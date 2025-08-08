'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { BarChart3, CheckSquare, Clock, Target, TrendingUp, Calendar } from 'lucide-react';
import { useLearningStore } from '@/stores';
import { useDashboardProgress } from '@/hooks/api';
import type { DashboardData } from '@/types';

interface DashboardOverviewProps {
  userId: string;
}

/**
 * ダッシュボードの概要セクション
 * 現在のフェーズ、全体進捗率、学習統計を表示
 */
export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ userId }) => {
  const { 
    currentPhase, 
    getOverallProgress, 
    getTotalStudyTime, 
    getStreak,
    getCompletedTasksCount,
    getTotalTasksCount 
  } = useLearningStore();

  const { data: dashboardData, isLoading } = useDashboardProgress(userId);

  // ローカルストアからの計算値
  const overallProgress = getOverallProgress();
  const totalStudyTime = getTotalStudyTime();
  const streak = getStreak();
  const completedTasks = getCompletedTasksCount();
  const totalTasks = getTotalTasksCount();

  // 学習時間を時間と分に変換
  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}時間${mins > 0 ? `${mins}分` : ''}`;
    }
    return `${mins}分`;
  };

  // 今週の学習時間を計算（簡易実装）
  const thisWeekStudyTime = Math.floor(totalStudyTime * 0.3); // 仮の計算

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 全体進捗 */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            全体進捗
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(overallProgress)}%
          </div>
          <Progress 
            value={overallProgress} 
            className="mt-2" 
            indicatorClassName="bg-blue-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            順調に進行中
          </p>
        </CardContent>
      </Card>

      {/* 完了タスク */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            完了タスク
          </CardTitle>
          <CheckSquare className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {completedTasks}/{totalTasks}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            残り{totalTasks - completedTasks}タスク
          </p>
          {totalTasks > 0 && (
            <Progress 
              value={(completedTasks / totalTasks) * 100} 
              className="mt-2" 
              indicatorClassName="bg-green-500"
            />
          )}
        </CardContent>
      </Card>

      {/* 学習時間 */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            学習時間
          </CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatStudyTime(totalStudyTime)}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            今週: {formatStudyTime(thisWeekStudyTime)}
          </p>
          <div className="mt-2 flex items-center">
            <div className="flex items-center text-xs text-orange-600 dark:text-orange-400">
              <Calendar className="h-3 w-3 mr-1" />
              継続{streak}日
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 現在のフェーズ */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            現在のフェーズ
          </CardTitle>
          <Target className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {currentPhase ? `Phase ${currentPhase.order}` : '未設定'}
          </div>
          {currentPhase && (
            <>
              <Badge variant="secondary" className="mb-2">
                {currentPhase.name}
              </Badge>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {currentPhase.description}
              </p>
            </>
          )}
          {!currentPhase && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              フェーズを選択してください
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};