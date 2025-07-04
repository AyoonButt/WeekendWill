'use client';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  validationErrors?: Record<string, string[]>;
}

export interface ApiClientOptions {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  showToast?: boolean;
  autoRetry?: boolean;
}

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private retries: number;
  private retryDelay: number;
  private showToast: boolean;
  private autoRetry: boolean;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl || '';
    this.timeout = options.timeout || 30000;
    this.retries = options.retries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.showToast = options.showToast ?? true;
    this.autoRetry = options.autoRetry ?? true;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private shouldRetry(error: Error, attempt: number): boolean {
    if (!this.autoRetry || attempt >= this.retries) {
      return false;
    }

    // Retry on network errors or server errors (5xx)
    if (error.name === 'NetworkError' || error.name === 'TimeoutError') {
      return true;
    }

    // Check if it's a fetch error with status code
    if (error.message.includes('fetch')) {
      return true;
    }

    return false;
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.error || `HTTP ${response.status}`);
        error.name = `HttpError${response.status}`;
        
        if (this.shouldRetry(error, attempt)) {
          await this.delay(this.retryDelay * attempt);
          return this.makeRequest<T>(url, options, attempt + 1);
        }

        if (this.showToast) {
          this.handleErrorToast(data, response.status);
        }

        return {
          success: false,
          error: data.error || 'Request failed',
          code: data.code,
          validationErrors: data.validationErrors,
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      const apiError = this.normalizeError(error);
      
      if (this.shouldRetry(apiError, attempt)) {
        await this.delay(this.retryDelay * attempt);
        return this.makeRequest<T>(url, options, attempt + 1);
      }

      if (this.showToast) {
        this.handleErrorToast({ error: apiError.message }, 0);
      }

      return {
        success: false,
        error: apiError.message,
        code: apiError.name,
      };
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      // Handle AbortError (timeout)
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timed out');
        timeoutError.name = 'TimeoutError';
        return timeoutError;
      }

      // Handle network errors
      if (error.message.includes('fetch')) {
        const networkError = new Error('Network error - please check your connection');
        networkError.name = 'NetworkError';
        return networkError;
      }

      return error;
    }

    return new Error('Unknown error occurred');
  }

  private handleErrorToast(errorData: any, statusCode: number): void {
    // Note: Toast handling removed from API client
    // Components should handle their own toast notifications
    console.warn('API Error:', {
      statusCode,
      error: errorData.error || 'Unknown error',
    });
  }

  // HTTP Methods
  public async get<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { ...options, method: 'GET' });
  }

  public async post<T>(
    url: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async put<T>(
    url: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async patch<T>(
    url: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async delete<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { ...options, method: 'DELETE' });
  }
}

// Default API client instance
export const apiClient = new ApiClient({
  baseUrl: '/api',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  showToast: true,
  autoRetry: true,
});

// API client without toast notifications (for background operations)
export const silentApiClient = new ApiClient({
  baseUrl: '/api',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  showToast: false,
  autoRetry: true,
});

// API client for external services (no retries)
export const externalApiClient = new ApiClient({
  timeout: 10000,
  retries: 0,
  showToast: false,
  autoRetry: false,
});

// Utility functions for common API operations
export const handleApiCall = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    showSuccessToast?: boolean;
    successMessage?: string;
  } = {}
): Promise<ApiResponse<T>> => {
  const response = await apiCall();

  if (response.success && response.data) {
    if (options.onSuccess) {
      options.onSuccess(response.data);
    }
    
    if (options.showSuccessToast && options.successMessage) {
      toast({
        title: 'Success',
        description: options.successMessage,
        variant: 'default',
      });
    }
  } else if (!response.success && options.onError) {
    options.onError(response.error || 'Unknown error');
  }

  return response;
};

// Network status utilities
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

export const waitForOnline = (): Promise<void> => {
  return new Promise((resolve) => {
    if (isOnline()) {
      resolve();
      return;
    }

    const handleOnline = () => {
      window.removeEventListener('online', handleOnline);
      resolve();
    };

    window.addEventListener('online', handleOnline);
  });
};