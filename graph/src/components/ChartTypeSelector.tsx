'use client';

import React from 'react';
import { ChartTypeSelectorProps, ChartType } from '@/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, PieChart } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

// Chart type configuration
interface ChartTypeConfig {
  type: ChartType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  supportMultipleSeries: boolean;
}

const chartTypeConfigs: ChartTypeConfig[] = [
  {
    type: 'bar',
    label: '棒グラフ',
    description: 'カテゴリ別の値を比較するのに適しています',
    icon: BarChart,
    supportMultipleSeries: true,
  },
  {
    type: 'line',
    label: '折れ線グラフ',
    description: '時系列データや傾向を表示するのに適しています',
    icon: LineChart,
    supportMultipleSeries: true,
  },
  {
    type: 'pie',
    label: '円グラフ',
    description: '全体に対する割合を表示するのに適しています（単一系列のみ）',
    icon: PieChart,
    supportMultipleSeries: false,
  },
];

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  disabled = false,
  multipleYAxes,
}) => {
  // Handle chart type selection
  const handleTypeChange = (type: ChartType) => {
    if (disabled) return;
    
    // Check if the chart type supports multiple series
    const config = chartTypeConfigs.find(c => c.type === type);
    if (!config) return;
    
    // If multiple Y-axes are selected and the chart type doesn't support it, don't allow selection
    if (multipleYAxes && !config.supportMultipleSeries) {
      return;
    }
    
    onTypeChange(type);
  };

  // Check if a chart type should be disabled
  const isChartTypeDisabled = (config: ChartTypeConfig): boolean => {
    if (disabled) return true;
    
    // Disable pie chart when multiple Y-axes are selected
    if (multipleYAxes && !config.supportMultipleSeries) {
      return true;
    }
    
    return false;
  };

  // Get the reason why a chart type is disabled
  const getDisabledReason = (config: ChartTypeConfig): string | null => {
    if (disabled) return 'グラフタイプ選択が無効になっています';
    
    if (multipleYAxes && !config.supportMultipleSeries) {
      return '複数のY軸が選択されているため、このグラフタイプは使用できません';
    }
    
    return null;
  };

  return (
    <div className="space-y-4" role="region" aria-labelledby="chart-type-label">
      <div className="space-y-2">
        <Label id="chart-type-label" className="text-sm font-medium">
          グラフタイプ
        </Label>
        <p className="text-xs text-gray-600" id="chart-type-description">
          データの表示方法を選択してください
        </p>
      </div>

      {/* Chart type options */}
      <div className="grid grid-cols-1 gap-3" role="radiogroup" aria-labelledby="chart-type-label" aria-describedby="chart-type-description">
        {chartTypeConfigs.map((config) => {
          const isDisabled = isChartTypeDisabled(config);
          const disabledReason = getDisabledReason(config);
          const isSelected = selectedType === config.type;
          const IconComponent = config.icon;

          return (
            <div key={config.type} className="relative">
              <Button
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "w-full h-auto p-4 flex items-start gap-3 text-left justify-start focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isDisabled && "opacity-50 cursor-not-allowed",
                  isSelected && !isDisabled && "ring-2 ring-primary ring-offset-2"
                )}
                onClick={() => handleTypeChange(config.type)}
                disabled={isDisabled}
                role="radio"
                aria-checked={isSelected}
                aria-describedby={`chart-type-${config.type}-description`}
                aria-label={`${config.label}: ${config.description}`}
              >
                <IconComponent 
                  className={cn(
                    "h-6 w-6 flex-shrink-0 mt-0.5",
                    isSelected ? "text-primary-foreground" : "text-gray-600"
                  )}
                  aria-hidden="true"
                />
                
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-medium text-sm",
                    isSelected ? "text-primary-foreground" : "text-gray-900"
                  )}>
                    {config.label}
                  </div>
                  <div 
                    className={cn(
                      "text-xs mt-1",
                      isSelected ? "text-primary-foreground/80" : "text-gray-600"
                    )}
                    id={`chart-type-${config.type}-description`}
                  >
                    {config.description}
                  </div>
                  
                  {/* Multiple series support indicator */}
                  <div className={cn(
                    "text-xs mt-2 flex items-center gap-1",
                    isSelected ? "text-primary-foreground/70" : "text-gray-500"
                  )}>
                    <span 
                      className={cn(
                        "inline-block w-2 h-2 rounded-full",
                        config.supportMultipleSeries 
                          ? (isSelected ? "bg-green-300" : "bg-green-500")
                          : (isSelected ? "bg-yellow-300" : "bg-yellow-500")
                      )}
                      aria-hidden="true"
                    />
                    <span aria-label={config.supportMultipleSeries ? '複数系列に対応しています' : '単一系列のみ対応しています'}>
                      {config.supportMultipleSeries ? '複数系列対応' : '単一系列のみ'}
                    </span>
                  </div>
                </div>
              </Button>

              {/* Disabled reason tooltip */}
              {isDisabled && disabledReason && (
                <div className="absolute top-2 right-2 z-10">
                  <div className="group relative">
                    <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-help">
                      !
                    </div>
                    <div className="absolute right-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      {disabledReason}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current selection info */}
      {selectedType && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">選択されたグラフタイプ</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <div>
              <span className="font-medium">タイプ:</span> {chartTypeConfigs.find(c => c.type === selectedType)?.label}
            </div>
            <div>
              <span className="font-medium">複数系列対応:</span> {
                chartTypeConfigs.find(c => c.type === selectedType)?.supportMultipleSeries ? 'はい' : 'いいえ'
              }
            </div>
            {multipleYAxes && selectedType === 'pie' && (
              <div className="text-amber-700 bg-amber-100 p-2 rounded mt-2 text-xs">
                注意: 円グラフは複数系列に対応していません。Y軸を1つに減らすか、別のグラフタイプを選択してください。
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• 棒グラフと折れ線グラフは複数のY軸系列を同時に表示できます</p>
        <p>• 円グラフは単一のY軸系列のみ表示できます</p>
        <p>• グラフタイプを変更しても、軸の選択は維持されます</p>
      </div>
    </div>
  );
};