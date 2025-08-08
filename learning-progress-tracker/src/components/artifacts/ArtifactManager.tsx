'use client';

import React, { useState } from 'react';
import { Plus, Upload, BarChart3, Grid, List, Download, Eye } from 'lucide-react';
import { ArtifactList } from './ArtifactList';
import { ArtifactUpload } from './ArtifactUpload';
import { ArtifactDetail } from './ArtifactDetail';
import { Portfolio } from './Portfolio';
import { PortfolioExport } from './PortfolioExport';
import { useArtifactStats } from '@/hooks/useArtifacts';
import type { Artifact } from '@/types';

interface ArtifactManagerProps {
  userId: string;
  phaseId?: string;
  taskId?: string;
  showStats?: boolean;
  showUploadButton?: boolean;
}

type ViewMode = 'list' | 'upload' | 'detail' | 'stats' | 'portfolio' | 'export';

export function ArtifactManager({ 
  userId, 
  phaseId, 
  taskId, 
  showStats = true,
  showUploadButton = true 
}: ArtifactManagerProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [editingArtifact, setEditingArtifact] = useState<Artifact | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const { stats, isLoading: statsLoading } = useArtifactStats({ userId });

  const handleArtifactClick = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setCurrentView('detail');
  };

  const handleEditArtifact = (artifact: Artifact) => {
    setEditingArtifact(artifact);
    setCurrentView('upload');
  };

  const handleUploadSuccess = (artifactId: string) => {
    setCurrentView('list');
    setEditingArtifact(null);
  };

  const handleUploadCancel = () => {
    setCurrentView('list');
    setEditingArtifact(null);
  };

  const handleDetailClose = () => {
    setCurrentView('list');
    setSelectedArtifact(null);
  };

  const handleArtifactDelete = (artifactId: string) => {
    setCurrentView('list');
    setSelectedArtifact(null);
  };

  const renderStats = () => {
    if (statsLoading || !stats) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    const typeEntries = Object.entries(stats.artifactsByType);
    const totalArtifacts = stats.totalArtifacts;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">総成果物数</p>
              <p className="text-2xl font-bold text-gray-900">{totalArtifacts}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">コード成果物</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.artifactsByType.code || 0}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Grid className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ドキュメント</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.artifactsByType.document || 0}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <List className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">最近の成果物</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.recentArtifacts.length}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    if (currentView === 'upload') {
      return null; // アップロードコンポーネントが独自のヘッダーを持つ
    }

    if (currentView === 'detail') {
      return null; // 詳細コンポーネントが独自のヘッダーを持つ
    }

    return (
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">成果物管理</h1>
          <p className="text-gray-600 mt-1">
            学習成果物をアップロード・管理し、ポートフォリオを構築しましょう
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentView('portfolio')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>ポートフォリオ</span>
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>エクスポート</span>
          </button>

          {showStats && (
            <button
              onClick={() => setCurrentView(currentView === 'stats' ? 'list' : 'stats')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>統計</span>
            </button>
          )}

          {showUploadButton && (
            <button
              onClick={() => setCurrentView('upload')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>成果物を追加</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'upload':
        return (
          <ArtifactUpload
            userId={userId}
            taskId={taskId || ''}
            phaseId={phaseId || ''}
            onSuccess={handleUploadSuccess}
            onCancel={handleUploadCancel}
          />
        );

      case 'detail':
        return selectedArtifact ? (
          <ArtifactDetail
            artifactId={selectedArtifact.id}
            onClose={handleDetailClose}
            onEdit={handleEditArtifact}
            onDelete={handleArtifactDelete}
          />
        ) : null;

      case 'portfolio':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">ポートフォリオプレビュー</h2>
              <button
                onClick={() => setCurrentView('list')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                一覧に戻る
              </button>
            </div>
            <Portfolio 
              userId={userId}
              isPublic={false}
              showHeader={false}
              theme="light"
            />
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-6">
            {renderStats()}
            
            {/* 詳細統計 */}
            {stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* タイプ別分布 */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    タイプ別分布
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(stats.artifactsByType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{type}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(count / stats.totalArtifacts) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 最近の成果物 */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    最近の成果物
                  </h3>
                  <div className="space-y-3">
                    {stats.recentArtifacts.map((artifact) => (
                      <div
                        key={artifact.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleArtifactClick(artifact)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {artifact.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {artifact.type} • {artifact.createdAt.toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {stats.recentArtifacts.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        成果物がありません
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* リストに戻るボタン */}
            <div className="flex justify-center">
              <button
                onClick={() => setCurrentView('list')}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                成果物一覧に戻る
              </button>
            </div>
          </div>
        );

      case 'list':
      default:
        return (
          <div className="space-y-6">
            {showStats && renderStats()}
            <ArtifactList
              userId={userId}
              phaseId={phaseId}
              taskId={taskId}
              onArtifactClick={handleArtifactClick}
              onEditArtifact={handleEditArtifact}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderHeader()}
        {renderContent()}
      </div>
      
      {/* エクスポートモーダル */}
      {showExportModal && (
        <PortfolioExport
          userId={userId}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}