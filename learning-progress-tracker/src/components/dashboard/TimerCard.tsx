'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TimerWidget } from '@/components/timer';
import { useTimerStore } from '@/stores/timer-store';
import { useLearningStore } from '@/stores';
import { Clock, Play, Pause } from 'lucide-react';

interface TimerCardProps {
  className?: string;
}

/**
 * ダッシュボード用のタイマーカード
 * 現在のタイマー状態と今日の学習時間を表示
 */
export const TimerCard: React.FC<TimerCardProps> = ({ className }) => {
  const { 
    isRunning, 
    isPaused, 
    currentTaskId, 
    currentPhaseId,
    getTodaysTotalTime,
    getFormattedTime 
  } = useTimerStore();
  
  const { tasks, phases } = useLearningStore();

  // 現在のタスクとフェーズ情報を取得
  const currentTask = currentTaskId ? tasks.find(t => t.id === currentTaskId) : null;
  const currentPhase = currentPhaseId ? phases.find(p => p.id === currentPhaseId) : null;
  
  const todayTotal = getTodaysTotalTime();
  const todayFormatted = `${Math.floor(todayTotal / 60)}時間${todayTotal % 60}分`;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            学習タイマー
          </CardTitle>
          <CardDescription className="text-xs">
            今日の学習時間: {todayFormatted}
          </CardDescription>
        </div>
        <div className="flex items-center">
          {isRunning ? (
            isPaused ? (
              <Pause className="h-4 w-4 text-yellow-500" />
            ) : (
              <Play className="h-4 w-4 text-green-500" />
            )
          ) : (
            <Clock className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 現在のセッション情報 */}
        {isRunning && (currentTask || currentPhase) && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
              実行中のセッション
            </div>
            {currentTask && (
              <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                タスク: {currentTask.title}
              </div>
            )}
            {currentPhase && (
              <div className="text-xs text-blue-600 dark:text-blue-400">
                フェーズ: {currentPhase.name}
              </div>
            )}
          </div>
        )}

        {/* タイマーウィジェット */}
        <div className="flex justify-center">
          <TimerWidget
            taskId={currentTaskId || undefined}
            phaseId={currentPhaseId || undefined}
            compact={false}
            autoShowModal={true}
          />
        </div>

        {/* 今日の統計 */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between items-center">
            <span>今日の合計:</span>
            <span className="font-medium">{todayFormatted}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};