'use client';

import React, { useCallback, useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { parseCSVFile, validateFile } from '@/lib/csvParser';
import { CSVUploaderProps, FileUploadState, ValidationResult } from '@/types';
import { cn } from '@/lib/utils';

export function CSVUploader({ 
  onFileUpload, 
  onError, 
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  acceptedFormats = ['.csv'],
  loading = false 
}: CSVUploaderProps) {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    isDragOver: false,
    isUploading: false,
    progress: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileValidation = useCallback((file: File) => {
    const result = validateFile(file);
    setValidationResult(result);
    return result;
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    setSelectedFile(file);
    setUploadState(prev => ({ ...prev, isUploading: true, progress: 0 }));

    try {
      // Stage 1: File validation
      setUploadState(prev => ({ ...prev, progress: 10 }));
      const validation = handleFileValidation(file);
      if (!validation.isValid) {
        onError(validation.errors.join(' '));
        setUploadState(prev => ({ ...prev, isUploading: false }));
        return;
      }

      // Stage 2: Start parsing with progress callback
      setUploadState(prev => ({ ...prev, progress: 25 }));
      
      // Stage 3: Parse the CSV file with optimized parser
      const result = await parseCSVFile(file, (progress) => {
        setUploadState(prev => ({ ...prev, progress: Math.max(25, progress) }));
      });

      if (result.success && result.data) {
        // Stage 4: Complete
        setUploadState(prev => ({ ...prev, progress: 100 }));
        onFileUpload(result.data);
        
        // Announce success to screen readers
        const announcement = `ファイル ${file.name} が正常にアップロードされました。${result.data.data.length}行のデータが読み込まれました。`;
        announceToScreenReader(announcement);
        
        // Reset upload state after a short delay
        setTimeout(() => {
          setUploadState(prev => ({ ...prev, isUploading: false, progress: 0 }));
        }, 800);
      } else {
        const errorMessage = result.error || 'ファイルの解析に失敗しました。';
        onError(errorMessage);
        announceToScreenReader(`エラー: ${errorMessage}`);
        setUploadState(prev => ({ ...prev, isUploading: false, progress: 0 }));
      }
    } catch (error) {
      const errorMessage = 'ファイルの処理中にエラーが発生しました。';
      onError(errorMessage);
      announceToScreenReader(`エラー: ${errorMessage}`);
      setUploadState(prev => ({ ...prev, isUploading: false, progress: 0 }));
    }
  }, [onFileUpload, onError, handleFileValidation]);

  // Screen reader announcement utility
  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  // Keyboard navigation handlers
  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!uploadState.isUploading && !loading) {
        handleBrowseClick();
      }
    }
  }, [uploadState.isUploading, loading, handleBrowseClick]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState(prev => ({ ...prev, isDragOver: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState(prev => ({ ...prev, isDragOver: false }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState(prev => ({ ...prev, isDragOver: false }));

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setValidationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      {/* File Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          uploadState.isDragOver 
            ? "border-blue-500 bg-blue-50" 
            : "border-gray-300 hover:border-gray-400",
          uploadState.isUploading && "pointer-events-none opacity-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        onKeyDown={handleKeyDown}
        tabIndex={uploadState.isUploading || loading ? -1 : 0}
        role="button"
        aria-label="CSVファイルをアップロードするためのドラッグ&ドロップエリア。クリックまたはEnterキーでファイル選択ダイアログを開きます。"
        aria-describedby="upload-instructions"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploadState.isUploading || loading}
          aria-label="CSVファイルを選択"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          {uploadState.isUploading ? (
            <>
              <div 
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
                role="status"
                aria-label="ファイルを処理中"
              ></div>
              <p className="text-sm text-gray-600" aria-live="polite">
                ファイルを処理中... {uploadState.progress}%
              </p>
              {uploadState.progress > 0 && (
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow={uploadState.progress} aria-valuemin={0} aria-valuemax={100}>
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadState.progress}%` }}
                  ></div>
                </div>
              )}
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" aria-hidden="true" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">
                  CSVファイルをドラッグ&ドロップ
                </p>
                <p className="text-xs text-gray-500 mt-1" id="upload-instructions">
                  または <span className="text-blue-500 underline">ファイルを選択</span>
                </p>
              </div>
              <p className="text-xs text-gray-400">
                最大ファイルサイズ: {formatFileSize(maxFileSize)}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Selected File Display */}
      {selectedFile && !uploadState.isUploading && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              type="button"
              aria-label={`選択されたファイル ${selectedFile.name} を削除`}
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Validation Results */}
          {validationResult && (
            <div className="mt-3 space-y-2">
              {validationResult.isValid ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">ファイルは有効です</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <div key={index} className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {validationResult.warnings.length > 0 && (
                <div className="space-y-1">
                  {validationResult.warnings.map((warning, index) => (
                    <div key={index} className="flex items-center space-x-2 text-yellow-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{warning}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• サポートされる形式: CSV (.csv)</p>
        <p>• 標準的な区切り文字（カンマ、セミコロン、タブ）に対応</p>
        <p>• 最初の行は列ヘッダーとして扱われます</p>
      </div>
    </div>
  );
}