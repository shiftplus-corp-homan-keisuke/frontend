'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Calendar,
  BarChart3,
  Download,
  Award,
  AlertCircle
} from 'lucide-react';
import { useTimerStore } from '@/stores/timer-store';
import { useLearningStore } from '@/stores';
import type { StudySession } from '@/types';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay,
  subWeeks,
  startOfMonth,
  endOfMonth,
  differenceInDays
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface LearningAnalyticsProps {
  className?: string;
}

interface DailyStats {
  date: Date;
  totalMinutes: number;
  sessionCount: number;
  averageProductivity: number;
  completedTasks: number;
}

interface WeeklyComparison {
  currentWeek: number;
  previousWeek: number;
  change: number;
  changePercent: number;
}

interface LearningInsight {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  recommendation?: string;
}

export const LearningAnalytics: React.FC<LearningAnalyticsProps> = ({ className }) => {
  const { 
    sessions, 
    getTodaysTotalTime,
    getWeeklyTotalTime,
    getAverageSessionDuration,
    getProductivityStats
  } = useTimerStore();

  const { tasks } = useLearningStore();

  // 日別統計の計算
  const dailyStats = useMemo((): DailyStats[] => {
    const now = new Date();
    const weekStart = startOfWeek(now, { locale: ja });
    const weekEnd = endOfWeek(now, { locale: ja });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return days.map(date => {
      const daySessions = sessions.filter(session => 
        isSameDay(new Date(session.createdAt), date)
      );

      const totalMinutes = daySessions.reduce((sum, session) => sum + session.duration, 0);
      const sessionCount = daySessions.length;
      const averageProductivity = sessionCount > 0 
        ? daySessions.reduce((sum, session) => sum + session.productivity, 0) / sessionCount
        : 0;

      // その日に完了したタスク数（簡易実装）
      const completedTasks = daySessions.filter(session => session.taskId).length;

      return {
        date,
        totalMinutes,
        sessionCount,
        averageProductivity,
        completedTasks
      };
    });
  }, [sessions]);

  // 週間比較の計算
  const weeklyComparison = useMemo((): WeeklyComparison => {
    const now = new Date();
    const currentWeekStart = startOfWeek(now, { locale: ja });
    const currentWeekEnd = endOfWeek(now, { locale: ja });
    const previousWeekStart = startOfWeek(subWeeks(now, 1), { locale: ja });
    const previousWeekEnd = endOfWeek(subWeeks(now, 1), { locale: ja });

    const currentWeekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.createdAt);
      return sessionDate >= currentWeekStart && sessionDate <= currentWeekEnd;
    });

    const previousWeekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.createdAt);
      return sessionDate >= previousWeekStart && sessionDate <= previousWeekEnd;
    });

    const currentWeek = currentWeekSessions.reduce((sum, session) => sum + session.duration, 0);
    const previousWeek = previousWeekSessions.reduce((sum, session) => sum + session.duration, 0);
    const change = currentWeek - previousWeek;
    const changePercent = previousWeek > 0 ? (change / previousWeek) * 100 : 0;

    return {
      currentWeek,
      previousWeek,
      change,
      changePercent
    };
  }, [sessions]);

  // 学習インサイトの生成
  const learningInsights = useMemo((): LearningInsight[] => {
    const insights: LearningInsight[] = [];
    const stats = getProductivityStats();
    const averageDuration = getAverageSessionDuration();
    const todayTotal = getTodaysTotalTime();

    // 集中度に関するインサイト
    if (stats.average >= 4) {
      insights.push({
        type: 'positive',
        title: '高い集中度を維持',
        description: `平均集中度が${stats.average.toFixed(1)}と高い水準を保っています。`,
        recommendation: 'この調子で継続しましょう！'
      });
    } else if (stats.average < 3) {
      insights.push({
        type: 'negative',
        title: '集中度の改善が必要',
        description: `平均集中度が${stats.average.toFixed(1)}と低めです。`,
        recommendation: '学習環境の見直しや休憩の取り方を工夫してみましょう。'
      });
    }

    // セッション時間に関するインサイト
    if (averageDuration > 60) {
      insights.push({
        type: 'positive',
        title: '長時間の集中学習',
        description: `平均セッション時間が${Math.round(averageDuration)}分と長く、深い学習ができています。`,
      });
    } else if (averageDuration < 25) {
      insights.push({
        type: 'neutral',
        title: '短時間セッション',
        description: `平均セッション時間が${Math.round(averageDuration)}分です。`,
        recommendation: 'ポモドーロテクニックを活用して25分以上の集中時間を目指しましょう。'
      });
    }

    // 週間比較に関するインサイト
    if (weeklyComparison.changePercent > 20) {
      insights.push({
        type: 'positive',
        title: '学習時間が大幅増加',
        description: `先週と比べて学習時間が${Math.round(weeklyComparison.changePercent)}%増加しました。`,
        recommendation: 'この勢いを維持しましょう！'
      });
    } else if (weeklyComparison.changePercent < -20) {
      insights.push({
        type: 'negative',
        title: '学習時間が減少',
        description: `先週と比べて学習時間が${Math.round(Math.abs(weeklyComparison.changePercent))}%減少しました。`,
        recommendation: '学習計画を見直し、継続的な学習習慣を取り戻しましょう。'
      });
    }

    // 今日の学習に関するインサイト
    if (todayTotal === 0) {
      insights.push({
        type: 'neutral',
        title: '今日はまだ学習していません',
        description: '今日の学習を始めましょう。',
        recommendation: '短時間でも良いので学習セッションを開始してみましょう。'
      });
    } else if (todayTotal >= 120) {
      insights.push({
        type: 'positive',
        title: '今日は十分な学習時間',
        description: `今日は${Math.floor(todayTotal / 60)}時間${todayTotal % 60}分学習しました。`,
      });
    }

    return insights;
  }, [sessions, getProductivityStats, getAverageSessionDuration, getTodaysTotalTime, weeklyComparison]);

  // 学習目標の達成率計算
  const goalProgress = useMemo(() => {
    const weeklyGoal = 10 * 60; // 週10時間の目標（分）
    const dailyGoal = 2 * 60; // 日2時間の目標（分）
    
    const weeklyTotal = getWeeklyTotalTime();
    const todayTotal = getTodaysTotalTime();

    return {
      weekly: {
        current: weeklyTotal,
        goal: weeklyGoal,
        percentage: Math.min((weeklyTotal / weeklyGoal) * 100, 100)
      },
      daily: {
        current: todayTotal,
        goal: dailyGoal,
        percentage: Math.min((todayTotal / dailyGoal) * 100, 100)
      }
    };
  }, [getWeeklyTotalTime, getTodaysTotalTime]);

  // レポート生成
  const generateReport = () => {
    const reportData = {
      period: `${format(startOfWeek(new Date(), { locale: ja }), 'yyyy年M月d日', { locale: ja })} - ${format(endOfWeek(new Date(), { locale: ja }), 'yyyy年M月d日', { locale: ja })}`,
      totalSessions: sessions.length,
      totalTime: sessions.reduce((sum, session) => sum + session.duration, 0),
      averageProductivity: getProductivityStats().average,
      dailyStats,
      insights: learningInsights
    };

    // JSON形式でダウンロード
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learning-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}時間${mins}分`;
    }
    return `${mins}分`;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">学習分析</h2>
          <p className="text-muted-foreground">学習効率と進捗の詳細分析</p>
        </div>
        <Button onClick={generateReport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          レポート出力
        </Button>
      </div>

      {/* 目標達成率 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日の目標達成率</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {Math.round(goalProgress.daily.percentage)}%
            </div>
            <Progress value={goalProgress.daily.percentage} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {formatDuration(goalProgress.daily.current)} / {formatDuration(goalProgress.daily.goal)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今週の目標達成率</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {Math.round(goalProgress.weekly.percentage)}%
            </div>
            <Progress value={goalProgress.weekly.percentage} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {formatDuration(goalProgress.weekly.current)} / {formatDuration(goalProgress.weekly.goal)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 週間比較 */}
      <Card>
        <CardHeader>
          <CardTitle>週間比較</CardTitle>
          <CardDescription>先週との学習時間比較</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">今週</p>
              <p className="text-2xl font-bold">{formatDuration(weeklyComparison.currentWeek)}</p>
            </div>
            <div className="flex items-center gap-2">
              {weeklyComparison.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : weeklyComparison.change < 0 ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : null}
              <span className={cn(
                'text-sm font-medium',
                weeklyComparison.change > 0 ? 'text-green-500' : 
                weeklyComparison.change < 0 ? 'text-red-500' : 'text-muted-foreground'
              )}>
                {weeklyComparison.change > 0 ? '+' : ''}{Math.round(weeklyComparison.changePercent)}%
              </span>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-muted-foreground">先週</p>
              <p className="text-xl font-semibold">{formatDuration(weeklyComparison.previousWeek)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 日別統計 */}
      <Card>
        <CardHeader>
          <CardTitle>今週の日別統計</CardTitle>
          <CardDescription>各日の学習時間と集中度</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyStats.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium w-16">
                    {format(day.date, 'M/d', { locale: ja })}
                  </div>
                  <div className="text-sm text-muted-foreground w-12">
                    {format(day.date, 'E', { locale: ja })}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {formatDuration(day.totalMinutes)}
                  </div>
                  <div className="text-sm">
                    <BarChart3 className="inline h-3 w-3 mr-1" />
                    {day.sessionCount}セッション
                  </div>
                  <div className="text-sm">
                    <Award className="inline h-3 w-3 mr-1" />
                    {day.averageProductivity.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 学習インサイト */}
      <Card>
        <CardHeader>
          <CardTitle>学習インサイト</CardTitle>
          <CardDescription>AIによる学習パターン分析と改善提案</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningInsights.map((insight, index) => (
              <div key={index} className="flex gap-3 p-4 rounded-lg border">
                <div className="flex-shrink-0">
                  {insight.type === 'positive' && (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  {insight.type === 'negative' && (
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    </div>
                  )}
                  {insight.type === 'neutral' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                  {insight.recommendation && (
                    <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      💡 {insight.recommendation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};