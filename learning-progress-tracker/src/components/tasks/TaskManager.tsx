'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Filter, 
  Plus, 
  LayoutGrid, 
  List, 
  Columns,
  SortAsc, 
  SortDesc,
  RefreshCw
} from 'lucide-react';
import { useLearningStore } from '@/stores';
import { TaskList } from './TaskList';
import { TaskFilters } from './TaskFilters';
import { PhaseOverview } from './PhaseOverview';
import { TaskBoard } from './TaskBoard';
import type { TaskStatus, Priority } from '@/types';

interface TaskManagerProps {
  className?: string;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ className }) => {
  const { phases, tasks, loading, error, loadFromStorage } = useLearningStore();

  // フィルター状態
  const [selectedPhase, setSelectedPhase] = useState<string | undefined>();
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'list' | 'board'>('overview');

  // 初期化時にデータをロード
  useEffect(() => {
    if (phases.length === 0 && !loading) {
      loadFromStorage();
    }
  }, [phases.length, loading, loadFromStorage]);

  // フィルターをクリア
  const handleClearFilters = () => {
    setSelectedPhase(undefined);
    setSelectedStatuses([]);
    setSelectedPriorities([]);
    setSearchQuery('');
  };

  // フェーズ選択ハンドラー
  const handlePhaseSelect = (phaseId: string) => {
    setSelectedPhase(phaseId);
    setViewMode('list'); // フェーズを選択したらリスト表示に切り替え
  };

  // アクティブフィルター数を計算
  const activeFiltersCount = 
    (selectedPhase ? 1 : 0) +
    selectedStatuses.length +
    selectedPriorities.length +
    (searchQuery.trim() ? 1 : 0);

  // フィルタリングされたタスク数を計算
  const getFilteredTaskCount = () => {
    let filtered = tasks;

    if (selectedPhase) {
      filtered = filtered.filter(task => task.phaseId === selectedPhase);
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(task => selectedStatuses.includes(task.status));
    }

    if (selectedPriorities.length > 0) {
      filtered = filtered.filter(task => selectedPriorities.includes(task.priority));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    return filtered.length;
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-3 text-gray-600">タスクデータを読み込み中...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-600">
              <p className="text-lg font-medium mb-2">エラーが発生しました</p>
              <p className="text-sm">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => loadFromStorage()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                再読み込み
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ページヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            タスク管理
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            学習タスクの進捗状況を管理します
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          {/* 表示モード切り替え */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={viewMode === 'overview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('overview')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'board' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('board')}
            >
              <Columns className="h-4 w-4" />
            </Button>
          </div>

          {/* フィルターボタン */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="mr-2 h-4 w-4" />
            フィルター
            {activeFiltersCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {/* 新しいタスクボタン */}
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新しいタスク
          </Button>
        </div>
      </div>

      {/* フィルター結果の表示 */}
      {activeFiltersCount > 0 && (
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getFilteredTaskCount()}件のタスクが見つかりました
                </span>
                {selectedPhase && (
                  <Badge variant="outline">
                    {phases.find(p => p.id === selectedPhase)?.name}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
              >
                フィルターをクリア
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* フィルターサイドバー */}
        {showFilters && (
          <div className="lg:col-span-1">
            <TaskFilters
              selectedPhase={selectedPhase}
              selectedStatuses={selectedStatuses}
              selectedPriorities={selectedPriorities}
              searchQuery={searchQuery}
              onPhaseChange={setSelectedPhase}
              onStatusChange={setSelectedStatuses}
              onPriorityChange={setSelectedPriorities}
              onSearchChange={setSearchQuery}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}

        {/* メインコンテンツ */}
        <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
          {viewMode === 'overview' ? (
            <div className="space-y-6">
              {/* フェーズ概要 */}
              <Card>
                <CardHeader>
                  <CardTitle>フェーズ別進捗</CardTitle>
                  <CardDescription>
                    各フェーズの進捗状況と統計情報
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PhaseOverview
                    selectedPhase={selectedPhase}
                    onPhaseSelect={handlePhaseSelect}
                  />
                </CardContent>
              </Card>

              {/* 最近のタスク */}
              {!selectedPhase && (
                <Card>
                  <CardHeader>
                    <CardTitle>最近のタスク</CardTitle>
                    <CardDescription>
                      進行中および最近完了したタスク
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TaskList
                      statusFilter={['in_progress', 'completed']}
                      searchQuery={searchQuery}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          ) : viewMode === 'board' ? (
            <TaskBoard
              phaseId={selectedPhase}
              searchQuery={searchQuery}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedPhase 
                    ? `${phases.find(p => p.id === selectedPhase)?.name} のタスク`
                    : 'すべてのタスク'
                  }
                </CardTitle>
                <CardDescription>
                  タスクの詳細情報と進捗管理
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskList
                  phaseId={selectedPhase}
                  statusFilter={selectedStatuses.length > 0 ? selectedStatuses : undefined}
                  priorityFilter={selectedPriorities.length > 0 ? selectedPriorities : undefined}
                  searchQuery={searchQuery}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};