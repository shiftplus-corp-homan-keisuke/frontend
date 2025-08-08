'use client';

import React, { useState, useEffect } from 'react';
import { Timer } from './Timer';
import { SessionCompleteModal } from './SessionCompleteModal';
import { useTimerStore } from '@/stores/timer-store';
import type { ProductivityRating } from '@/types';

interface TimerWidgetProps {
  taskId?: string;
  phaseId?: string;
  className?: string;
  compact?: boolean;
  autoShowModal?: boolean;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({
  taskId,
  phaseId,
  className,
  compact = false,
  autoShowModal = true
}) => {
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [lastSessionDuration, setLastSessionDuration] = useState(0);
  
  const {
    isRunning,
    elapsedTime,
    stopTimer,
    initializeBackgroundManager
  } = useTimerStore();

  // タイマーが停止された時にモーダルを表示
  const handleStopTimer = () => {
    const currentDuration = Math.floor(elapsedTime / 60);
    
    if (currentDuration >= 1 && autoShowModal) {
      setLastSessionDuration(currentDuration);
      setShowCompleteModal(true);
    } else {
      // 1分未満の場合は直接停止
      stopTimer();
    }
  };

  const handleSaveSession = (notes?: string, productivity?: ProductivityRating) => {
    const session = stopTimer(notes, productivity);
    setShowCompleteModal(false);
    
    // セッション保存後の処理（必要に応じて）
    if (session) {
      console.log('セッションが保存されました:', session);
    }
  };

  const handleCancelModal = () => {
    setShowCompleteModal(false);
    // モーダルをキャンセルした場合もタイマーを停止
    stopTimer();
  };

  // バックグラウンドマネージャーの初期化
  useEffect(() => {
    initializeBackgroundManager();
  }, [initializeBackgroundManager]);

  // ページリロード時の警告
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue = 'タイマーが実行中です。ページを離れますか？';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isRunning]);

  return (
    <>
      <Timer
        taskId={taskId}
        phaseId={phaseId}
        className={className}
        compact={compact}
      />
      
      <SessionCompleteModal
        isOpen={showCompleteModal}
        onClose={handleCancelModal}
        onSave={handleSaveSession}
        duration={lastSessionDuration}
        taskId={taskId}
        phaseId={phaseId}
      />
    </>
  );
};