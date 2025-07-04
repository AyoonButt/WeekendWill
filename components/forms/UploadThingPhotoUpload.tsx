'use client';

import React, { useState } from 'react';
import { 
  PhotoIcon, 
  XMarkIcon, 
  ArrowUpTrayIcon,
  EyeIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';
import { Card, Button, Modal } from '@/components/ui';
import { UploadDropzone } from '@/lib/uploadthing';
import type { Photo } from '@/types';
import { cn, formatFileSize } from '@/utils';

interface UploadThingPhotoUploadProps {
  onUpload: (photos: Photo[]) => void;
  maxFiles?: number;
  currentPhotos?: Photo[];
  endpoint?: 'photoUploader' | 'documentUploader' | 'avatarUploader';
  title?: string;
  description?: string;
}

const UploadThingPhotoUpload: React.FC<UploadThingPhotoUploadProps> = ({
  onUpload,
  maxFiles = 10,
  currentPhotos = [],
  endpoint = 'photoUploader',
  title = 'Upload Photos',
  description = 'Upload photos of important items, documents, or personal belongings'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>(currentPhotos);

  const handleUploadComplete = (uploadedFiles: any[]) => {
    const newPhotos: Photo[] = uploadedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      url: file.url,
      caption: '',
      associatedItems: [],
      uploadedAt: new Date(),
      name: file.name,
      size: file.size,
    }));

    const updatedPhotos = [...photos, ...newPhotos];
    setPhotos(updatedPhotos);
    onUpload(updatedPhotos);
    setIsUploading(false);
  };

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error);
    setIsUploading(false);
    alert('Upload failed. Please try again.');
  };

  const removePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    setPhotos(updatedPhotos);
    onUpload(updatedPhotos);
  };

  const updatePhotoCaption = (photoId: string, caption: string) => {
    const updatedPhotos = photos.map(photo =>
      photo.id === photoId ? { ...photo, caption } : photo
    );
    setPhotos(updatedPhotos);
    onUpload(updatedPhotos);
  };

  const canUploadMore = photos.length < maxFiles;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <PhotoIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-charcoal-900 mb-2">
          {title}
        </h3>
        <p className="text-charcoal-600">
          {description}
        </p>
      </div>

      {/* Upload Area */}
      {canUploadMore && (
        <Card className="p-6">
          <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            onUploadBegin={() => setIsUploading(true)}
            appearance={{
              container: {
                borderColor: '#e5e7eb',
                borderRadius: '12px',
                backgroundColor: '#f9fafb',
              },
              uploadIcon: {
                color: '#1e40af',
              },
              label: {
                color: '#374151',
                fontSize: '16px',
                fontWeight: '500',
              },
              allowedContent: {
                color: '#6b7280',
                fontSize: '14px',
              },
              button: {
                backgroundColor: '#1e40af',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
              },
            }}
            content={{
              label: 'Choose files or drag and drop',
              allowedContent: `Images up to 4MB, max ${maxFiles} files`,
              button: 'Choose Files',
            }}
          />
          
          {isUploading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-50 text-primary-700">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                Uploading photos...
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Current Photos Grid */}
      {photos.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-charcoal-900">
              Uploaded Photos ({photos.length}/{maxFiles})
            </h4>
            {!canUploadMore && (
              <span className="text-sm text-charcoal-600 bg-charcoal-100 px-3 py-1 rounded-full">
                Maximum files reached
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Uploaded photo'}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPhoto(photo)}
                        className="text-white hover:bg-white hover:bg-opacity-20"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePhoto(photo.id)}
                        className="text-white hover:bg-red-500 hover:bg-opacity-80"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Caption input */}
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Add caption..."
                    value={photo.caption || ''}
                    onChange={(e) => updatePhotoCaption(photo.id, e.target.value)}
                    className="w-full text-sm px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* File info */}
                <div className="mt-1 text-xs text-charcoal-500">
                  {photo.name && formatFileSize(photo.size || 0)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <Modal
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          title={selectedPhoto.caption || 'Photo Preview'}
        >
          <div className="space-y-4">
            <div className="max-w-2xl mx-auto">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || 'Photo preview'}
                className="w-full h-auto rounded-lg"
              />
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={selectedPhoto.caption || ''}
                  onChange={(e) => updatePhotoCaption(selectedPhoto.id, e.target.value)}
                  placeholder="Describe this photo..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              {selectedPhoto.uploadedAt && (
                <div className="text-sm text-charcoal-600">
                  Uploaded: {selectedPhoto.uploadedAt.toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setSelectedPhoto(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => removePhoto(selectedPhoto.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Remove Photo
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Help text */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">
          💡 Photo Tips
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Upload clear photos of valuable items for insurance purposes</li>
          <li>• Include photos of important documents (keep originals secure)</li>
          <li>• Add descriptive captions to help identify items later</li>
          <li>• Maximum file size: 4MB per photo</li>
          <li>• Supported formats: JPG, PNG, GIF</li>
        </ul>
      </Card>
    </div>
  );
};

export default UploadThingPhotoUpload;