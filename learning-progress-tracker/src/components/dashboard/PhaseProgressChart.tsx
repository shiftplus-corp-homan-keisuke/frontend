'use client';

import React, { useState, useMemo } from 'react';
import { ProgressChart } from './ProgressChart';
import { useLearningStore } from '@/stores';
import type { ChartType, ChartData } from '@/types';

interface PhaseProgressChartProps {
  userId: string;
  height?: number;
  showControls?: boolean;
}

/**
 * フェーズ別進捗チャートコンポーネント
 * 各フェーズの進捗率を可視化
 */
export const PhaseProgressChart: React.FC<PhaseProgressChartProps> = ({
  userId,
  height = 300,
  showControls = true,
}) => {
  const { phases, progress } = useLearningStore();
  const [chartType, setChartType] = useState<ChartType>('bar');

  // フェーズ別進捗データを生成
  const chartData = useMemo((): ChartData[] => {
    return phases.map(phase => {
      const phaseProgress = progress.find(p => p.phaseId === phase.id && p.userId === userId);
      const completionRate = phaseProgress?.completionRate || 0;
      
      return {
        date: `Phase ${phase.order}`,
        value: Math.round(completionRate),
        label: phase.name,
      };
    });
  }, [phases, progress, userId]);

  // 全体統計を計算
  const stats = useMemo(() => {
    const totalPhases = phases.length;
    const completedPhases = chartData.filter(data => data.value >= 100).length;
    const inProgressPhases = chartData.filter(data => data.value > 0 && data.value < 100).length;
    const notStartedPhases = chartData.filter(data => data.value === 0).length;
    const averageProgress = chartData.reduce((sum, data) => sum + data.value, 0) / totalPhases;

    return {
      totalPhases,
      completedPhases,
      inProgressPhases,
      notStartedPhases,
      averageProgress: Math.round(averageProgress),
    };
  }, [chartData, phases.length]);

  return (
    <div className="space-y-4">
      <ProgressChart
        data={chartData}
        title="フェーズ別進捗"
        description="各学習フェーズの完了率"
        chartType={chartType}
        height={height}
        showControls={showControls}
        onChartTypeChange={setChartType}
      />
      
      {/* 進捗サマリー */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">
            {stats.completedPhases}
          </div>
          <div className="text-sm text-green-600 dark:text-green-500">
            完了フェーズ
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {stats.inProgressPhases}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-500">
            進行中フェーズ
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-400">
            {stats.notStartedPhases}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-500">
            未開始フェーズ
          </div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
            {stats.averageProgress}%
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-500">
            平均進捗率
          </div>
        </div>
      </div>
    </div>
  );
};