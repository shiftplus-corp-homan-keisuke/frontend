'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Calendar, 
  Star, 
  Filter, 
  Download,
  Trash2,
  Edit3,
  BarChart3
} from 'lucide-react';
import { useTimerStore } from '@/stores/timer-store';
import { useLearningStore } from '@/stores';
import type { StudySession, ProductivityRating } from '@/types';
import { format, isToday, isYesterday, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ja } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface SessionHistoryProps {
  className?: string;
  limit?: number;
  showFilters?: boolean;
  showActions?: boolean;
}

type TimeFilter = 'all' | 'today' | 'yesterday' | 'week' | 'month';
type SortBy = 'date' | 'duration' | 'productivity';

export const SessionHistory: React.FC<SessionHistoryProps> = ({
  className,
  limit,
  showFilters = true,
  showActions = true
}) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { 
    sessions, 
    removeSession, 
    updateSession,
    getTodaysTotalTime,
    getWeeklyTotalTime,
    getAverageSessionDuration,
    getProductivityStats
  } = useTimerStore();

  const { tasks, phases } = useLearningStore();

  // セッションのフィルタリングとソート
  const filteredAndSortedSessions = useMemo(() => {
    let filtered = [...sessions];

    // 時間フィルター
    const now = new Date();
    switch (timeFilter) {
      case 'today':
        filtered = filtered.filter(session => isToday(new Date(session.createdAt)));
        break;
      case 'yesterday':
        filtered = filtered.filter(session => isYesterday(new Date(session.createdAt)));
        break;
      case 'week':
        const weekStart = startOfWeek(now, { locale: ja });
        const weekEnd = endOfWeek(now, { locale: ja });
        filtered = filtered.filter(session => {
          const sessionDate = new Date(session.createdAt);
          return sessionDate >= weekStart && sessionDate <= weekEnd;
        });
        break;
      case 'month':
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        filtered = filtered.filter(session => {
          const sessionDate = new Date(session.createdAt);
          return sessionDate >= monthStart && sessionDate <= monthEnd;
        });
        break;
    }

    // ソート
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        case 'productivity':
          comparison = a.productivity - b.productivity;
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // 制限
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [sessions, timeFilter, sortBy, sortOrder, limit]);

  // 統計データ
  const stats = useMemo(() => {
    const todayTotal = getTodaysTotalTime();
    const weeklyTotal = getWeeklyTotalTime();
    const averageDuration = getAverageSessionDuration();
    const productivityStats = getProductivityStats();

    return {
      todayTotal,
      weeklyTotal,
      averageDuration,
      productivityStats
    };
  }, [getTodaysTotalTime, getWeeklyTotalTime, getAverageSessionDuration, getProductivityStats]);

  // セッション削除
  const handleDeleteSession = (sessionId: string) => {
    if (confirm('このセッションを削除しますか？')) {
      removeSession(sessionId);
    }
  };

  // セッション編集（簡易実装）
  const handleEditSession = (session: StudySession) => {
    const newNotes = prompt('メモを編集:', session.notes || '');
    if (newNotes !== null) {
      updateSession(session.id, { notes: newNotes.trim() || undefined });
    }
  };

  // 時間フォーマット
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}時間${mins}分`;
    }
    return `${mins}分`;
  };

  // 日付フォーマット
  const formatSessionDate = (date: Date) => {
    if (isToday(date)) {
      return `今日 ${format(date, 'HH:mm', { locale: ja })}`;
    } else if (isYesterday(date)) {
      return `昨日 ${format(date, 'HH:mm', { locale: ja })}`;
    } else {
      return format(date, 'M月d日 HH:mm', { locale: ja });
    }
  };

  // 生産性レーティングの表示
  const renderProductivityRating = (rating: ProductivityRating) => {
    const colors = {
      1: 'text-red-500',
      2: 'text-orange-500',
      3: 'text-yellow-500',
      4: 'text-blue-500',
      5: 'text-green-500'
    };

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-3 w-3',
              i < rating ? `${colors[rating]} fill-current` : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  // タスク名を取得
  const getTaskName = (taskId?: string) => {
    if (!taskId) return null;
    const task = tasks.find(t => t.id === taskId);
    return task?.title;
  };

  // フェーズ名を取得
  const getPhaseName = (phaseId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    return phase?.name || 'Unknown Phase';
  };

  return (
    <div className={className}>
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">セッション履歴</TabsTrigger>
          <TabsTrigger value="stats">統計</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          {/* フィルターとソート */}
          {showFilters && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">期間:</span>
                    <div className="flex gap-1">
                      {[
                        { value: 'all', label: '全て' },
                        { value: 'today', label: '今日' },
                        { value: 'yesterday', label: '昨日' },
                        { value: 'week', label: '今週' },
                        { value: 'month', label: '今月' }
                      ].map(({ value, label }) => (
                        <Button
                          key={value}
                          size="sm"
                          variant={timeFilter === value ? 'default' : 'outline'}
                          onClick={() => setTimeFilter(value as TimeFilter)}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">並び順:</span>
                    <div className="flex gap-1">
                      {[
                        { value: 'date', label: '日時' },
                        { value: 'duration', label: '時間' },
                        { value: 'productivity', label: '集中度' }
                      ].map(({ value, label }) => (
                        <Button
                          key={value}
                          size="sm"
                          variant={sortBy === value ? 'default' : 'outline'}
                          onClick={() => setSortBy(value as SortBy)}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    >
                      {sortOrder === 'desc' ? '↓' : '↑'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* セッション一覧 */}
          <div className="space-y-3">
            {filteredAndSortedSessions.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>セッション履歴がありません</p>
                </CardContent>
              </Card>
            ) : (
              filteredAndSortedSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {formatDuration(session.duration)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {formatSessionDate(new Date(session.createdAt))}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          {renderProductivityRating(session.productivity)}
                          <span className="text-sm text-muted-foreground">
                            集中度
                          </span>
                        </div>

                        <div className="space-y-1">
                          {session.taskId && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">タスク: </span>
                              <span className="font-medium">{getTaskName(session.taskId)}</span>
                            </div>
                          )}
                          <div className="text-sm">
                            <span className="text-muted-foreground">フェーズ: </span>
                            <span>{getPhaseName(session.phaseId)}</span>
                          </div>
                        </div>

                        {session.notes && (
                          <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                            {session.notes}
                          </div>
                        )}
                      </div>

                      {showActions && (
                        <div className="flex gap-1 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditSession(session)}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteSession(session.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          {/* 統計カード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">今日の学習時間</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDuration(stats.todayTotal)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">今週の学習時間</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDuration(stats.weeklyTotal)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均セッション時間</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDuration(stats.averageDuration)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均集中度</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.productivityStats.average.toFixed(1)}
                </div>
                <div className="flex mt-2">
                  {renderProductivityRating(Math.round(stats.productivityStats.average) as ProductivityRating)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 集中度分布 */}
          <Card>
            <CardHeader>
              <CardTitle>集中度分布</CardTitle>
              <CardDescription>各集中度レベルのセッション数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.productivityStats.distribution).map(([rating, count]) => (
                  <div key={rating} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {renderProductivityRating(parseInt(rating) as ProductivityRating)}
                      <span className="text-sm">レベル {rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${sessions.length > 0 ? (count / sessions.length) * 100 : 0}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};