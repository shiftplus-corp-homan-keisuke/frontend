'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  ExternalLink, 
  Edit, 
  Trash2,
  Eye,
  Code,
  FileText,
  Image,
  Video,
  File,
  Calendar,
  Tag,
  User
} from 'lucide-react';
import { useArtifacts, useArtifactMutations } from '@/hooks/useArtifacts';
import { useArtifactsStore } from '@/stores/artifacts-store';
import { getLocalFile } from '@/lib/api/artifacts';
import type { Artifact, ArtifactType } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ArtifactListProps {
  userId?: string;
  phaseId?: string;
  taskId?: string;
  showFilters?: boolean;
  viewMode?: 'grid' | 'list';
  onArtifactClick?: (artifact: Artifact) => void;
  onEditArtifact?: (artifact: Artifact) => void;
}

const ARTIFACT_TYPE_ICONS: Record<ArtifactType, React.ReactNode> = {
  code: <Code className="w-5 h-5" />,
  document: <FileText className="w-5 h-5" />,
  design: <Image className="w-5 h-5" />,
  video: <Video className="w-5 h-5" />,
  other: <File className="w-5 h-5" />
};

const ARTIFACT_TYPE_LABELS: Record<ArtifactType, string> = {
  code: 'コード',
  document: 'ドキュメント',
  design: 'デザイン',
  video: '動画',
  other: 'その他'
};

export function ArtifactList({ 
  userId, 
  phaseId, 
  taskId, 
  showFilters = true, 
  viewMode: initialViewMode = 'grid',
  onArtifactClick,
  onEditArtifact
}: ArtifactListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const { artifacts, isLoading, error } = useArtifacts({ userId, phaseId, taskId });
  const { deleteArtifact, isDeleting } = useArtifactMutations();
  
  const {
    searchQuery,
    selectedTags,
    selectedType,
    selectedPhase,
    setSearchQuery,
    setSelectedTags,
    setSelectedType,
    setSelectedPhase,
    clearFilters,
    getFilteredArtifacts,
    getAllTags
  } = useArtifactsStore();

  const filteredArtifacts = useMemo(() => {
    return getFilteredArtifacts();
  }, [getFilteredArtifacts]);

  const availableTags = useMemo(() => {
    return getAllTags();
  }, [getAllTags]);

  const handleDownload = async (artifact: Artifact) => {
    if (artifact.fileUrl?.startsWith('local://')) {
      const fileData = getLocalFile(artifact.fileUrl);
      if (fileData) {
        const link = document.createElement('a');
        link.href = fileData.data;
        link.download = fileData.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (artifact.fileUrl) {
      window.open(artifact.fileUrl, '_blank');
    }
  };

  const handleDelete = async (artifact: Artifact) => {
    if (window.confirm('この成果物を削除しますか？この操作は取り消せません。')) {
      try {
        await deleteArtifact(artifact.id);
      } catch (error) {
        console.error('Failed to delete artifact:', error);
        alert('成果物の削除に失敗しました');
      }
    }
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">成果物を読み込み中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">成果物の読み込みに失敗しました</p>
        <p className="text-sm text-gray-500 mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">成果物</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredArtifacts.length}件の成果物
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 表示モード切り替え */}
          <div className="flex rounded-lg border border-gray-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          {showFilters && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              <span>フィルター</span>
            </button>
          )}
        </div>
      </div>

      {/* 検索バー */}
      {showFilters && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="成果物を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* フィルターパネル */}
      {showFilters && showFilterPanel && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* タイプフィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイプ
              </label>
              <select
                value={selectedType || ''}
                onChange={(e) => setSelectedType(e.target.value as ArtifactType || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべて</option>
                {Object.entries(ARTIFACT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* フェーズフィルター */}
            {!phaseId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  フェーズ
                </label>
                <select
                  value={selectedPhase || ''}
                  onChange={(e) => setSelectedPhase(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">すべて</option>
                  {/* フェーズオプションは実際のフェーズデータから生成 */}
                </select>
              </div>
            )}

            {/* タグフィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タグ
              </label>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              フィルターをクリア
            </button>
          </div>
        </div>
      )}

      {/* 成果物一覧 */}
      {filteredArtifacts.length === 0 ? (
        <div className="text-center py-12">
          <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">成果物が見つかりません</p>
          {searchQuery || selectedTags.length > 0 || selectedType || selectedPhase ? (
            <button
              onClick={clearFilters}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              フィルターをクリアして全て表示
            </button>
          ) : null}
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredArtifacts.map((artifact) => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              viewMode={viewMode}
              onDownload={() => handleDownload(artifact)}
              onDelete={() => handleDelete(artifact)}
              onEdit={() => onEditArtifact?.(artifact)}
              onClick={() => onArtifactClick?.(artifact)}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ArtifactCardProps {
  artifact: Artifact;
  viewMode: 'grid' | 'list';
  onDownload: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onClick: () => void;
  isDeleting: boolean;
}

function ArtifactCard({ 
  artifact, 
  viewMode, 
  onDownload, 
  onDelete, 
  onEdit, 
  onClick,
  isDeleting 
}: ArtifactCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex-shrink-0 text-gray-500">
              {ARTIFACT_TYPE_ICONS[artifact.type]}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {artifact.title}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {artifact.description || 'No description'}
              </p>
              
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDistanceToNow(artifact.createdAt, { addSuffix: true, locale: ja })}
                </span>
                <span className="flex items-center">
                  <Tag className="w-3 h-3 mr-1" />
                  {ARTIFACT_TYPE_LABELS[artifact.type]}
                </span>
                {artifact.metadata.language && (
                  <span>{artifact.metadata.language}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onClick}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="詳細を表示"
            >
              <Eye className="w-4 h-4" />
            </button>
            
            {artifact.fileUrl && (
              <button
                onClick={onDownload}
                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                title="ダウンロード"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            
            {artifact.externalUrl && (
              <a
                href={artifact.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="外部リンクを開く"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
              title="編集"
            >
              <Edit className="w-4 h-4" />
            </button>
            
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
              title="削除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {artifact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {artifact.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="text-gray-500">
              {ARTIFACT_TYPE_ICONS[artifact.type]}
            </div>
            <span className="text-sm font-medium text-gray-600">
              {ARTIFACT_TYPE_LABELS[artifact.type]}
            </span>
          </div>
          
          {artifact.isPublic && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              公開
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {artifact.title}
        </h3>
        
        {artifact.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {artifact.description}
          </p>
        )}
        
        {artifact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {artifact.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
            {artifact.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{artifact.tags.length - 3}個
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDistanceToNow(artifact.createdAt, { addSuffix: true, locale: ja })}
          </span>
          {artifact.metadata.language && (
            <span>{artifact.metadata.language}</span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={onClick}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>詳細</span>
          </button>
          
          <div className="flex items-center space-x-2">
            {artifact.fileUrl && (
              <button
                onClick={onDownload}
                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                title="ダウンロード"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            
            {artifact.externalUrl && (
              <a
                href={artifact.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="外部リンクを開く"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
              title="編集"
            >
              <Edit className="w-4 h-4" />
            </button>
            
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
              title="削除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}