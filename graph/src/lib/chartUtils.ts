import { ProcessedChartData, ChartType, DEFAULT_CHART_COLORS } from '@/types';

/**
 * Processes CSV data for chart rendering
 */
export function processDataForChart(
  data: Record<string, any>[],
  xAxis: string,
  yAxes: string[]
): ProcessedChartData[] {
  return data.map((row) => {
    const processedRow: ProcessedChartData = {
      name: String(row[xAxis] || ''),
    };

    yAxes.forEach((yAxis) => {
      const value = row[yAxis];
      // Convert to number if possible, otherwise use 0
      processedRow[yAxis] = typeof value === 'number' ? value : 
                           (typeof value === 'string' && !isNaN(Number(value))) ? Number(value) : 0;
    });

    return processedRow;
  });
}

/**
 * Gets color for a specific data series
 */
export function getSeriesColor(index: number): string {
  return DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length];
}

/**
 * Validates if chart type is compatible with multiple Y axes
 */
export function isChartTypeCompatibleWithMultipleAxes(chartType: ChartType): boolean {
  return chartType === 'bar' || chartType === 'line';
}

/**
 * Gets chart configuration for rendering
 */
export function getChartConfig(
  xAxis: string,
  yAxes: string[],
  chartType: ChartType
) {
  return {
    xAxis: {
      dataKey: 'name',
      type: 'category' as const,
    },
    yAxes: yAxes.map((yAxis, index) => ({
      dataKey: yAxis,
      color: getSeriesColor(index),
      name: yAxis,
    })),
    chartType,
    margin: {
      top: 20,
      right: 30,
      left: 20,
      bottom: 80,
    },
  };
}

/**
 * Calculates appropriate chart dimensions
 */
export function getChartDimensions(containerWidth?: number, containerHeight?: number) {
  return {
    width: containerWidth || 800,
    height: containerHeight || 400,
    margin: {
      top: 20,
      right: 30,
      left: 20,
      bottom: 60,
    },
  };
}

/**
 * Manages multiple series data and provides utilities for series handling
 */
export class MultipleSeriesManager {
  private maxSeries: number;
  
  constructor(maxSeries: number = 10) {
    this.maxSeries = maxSeries;
  }

  /**
   * Validates if a new series can be added
   */
  canAddSeries(currentSeries: string[]): boolean {
    return currentSeries.length < this.maxSeries;
  }

  /**
   * Adds a new series if possible
   */
  addSeries(currentSeries: string[], newSeries: string): string[] {
    if (!this.canAddSeries(currentSeries) || currentSeries.includes(newSeries)) {
      return currentSeries;
    }
    return [...currentSeries, newSeries];
  }

  /**
   * Removes a series
   */
  removeSeries(currentSeries: string[], seriesToRemove: string): string[] {
    return currentSeries.filter(series => series !== seriesToRemove);
  }

  /**
   * Reorders series by moving a series up
   */
  moveSeriesUp(currentSeries: string[], index: number): string[] {
    if (index <= 0 || index >= currentSeries.length) {
      return currentSeries;
    }
    const newSeries = [...currentSeries];
    [newSeries[index - 1], newSeries[index]] = [newSeries[index], newSeries[index - 1]];
    return newSeries;
  }

  /**
   * Reorders series by moving a series down
   */
  moveSeriesDown(currentSeries: string[], index: number): string[] {
    if (index < 0 || index >= currentSeries.length - 1) {
      return currentSeries;
    }
    const newSeries = [...currentSeries];
    [newSeries[index], newSeries[index + 1]] = [newSeries[index + 1], newSeries[index]];
    return newSeries;
  }

  /**
   * Gets series information with colors and metadata
   */
  getSeriesInfo(series: string[]): Array<{
    name: string;
    color: string;
    index: number;
  }> {
    return series.map((name, index) => ({
      name,
      color: getSeriesColor(index),
      index
    }));
  }

  /**
   * Validates chart type compatibility with multiple series
   */
  isChartTypeCompatible(chartType: ChartType, seriesCount: number): boolean {
    if (seriesCount <= 1) return true;
    return chartType === 'bar' || chartType === 'line';
  }

  /**
   * Gets recommended chart types for current series count
   */
  getCompatibleChartTypes(seriesCount: number): ChartType[] {
    if (seriesCount <= 1) {
      return ['bar', 'line', 'pie'];
    }
    return ['bar', 'line'];
  }

  /**
   * Generates legend data for multiple series
   */
  generateLegendData(series: string[]): Array<{
    name: string;
    color: string;
  }> {
    return series.map((name, index) => ({
      name,
      color: getSeriesColor(index)
    }));
  }

  /**
   * Validates series configuration
   */
  validateSeriesConfiguration(series: string[], chartType: ChartType): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check series count
    if (series.length === 0) {
      errors.push('少なくとも1つのY軸系列を選択してください');
    }

    if (series.length > this.maxSeries) {
      errors.push(`系列数が最大値(${this.maxSeries})を超えています`);
    }

    // Check chart type compatibility
    if (!this.isChartTypeCompatible(chartType, series.length)) {
      errors.push(`選択されたグラフタイプ(${chartType})は${series.length}個の系列に対応していません`);
    }

    // Warnings for readability
    if (series.length > Math.floor(this.maxSeries * 0.6)) {
      warnings.push('系列数が多いため、グラフの可読性が低下する可能性があります');
    }

    // Check for duplicate series names
    const uniqueSeries = new Set(series);
    if (uniqueSeries.size !== series.length) {
      errors.push('重複する系列名があります');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Gets optimal chart height based on series count
   */
  getOptimalChartHeight(seriesCount: number): number {
    const baseHeight = 384; // 24rem in pixels
    const additionalHeightPerSeries = 20;
    const legendHeight = seriesCount > 1 ? 60 : 0;
    
    return baseHeight + (seriesCount * additionalHeightPerSeries) + legendHeight;
  }
}