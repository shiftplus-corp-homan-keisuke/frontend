'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Play, 
  CheckSquare, 
  Plus,
  AlertCircle
} from 'lucide-react';
import { useLearningStore } from '@/stores';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '@/types';

interface TaskBoardProps {
  phaseId?: string;
  searchQuery?: string;
  className?: string;
}

interface DragState {
  draggedTask: Task | null;
  dragOverColumn: TaskStatus | null;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  phaseId,
  searchQuery,
  className = '',
}) => {
  const { tasks, phases, updateTaskStatus, canUpdateTaskStatus } = useLearningStore();
  const [dragState, setDragState] = useState<DragState>({
    draggedTask: null,
    dragOverColumn: null,
  });

  // フィルタリングされたタスクを取得
  const filteredTasks = React.useMemo(() => {
    let filtered = tasks;

    // フェーズフィルター
    if (phaseId) {
      filtered = filtered.filter(task => task.phaseId === phaseId);
    }

    // 検索クエリフィルター
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, phaseId, searchQuery]);

  // ステータス別にタスクをグループ化
  const tasksByStatus = React.useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      not_started: [],
      in_progress: [],
      completed: [],
    };

    filteredTasks.forEach(task => {
      groups[task.status].push(task);
    });

    // 各グループ内で優先度と期限でソート
    Object.keys(groups).forEach(status => {
      groups[status as TaskStatus].sort((a, b) => {
        // 優先度でソート（高 > 中 > 低）
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;

        // 期限でソート（近い順）
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;

        // 作成日でソート（新しい順）
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    });

    return groups;
  }, [filteredTasks]);

  // カラム設定
  const columns: Array<{
    status: TaskStatus;
    title: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  }> = [
    {
      status: 'not_started',
      title: '未開始',
      icon: <Clock className="h-5 w-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
    },
    {
      status: 'in_progress',
      title: '進行中',
      icon: <Play className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      status: 'completed',
      title: '完了',
      icon: <CheckSquare className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
  ];

  // ドラッグ開始ハンドラー
  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDragState(prev => ({ ...prev, draggedTask: task }));
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
  }, []);

  // ドラッグ終了ハンドラー
  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDragState({ draggedTask: null, dragOverColumn: null });
  }, []);

  // ドラッグオーバーハンドラー
  const handleDragOver = useCallback((e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragState(prev => ({ ...prev, dragOverColumn: status }));
  }, []);

  // ドラッグリーブハンドラー
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // カラムから完全に離れた場合のみリセット
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragState(prev => ({ ...prev, dragOverColumn: null }));
    }
  }, []);

  // ドロップハンドラー
  const handleDrop = useCallback((e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    
    const taskId = e.dataTransfer.getData('text/plain');
    const task = tasks.find(t => t.id === taskId);
    
    if (!task || task.status === newStatus) {
      setDragState({ draggedTask: null, dragOverColumn: null });
      return;
    }

    // ステータス更新が可能かチェック
    const canUpdate = canUpdateTaskStatus(taskId, newStatus);
    if (!canUpdate.canUpdate) {
      alert(canUpdate.reason);
      setDragState({ draggedTask: null, dragOverColumn: null });
      return;
    }

    // ステータスを更新
    updateTaskStatus(taskId, newStatus);
    setDragState({ draggedTask: null, dragOverColumn: null });
  }, [tasks, canUpdateTaskStatus, updateTaskStatus]);

  // タスクステータス更新ハンドラー（カード内のボタン用）
  const handleTaskStatusUpdate = useCallback((taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
  }, [updateTaskStatus]);

  if (filteredTasks.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">タスクが見つかりません</p>
            <p className="text-sm">
              {phaseId 
                ? 'このフェーズにはタスクがありません。'
                : 'フィルター条件を変更するか、新しいタスクを作成してください。'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`${className}`}>
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {phaseId 
                ? `${phases.find(p => p.id === phaseId)?.name} のタスクボード`
                : 'タスクボード'
              }
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              タスクをドラッグ&ドロップしてステータスを変更できます
            </p>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            新しいタスク
          </Button>
        </div>
      </div>

      {/* カンバンボード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = tasksByStatus[column.status];
          const isDropTarget = dragState.dragOverColumn === column.status;
          const canDropHere = dragState.draggedTask && 
            canUpdateTaskStatus(dragState.draggedTask.id, column.status).canUpdate;

          return (
            <div key={column.status} className="flex flex-col">
              {/* カラムヘッダー */}
              <Card className={`mb-4 ${isDropTarget ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`flex items-center justify-between text-lg ${column.color}`}>
                    <div className="flex items-center space-x-2">
                      {column.icon}
                      <span>{column.title}</span>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {columnTasks.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* ドロップゾーン */}
              <div
                className={`
                  flex-1 min-h-[400px] p-4 rounded-lg border-2 border-dashed transition-all duration-200
                  ${isDropTarget && canDropHere
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : isDropTarget && !canDropHere
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                  }
                  ${column.bgColor}
                `}
                onDragOver={(e) => handleDragOver(e, column.status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                {/* タスクカード */}
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isDragging={dragState.draggedTask?.id === task.id}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onStatusUpdate={handleTaskStatusUpdate}
                      showPhase={!phaseId}
                    />
                  ))}
                </div>

                {/* 空の状態 */}
                {columnTasks.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-600">
                    <div className="text-center">
                      {column.icon}
                      <p className="text-sm mt-2">タスクなし</p>
                    </div>
                  </div>
                )}

                {/* ドロップヒント */}
                {isDropTarget && dragState.draggedTask && (
                  <div className={`
                    mt-4 p-3 rounded-lg border text-center text-sm
                    ${canDropHere
                      ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-red-500 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }
                  `}>
                    {canDropHere
                      ? `「${dragState.draggedTask.title}」を${column.title}に移動`
                      : `このタスクは${column.title}に移動できません`
                    }
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 統計情報 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => {
          const columnTasks = tasksByStatus[column.status];
          const totalHours = columnTasks.reduce((sum, task) => 
            sum + (task.actualHours || task.estimatedHours), 0
          );

          return (
            <Card key={`stats-${column.status}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {column.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {columnTasks.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {totalHours.toFixed(1)}時間
                    </p>
                    <div className={`${column.color}`}>
                      {column.icon}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};