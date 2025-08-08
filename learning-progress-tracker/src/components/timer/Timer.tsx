'use client';

import React, { useEffect } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTimerStore } from '@/stores/timer-store';
import { cn } from '@/lib/utils';

interface TimerProps {
  taskId?: string;
  phaseId?: string;
  className?: string;
  compact?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  taskId,
  phaseId,
  className,
  compact = false
}) => {
  const {
    isRunning,
    isPaused,
    elapsedTime,
    currentTaskId,
    currentPhaseId,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    getFormattedTime,
    updateElapsedTime
  } = useTimerStore();

  // コンポーネントがマウントされた時とタイマーが実行中の時に経過時間を更新
  useEffect(() => {
    if (isRunning && !isPaused) {
      const interval = setInterval(() => {
        updateElapsedTime();
      }, 100); // より滑らかな更新のため100msに設定

      return () => clearInterval(interval);
    }
  }, [isRunning, isPaused, updateElapsedTime]);

  const handleStart = () => {
    if (isPaused) {
      resumeTimer();
    } else {
      startTimer(taskId, phaseId);
    }
  };

  const handlePause = () => {
    pauseTimer();
  };

  const handleStop = () => {
    stopTimer();
  };

  const handleReset = () => {
    resetTimer();
  };

  const isCurrentSession = currentTaskId === taskId || (!taskId && !currentTaskId);
  const canControl = !isRunning || isCurrentSession;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="text-sm font-mono">
          {getFormattedTime()}
        </div>
        <div className="flex gap-1">
          {!isRunning || isPaused ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleStart}
              disabled={!canControl}
              className="h-8 w-8 p-0"
            >
              <Play className="h-3 w-3" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={handlePause}
              disabled={!canControl}
              className="h-8 w-8 p-0"
            >
              <Pause className="h-3 w-3" />
            </Button>
          )}
          {isRunning && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleStop}
              disabled={!canControl}
              className="h-8 w-8 p-0"
            >
              <Square className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('p-6', className)}>
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">学習タイマー</h3>
          {isRunning && currentTaskId && (
            <p className="text-sm text-muted-foreground">
              タスク実行中
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className={cn(
            'text-4xl font-mono font-bold',
            isRunning && !isPaused ? 'text-green-600' : 'text-muted-foreground'
          )}>
            {getFormattedTime()}
          </div>

          {isPaused && (
            <div className="text-sm text-yellow-600 font-medium">
              一時停止中
            </div>
          )}
        </div>

        <div className="flex justify-center gap-2">
          {!isRunning || isPaused ? (
            <Button
              onClick={handleStart}
              disabled={!canControl}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isPaused ? '再開' : '開始'}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handlePause}
              disabled={!canControl}
              className="flex items-center gap-2"
            >
              <Pause className="h-4 w-4" />
              一時停止
            </Button>
          )}

          {isRunning && (
            <Button
              variant="outline"
              onClick={handleStop}
              disabled={!canControl}
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              停止
            </Button>
          )}

          {!isRunning && elapsedTime > 0 && (
            <Button
              variant="ghost"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              リセット
            </Button>
          )}
        </div>

        {!canControl && (
          <div className="text-sm text-muted-foreground">
            他のタスクでタイマーが実行中です
          </div>
        )}
      </div>
    </Card>
  );
};