'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckSquare, 
  Clock, 
  Play, 
  AlertCircle, 
  Calendar, 
  GripVertical,
  AlertTriangle,
  CheckCircle,
  Timer as TimerIcon
} from 'lucide-react';
import { useLearningStore } from '@/stores';
import { useTimerStore } from '@/stores/timer-store';
import { Timer } from '@/components/timer';
import type { Task, TaskStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onStatusUpdate?: (taskId: string, newStatus: TaskStatus) => void;
  showPhase?: boolean;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isDragging = false,
  onDragStart,
  onDragEnd,
  onStatusUpdate,
  showPhase = true,
  className = '',
}) => {
  const { phases, tasks, updateTaskStatus, canUpdateTaskStatus } = useLearningStore();
  const { isRunning, currentTaskId } = useTimerStore();
  const [isHovered, setIsHovered] = useState(false);

  // フェーズ名を取得する関数
  const getPhaseName = (phaseId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    return phase?.name || 'Unknown Phase';
  };

  // ステータスに応じたスタイルを取得
  const getStatusStyle = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return {
          borderColor: 'border-green-500',
          badgeVariant: 'success' as const,
          opacity: 'opacity-75',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
        };
      case 'in_progress':
        return {
          borderColor: 'border-blue-500',
          badgeVariant: 'info' as const,
          opacity: '',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        };
      case 'not_started':
        return {
          borderColor: 'border-gray-300',
          badgeVariant: 'secondary' as const,
          opacity: '',
          bgColor: 'bg-gray-50 dark:bg-gray-800/50',
        };
      default:
        return {
          borderColor: 'border-gray-300',
          badgeVariant: 'secondary' as const,
          opacity: '',
          bgColor: 'bg-gray-50 dark:bg-gray-800/50',
        };
    }
  };

  // 優先度に応じたアイコンとスタイルを取得
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
          text: '高',
          color: 'text-red-500',
        };
      case 'medium':
        return {
          icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
          text: '中',
          color: 'text-yellow-500',
        };
      case 'low':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          text: '低',
          color: 'text-green-500',
        };
      default:
        return {
          icon: <AlertCircle className="h-4 w-4 text-gray-500" />,
          text: '不明',
          color: 'text-gray-500',
        };
    }
  };

  // タスクステータス更新ハンドラー
  const handleStatusUpdate = (newStatus: TaskStatus) => {
    const canUpdate = canUpdateTaskStatus(task.id, newStatus);
    if (!canUpdate.canUpdate) {
      alert(canUpdate.reason);
      return;
    }

    if (onStatusUpdate) {
      onStatusUpdate(task.id, newStatus);
    } else {
      updateTaskStatus(task.id, newStatus);
    }
  };

  // タスクアクションボタンを取得
  const getActionButtons = () => {
    const buttons = [];

    switch (task.status) {
      case 'not_started':
        buttons.push(
          <Button
            key="start"
            size="sm"
            variant="outline"
            onClick={() => handleStatusUpdate('in_progress')}
            className="text-xs"
          >
            <Play className="mr-1 h-3 w-3" />
            開始
          </Button>
        );
        break;
      case 'in_progress':
        buttons.push(
          <Button
            key="complete"
            size="sm"
            onClick={() => handleStatusUpdate('completed')}
            className="text-xs"
          >
            <CheckSquare className="mr-1 h-3 w-3" />
            完了
          </Button>
        );
        break;
      case 'completed':
        buttons.push(
          <Button key="completed" size="sm" variant="ghost" disabled className="text-xs">
            <CheckSquare className="mr-1 h-3 w-3" />
            完了済み
          </Button>
        );
        break;
    }

    return buttons;
  };

  const statusStyle = getStatusStyle(task.status);
  const priorityStyle = getPriorityStyle(task.priority);

  return (
    <Card
      className={`
        ${statusStyle.opacity} 
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''} 
        ${isHovered ? 'shadow-lg' : ''} 
        transition-all duration-200 cursor-move
        ${className}
      `}
      draggable
      onDragStart={(e) => {
        setIsHovered(false);
        onDragStart?.(e, task);
      }}
      onDragEnd={(e) => {
        onDragEnd?.(e);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className={`border-l-4 ${statusStyle.borderColor} pl-3 ${statusStyle.bgColor} -ml-4 -mt-4 -mb-4 -mr-4 p-4 rounded-r-lg`}>
          {/* ドラッグハンドル */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                {/* タスクタイトル */}
                <h3 className={`font-medium text-sm text-gray-900 dark:text-white truncate ${
                  task.status === 'completed' ? 'line-through' : ''
                }`}>
                  {task.title}
                </h3>
              </div>
            </div>
            
            {/* 優先度インジケーター */}
            <div className={`flex items-center ${priorityStyle.color} flex-shrink-0`}>
              {priorityStyle.icon}
            </div>
          </div>

          {/* フェーズ名 */}
          {showPhase && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 truncate">
              {getPhaseName(task.phaseId)}
            </p>
          )}

          {/* タスク説明 */}
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
            {task.description}
          </p>

          {/* メタデータ */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              {/* 予想時間 */}
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {task.actualHours 
                  ? `${task.actualHours}h`
                  : `${task.estimatedHours}h`
                }
              </div>

              {/* 期限 */}
              {task.dueDate && (
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span className="truncate">
                    {formatDistanceToNow(new Date(task.dueDate), {
                      addSuffix: true,
                      locale: ja,
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* タイマー表示（進行中のタスクのみ） */}
          {task.status === 'in_progress' && (
            <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Timer
                taskId={task.id}
                phaseId={task.phaseId}
                compact={true}
                className="justify-center"
              />
              {isRunning && currentTaskId === task.id && (
                <div className="flex items-center justify-center mt-1">
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    実行中
                  </div>
                </div>
              )}
            </div>
          )}

          {/* バッジとアクション */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* ステータスバッジ */}
              <Badge variant={statusStyle.badgeVariant} className="text-xs">
                {task.status === 'not_started' && '未開始'}
                {task.status === 'in_progress' && '進行中'}
                {task.status === 'completed' && '完了'}
              </Badge>

              {/* タイプバッジ */}
              <Badge variant="outline" className="text-xs">
                {task.type === 'theory' && '理論'}
                {task.type === 'practice' && '実践'}
                {task.type === 'project' && 'プロジェクト'}
                {task.type === 'assessment' && '評価'}
              </Badge>

              {/* タイマー実行中インジケーター */}
              {isRunning && currentTaskId === task.id && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                  <TimerIcon className="mr-1 h-3 w-3" />
                  計測中
                </Badge>
              )}
            </div>

            {/* アクションボタン */}
            <div className="flex space-x-1">
              {getActionButtons()}
            </div>
          </div>

          {/* 依存関係がある場合の表示 */}
          {task.dependencies.length > 0 && (
            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 mb-1">依存:</p>
              <div className="flex flex-wrap gap-1">
                {task.dependencies.slice(0, 2).map((depId) => {
                  const depTask = tasks.find(t => t.id === depId);
                  return (
                    <Badge key={depId} variant="outline" className="text-xs">
                      {depTask?.title?.substring(0, 10) || depId}
                      {depTask?.title && depTask.title.length > 10 && '...'}
                    </Badge>
                  );
                })}
                {task.dependencies.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{task.dependencies.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};