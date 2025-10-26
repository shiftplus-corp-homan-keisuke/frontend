'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartRendererProps } from '@/types';
import { processDataForChart, getChartConfig, getSeriesColor, MultipleSeriesManager } from '@/lib/chartUtils';
import { ErrorDisplay } from './ErrorDisplay';

export function ChartRenderer({
  data,
  xAxis,
  yAxes,
  chartType,
  loading = false,
  error = null,
}: ChartRendererProps) {
  // Show loading state
  if (loading) {
    return (
      <div className="h-96 bg-gray-50 rounded-lg p-6">
        <div className="animate-pulse">
          {/* Chart title skeleton */}
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6" />
          
          {/* Chart area skeleton */}
          <div className="space-y-3">
            {/* Y-axis labels */}
            <div className="flex items-end space-x-2 h-48">
              {Array.from({ length: 8 }).map((_, index) => (
                <div 
                  key={index}
                  className="bg-gray-200 rounded-t animate-pulse"
                  style={{ 
                    height: `${Math.random() * 80 + 20}%`,
                    width: '12%',
                    animationDelay: `${index * 100}ms`
                  }}
                />
              ))}
            </div>
            
            {/* X-axis labels */}
            <div className="flex justify-between">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-3 bg-gray-200 rounded w-8" />
              ))}
            </div>
          </div>
          
          {/* Legend skeleton */}
          <div className="flex justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-16" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
          </div>
        </div>
        
        {/* Loading message overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-600 font-medium">グラフを生成中...</p>
            <p className="text-xs text-gray-500 mt-1">データを処理しています</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-96 bg-gray-50 rounded-lg p-4">
        <ErrorDisplay error={error} />
      </div>
    );
  }

  // Validate required data
  if (!data || data.length === 0 || !xAxis || yAxes.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          グラフを表示するには、CSVファイルをアップロードし、X軸とY軸を選択してください。
        </p>
      </div>
    );
  }

  // Process data for chart
  const chartData = processDataForChart(data, xAxis, yAxes);
  const config = getChartConfig(xAxis, yAxes, chartType);

  // Calculate height based on number of series (more space for legend if multiple series)
  const baseHeight = 384;
  const additionalHeightPerSeries = 20;
  const legendHeight = yAxes.length > 1 ? 60 : 0;
  const chartHeight = baseHeight + (yAxes.length * additionalHeightPerSeries) + legendHeight;

  return (
    <div 
      className="w-full bg-white rounded-lg border p-4" 
      style={{ height: chartHeight }}
      role="img"
      aria-label={`${chartType === 'bar' ? '棒グラフ' : chartType === 'line' ? '折れ線グラフ' : '円グラフ'}。X軸: ${xAxis}、Y軸: ${yAxes.join(', ')}`}
    >
      {/* Multiple series info header */}
      {yAxes.length > 1 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg" role="status" aria-live="polite">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              複数系列表示中 ({yAxes.length}個の系列)
            </span>
            <span className="text-xs text-blue-700">
              各系列は異なる色で表示されます
            </span>
          </div>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'bar' && (
          <BarChart 
            data={chartData} 
            margin={config.margin}
            aria-label="棒グラフ"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={config.xAxis.dataKey} 
              angle={-45}
              textAnchor="end"
              height={80}
              aria-label={`X軸: ${xAxis}`}
            />
            <YAxis aria-label="Y軸の値" />
            <Tooltip 
              formatter={(value, name) => [value, name]}
              labelFormatter={(label) => `${xAxis}: ${label}`}
            />
            <Legend />
            {config.yAxes.map((yAxisConfig) => (
              <Bar
                key={yAxisConfig.dataKey}
                dataKey={yAxisConfig.dataKey}
                fill={yAxisConfig.color}
                name={yAxisConfig.name}
                aria-label={`データ系列: ${yAxisConfig.name}`}
              />
            ))}
          </BarChart>
        )}

        {chartType === 'line' && (
          <LineChart 
            data={chartData} 
            margin={config.margin}
            aria-label="折れ線グラフ"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={config.xAxis.dataKey} 
              angle={-45}
              textAnchor="end"
              height={80}
              aria-label={`X軸: ${xAxis}`}
            />
            <YAxis aria-label="Y軸の値" />
            <Tooltip 
              formatter={(value, name) => [value, name]}
              labelFormatter={(label) => `${xAxis}: ${label}`}
            />
            <Legend />
            {config.yAxes.map((yAxisConfig) => (
              <Line
                key={yAxisConfig.dataKey}
                type="monotone"
                dataKey={yAxisConfig.dataKey}
                stroke={yAxisConfig.color}
                strokeWidth={2}
                name={yAxisConfig.name}
                aria-label={`データ系列: ${yAxisConfig.name}`}
              />
            ))}
          </LineChart>
        )}

        {chartType === 'pie' && yAxes.length === 1 && (
          <PieChart aria-label="円グラフ">
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey={yAxes[0]}
              aria-label={`円グラフ: ${yAxes[0]}の分布`}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getSeriesColor(index)}
                  aria-label={`セクション ${index + 1}: ${entry.name}`}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [value, name]}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}