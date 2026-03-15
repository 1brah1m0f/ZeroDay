'use client';

import { useState, useRef } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/Button';

interface ImageUploadProps {
  onUploadSuccess: (urls: string[]) => void;
  maxFiles?: number;
  minFiles?: number;
  maxSizeMB?: number;
}

export function ImageUpload({
  onUploadSuccess,
  maxFiles = 5,
  minFiles = 1,
  maxSizeMB = 5,
}: ImageUploadProps) {
  const { accessToken } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const files = Array.from(e.target.files || []);
    
    // Total files check
    if (selectedFiles.length + files.length > maxFiles) {
      setError(`Maksimum ${maxFiles} şəkil seçə bilərsiniz.`);
      return;
    }

    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    files.forEach(file => {
      // Type validation
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Yalnız JPEG, PNG və WEBP formatları dəstəklənir.');
        return;
      }
      
      // Size validation
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Hər şəklin ölçüsü maksimum ${maxSizeMB}MB olmalıdır.`);
        return;
      }

      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setPreviews(prev => [...prev, ...validPreviews]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setError('');
  };

  const handleUpload = async () => {
    if (selectedFiles.length < minFiles) {
      setError(`Ən azı ${minFiles} şəkil yükləməlisiniz!`);
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const res = await api.post('/media/upload', formData);
      
      // Success
      alert('Şəkillər uğurla yükləndi!');
      onUploadSuccess(res.data.urls);
      
      // Cleanup
      previews.forEach(p => URL.revokeObjectURL(p));
      setSelectedFiles([]);
      setPreviews([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Şəkillər yüklənərkən xəta baş verdi.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-stone-900">Şəkil Yüklə</h3>
        <p className="text-sm text-stone-500">
          Maksimum {maxFiles} şəkil (Minimum {minFiles}). {maxSizeMB}MB limit (JPG, PNG, WEBP).
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {previews.map((src, idx) => (
            <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border border-stone-200 group">
              <img src={src} alt="Preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
          disabled={isUploading || selectedFiles.length >= maxFiles}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || selectedFiles.length >= maxFiles}
        >
          Şəkil Seç
        </Button>

        {selectedFiles.length > 0 && (
          <Button
            type="button"
            variant="primary"
            onClick={handleUpload}
            isLoading={isUploading}
            disabled={selectedFiles.length < minFiles}
          >
            Yüklə ({selectedFiles.length}/{maxFiles})
          </Button>
        )}
      </div>
    </div>
  );
}
