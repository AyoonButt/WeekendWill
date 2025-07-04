'use client';

import React, { useCallback, useState } from 'react';
import { 
  PhotoIcon, 
  XMarkIcon, 
  ArrowUpTrayIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';
import { Card, Button, Modal } from '@/components/ui';
import type { PhotoUploadProps, Photo } from '@/types';
import { cn, formatFileSize } from '@/utils';

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onUpload,
  maxFiles,
  acceptedTypes,
  currentPhotos,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    // Filter by accepted types
    const validFiles = files.filter(file => 
      acceptedTypes.some(type => 
        file.type.includes(type.replace('*', ''))
      )
    );

    // Check file count limit
    const availableSlots = maxFiles - currentPhotos.length - previewFiles.length;
    const filesToProcess = validFiles.slice(0, availableSlots);

    if (filesToProcess.length > 0) {
      setPreviewFiles(prev => [...prev, ...filesToProcess]);
      simulateUpload(filesToProcess);
    }
  };

  const simulateUpload = async (files: File[]) => {
    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onUpload(files);
    setPreviewFiles([]);
    setIsUploading(false);
  };

  const removePreviewFile = (index: number) => {
    setPreviewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const canAddMore = currentPhotos.length + previewFiles.length < maxFiles;

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200',
          isDragOver 
            ? 'border-primary-400 bg-primary-50' 
            : canAddMore
              ? 'border-gray-300 hover:border-gray-400'
              : 'border-gray-200 bg-gray-50',
          !canAddMore && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={!canAddMore}
        />

        <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        
        <h3 className="text-lg font-medium text-charcoal-900 mb-2">
          Upload Photos
        </h3>
        
        <p className="text-charcoal-600 mb-4">
          Drag and drop photos here, or click to browse
        </p>

        <Button
          variant="outline"
          onClick={() => canAddMore && fileInputRef.current?.click()}
          disabled={!canAddMore}
          className="mb-4"
        >
          <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
          Choose Files
        </Button>

        <div className="text-sm text-charcoal-500 space-y-1">
          <p>Accepted formats: {acceptedTypes.join(', ')}</p>
          <p>Maximum {maxFiles} photos • Up to 10MB each</p>
          <p>{currentPhotos.length + previewFiles.length} of {maxFiles} photos uploaded</p>
        </div>
      </div>

      {/* Upload progress */}
      {isUploading && (
        <Card>
          <Card.Content>
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <span className="text-sm text-charcoal-700">Uploading photos...</span>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Preview files */}
      {previewFiles.length > 0 && (
        <div>
          <h4 className="font-medium text-charcoal-900 mb-3">
            Uploading ({previewFiles.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previewFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                  <div className="flex items-center justify-center h-full">
                    <PhotoIcon className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={() => removePreviewFile(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                  aria-label="Remove photo"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
                <div className="mt-2">
                  <p className="text-xs text-charcoal-600 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-charcoal-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current photos */}
      {currentPhotos.length > 0 && (
        <div>
          <h4 className="font-medium text-charcoal-900 mb-3">
            Uploaded Photos ({currentPhotos.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currentPhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Uploaded photo'}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedPhoto(photo)}
                      className="w-8 h-8 bg-white text-charcoal-700 rounded-full flex items-center justify-center hover:bg-gray-100"
                      aria-label="View photo"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                      aria-label="Delete photo"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {photo.caption && (
                  <div className="mt-2">
                    <p className="text-xs text-charcoal-600 truncate">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo preview modal */}
      <Modal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        size="lg"
      >
        {selectedPhoto && (
          <div className="space-y-4">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || 'Photo preview'}
              className="w-full h-auto max-h-96 object-contain rounded-lg"
            />
            
            {selectedPhoto.caption && (
              <div>
                <h4 className="font-medium text-charcoal-900 mb-2">Caption</h4>
                <p className="text-charcoal-700">{selectedPhoto.caption}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setSelectedPhoto(null)}
              >
                Close
              </Button>
              <Button variant="primary">
                Edit Caption
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PhotoUpload;