'use client';

import React, { useState, useMemo } from 'react';
import { ProgressChart } from './ProgressChart';
import { useLearningStore } from '@/stores';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { ChartType, TimeRange, ChartData } from '@/types';

interface StudyTimeChartProps {
  userId: string;
  height?: number;
  showControls?: boolean;
}

/**
 * 学習時間チャートコンポーネント
 * 日別・週別・月別の学習時間を可視化
 */
export const StudyTimeChart: React.FC<StudyTimeChartProps> = ({
  userId,
  height = 300,
  showControls = true,
}) => {
  const { studySessions } = useLearningStore();
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  // 時間範囲に基づいてデータを生成
  const chartData = useMemo((): ChartData[] => {
    const now = new Date();
    const userSessions = studySessions.filter(session => session.userId === userId);

    switch (timeRange) {
      case 'day': {
        // 今日の時間別学習時間
        const todaySessions = userSessions.filter(session => {
          const sessionDate = new Date(session.createdAt);
          return sessionDate.toDateString() === now.toDateString();
        });

        const hourlyData: { [hour: string]: number } = {};
        
        // 0-23時の初期化
        for (let i = 0; i < 24; i++) {
          hourlyData[`${i.toString().padStart(2, '0')}:00`] = 0;
        }

        // セッションデータを時間別に集計
        todaySessions.forEach(session => {
          const hour = new Date(session.startTime).getHours();
          const hourKey = `${hour.toString().padStart(2, '0')}:00`;
          hourlyData[hourKey] += session.duration;
        });

        return Object.entries(hourlyData).map(([hour, duration]) => ({
          date: hour,
          value: duration,
          label: hour,
        }));
      }

      case 'week': {
        // 今週の日別学習時間
        const weekStart = startOfWeek(now, { locale: ja });
        const weekEnd = endOfWeek(now, { locale: ja });
        
        const dailyData: { [date: string]: number } = {};
        
        // 週の各日を初期化
        for (let i = 0; i < 7; i++) {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + i);
          const dateKey = format(date, 'MM/dd', { locale: ja });
          dailyData[dateKey] = 0;
        }

        // セッションデータを日別に集計
        userSessions.forEach(session => {
          const sessionDate = new Date(session.createdAt);
          if (sessionDate >= weekStart && sessionDate <= weekEnd) {
            const dateKey = format(sessionDate, 'MM/dd', { locale: ja });
            if (dailyData[dateKey] !== undefined) {
              dailyData[dateKey] += session.duration;
            }
          }
        });

        return Object.entries(dailyData).map(([date, duration]) => ({
          date,
          value: duration,
          label: date,
        }));
      }

      case 'month': {
        // 今月の日別学習時間
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        
        const dailyData: { [date: string]: number } = {};
        
        // 月の各日を初期化
        const daysInMonth = monthEnd.getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          const dateKey = `${i}日`;
          dailyData[dateKey] = 0;
        }

        // セッションデータを日別に集計
        userSessions.forEach(session => {
          const sessionDate = new Date(session.createdAt);
          if (sessionDate >= monthStart && sessionDate <= monthEnd) {
            const day = sessionDate.getDate();
            const dateKey = `${day}日`;
            dailyData[dateKey] += session.duration;
          }
        });

        return Object.entries(dailyData).map(([date, duration]) => ({
          date,
          value: duration,
          label: date,
        }));
      }

      case 'phase': {
        // フェーズ別学習時間
        const phaseData: { [phaseId: string]: { name: string; duration: number } } = {};
        
        userSessions.forEach(session => {
          if (!phaseData[session.phaseId]) {
            phaseData[session.phaseId] = {
              name: `Phase ${session.phaseId.split('-')[1]}`,
              duration: 0,
            };
          }
          phaseData[session.phaseId].duration += session.duration;
        });

        return Object.entries(phaseData).map(([phaseId, data]) => ({
          date: data.name,
          value: data.duration,
          label: data.name,
        }));
      }

      case 'all': {
        // 全期間の週別学習時間
        const weeklyData: { [week: string]: number } = {};
        
        userSessions.forEach(session => {
          const sessionDate = new Date(session.createdAt);
          const weekStart = startOfWeek(sessionDate, { locale: ja });
          const weekKey = format(weekStart, 'MM/dd', { locale: ja });
          
          if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = 0;
          }
          weeklyData[weekKey] += session.duration;
        });

        return Object.entries(weeklyData)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([week, duration]) => ({
            date: week,
            value: duration,
            label: `${week}週`,
          }));
      }

      default:
        return [];
    }
  }, [studySessions, userId, timeRange]);

  // 時間範囲に応じたタイトルと説明を生成
  const getChartInfo = () => {
    switch (timeRange) {
      case 'day':
        return {
          title: '今日の学習時間',
          description: '時間別の学習時間分布',
        };
      case 'week':
        return {
          title: '今週の学習時間',
          description: '日別の学習時間推移',
        };
      case 'month':
        return {
          title: '今月の学習時間',
          description: '日別の学習時間推移',
        };
      case 'phase':
        return {
          title: 'フェーズ別学習時間',
          description: '各フェーズの累計学習時間',
        };
      case 'all':
        return {
          title: '全期間の学習時間',
          description: '週別の学習時間推移',
        };
      default:
        return {
          title: '学習時間',
          description: '学習時間の推移',
        };
    }
  };

  const { title, description } = getChartInfo();

  return (
    <ProgressChart
      data={chartData}
      title={title}
      description={description}
      chartType={chartType}
      timeRange={timeRange}
      height={height}
      showControls={showControls}
      onChartTypeChange={setChartType}
      onTimeRangeChange={setTimeRange}
    />
  );
};