'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TimerWidget, 
  SessionHistory, 
  LearningAnalytics 
} from '@/components/timer';
import { 
  Clock, 
  History, 
  BarChart3, 
  Play,
  Target
} from 'lucide-react';
import { useTimerStore } from '@/stores/timer-store';
import { useLearningStore } from '@/stores';

export default function TimerPage() {
  const [activeTab, setActiveTab] = useState('timer');
  
  const { 
    isRunning, 
    currentTaskId,
    getTodaysTotalTime,
    getWeeklyTotalTime,
    sessions
  } = useTimerStore();

  const { tasks, currentPhase } = useLearningStore();

  // 現在のタスク情報を取得
  const currentTask = currentTaskId ? tasks.find(t => t.id === currentTaskId) : null;

  // 統計データ
  const todayTotal = getTodaysTotalTime();
  const weeklyTotal = getWeeklyTotalTime();
  const totalSessions = sessions.length;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}時間${mins}分`;
    }
    return `${mins}分`;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* ページヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              学習時間記録
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              学習セッションの記録と分析を行います
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            {!isRunning && (
              <Button>
                <Play className="mr-2 h-4 w-4" />
                学習を開始
              </Button>
            )}
            <Button variant="outline">
              <Target className="mr-2 h-4 w-4" />
              目標設定
            </Button>
          </div>
        </div>

        {/* 現在のセッション情報 */}
        {isRunning && (currentTask || currentPhase) && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-blue-900 dark:text-blue-100">
                  学習セッション実行中
                </span>
              </div>
              {currentTask && (
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  タスク: {currentTask.title}
                </p>
              )}
              {currentPhase && (
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  フェーズ: {currentPhase.name}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">今日の学習時間</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(todayTotal)}</div>
              <p className="text-xs text-muted-foreground">
                目標: 2時間
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">今週の学習時間</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(weeklyTotal)}</div>
              <p className="text-xs text-muted-foreground">
                目標: 10時間
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総セッション数</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                累計セッション
              </p>
            </CardContent>
          </Card>
        </div>

        {/* メインコンテンツ */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              タイマー
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              履歴
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              分析
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* メインタイマー */}
              <div className="lg:col-span-1">
                <TimerWidget
                  taskId={currentTaskId || undefined}
                  phaseId={currentPhase?.id}
                  compact={false}
                  autoShowModal={true}
                />
              </div>

              {/* 今日のセッション履歴 */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>今日のセッション</CardTitle>
                    <CardDescription>本日の学習セッション履歴</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SessionHistory 
                      limit={5}
                      showFilters={false}
                      showActions={false}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <SessionHistory 
              showFilters={true}
              showActions={true}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <LearningAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}