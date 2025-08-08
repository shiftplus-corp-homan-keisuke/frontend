'use client';

import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Image, 
  Code, 
  Share2, 
  Settings,
  Eye,
  Palette,
  Layout
} from 'lucide-react';
import { useArtifacts } from '@/hooks/useArtifacts';
import { useLearningStore } from '@/stores/learning-store';
import type { Artifact } from '@/types';

interface PortfolioExportProps {
  userId: string;
  onClose?: () => void;
}

type ExportFormat = 'html' | 'pdf' | 'json';
type PortfolioTheme = 'modern' | 'classic' | 'minimal' | 'dark';
type PortfolioLayout = 'grid' | 'list' | 'timeline';

interface ExportSettings {
  format: ExportFormat;
  theme: PortfolioTheme;
  layout: PortfolioLayout;
  includePrivate: boolean;
  includeDescription: boolean;
  includeStats: boolean;
  includeSkills: boolean;
  selectedTypes: string[];
  selectedPhases: string[];
}

const EXPORT_FORMATS = [
  { value: 'html', label: 'HTML', icon: <Code className="w-4 h-4" />, description: 'Webページとして保存' },
  { value: 'pdf', label: 'PDF', icon: <FileText className="w-4 h-4" />, description: 'PDF文書として保存' },
  { value: 'json', label: 'JSON', icon: <Download className="w-4 h-4" />, description: 'データとして保存' }
] as const;

const PORTFOLIO_THEMES = [
  { value: 'modern', label: 'モダン', description: '洗練されたモダンなデザイン' },
  { value: 'classic', label: 'クラシック', description: '伝統的で読みやすいデザイン' },
  { value: 'minimal', label: 'ミニマル', description: 'シンプルで清潔なデザイン' },
  { value: 'dark', label: 'ダーク', description: 'ダークテーマのデザイン' }
] as const;

const PORTFOLIO_LAYOUTS = [
  { value: 'grid', label: 'グリッド', icon: <Layout className="w-4 h-4" />, description: 'カード形式で表示' },
  { value: 'list', label: 'リスト', icon: <FileText className="w-4 h-4" />, description: 'リスト形式で表示' },
  { value: 'timeline', label: 'タイムライン', icon: <Image className="w-4 h-4" />, description: '時系列で表示' }
] as const;

export function PortfolioExport({ userId, onClose }: PortfolioExportProps) {
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'html',
    theme: 'modern',
    layout: 'grid',
    includePrivate: false,
    includeDescription: true,
    includeStats: true,
    includeSkills: true,
    selectedTypes: [],
    selectedPhases: []
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const { artifacts } = useArtifacts({ userId });
  const { phases } = useLearningStore();

  const filteredArtifacts = artifacts.filter(artifact => {
    if (!settings.includePrivate && !artifact.isPublic) return false;
    if (settings.selectedTypes.length > 0 && !settings.selectedTypes.includes(artifact.type)) return false;
    if (settings.selectedPhases.length > 0 && !settings.selectedPhases.includes(artifact.phaseId)) return false;
    return true;
  });

  const handleSettingChange = <K extends keyof ExportSettings>(
    key: K,
    value: ExportSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleArraySettingToggle = (
    key: 'selectedTypes' | 'selectedPhases',
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const generateHTML = (artifacts: Artifact[]): string => {
    const themeStyles = {
      modern: `
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #f8fafc; color: #1e293b; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .header { text-align: center; margin-bottom: 3rem; }
        .title { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; color: #0f172a; }
        .subtitle { font-size: 1.25rem; color: #64748b; margin-bottom: 2rem; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 3rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .artifacts { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .artifact-card { background: white; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .artifact-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
        .artifact-description { color: #64748b; margin-bottom: 1rem; }
        .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .tag { background: #e0e7ff; color: #3730a3; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; }
      `,
      classic: `
        body { font-family: Georgia, serif; background: #ffffff; color: #333333; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
        .header { text-align: center; margin-bottom: 3rem; border-bottom: 2px solid #333; padding-bottom: 2rem; }
        .title { font-size: 2.5rem; margin-bottom: 1rem; }
        .artifacts { margin-top: 2rem; }
        .artifact-card { border: 1px solid #ddd; margin-bottom: 2rem; padding: 1.5rem; }
        .artifact-title { font-size: 1.5rem; margin-bottom: 1rem; }
      `,
      minimal: `
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #ffffff; color: #000000; }
        .container { max-width: 900px; margin: 0 auto; padding: 2rem; }
        .header { margin-bottom: 4rem; }
        .title { font-size: 2rem; font-weight: 300; margin-bottom: 1rem; }
        .artifacts { display: grid; gap: 2rem; }
        .artifact-card { border-bottom: 1px solid #eee; padding-bottom: 2rem; }
        .artifact-title { font-size: 1.25rem; font-weight: 400; margin-bottom: 0.5rem; }
      `,
      dark: `
        body { font-family: 'Inter', sans-serif; background: #0f172a; color: #f1f5f9; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .header { text-align: center; margin-bottom: 3rem; }
        .title { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; }
        .artifacts { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .artifact-card { background: #1e293b; border-radius: 0.75rem; padding: 1.5rem; }
        .artifact-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
        .tag { background: #374151; color: #d1d5db; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; }
      `
    };

    const stats = {
      totalArtifacts: artifacts.length,
      artifactsByType: artifacts.reduce((acc, artifact) => {
        acc[artifact.type] = (acc[artifact.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      skills: Array.from(new Set(artifacts.flatMap(a => [...a.tags, a.metadata.language, a.metadata.framework].filter(Boolean))))
    };

    return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>学習ポートフォリオ</title>
    <style>
        ${themeStyles[settings.theme]}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">学習ポートフォリオ</h1>
            <p class="subtitle">フロントエンドエンジニア育成プランの学習成果</p>
            <p>生成日: ${new Date().toLocaleDateString('ja-JP')}</p>
        </div>
        
        ${settings.includeStats ? `
        <div class="stats">
            <div class="stat-card">
                <h3>総成果物数</h3>
                <p style="font-size: 2rem; font-weight: bold;">${stats.totalArtifacts}</p>
            </div>
            <div class="stat-card">
                <h3>習得スキル数</h3>
                <p style="font-size: 2rem; font-weight: bold;">${stats.skills.length}</p>
            </div>
        </div>
        ` : ''}
        
        ${settings.includeSkills && stats.skills.length > 0 ? `
        <div style="margin-bottom: 3rem;">
            <h2>習得スキル</h2>
            <div class="tags">
                ${stats.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        
        <div class="artifacts">
            ${artifacts.map(artifact => `
                <div class="artifact-card">
                    <h3 class="artifact-title">${artifact.title}</h3>
                    ${settings.includeDescription && artifact.description ? `
                        <p class="artifact-description">${artifact.description}</p>
                    ` : ''}
                    <p><strong>タイプ:</strong> ${artifact.type}</p>
                    <p><strong>作成日:</strong> ${artifact.createdAt.toLocaleDateString('ja-JP')}</p>
                    ${artifact.metadata.language ? `<p><strong>言語:</strong> ${artifact.metadata.language}</p>` : ''}
                    ${artifact.metadata.framework ? `<p><strong>フレームワーク:</strong> ${artifact.metadata.framework}</p>` : ''}
                    ${artifact.externalUrl ? `<p><strong>URL:</strong> <a href="${artifact.externalUrl}" target="_blank">${artifact.externalUrl}</a></p>` : ''}
                    ${artifact.tags.length > 0 ? `
                        <div class="tags" style="margin-top: 1rem;">
                            ${artifact.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
    `;
  };

  const generateJSON = (artifacts: Artifact[]) => {
    return JSON.stringify({
      metadata: {
        exportDate: new Date().toISOString(),
        userId,
        totalArtifacts: artifacts.length,
        settings
      },
      artifacts: artifacts.map(artifact => ({
        id: artifact.id,
        title: artifact.title,
        description: artifact.description,
        type: artifact.type,
        createdAt: artifact.createdAt,
        updatedAt: artifact.updatedAt,
        tags: artifact.tags,
        metadata: artifact.metadata,
        externalUrl: artifact.externalUrl,
        isPublic: artifact.isPublic
      })),
      phases: phases.map(phase => ({
        id: phase.id,
        name: phase.name,
        description: phase.description,
        order: phase.order
      }))
    }, null, 2);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // プログレス更新のシミュレーション
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      let content: string;
      let filename: string;
      let mimeType: string;

      switch (settings.format) {
        case 'html':
          content = generateHTML(filteredArtifacts);
          filename = `portfolio-${userId}-${new Date().toISOString().split('T')[0]}.html`;
          mimeType = 'text/html';
          break;
        case 'json':
          content = generateJSON(filteredArtifacts);
          filename = `portfolio-${userId}-${new Date().toISOString().split('T')[0]}.json`;
          mimeType = 'application/json';
          break;
        case 'pdf':
          // PDF生成は実際の実装では専用ライブラリ（jsPDF等）を使用
          content = generateHTML(filteredArtifacts);
          filename = `portfolio-${userId}-${new Date().toISOString().split('T')[0]}.html`;
          mimeType = 'text/html';
          break;
        default:
          throw new Error('Unsupported format');
      }

      // ファイルダウンロード
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      clearInterval(progressInterval);
      setExportProgress(100);

      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        onClose?.();
      }, 1000);

    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setExportProgress(0);
      alert('エクスポートに失敗しました');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">ポートフォリオエクスポート</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            学習成果物をポートフォリオとしてエクスポートします
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* エクスポート形式 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">エクスポート形式</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {EXPORT_FORMATS.map((format) => (
                <button
                  key={format.value}
                  onClick={() => handleSettingChange('format', format.value)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    settings.format === format.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {format.icon}
                    <span className="font-medium">{format.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{format.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* テーマ選択 */}
          {settings.format === 'html' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">テーマ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PORTFOLIO_THEMES.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleSettingChange('theme', theme.value)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      settings.theme === theme.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium mb-1">{theme.label}</div>
                    <p className="text-sm text-gray-600">{theme.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* レイアウト選択 */}
          {settings.format === 'html' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">レイアウト</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PORTFOLIO_LAYOUTS.map((layout) => (
                  <button
                    key={layout.value}
                    onClick={() => handleSettingChange('layout', layout.value)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      settings.layout === layout.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {layout.icon}
                      <span className="font-medium">{layout.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{layout.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 含める内容 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">含める内容</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includePrivate}
                  onChange={(e) => handleSettingChange('includePrivate', e.target.checked)}
                  className="mr-3"
                />
                <span>非公開の成果物も含める</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includeDescription}
                  onChange={(e) => handleSettingChange('includeDescription', e.target.checked)}
                  className="mr-3"
                />
                <span>成果物の説明を含める</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includeStats}
                  onChange={(e) => handleSettingChange('includeStats', e.target.checked)}
                  className="mr-3"
                />
                <span>統計情報を含める</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includeSkills}
                  onChange={(e) => handleSettingChange('includeSkills', e.target.checked)}
                  className="mr-3"
                />
                <span>習得スキル一覧を含める</span>
              </label>
            </div>
          </div>

          {/* プレビュー情報 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">エクスポート対象</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>成果物数: {filteredArtifacts.length}個</p>
              <p>形式: {EXPORT_FORMATS.find(f => f.value === settings.format)?.label}</p>
              {settings.format === 'html' && (
                <>
                  <p>テーマ: {PORTFOLIO_THEMES.find(t => t.value === settings.theme)?.label}</p>
                  <p>レイアウト: {PORTFOLIO_LAYOUTS.find(l => l.value === settings.layout)?.label}</p>
                </>
              )}
            </div>
          </div>

          {/* エクスポート進行状況 */}
          {isExporting && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">エクスポート中...</span>
                <span className="text-sm text-blue-700">{exportProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredArtifacts.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? 'エクスポート中...' : 'エクスポート'}
          </button>
        </div>
      </div>
    </div>
  );
}