'use client';

import React from 'react';
import { Clock, Play, Pause } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTimerStore } from '@/stores/timer-store';
import { cn } from '@/lib/utils';

interface TimerStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const TimerStatus: React.FC<TimerStatusProps> = ({
  className,
  showDetails = false
}) => {
  const {
    isRunning,
    isPaused,
    elapsedTime,
    currentTaskId,
    getFormattedTime,
    getTodaysTotalTime
  } = useTimerStore();

  const todayTotal = getTodaysTotalTime();
  const todayFormatted = `${Math.floor(todayTotal / 60)}時間${todayTotal % 60}分`;

  if (!isRunning && elapsedTime === 0) {
    return (
      <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
        <Clock className="h-4 w-4" />
        <span className="text-sm">タイマー停止中</span>
        {showDetails && (
          <span className="text-xs">今日: {todayFormatted}</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1">
        {isPaused ? (
          <Pause className="h-4 w-4 text-yellow-500" />
        ) : (
          <Play className="h-4 w-4 text-green-500" />
        )}
        <Badge
          variant={isPaused ? 'secondary' : 'default'}
          className={cn(
            'font-mono',
            isPaused ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
          )}
        >
          {getFormattedTime()}
        </Badge>
      </div>

      {showDetails && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {currentTaskId && (
            <span>タスク実行中</span>
          )}
          <span>今日: {todayFormatted}</span>
        </div>
      )}

      {isPaused && (
        <Badge variant="outline" className="text-xs">
          一時停止
        </Badge>
      )}
    </div>
  );
};