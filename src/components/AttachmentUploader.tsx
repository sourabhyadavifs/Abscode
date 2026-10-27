import React, { useState, useRef } from 'react';
import { Camera, Upload, FileText, Trash2, Eye, X, Image as ImageIcon } from 'lucide-react';
import { Attachment } from '../types';
import { CameraCaptureModal } from './CameraCaptureModal';

interface AttachmentUploaderProps {
  attachment?: Attachment;
  onAttachmentChange: (attachment?: Attachment) => void;
  label?: string;
  helperText?: string;
  required?: boolean;
}

export const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({
  attachment,
  onAttachmentChange,
  label = 'Physical Form or Supporting Document',
  helperText = 'Camera capture, photo, scan or PDF (max 10MB)',
  required = false,
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const sizeKB = Math.round(file.size / 1024);
      const sizeFormatted = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

      const newAttachment: Attachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        type: isPdf ? 'pdf' : isImage ? 'image' : 'image',
        dataUrl: result,
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        source: 'upload',
        sizeFormatted,
      };

      onAttachmentChange(newAttachment);
    };

    reader.readAsDataURL(file);
    // reset input
    e.target.value = '';
  };

  const handlePhotoCaptured = (dataUrl: string, fileName: string) => {
    const newAttachment: Attachment = {
      id: `att-${Date.now()}`,
      name: fileName,
      type: 'image',
      dataUrl,
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      source: 'camera',
      sizeFormatted: 'Camera snapshot',
    };
    onAttachmentChange(newAttachment);
  };

  const handleRemove = () => {
    onAttachmentChange(undefined);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-800">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        <span className="text-xs text-slate-500">{helperText}</span>
      </div>

      {!attachment ? (
        <div className="border border-slate-300 border-dashed rounded-lg p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,application/pdf"
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Real Camera Action Button */}
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors inline-flex items-center justify-center gap-2 shadow-xs"
            >
              <Camera className="w-4 h-4" />
              Scan with Camera
            </button>

            <span className="text-xs text-slate-400">or</span>

            {/* Upload Existing File Fallback */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-medium rounded-md transition-colors inline-flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              Upload Photo, Scan or PDF
            </button>
          </div>
          <p className="text-[11px] text-slate-500 text-center mt-3">
            Supports JPEG, PNG, WEBP, and PDF documents. Rear camera preferred on mobile devices.
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            {attachment.type === 'image' ? (
              <div
                onClick={() => setIsPreviewOpen(true)}
                className="w-12 h-12 rounded border border-slate-200 overflow-hidden bg-slate-100 shrink-0 cursor-pointer group relative"
                title="Click to preview image"
              >
                <img
                  src={attachment.dataUrl}
                  alt={attachment.name}
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Eye className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 rounded border border-slate-200 bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            )}

            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-900 truncate max-w-xs sm:max-w-md">
                {attachment.name}
              </p>
              <p className="text-[11px] text-slate-500 flex items-center gap-2">
                <span>{attachment.sizeFormatted || 'Document'}</span>
                <span>·</span>
                <span className="capitalize">{attachment.source}</span>
                <span>·</span>
                <span>{attachment.uploadedAt}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
              title="Preview attachment"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Remove attachment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCaptured={handlePhotoCaptured}
        title="Scan 4M Document with Camera"
      />

      {/* Preview Modal */}
      {isPreviewOpen && attachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 min-w-0">
                {attachment.type === 'image' ? (
                  <ImageIcon className="w-4 h-4 text-slate-600" />
                ) : (
                  <FileText className="w-4 h-4 text-slate-600" />
                )}
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {attachment.name}
                </span>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex items-center justify-center bg-slate-100 min-h-[300px]">
              {attachment.type === 'image' ? (
                <img
                  src={attachment.dataUrl}
                  alt={attachment.name}
                  className="max-w-full max-h-[70vh] object-contain rounded border border-slate-200 bg-white"
                />
              ) : (
                <div className="w-full h-[65vh]">
                  <iframe
                    src={attachment.dataUrl}
                    title={attachment.name}
                    className="w-full h-full border border-slate-200 rounded bg-white"
                  />
                </div>
              )}
            </div>
            <div className="px-5 py-2.5 bg-white border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
