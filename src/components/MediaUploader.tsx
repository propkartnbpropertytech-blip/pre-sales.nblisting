import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  Loader2,
  Play,
  Plus,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { uploadMediaFiles } from '../services/presalesApi';

interface MediaUploaderProps {
  fieldKey: string;
  label?: string;
  mediaType: 'photos' | 'videos';
  maxFiles?: number;
  maxFileSizeMb?: number;
  value: string[] | string;
  onChange: (urls: string[]) => void;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  fieldKey,
  label,
  mediaType,
  maxFiles = mediaType === 'photos' ? 100 : 50,
  maxFileSizeMb = mediaType === 'photos' ? 25 : 60,
  value,
  onChange,
  error,
  helpText,
  required,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [manualUrl, setManualUrl] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Normalize value to array of string URLs
  const items: string[] = Array.isArray(value)
    ? value
    : typeof value === 'string' && value.trim()
    ? value.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const remainingCount = Math.max(0, maxFiles - items.length);
  const isVideo = mediaType === 'videos';

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadError(null);

    const newFiles: File[] = Array.from(fileList);

    if (newFiles.length > remainingCount) {
      setUploadError(
        `You can only add ${remainingCount} more ${mediaType}. Maximum limit is ${maxFiles}.`
      );
      return;
    }

    for (const f of newFiles) {
      if (isVideo && !f.type.startsWith('video/')) {
        setUploadError(`"${f.name}" is not a valid video file.`);
        return;
      }
      if (!isVideo && !f.type.startsWith('image/')) {
        setUploadError(`"${f.name}" is not a valid image file.`);
        return;
      }
      if (f.size > maxFileSizeMb * 1024 * 1024) {
        setUploadError(`"${f.name}" exceeds the ${maxFileSizeMb}MB limit.`);
        return;
      }
    }

    setIsUploading(true);
    try {
      const uploaded = await uploadMediaFiles(newFiles);
      const newUrls = uploaded.map((u) => u.public_url).filter(Boolean);
      onChange([...items, ...newUrls]);
    } catch (err: any) {
      console.error('Media upload error:', err);
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = items.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    if (remainingCount <= 0) {
      setUploadError(`Maximum limit of ${maxFiles} ${mediaType} reached.`);
      return;
    }

    const trimmed = manualUrl.trim();
    onChange([...items, trimmed]);
    setManualUrl('');
    setShowUrlInput(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Header Info & Limits */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <label className="block text-xs font-bold text-slate-800">
          {label || (isVideo ? 'Project Walkthrough Videos' : 'Project Elevation Photos')}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>

        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
              items.length >= maxFiles
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-purple-50 text-purple-700 border border-purple-200'
            }`}
          >
            {items.length} / {maxFiles} {isVideo ? 'Videos' : 'Photos'}
          </span>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Hide URL' : '+ Paste Link'}</span>
          </button>
        </div>
      </div>

      {helpText && <p className="text-[11px] text-slate-400">{helpText}</p>}

      {/* Manual URL Input Bar (Expandable) */}
      {showUrlInput && (
        <form onSubmit={handleAddManualUrl} className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder={`Paste direct ${isVideo ? 'video (.mp4 / stream)' : 'image'} URL...`}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-100 outline-hidden transition-all"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Add URL
          </button>
        </form>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && remainingCount > 0 && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-5 sm:p-6 transition-all text-center select-none ${
          remainingCount === 0
            ? 'opacity-60 bg-slate-50 border-slate-200 cursor-not-allowed'
            : dragActive
            ? 'border-purple-600 bg-purple-50/60 scale-[1.005] cursor-pointer'
            : error
            ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400 cursor-pointer'
            : 'border-slate-200 bg-slate-50/70 hover:bg-purple-50/30 hover:border-purple-300 cursor-pointer'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={
            isVideo
              ? 'video/mp4,video/webm,video/quicktime,video/x-matroska'
              : 'image/jpeg,image/png,image/webp,image/heic'
          }
          onChange={(e) => handleFiles(e.target.files)}
          disabled={isUploading || remainingCount === 0}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-apple-xs border border-slate-200 flex items-center justify-center text-purple-600">
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
            ) : isVideo ? (
              <VideoIcon className="w-5 h-5 text-purple-600" />
            ) : (
              <UploadCloud className="w-5 h-5 text-purple-600" />
            )}
          </div>

          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
              {isUploading
                ? `Uploading ${isVideo ? 'videos' : 'photos'}...`
                : remainingCount === 0
                ? `Maximum limit reached (${maxFiles} ${isVideo ? 'videos' : 'photos'})`
                : `Upload ${isVideo ? 'Walkthrough Videos' : 'Project Photos'}`}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {remainingCount > 0
                ? `Drag & drop files or click to browse • Up to ${remainingCount} more (Max ${maxFiles})`
                : `All ${maxFiles} slots filled`}
            </p>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Media Previews Grid */}
      {items.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1">
            <span>
              Attached {isVideo ? 'Videos' : 'Photos'} ({items.length})
            </span>
            <span className="text-[10px] text-slate-400">Click × to remove</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {items.map((url, idx) => (
              <div
                key={idx}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-apple-xs transition-all hover:shadow-apple-sm"
              >
                {isVideo ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-2 text-center">
                    <video
                      src={url}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                      onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
                      onMouseLeave={(e) => {
                        const v = e.currentTarget as HTMLVideoElement;
                        v.pause();
                        v.currentTime = 0;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none group-hover:bg-black/10 transition-colors">
                      <Play className="w-7 h-7 text-white/90 drop-shadow-md" />
                    </div>
                    <span className="absolute bottom-1 left-1 right-1 text-[9px] text-white/90 bg-black/70 px-1 py-0.5 rounded-md truncate font-mono">
                      Video #{idx + 1}
                    </span>
                  </div>
                ) : (
                  <img
                    src={url}
                    alt={`Uploaded photo ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                )}

                {/* Index badge */}
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-mono font-bold backdrop-blur-xs">
                  #{idx + 1}
                </span>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 hover:bg-rose-600 text-white backdrop-blur-xs transition-colors active:scale-90 cursor-pointer"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-[11px] font-bold text-rose-600">{error}</p>}
    </div>
  );
};
