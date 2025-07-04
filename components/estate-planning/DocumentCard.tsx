'use client';

import React from 'react';
import { 
  DocumentTextIcon, 
  ArrowDownTrayIcon, 
  PencilIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Card, Button } from '@/components/ui';
import type { DocumentCardProps } from '@/types';
import { cn, formatDate } from '@/utils';

const DocumentCard: React.FC<DocumentCardProps> = ({
  documentType,
  status,
  lastModified,
  onDownload,
  onEdit,
}) => {
  const documentConfig = {
    will: {
      title: 'Last Will and Testament',
      description: 'Your primary estate planning document',
      icon: DocumentTextIcon,
    },
    trust: {
      title: 'Living Trust',
      description: 'Manages your assets during your lifetime',
      icon: DocumentTextIcon,
    },
    'power-of-attorney': {
      title: 'Power of Attorney',
      description: 'Authorizes someone to act on your behalf',
      icon: DocumentTextIcon,
    },
  };

  const statusConfig = {
    draft: {
      label: 'Draft',
      color: 'status-draft',
      icon: ClockIcon,
      description: 'Document in progress',
    },
    completed: {
      label: 'Completed',
      color: 'status-completed',
      icon: CheckCircleIcon,
      description: 'Ready for execution',
    },
    executed: {
      label: 'Executed',
      color: 'status-executed',
      icon: CheckCircleIcon,
      description: 'Legally executed document',
    },
  };

  const config = documentConfig[documentType];
  const statusInfo = statusConfig[status];
  const Icon = config.icon;
  const StatusIcon = statusInfo.icon;

  const canDownload = status === 'completed' || status === 'executed';
  const canEdit = status !== 'executed';

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <Card.Content>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Document icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
            </div>

            {/* Document info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-charcoal-900 mb-1">
                {config.title}
              </h3>
              <p className="text-sm text-charcoal-600 mb-3">
                {config.description}
              </p>

              {/* Status badge */}
              <div className="flex items-center space-x-2 mb-3">
                <span className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  statusInfo.color
                )}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusInfo.label}
                </span>
                <span className="text-xs text-charcoal-500">
                  {statusInfo.description}
                </span>
              </div>

              {/* Last modified */}
              <p className="text-xs text-charcoal-500">
                Last modified: {formatDate(lastModified)}
              </p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex-shrink-0">
            {status === 'executed' && (
              <div className="w-6 h-6 bg-success-600 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-4 h-4 text-white" />
              </div>
            )}
            {status === 'draft' && (
              <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex items-center space-x-3">
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center space-x-1"
            >
              <PencilIcon className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          )}
          
          {canDownload && (
            <Button
              variant={status === 'executed' ? 'primary' : 'secondary'}
              size="sm"
              onClick={onDownload}
              className="flex items-center space-x-1"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Download</span>
            </Button>
          )}

          {status === 'draft' && (
            <Button
              variant="primary"
              size="sm"
              onClick={onEdit}
              className="flex items-center space-x-1"
            >
              <span>Continue</span>
            </Button>
          )}
        </div>

        {/* Legal notice for executed documents */}
        {status === 'executed' && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              This document has been legally executed. Any changes will require creating a new version 
              or a codicil. Consult with an attorney for significant modifications.
            </p>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

// Document grid component for dashboard
interface DocumentGridProps {
  documents: Array<DocumentCardProps & { id: string }>;
  className?: string;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  className,
}) => {
  if (documents.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-charcoal-900 mb-2">
          No documents yet
        </h3>
        <p className="text-charcoal-600 mb-6">
          Start creating your will to protect your family and assets.
        </p>
        <Button variant="primary">
          Create Your First Will
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6', className)}>
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          {...doc}
        />
      ))}
    </div>
  );
};

export default DocumentCard;