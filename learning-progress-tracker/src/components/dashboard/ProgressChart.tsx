'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Calendar } from 'lucide-react';
import type { ChartType, TimeRange, ChartData } from '@/types';

interface ProgressChartProps {
  data: ChartData[];
  title: string;
  description?: string;
  chartType?: ChartType;
  timeRange?: TimeRange;
  height?: number;
  showControls?: boolean;
  onChartTypeChange?: (type: ChartType) => void;
  onTimeRangeChange?: (range: TimeRange) => void;
}

/**
 * 進捗可視化チャートコンポーネント
 * 学習時間や進捗率をグラフで表示
 */
export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title,
  description,
  chartType = 'line',
  timeRange = 'week',
  height = 300,
  showControls = true,
  onChartTypeChange,
  onTimeRangeChange,
}) => {
  // チャートの色設定
  const colors = {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    danger: '#ef4444',
  };

  // 時間範囲のラベル
  const timeRangeLabels = {
    day: '今日',
    week: '今週',
    month: '今月',
    phase: 'フェーズ',
    all: '全期間',
  };

  // チャートタイプのラベル
  const chartTypeLabels = {
    line: '線グラフ',
    bar: '棒グラフ',
    pie: '円グラフ',
    area: 'エリアグラフ',
  };

  // データの統計情報を計算
  const stats = useMemo(() => {
    if (data.length === 0) return { total: 0, average: 0, trend: 0 };

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const average = total / data.length;
    
    // トレンド計算（最初と最後の値の差）
    const trend = data.length > 1 ? data[data.length - 1].value - data[0].value : 0;

    return { total, average, trend };
  }, [data]);

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {`値: ${payload[0].value}${chartType === 'line' && title.includes('時間') ? '分' : '%'}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // 線グラフの描画
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="date" 
          className="text-xs text-gray-600 dark:text-gray-400"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          className="text-xs text-gray-600 dark:text-gray-400"
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={colors.primary}
          strokeWidth={2}
          dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: colors.primary, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // 棒グラフの描画
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="date" 
          className="text-xs text-gray-600 dark:text-gray-400"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          className="text-xs text-gray-600 dark:text-gray-400"
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          fill={colors.primary}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  // 円グラフの描画（フェーズ別進捗用）
  const renderPieChart = () => {
    const pieData = data.slice(0, 5).map((item, index) => ({
      name: item.label || item.date,
      value: item.value,
      fill: [colors.primary, colors.secondary, colors.accent, colors.danger, '#8b5cf6'][index % 5],
    }));

    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // チャートの描画
  const renderChart = () => {
    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">データがありません</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              学習を開始すると、ここにグラフが表示されます
            </p>
          </div>
        </div>
      );
    }

    switch (chartType) {
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      case 'line':
      default:
        return renderLineChart();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="mt-1">
                {description}
              </CardDescription>
            )}
          </div>
          
          {showControls && (
            <div className="flex items-center space-x-2">
              {/* 時間範囲選択 */}
              <div className="flex items-center space-x-1">
                {Object.entries(timeRangeLabels).map(([range, label]) => (
                  <Button
                    key={range}
                    size="sm"
                    variant={timeRange === range ? 'default' : 'outline'}
                    onClick={() => onTimeRangeChange?.(range as TimeRange)}
                    className="text-xs"
                  >
                    {label}
                  </Button>
                ))}
              </div>
              
              {/* チャートタイプ選択 */}
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant={chartType === 'line' ? 'default' : 'outline'}
                  onClick={() => onChartTypeChange?.('line')}
                  className="p-2"
                  title="線グラフ"
                >
                  <TrendingUp className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={chartType === 'bar' ? 'default' : 'outline'}
                  onClick={() => onChartTypeChange?.('bar')}
                  className="p-2"
                  title="棒グラフ"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={chartType === 'pie' ? 'default' : 'outline'}
                  onClick={() => onChartTypeChange?.('pie')}
                  className="p-2"
                  title="円グラフ"
                >
                  <PieChartIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* 統計情報 */}
        {data.length > 0 && (
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                合計: {Math.round(stats.total)}{title.includes('時間') ? '分' : '%'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                平均: {Math.round(stats.average)}{title.includes('時間') ? '分' : '%'}
              </Badge>
              {stats.trend !== 0 && (
                <Badge 
                  variant={stats.trend > 0 ? 'success' : 'destructive'} 
                  className="text-xs flex items-center"
                >
                  <TrendingUp className={`h-3 w-3 mr-1 ${stats.trend < 0 ? 'rotate-180' : ''}`} />
                  {stats.trend > 0 ? '+' : ''}{Math.round(stats.trend)}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};