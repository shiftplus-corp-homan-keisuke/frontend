'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckSquare, Clock, Play, AlertCircle, Calendar } from 'lucide-react';
import { useLearningStore } from '@/stores';
import type { Task, TaskStatus, Priority } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TaskListProps {
  phaseId?: string;
  statusFilter?: TaskStatus[];
  priorityFilter?: Priority[];
  searchQuery?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  phaseId,
  statusFilter,
  priorityFilter,
  searchQuery,
}) => {
  const { tasks, phases, updateTaskStatus } = useLearningStore();

  // フィルタリングされたタスクを取得
  const filteredTasks = React.useMemo(() => {
    let filtered = tasks;

    // フェーズフィルター
    if (phaseId) {
      filtered = filtered.filter(task => task.phaseId === phaseId);
    }

    // ステータスフィルター
    if (statusFilter && statusFilter.length > 0) {
      filtered = filtered.filter(task => statusFilter.includes(task.status));
    }

    // 優先度フィルター
    if (priorityFilter && priorityFilter.length > 0) {
      filtered = filtered.filter(task => priorityFilter.includes(task.priority));
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
  }, [tasks, phaseId, statusFilter, priorityFilter, searchQuery]);

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
        };
      case 'in_progress':
        return {
          borderColor: 'border-blue-500',
          badgeVariant: 'info' as const,
          opacity: '',
        };
      case 'not_started':
        return {
          borderColor: 'border-gray-300',
          badgeVariant: 'secondary' as const,
          opacity: '',
        };
      default:
        return {
          borderColor: 'border-gray-300',
          badgeVariant: 'secondary' as const,
          opacity: '',
        };
    }
  };

  // 優先度に応じたアイコンとスタイルを取得
  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return {
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
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
          icon: <AlertCircle className="h-4 w-4 text-green-500" />,
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
  const handleStatusUpdate = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  // タスクアクションボタンを取得
  const getActionButton = (task: Task) => {
    switch (task.status) {
      case 'not_started':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusUpdate(task.id, 'in_progress')}
          >
            <Play className="mr-2 h-4 w-4" />
            開始
          </Button>
        );
      case 'in_progress':
        return (
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(task.id, 'completed')}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            完了
          </Button>
        );
      case 'completed':
        return (
          <Button size="sm" variant="ghost" disabled>
            <CheckSquare className="mr-2 h-4 w-4" />
            完了済み
          </Button>
        );
      default:
        return null;
    }
  };

  if (filteredTasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">タスクが見つかりません</p>
            <p className="text-sm">
              フィルター条件を変更するか、新しいタスクを作成してください。
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => {
        const statusStyle = getStatusStyle(task.status);
        const priorityStyle = getPriorityStyle(task.priority);

        return (
          <Card key={task.id} className={statusStyle.opacity}>
            <CardContent className="p-6">
              <div className={`border-l-4 ${statusStyle.borderColor} pl-4`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* タスクタイトル */}
                    <h3 className={`font-medium text-gray-900 dark:text-white ${
                      task.status === 'completed' ? 'line-through' : ''
                    }`}>
                      {task.title}
                    </h3>

                    {/* フェーズ名 */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {getPhaseName(task.phaseId)}
                    </p>

                    {/* タスク説明 */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                      {task.description}
                    </p>

                    {/* メタデータ */}
                    <div className="flex items-center mt-3 space-x-4 flex-wrap gap-2">
                      {/* 予想時間 */}
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1 h-4 w-4" />
                        {task.actualHours 
                          ? `実際: ${task.actualHours}時間`
                          : `予想: ${task.estimatedHours}時間`
                        }
                      </div>

                      {/* 期限 */}
                      {task.dueDate && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1 h-4 w-4" />
                          {formatDistanceToNow(new Date(task.dueDate), {
                            addSuffix: true,
                            locale: ja,
                          })}
                        </div>
                      )}

                      {/* 優先度 */}
                      <div className={`flex items-center text-sm ${priorityStyle.color}`}>
                        {priorityStyle.icon}
                        <span className="ml-1">優先度: {priorityStyle.text}</span>
                      </div>

                      {/* ステータスバッジ */}
                      <Badge variant={statusStyle.badgeVariant}>
                        {task.status === 'not_started' && '未開始'}
                        {task.status === 'in_progress' && '進行中'}
                        {task.status === 'completed' && '完了'}
                      </Badge>

                      {/* タイプバッジ */}
                      <Badge variant="outline">
                        {task.type === 'theory' && '理論'}
                        {task.type === 'practice' && '実践'}
                        {task.type === 'project' && 'プロジェクト'}
                        {task.type === 'assessment' && '評価'}
                      </Badge>
                    </div>

                    {/* 依存関係がある場合の表示 */}
                    {task.dependencies.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">依存タスク:</p>
                        <div className="flex flex-wrap gap-1">
                          {task.dependencies.map((depId) => {
                            const depTask = tasks.find(t => t.id === depId);
                            return (
                              <Badge key={depId} variant="outline" className="text-xs">
                                {depTask?.title || depId}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 進捗バー（実際時間がある場合） */}
                    {task.actualHours && task.estimatedHours && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>進捗</span>
                          <span>{Math.round((task.actualHours / task.estimatedHours) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(task.actualHours / task.estimatedHours) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>

                  {/* アクションボタン */}
                  <div className="ml-4 flex-shrink-0">
                    {getActionButton(task)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};