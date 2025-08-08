'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLearningStore } from '@/stores';
import { formatDistanceToNow, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckSquare,
  ArrowRight
} from 'lucide-react';
import type { Task, Priority } from '@/types';

interface UpcomingDeadlinesProps {
  limit?: number;
}

/**
 * 今後の予定（期限が近いタスク）を表示するコンポーネント
 * 期限の近いタスクを優先度と期限で並べて表示
 */
export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ limit = 5 }) => {
  const { getUpcomingDeadlines, phases, updateTaskStatus } = useLearningStore();
  const upcomingTasks = getUpcomingDeadlines(limit);

  // 優先度に応じたバッジの色を取得
  const getPriorityBadgeVariant = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // 期限に応じたバッジの色とテキストを取得
  const getDeadlineBadge = (dueDate: Date) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    if (due < now) {
      return { variant: 'destructive' as const, text: '期限切れ', icon: AlertTriangle };
    } else if (isToday(due)) {
      return { variant: 'destructive' as const, text: '今日', icon: Clock };
    } else if (isTomorrow(due)) {
      return { variant: 'warning' as const, text: '明日', icon: Clock };
    } else if (isThisWeek(due)) {
      return { variant: 'warning' as const, text: '今週', icon: Calendar };
    } else {
      return { 
        variant: 'outline' as const, 
        text: formatDistanceToNow(due, { locale: ja }), 
        icon: Calendar 
      };
    }
  };

  // フェーズ名を取得
  const getPhaseName = (phaseId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    return phase?.name || '不明なフェーズ';
  };

  // タスクを開始する
  const handleStartTask = (taskId: string) => {
    updateTaskStatus(taskId, 'in_progress');
  };

  if (upcomingTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            今後の予定
          </CardTitle>
          <CardDescription>
            予定されているタスクと期限
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckSquare className="mx-auto h-12 w-12 text-green-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              期限が近いタスクはありません
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              すべてのタスクが順調に進んでいます
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          今後の予定
        </CardTitle>
        <CardDescription>
          予定されているタスクと期限
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingTasks.map((task) => {
            const deadlineBadge = task.dueDate ? getDeadlineBadge(new Date(task.dueDate)) : null;
            const DeadlineIcon = deadlineBadge?.icon || Calendar;
            
            return (
              <div 
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.title}
                    </h4>
                    <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs">
                      {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {getPhaseName(task.phaseId)}
                  </p>
                  <div className="flex items-center space-x-2">
                    {deadlineBadge && (
                      <Badge variant={deadlineBadge.variant} className="text-xs flex items-center">
                        <DeadlineIcon className="h-3 w-3 mr-1" />
                        {deadlineBadge.text}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      予想時間: {task.estimatedHours}時間
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {task.status === 'not_started' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartTask(task.id)}
                      className="text-xs"
                    >
                      開始
                    </Button>
                  )}
                  {task.status === 'in_progress' && (
                    <Badge variant="info" className="text-xs">
                      進行中
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-1 h-8 w-8"
                    title="タスク詳細を表示"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        {upcomingTasks.length >= limit && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              すべてのタスクを表示
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};