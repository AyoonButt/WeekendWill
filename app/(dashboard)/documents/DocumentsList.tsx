'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { 
  DocumentTextIcon,
  ArrowDownTrayIcon as DownloadIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/Toast';

interface Document {
  id: string;
  name: string;
  type: 'will' | 'trust' | 'power-of-attorney' | 'draft';
  status: 'draft' | 'completed' | 'executed';
  lastModified: Date;
  size?: number;
  version: number;
}

interface DocumentsListProps {
  userId: string;
}

const DocumentsList: React.FC<DocumentsListProps> = ({ userId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  const fetchDocuments = async () => {
    try {
      const response = await apiClient.get(`/documents?userId=${userId}`);
      if (response.success) {
        setDocuments(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      // Mock data for demonstration
      setDocuments([
        {
          id: '1',
          name: 'Last Will and Testament',
          type: 'will',
          status: 'draft',
          lastModified: new Date('2024-01-15'),
          size: 245760,
          version: 3,
        },
        {
          id: '2',
          name: 'Power of Attorney Draft',
          type: 'power-of-attorney',
          status: 'draft',
          lastModified: new Date('2024-01-10'),
          size: 156800,
          version: 1,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      setSelectedDocument(doc.id);
      const response = await apiClient.get(`/documents/${doc.id}/download`);
      
      if (response.success) {
        // Create download link
        const blob = new Blob([response.data as BlobPart], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${doc.name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        showSuccess(
          'Download Started',
          `${doc.name} is being downloaded.`
        );
      }
    } catch (error) {
      console.error('Download failed:', error);
      showError(
        'Download Failed',
        'Unable to download the document. Please try again.'
      );
    } finally {
      setSelectedDocument(null);
    }
  };

  const handlePreview = (document: Document) => {
    // Open preview modal or navigate to preview page
    window.open(`/documents/${document.id}/preview`, '_blank');
  };

  const handleEdit = (document: Document) => {
    if (document.type === 'will') {
      window.location.href = '/interview';
    } else {
      showError(
        'Edit Unavailable',
        'Editing is currently only available for wills.'
      );
    }
  };

  const handleDelete = async (document: Document) => {
    if (window.confirm(`Are you sure you want to delete "${document.name}"? This action cannot be undone.`)) {
      try {
        const response = await apiClient.delete(`/documents/${document.id}`);
        if (response.success) {
          setDocuments(docs => docs.filter(d => d.id !== document.id));
          showSuccess(
            'Document Deleted',
            `${document.name} has been deleted.`
          );
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-100';
      case 'executed':
        return 'text-blue-700 bg-blue-100';
      case 'draft':
      default:
        return 'text-amber-700 bg-amber-100';
    }
  };

  const getStatusText = (status: Document['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'executed':
        return 'Executed';
      case 'draft':
      default:
        return 'Draft';
    }
  };

  const getTypeIcon = (type: Document['type']) => {
    return <DocumentTextIcon className="w-5 h-5 text-charcoal-600" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-charcoal-900 mb-2">
          No Documents Yet
        </h3>
        <p className="text-charcoal-600 mb-6">
          Start creating your will to see your documents here.
        </p>
        <Button onClick={() => window.location.href = '/interview'}>
          Create Your Will
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <div
          key={document.id}
          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                {getTypeIcon(document.type)}
              </div>
              
              <div>
                <h3 className="font-semibold text-charcoal-900">
                  {document.name}
                </h3>
                <div className="flex items-center space-x-4 mt-1 text-sm text-charcoal-600">
                  <span className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {document.lastModified.toLocaleDateString()}
                  </span>
                  {document.size && (
                    <span>{formatFileSize(document.size)}</span>
                  )}
                  <span>Version {document.version}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                {getStatusText(document.status)}
              </span>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePreview(document)}
                  className="text-charcoal-600 hover:text-charcoal-900"
                >
                  <EyeIcon className="w-4 h-4" />
                </Button>
                
                {document.status === 'draft' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(document)}
                    className="text-charcoal-600 hover:text-charcoal-900"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(document)}
                  disabled={selectedDocument === document.id}
                  className="text-charcoal-600 hover:text-charcoal-900"
                >
                  {selectedDocument === document.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-charcoal-600"></div>
                  ) : (
                    <DownloadIcon className="w-4 h-4" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(document)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentsList;