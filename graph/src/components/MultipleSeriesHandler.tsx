'use client';

import React from 'react';
import { DEFAULT_CHART_COLORS, ChartType } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Palette, BarChart3, TrendingUp } from '@/components/ui/icons';

interface SeriesInfo {
  name: string;
  color: string;
  index: number;
}

interface MultipleSeriesHandlerProps {
  selectedYAxes: string[];
  onYAxesChange: (axes: string[]) => void;
  maxSeries?: number;
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

export const MultipleSeriesHandler: React.FC<MultipleSeriesHandlerProps> = ({
  selectedYAxes,
  onYAxesChange,
  maxSeries = 10,
  chartType,
  onChartTypeChange
}) => {
  // Generate series information with colors
  const seriesInfo: SeriesInfo[] = selectedYAxes.map((axis, index) => ({
    name: axis,
    color: DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length],
    index
  }));

  // Handle series removal
  const handleRemoveSeries = (seriesName: string) => {
    const newYAxes = selectedYAxes.filter(axis => axis !== seriesName);
    onYAxesChange(newYAxes);
  };

  // Handle series reordering (move up)
  const handleMoveSeriesUp = (index: number) => {
    if (index > 0) {
      const newYAxes = [...selectedYAxes];
      [newYAxes[index - 1], newYAxes[index]] = [newYAxes[index], newYAxes[index - 1]];
      onYAxesChange(newYAxes);
    }
  };

  // Handle series reordering (move down)
  const handleMoveSeriesDown = (index: number) => {
    if (index < selectedYAxes.length - 1) {
      const newYAxes = [...selectedYAxes];
      [newYAxes[index], newYAxes[index + 1]] = [newYAxes[index + 1], newYAxes[index]];
      onYAxesChange(newYAxes);
    }
  };

  // Handle chart type change with multiple series restrictions
  const handleChartTypeChange = (type: ChartType) => {
    // Requirement 4.5: Only allow bar and line charts when multiple series are active
    if (selectedYAxes.length > 1 && type === 'pie') {
      return; // Don't allow pie chart with multiple series
    }
    onChartTypeChange(type);
  };

  // Check if chart type is compatible with current series count
  const isChartTypeCompatible = (type: ChartType): boolean => {
    if (selectedYAxes.length <= 1) return true;
    return type === 'bar' || type === 'line';
  };

  if (selectedYAxes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Series Management Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">データ系列管理</h3>
        </div>
        <Badge variant="secondary">
          {selectedYAxes.length}/{maxSeries}個の系列
        </Badge>
      </div>

      {/* Series List */}
      <div className="space-y-2">
        {seriesInfo.map((series, index) => (
          <div
            key={series.name}
            className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {/* Color indicator */}
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: series.color }}
              title={`系列色: ${series.color}`}
            />

            {/* Series name and index */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{series.name}</span>
                <Badge variant="outline" className="text-xs">
                  系列 {index + 1}
                </Badge>
              </div>
            </div>

            {/* Series controls */}
            <div className="flex items-center gap-1">
              {/* Move up button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMoveSeriesUp(index)}
                disabled={index === 0}
                className="h-8 w-8 p-0"
                title="上に移動"
              >
                ↑
              </Button>

              {/* Move down button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMoveSeriesDown(index)}
                disabled={index === selectedYAxes.length - 1}
                className="h-8 w-8 p-0"
                title="下に移動"
              >
                ↓
              </Button>

              {/* Remove button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSeries(series.name)}
                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                title="系列を削除"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Multiple Series Information */}
      {selectedYAxes.length > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">複数系列表示中</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 各系列は異なる色で表示されます</li>
                <li>• 凡例でデータ系列を識別できます</li>
                <li>• 系列の順序を変更するには↑↓ボタンを使用してください</li>
                <li>• 円グラフは複数系列では使用できません</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Chart Type Restrictions for Multiple Series */}
      {selectedYAxes.length > 1 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">利用可能なグラフタイプ</h4>
          <div className="flex gap-2">
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChartTypeChange('bar')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              棒グラフ
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChartTypeChange('line')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              折れ線グラフ
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={true}
              className="flex items-center gap-2 opacity-50"
              title="複数系列では円グラフは使用できません"
            >
              <div className="h-4 w-4 rounded-full border-2 border-current" />
              円グラフ (無効)
            </Button>
          </div>
          <p className="text-xs text-gray-600">
            複数のデータ系列が選択されている場合、棒グラフと折れ線グラフのみ使用できます。
          </p>
        </div>
      )}

      {/* Series Limit Warning */}
      {selectedYAxes.length >= maxSeries * 0.8 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">
            <strong>注意:</strong> 系列数が多くなると、グラフの可読性が低下する可能性があります。
            最大{maxSeries}個まで選択できますが、{Math.floor(maxSeries * 0.6)}個以下を推奨します。
          </p>
        </div>
      )}

      {/* Legend Preview */}
      {selectedYAxes.length > 1 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">凡例プレビュー</h4>
          <div className="flex flex-wrap gap-3 p-3 bg-white border rounded-lg">
            {seriesInfo.map((series) => (
              <div key={series.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: series.color }}
                />
                <span className="text-sm text-gray-700">{series.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};