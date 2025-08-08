'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLearningStore } from '@/stores';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  CheckCircle, 
  Play, 
  Upload, 
  Target, 
  Clock,
  BookOpen,
  Award
} from 'lucide-react';
import type { ActivityType } from '@/types';

interface RecentActivitiesProps {
  limit?: number;
}

/**
 * 最近の活動を表示するコンポーネント
 * 学習セッション、タスク完了、成果物アップロードなどの活動履歴を表示
 */
export const RecentActivities: React.FC<RecentActivitiesProps> = ({ limit = 10 }) => {
  const { getRecentActivities } = useLearningStore();
  const activities = getRecentActivities(limit);

  // アクティビティタイプに応じたアイコンを取得
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'session_started':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'session_ended':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'artifact_uploaded':
        return <Upload className="h-4 w-4 text-purple-500" />;
      case 'phase_completed':
        return <Target className="h-4 w-4 text-indigo-500" />;
      case 'milestone_reached':
        return <Award className="h-4 w-4 text-yellow-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-gray-500" />;
    }
  };

  // アクティビティタイプに応じた色を取得
  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'task_completed':
        return 'bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'session_started':
        return 'bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'session_ended':
        return 'bg-orange-100 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800';
      case 'artifact_uploaded':
        return 'bg-purple-100 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800';
      case 'phase_completed':
        return 'bg-indigo-100 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800';
      case 'milestone_reached':
        return 'bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      default:
        return 'bg-gray-100 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  // 時間の相対表示をフォーマット
  const formatRelativeTime = (date: Date) => {
    try {
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: ja 
      });
    } catch (error) {
      return '不明';
    }
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            最近の活動
          </CardTitle>
          <CardDescription>
            直近の学習活動と進捗状況
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              まだ活動がありません
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              学習を開始すると、ここに活動履歴が表示されます
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
          <BookOpen className="mr-2 h-5 w-5" />
          最近の活動
        </CardTitle>
        <CardDescription>
          直近の学習活動と進捗状況
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={activity.id}
              className={`flex items-start space-x-4 p-3 rounded-lg border transition-colors hover:shadow-sm ${getActivityColor(activity.type)}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(new Date(activity.createdAt))}
                  </p>
                  {activity.metadata && (
                    <div className="flex items-center space-x-2">
                      {activity.metadata.duration && (
                        <Badge variant="outline" className="text-xs">
                          {activity.metadata.duration}分
                        </Badge>
                      )}
                      {activity.metadata.productivity && (
                        <Badge variant="outline" className="text-xs">
                          集中度: {activity.metadata.productivity}/5
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {activities.length >= limit && (
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              すべての活動を表示
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};