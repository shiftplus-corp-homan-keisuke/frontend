'use client';

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Tag, 
  FileText,
  Code,
  Image,
  Video,
  File,
  Eye,
  EyeOff,
  Share2
} from 'lucide-react';
import { useArtifact, useArtifactMutations } from '@/hooks/useArtifacts';
import { getLocalFile } from '@/lib/api/artifacts';
import type { Artifact, ArtifactType } from '@/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ArtifactDetailProps {
  artifactId: string;
  onClose: () => void;
  onEdit?: (artifact: Artifact) => void;
  onDelete?: (artifactId: string) => void;
}

const ARTIFACT_TYPE_ICONS: Record<ArtifactType, React.ReactNode> = {
  code: <Code className="w-6 h-6" />,
  document: <FileText className="w-6 h-6" />,
  design: <Image className="w-6 h-6" />,
  video: <Video className="w-6 h-6" />,
  other: <File className="w-6 h-6" />
};

const ARTIFACT_TYPE_LABELS: Record<ArtifactType, string> = {
  code: 'コード',
  document: 'ドキュメント',
  design: 'デザイン',
  video: '動画',
  other: 'その他'
};

const DIFFICULTY_LABELS = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級'
};

export function ArtifactDetail({ artifactId, onClose, onEdit, onDelete }: ArtifactDetailProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const { artifact, isLoading, error } = useArtifact({ artifactId });
  const { deleteArtifact, updateArtifact, isDeleting, isUpdating } = useArtifactMutations();

  const handleDownload = async () => {
    if (!artifact?.fileUrl) return;

    if (artifact.fileUrl.startsWith('local://')) {
      const fileData = getLocalFile(artifact.fileUrl);
      if (fileData) {
        const link = document.createElement('a');
        link.href = fileData.data;
        link.download = fileData.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      window.open(artifact.fileUrl, '_blank');
    }
  };

  const handleDelete = async () => {
    if (!artifact) return;

    if (window.confirm('この成果物を削除しますか？この操作は取り消せません。')) {
      try {
        await deleteArtifact(artifact.id);
        onDelete?.(artifact.id);
        onClose();
      } catch (error) {
        console.error('Failed to delete artifact:', error);
        alert('成果物の削除に失敗しました');
      }
    }
  };

  const handleTogglePublic = async () => {
    if (!artifact) return;

    try {
      await updateArtifact(artifact.id, {
        isPublic: !artifact.isPublic
      });
    } catch (error) {
      console.error('Failed to update artifact visibility:', error);
      alert('公開設定の変更に失敗しました');
    }
  };

  const handleShare = async () => {
    if (!artifact) return;

    const shareUrl = `${window.location.origin}/artifacts/${artifact.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: artifact.title,
          text: artifact.description || '',
          url: shareUrl,
        });
      } catch (error) {
        // ユーザーがキャンセルした場合など
        console.log('Share cancelled');
      }
    } else {
      // Web Share API が利用できない場合はクリップボードにコピー
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        setShowShareModal(true);
      }
    }
  };

  const getFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">読み込み中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artifact) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <div className="text-center">
            <p className="text-red-600 mb-4">成果物の読み込みに失敗しました</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="text-gray-600">
                {ARTIFACT_TYPE_ICONS[artifact.type]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{artifact.title}</h1>
                <p className="text-sm text-gray-600">
                  {ARTIFACT_TYPE_LABELS[artifact.type]}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* 公開/非公開切り替え */}
              <button
                onClick={handleTogglePublic}
                disabled={isUpdating}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  artifact.isPublic
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={artifact.isPublic ? '非公開にする' : '公開する'}
              >
                {artifact.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="text-sm">
                  {artifact.isPublic ? '公開中' : '非公開'}
                </span>
              </button>

              {/* 共有ボタン */}
              {artifact.isPublic && (
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  title="共有"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">共有</span>
                </button>
              )}

              {/* アクションボタン */}
              <div className="flex items-center space-x-1">
                {artifact.fileUrl && (
                  <button
                    onClick={handleDownload}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title="ダウンロード"
                  >
                    <Download className="w-5 h-5" />
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
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
                
                <button
                  onClick={() => onEdit?.(artifact)}
                  className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                  title="編集"
                >
                  <Edit className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  title="削除"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="閉じる"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* コンテンツ */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* メインコンテンツ */}
              <div className="lg:col-span-2 space-y-6">
                {/* 説明 */}
                {artifact.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">説明</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {artifact.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* ファイル情報 */}
                {artifact.fileUrl && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">ファイル情報</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {artifact.metadata.mimeType && (
                          <div>
                            <span className="font-medium text-gray-600">ファイル形式:</span>
                            <span className="ml-2 text-gray-900">{artifact.metadata.mimeType}</span>
                          </div>
                        )}
                        {artifact.metadata.fileSize && (
                          <div>
                            <span className="font-medium text-gray-600">ファイルサイズ:</span>
                            <span className="ml-2 text-gray-900">{getFileSize(artifact.metadata.fileSize)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 外部リンク */}
                {artifact.externalUrl && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">外部リンク</h3>
                    <a
                      href={artifact.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="break-all">{artifact.externalUrl}</span>
                    </a>
                  </div>
                )}

                {/* タグ */}
                {artifact.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">タグ</h3>
                    <div className="flex flex-wrap gap-2">
                      {artifact.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* サイドバー */}
              <div className="space-y-6">
                {/* 基本情報 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-600">作成日:</span>
                      <span className="text-gray-900">
                        {format(artifact.createdAt, 'yyyy年MM月dd日', { locale: ja })}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-600">更新日:</span>
                      <span className="text-gray-900">
                        {format(artifact.updatedAt, 'yyyy年MM月dd日', { locale: ja })}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-600">難易度:</span>
                      <span className="text-gray-900">
                        {DIFFICULTY_LABELS[artifact.metadata.difficulty]}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-600">公開状態:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        artifact.isPublic
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {artifact.isPublic ? '公開' : '非公開'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 技術情報 */}
                {(artifact.metadata.language || artifact.metadata.framework) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">技術情報</h3>
                    <div className="space-y-3 text-sm">
                      {artifact.metadata.language && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-600">言語:</span>
                          <span className="text-gray-900">{artifact.metadata.language}</span>
                        </div>
                      )}
                      
                      {artifact.metadata.framework && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-600">フレームワーク:</span>
                          <span className="text-gray-900">{artifact.metadata.framework}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* アクション */}
                <div className="space-y-2">
                  {artifact.fileUrl && (
                    <button
                      onClick={handleDownload}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>ダウンロード</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => onEdit?.(artifact)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>編集</span>
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{isDeleting ? '削除中...' : '削除'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 共有モーダル */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">共有</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              以下のURLをコピーして共有してください:
            </p>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={`${window.location.origin}/artifacts/${artifact.id}`}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(`${window.location.origin}/artifacts/${artifact.id}`);
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                  } catch (error) {
                    console.error('Failed to copy to clipboard:', error);
                  }
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                コピー
              </button>
            </div>
            
            {copySuccess && (
              <p className="text-sm text-green-600 mt-2">
                URLをクリップボードにコピーしました！
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}