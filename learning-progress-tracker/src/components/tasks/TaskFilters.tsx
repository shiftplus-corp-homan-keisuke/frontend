'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Filter, 
  Search, 
  X, 
  CheckSquare, 
  Clock, 
  Play,
  AlertTriangle,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useLearningStore } from '@/stores';
import type { TaskStatus, Priority, Phase } from '@/types';

interface TaskFiltersProps {
  selectedPhase?: string;
  selectedStatuses: TaskStatus[];
  selectedPriorities: Priority[];
  searchQuery: string;
  onPhaseChange: (phaseId?: string) => void;
  onStatusChange: (statuses: TaskStatus[]) => void;
  onPriorityChange: (priorities: Priority[]) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  selectedPhase,
  selectedStatuses,
  selectedPriorities,
  searchQuery,
  onPhaseChange,
  onStatusChange,
  onPriorityChange,
  onSearchChange,
  onClearFilters,
}) => {
  const { phases, tasks } = useLearningStore();

  // フィルターが適用されているかチェック
  const hasActiveFilters = 
    selectedPhase || 
    selectedStatuses.length > 0 || 
    selectedPriorities.length > 0 || 
    searchQuery.trim().length > 0;

  // ステータス別のタスク数を計算
  const getStatusCount = (status: TaskStatus, phaseId?: string) => {
    let filteredTasks = tasks;
    if (phaseId) {
      filteredTasks = filteredTasks.filter(task => task.phaseId === phaseId);
    }
    return filteredTasks.filter(task => task.status === status).length;
  };

  // 優先度別のタスク数を計算
  const getPriorityCount = (priority: Priority, phaseId?: string) => {
    let filteredTasks = tasks;
    if (phaseId) {
      filteredTasks = filteredTasks.filter(task => task.phaseId === phaseId);
    }
    return filteredTasks.filter(task => task.priority === priority).length;
  };

  // フェーズ別のタスク数を計算
  const getPhaseTaskCount = (phaseId: string) => {
    return tasks.filter(task => task.phaseId === phaseId).length;
  };

  // ステータス選択ハンドラー
  const handleStatusToggle = (status: TaskStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter(s => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  // 優先度選択ハンドラー
  const handlePriorityToggle = (priority: Priority) => {
    if (selectedPriorities.includes(priority)) {
      onPriorityChange(selectedPriorities.filter(p => p !== priority));
    } else {
      onPriorityChange([...selectedPriorities, priority]);
    }
  };

  // ステータスアイコンとラベルを取得
  const getStatusInfo = (status: TaskStatus) => {
    switch (status) {
      case 'not_started':
        return {
          icon: <Clock className="h-4 w-4" />,
          label: '未開始',
          color: 'text-gray-600',
        };
      case 'in_progress':
        return {
          icon: <Play className="h-4 w-4" />,
          label: '進行中',
          color: 'text-blue-600',
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: '完了',
          color: 'text-green-600',
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          label: '不明',
          color: 'text-gray-600',
        };
    }
  };

  // 優先度アイコンとラベルを取得
  const getPriorityInfo = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          label: '高',
          color: 'text-red-600',
        };
      case 'medium':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          label: '中',
          color: 'text-yellow-600',
        };
      case 'low':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: '低',
          color: 'text-green-600',
        };
      default:
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          label: '不明',
          color: 'text-gray-600',
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            フィルター
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-sm"
            >
              <X className="mr-2 h-4 w-4" />
              クリア
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 検索 */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            検索
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="タスク名や説明で検索..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* フェーズフィルター */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            フェーズ
          </label>
          <div className="space-y-2">
            <Button
              variant={!selectedPhase ? "default" : "outline"}
              size="sm"
              onClick={() => onPhaseChange(undefined)}
              className="w-full justify-start"
            >
              すべてのフェーズ
              <Badge variant="secondary" className="ml-auto">
                {tasks.length}
              </Badge>
            </Button>
            {phases.map((phase) => (
              <Button
                key={phase.id}
                variant={selectedPhase === phase.id ? "default" : "outline"}
                size="sm"
                onClick={() => onPhaseChange(phase.id)}
                className="w-full justify-start"
              >
                <span className="truncate">{phase.name}</span>
                <Badge variant="secondary" className="ml-auto">
                  {getPhaseTaskCount(phase.id)}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* ステータスフィルター */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            ステータス
          </label>
          <div className="space-y-2">
            {(['not_started', 'in_progress', 'completed'] as TaskStatus[]).map((status) => {
              const statusInfo = getStatusInfo(status);
              const count = getStatusCount(status, selectedPhase);
              const isSelected = selectedStatuses.includes(status);

              return (
                <Button
                  key={status}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusToggle(status)}
                  className="w-full justify-start"
                >
                  <span className={`flex items-center ${statusInfo.color}`}>
                    {statusInfo.icon}
                    <span className="ml-2">{statusInfo.label}</span>
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* 優先度フィルター */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            優先度
          </label>
          <div className="space-y-2">
            {(['high', 'medium', 'low'] as Priority[]).map((priority) => {
              const priorityInfo = getPriorityInfo(priority);
              const count = getPriorityCount(priority, selectedPhase);
              const isSelected = selectedPriorities.includes(priority);

              return (
                <Button
                  key={priority}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePriorityToggle(priority)}
                  className="w-full justify-start"
                >
                  <span className={`flex items-center ${priorityInfo.color}`}>
                    {priorityInfo.icon}
                    <span className="ml-2">{priorityInfo.label}</span>
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* アクティブフィルターの表示 */}
        {hasActiveFilters && (
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              適用中のフィルター
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedPhase && (
                <Badge variant="default" className="flex items-center gap-1">
                  {phases.find(p => p.id === selectedPhase)?.name}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onPhaseChange(undefined)}
                  />
                </Badge>
              )}
              {selectedStatuses.map((status) => {
                const statusInfo = getStatusInfo(status);
                return (
                  <Badge key={status} variant="default" className="flex items-center gap-1">
                    {statusInfo.label}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleStatusToggle(status)}
                    />
                  </Badge>
                );
              })}
              {selectedPriorities.map((priority) => {
                const priorityInfo = getPriorityInfo(priority);
                return (
                  <Badge key={priority} variant="default" className="flex items-center gap-1">
                    {priorityInfo.label}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handlePriorityToggle(priority)}
                    />
                  </Badge>
                );
              })}
              {searchQuery.trim() && (
                <Badge variant="default" className="flex items-center gap-1">
                  「{searchQuery}」
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onSearchChange('')}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};