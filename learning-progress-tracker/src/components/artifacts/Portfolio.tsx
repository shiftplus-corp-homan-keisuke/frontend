'use client';

import React, { useState, useMemo } from 'react';
import { 
  ExternalLink, 
  Download, 
  Calendar, 
  Tag, 
  Code, 
  FileText, 
  Image, 
  Video, 
  File,
  Share2,
  Eye,
  Filter,
  Grid,
  List,
  User,
  Award,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useArtifacts } from '@/hooks/useArtifacts';
import { useLearningStore } from '@/stores/learning-store';
import { getLocalFile } from '@/lib/api/artifacts';
import type { Artifact, ArtifactType, Phase } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface PortfolioProps {
  userId: string;
  isPublic?: boolean;
  showHeader?: boolean;
  theme?: 'light' | 'dark';
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

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

const DIFFICULTY_LABELS = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級'
};

export function Portfolio({ userId, isPublic = false, showHeader = true, theme = 'light' }: PortfolioProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<ArtifactType | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { artifacts, isLoading } = useArtifacts({ 
    userId, 
    enabled: true 
  });
  
  const { phases } = useLearningStore();

  // 公開設定に応じてフィルタリング
  const filteredArtifacts = useMemo(() => {
    let filtered = artifacts;
    
    if (isPublic) {
      filtered = filtered.filter(artifact => artifact.isPublic);
    }
    
    if (selectedType) {
      filtered = filtered.filter(artifact => artifact.type === selectedType);
    }
    
    if (selectedPhase) {
      filtered = filtered.filter(artifact => artifact.phaseId === selectedPhase);
    }
    
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [artifacts, isPublic, selectedType, selectedPhase]);

  // 統計情報の計算
  const stats = useMemo(() => {
    const totalArtifacts = filteredArtifacts.length;
    const artifactsByType = filteredArtifacts.reduce((acc, artifact) => {
      acc[artifact.type] = (acc[artifact.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const artifactsByPhase = filteredArtifacts.reduce((acc, artifact) => {
      acc[artifact.phaseId] = (acc[artifact.phaseId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const skillsSet = new Set<string>();
    filteredArtifacts.forEach(artifact => {
      artifact.tags.forEach(tag => skillsSet.add(tag));
      if (artifact.metadata.language) skillsSet.add(artifact.metadata.language);
      if (artifact.metadata.framework) skillsSet.add(artifact.metadata.framework);
    });
    
    const completedPhases = phases.filter(phase => 
      artifactsByPhase[phase.id] && artifactsByPhase[phase.id] > 0
    ).length;
    
    return {
      totalArtifacts,
      artifactsByType,
      artifactsByPhase,
      skills: Array.from(skillsSet),
      completedPhases,
      totalPhases: phases.length
    };
  }, [filteredArtifacts, phases]);

  // フェーズ別にグループ化
  const artifactsByPhase = useMemo(() => {
    const grouped = filteredArtifacts.reduce((acc, artifact) => {
      if (!acc[artifact.phaseId]) {
        acc[artifact.phaseId] = [];
      }
      acc[artifact.phaseId].push(artifact);
      return acc;
    }, {} as Record<string, Artifact[]>);
    
    return Object.entries(grouped).map(([phaseId, artifacts]) => {
      const phase = phases.find(p => p.id === phaseId);
      return {
        phase: phase || { id: phaseId, name: `Phase ${phaseId}`, description: '' } as Phase,
        artifacts: artifacts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      };
    }).sort((a, b) => (a.phase.order || 0) - (b.phase.order || 0));
  }, [filteredArtifacts, phases]);

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

  const handleShare = async () => {
    const portfolioUrl = `${window.location.origin}/portfolio/${userId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ポートフォリオ',
          text: '学習成果物のポートフォリオをご覧ください',
          url: portfolioUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(portfolioUrl);
        alert('ポートフォリオのURLをクリップボードにコピーしました！');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">ポートフォリオを読み込み中...</span>
      </div>
    );
  }

  const themeClasses = theme === 'dark' 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        {showHeader && (
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <User className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">学習ポートフォリオ</h1>
            <p className="text-xl text-gray-600 mb-6">
              フロントエンドエンジニア育成プランの学習成果
            </p>
            
            {/* 統計サマリー */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalArtifacts}</div>
                <div className="text-sm text-gray-600">成果物</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.completedPhases}/{stats.totalPhases}
                </div>
                <div className="text-sm text-gray-600">フェーズ</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-center mb-2">
                  <Code className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.skills.length}</div>
                <div className="text-sm text-gray-600">スキル</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredArtifacts.length > 0 
                    ? formatDistanceToNow(filteredArtifacts[0].createdAt, { locale: ja })
                    : '-'
                  }
                </div>
                <div className="text-sm text-gray-600">最新更新</div>
              </div>
            </div>
            
            {/* 共有ボタン */}
            {isPublic && (
              <button
                onClick={handleShare}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>ポートフォリオを共有</span>
              </button>
            )}
          </div>
        )}

        {/* フィルターとビューコントロール */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>フィルター</span>
            </button>
            
            {(selectedType || selectedPhase) && (
              <button
                onClick={() => {
                  setSelectedType(null);
                  setSelectedPhase(null);
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                フィルターをクリア
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg border border-gray-300 bg-white">
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
          </div>
        </div>

        {/* フィルターパネル */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {phases.map((phase) => (
                    <option key={phase.id} value={phase.id}>
                      {phase.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* スキル一覧 */}
        {stats.skills.length > 0 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">習得スキル</h3>
            <div className="flex flex-wrap gap-2">
              {stats.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 成果物一覧 */}
        {filteredArtifacts.length === 0 ? (
          <div className="text-center py-12">
            <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {isPublic ? '公開されている成果物がありません' : '成果物がありません'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="space-y-12">
            {artifactsByPhase.map(({ phase, artifacts }) => (
              <div key={phase.id}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{phase.name}</h2>
                    <p className="text-gray-600 mt-1">{artifacts.length}個の成果物</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artifacts.map((artifact) => (
                    <PortfolioArtifactCard
                      key={artifact.id}
                      artifact={artifact}
                      onDownload={() => handleDownload(artifact)}
                      theme={theme}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {artifactsByPhase.map(({ phase, artifacts }) => (
              <div key={phase.id}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{phase.name}</h2>
                    <p className="text-gray-600 mt-1">{artifacts.length}個の成果物</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {artifacts.map((artifact) => (
                    <PortfolioArtifactListItem
                      key={artifact.id}
                      artifact={artifact}
                      onDownload={() => handleDownload(artifact)}
                      theme={theme}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface PortfolioArtifactCardProps {
  artifact: Artifact;
  onDownload: () => void;
  theme: 'light' | 'dark';
}

function PortfolioArtifactCard({ artifact, onDownload, theme }: PortfolioArtifactCardProps) {
  const cardClasses = theme === 'dark' 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  return (
    <div className={`${cardClasses} border rounded-lg overflow-hidden hover:shadow-lg transition-shadow`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="text-gray-500">
              {ARTIFACT_TYPE_ICONS[artifact.type]}
            </div>
            <span className="text-sm font-medium text-gray-600">
              {ARTIFACT_TYPE_LABELS[artifact.type]}
            </span>
          </div>
          
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            DIFFICULTY_COLORS[artifact.metadata.difficulty]
          }`}>
            {DIFFICULTY_LABELS[artifact.metadata.difficulty]}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {artifact.title}
        </h3>
        
        {artifact.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {artifact.description}
          </p>
        )}
        
        {artifact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
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
            {format(artifact.createdAt, 'yyyy年MM月dd日', { locale: ja })}
          </span>
          {artifact.metadata.language && (
            <span>{artifact.metadata.language}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {artifact.fileUrl && (
            <button
              onClick={onDownload}
              className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>ダウンロード</span>
            </button>
          )}
          
          {artifact.externalUrl && (
            <a
              href={artifact.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>表示</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

interface PortfolioArtifactListItemProps {
  artifact: Artifact;
  onDownload: () => void;
  theme: 'light' | 'dark';
}

function PortfolioArtifactListItem({ artifact, onDownload, theme }: PortfolioArtifactListItemProps) {
  const itemClasses = theme === 'dark' 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  return (
    <div className={`${itemClasses} border rounded-lg p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0 text-gray-500">
            {ARTIFACT_TYPE_ICONS[artifact.type]}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {artifact.title}
              </h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                DIFFICULTY_COLORS[artifact.metadata.difficulty]
              }`}>
                {DIFFICULTY_LABELS[artifact.metadata.difficulty]}
              </span>
            </div>
            
            {artifact.description && (
              <p className="text-sm text-gray-600 mb-3">
                {artifact.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {format(artifact.createdAt, 'yyyy年MM月dd日', { locale: ja })}
              </span>
              <span className="flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                {ARTIFACT_TYPE_LABELS[artifact.type]}
              </span>
              {artifact.metadata.language && (
                <span>{artifact.metadata.language}</span>
              )}
            </div>
            
            {artifact.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
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
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {artifact.fileUrl && (
            <button
              onClick={onDownload}
              className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>ダウンロード</span>
            </button>
          )}
          
          {artifact.externalUrl && (
            <a
              href={artifact.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>表示</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}