'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, File, Image, Video, Code, FileText } from 'lucide-react';
import { useFileUpload, useArtifactMutations, generateArtifactMetadata } from '@/hooks/useArtifacts';
import { usePopularTags } from '@/hooks/useArtifacts';
import type { ArtifactType, DifficultyLevel, CreateArtifactRequest } from '@/types';

interface ArtifactUploadProps {
  userId: string;
  taskId: string;
  phaseId: string;
  onSuccess?: (artifactId: string) => void;
  onCancel?: () => void;
}

const ARTIFACT_TYPES: { value: ArtifactType; label: string; icon: React.ReactNode }[] = [
  { value: 'code', label: 'コード', icon: <Code className="w-4 h-4" /> },
  { value: 'document', label: 'ドキュメント', icon: <FileText className="w-4 h-4" /> },
  { value: 'design', label: 'デザイン', icon: <Image className="w-4 h-4" /> },
  { value: 'video', label: '動画', icon: <Video className="w-4 h-4" /> },
  { value: 'other', label: 'その他', icon: <File className="w-4 h-4" /> },
];

const DIFFICULTY_LEVELS: { value: DifficultyLevel; label: string }[] = [
  { value: 'beginner', label: '初級' },
  { value: 'intermediate', label: '中級' },
  { value: 'advanced', label: '上級' },
];

export function ArtifactUpload({ userId, taskId, phaseId, onSuccess, onCancel }: ArtifactUploadProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'code' as ArtifactType,
    externalUrl: '',
    tags: [] as string[],
    isPublic: false,
    difficulty: 'beginner' as DifficultyLevel,
    language: '',
    framework: ''
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { uploadFile, isUploading, progress } = useFileUpload();
  const { createArtifact, isCreating } = useArtifactMutations();
  const { tags: popularTags } = usePopularTags();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    
    // ファイル名からタイトルを自動生成
    if (!formData.title) {
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
      setFormData(prev => ({ ...prev, title: nameWithoutExtension }));
    }
    
    // メタデータを自動生成
    const metadata = generateArtifactMetadata(file);
    setFormData(prev => ({
      ...prev,
      language: metadata.language || prev.language,
      framework: metadata.framework || prev.framework,
      difficulty: metadata.difficulty
    }));
  }, [formData.title]);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleAddTag = useCallback(() => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  }, [currentTag, formData.tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }

    if (!selectedFile && !formData.externalUrl.trim()) {
      newErrors.file = 'ファイルまたは外部URLのいずれかは必須です';
    }

    if (formData.externalUrl && !isValidUrl(formData.externalUrl)) {
      newErrors.externalUrl = '有効なURLを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedFile]);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      let fileUrl: string | undefined;
      
      if (selectedFile) {
        fileUrl = await uploadFile(selectedFile);
      }

      const artifactData: CreateArtifactRequest = {
        userId,
        taskId,
        phaseId,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        fileUrl,
        externalUrl: formData.externalUrl.trim() || undefined,
        tags: formData.tags,
        isPublic: formData.isPublic,
        metadata: {
          fileSize: selectedFile?.size,
          mimeType: selectedFile?.type,
          language: formData.language || undefined,
          framework: formData.framework || undefined,
          difficulty: formData.difficulty
        }
      };

      const result = await createArtifact(artifactData);
      onSuccess?.(result.id);
    } catch (error) {
      console.error('Failed to create artifact:', error);
      setErrors({ submit: '成果物の作成に失敗しました' });
    }
  }, [formData, selectedFile, userId, taskId, phaseId, validateForm, uploadFile, createArtifact, onSuccess]);

  const isSubmitting = isUploading || isCreating;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">成果物をアップロード</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ファイルアップロード */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ファイル
          </label>
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              disabled={isSubmitting}
            />
            
            {selectedFile ? (
              <div className="flex items-center justify-center space-x-2">
                <File className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">
                  ファイルをドラッグ&ドロップするか、クリックして選択
                </p>
              </div>
            )}
            
            {isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% アップロード中...</p>
              </div>
            )}
          </div>
          {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
        </div>

        {/* 外部URL */}
        <div>
          <label htmlFor="externalUrl" className="block text-sm font-medium text-gray-700 mb-2">
            外部URL（オプション）
          </label>
          <input
            type="url"
            id="externalUrl"
            value={formData.externalUrl}
            onChange={(e) => handleInputChange('externalUrl', e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
          {errors.externalUrl && <p className="mt-1 text-sm text-red-600">{errors.externalUrl}</p>}
        </div>

        {/* タイトル */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            タイトル *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="成果物のタイトルを入力"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            required
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* 説明 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            説明
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="成果物の詳細説明を入力"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>

        {/* タイプ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タイプ
          </label>
          <div className="grid grid-cols-5 gap-2">
            {ARTIFACT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange('type', type.value)}
                className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${
                  formData.type === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={isSubmitting}
              >
                {type.icon}
                <span className="text-xs mt-1">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 難易度 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            難易度
          </label>
          <div className="flex space-x-4">
            {DIFFICULTY_LEVELS.map((level) => (
              <label key={level.value} className="flex items-center">
                <input
                  type="radio"
                  name="difficulty"
                  value={level.value}
                  checked={formData.difficulty === level.value}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="mr-2"
                  disabled={isSubmitting}
                />
                <span className="text-sm">{level.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* プログラミング言語・フレームワーク */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              プログラミング言語
            </label>
            <input
              type="text"
              id="language"
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              placeholder="JavaScript, TypeScript, Python..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="framework" className="block text-sm font-medium text-gray-700 mb-2">
              フレームワーク
            </label>
            <input
              type="text"
              id="framework"
              value={formData.framework}
              onChange={(e) => handleInputChange('framework', e.target.value)}
              placeholder="React, Vue.js, Next.js..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* タグ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タグ
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  disabled={isSubmitting}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="タグを入力してEnter"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              追加
            </button>
          </div>
          {popularTags.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">人気のタグ:</p>
              <div className="flex flex-wrap gap-1">
                {popularTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (!formData.tags.includes(tag)) {
                        setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                      }
                    }}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                    disabled={isSubmitting || formData.tags.includes(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 公開設定 */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => handleInputChange('isPublic', e.target.checked)}
              className="mr-2"
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-700">
              ポートフォリオで公開する
            </span>
          </label>
        </div>

        {/* エラーメッセージ */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* 送信ボタン */}
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              キャンセル
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? '作成中...' : '成果物を作成'}
          </button>
        </div>
      </form>
    </div>
  );
}