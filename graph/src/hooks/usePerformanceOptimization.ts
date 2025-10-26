import { useState, useEffect, useCallback, useMemo } from 'react';
import { ParsedCSVData } from '@/types';
import { getMemoryManager } from '@/lib/csvParser';

interface PerformanceMetrics {
  memoryUsage: number;
  renderTime: number;
  dataProcessingTime: number;
  isLargeDataset: boolean;
}

interface OptimizationSettings {
  maxRenderRows: number;
  enableVirtualization: boolean;
  enableDataSampling: boolean;
  chunkSize: number;
}

export function usePerformanceOptimization(csvData: ParsedCSVData | null) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    renderTime: 0,
    dataProcessingTime: 0,
    isLargeDataset: false
  });

  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>({
    maxRenderRows: 1000,
    enableVirtualization: false,
    enableDataSampling: false,
    chunkSize: 100
  });

  // Determine if dataset is large and needs optimization
  const isLargeDataset = useMemo(() => {
    if (!csvData) return false;
    return csvData.data.length > 1000 || csvData.headers.length > 20;
  }, [csvData]);

  // Optimize data for rendering
  const optimizedData = useMemo(() => {
    if (!csvData) return null;

    const startTime = performance.now();
    
    let processedData = csvData.data;

    // Apply data sampling for very large datasets
    if (isLargeDataset && optimizationSettings.enableDataSampling) {
      const sampleSize = Math.min(optimizationSettings.maxRenderRows, processedData.length);
      const step = Math.ceil(processedData.length / sampleSize);
      processedData = processedData.filter((_, index) => index % step === 0);
    }

    // Limit rows for performance
    if (processedData.length > optimizationSettings.maxRenderRows) {
      processedData = processedData.slice(0, optimizationSettings.maxRenderRows);
    }

    const processingTime = performance.now() - startTime;
    
    setMetrics(prev => ({
      ...prev,
      dataProcessingTime: processingTime,
      isLargeDataset
    }));

    return {
      ...csvData,
      data: processedData,
      meta: {
        ...csvData.meta,
        truncated: processedData.length < csvData.data.length,
        originalRowCount: csvData.data.length,
        displayedRowCount: processedData.length
      }
    };
  }, [csvData, isLargeDataset, optimizationSettings]);

  // Monitor memory usage
  const updateMemoryMetrics = useCallback(() => {
    const memoryManager = getMemoryManager();
    const memoryUsage = memoryManager.getMemoryUsage();
    
    setMetrics(prev => ({
      ...prev,
      memoryUsage: memoryUsage.percentage
    }));
  }, []);

  // Performance monitoring effect
  useEffect(() => {
    const interval = setInterval(updateMemoryMetrics, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [updateMemoryMetrics]);

  // Auto-adjust optimization settings based on performance
  useEffect(() => {
    if (isLargeDataset) {
      setOptimizationSettings(prev => ({
        ...prev,
        enableVirtualization: true,
        enableDataSampling: csvData ? csvData.data.length > 5000 : false,
        maxRenderRows: csvData && csvData.data.length > 10000 ? 500 : 1000
      }));
    }
  }, [isLargeDataset, csvData]);

  // Memory cleanup function
  const cleanupMemory = useCallback(() => {
    const memoryManager = getMemoryManager();
    memoryManager.clearCache();
    
    // Force garbage collection if available
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc();
    }
  }, []);

  // Performance measurement utilities
  const measureRenderTime = useCallback((renderFunction: () => void) => {
    const startTime = performance.now();
    renderFunction();
    const renderTime = performance.now() - startTime;
    
    setMetrics(prev => ({
      ...prev,
      renderTime
    }));
    
    return renderTime;
  }, []);

  // Get performance recommendations
  const getPerformanceRecommendations = useCallback(() => {
    const recommendations: string[] = [];
    
    if (metrics.memoryUsage > 80) {
      recommendations.push('メモリ使用量が高いです。データのサンプリングを有効にすることをお勧めします。');
    }
    
    if (metrics.renderTime > 100) {
      recommendations.push('レンダリング時間が長いです。仮想化を有効にすることをお勧めします。');
    }
    
    if (isLargeDataset && !optimizationSettings.enableDataSampling) {
      recommendations.push('大容量データセットが検出されました。パフォーマンス向上のためデータサンプリングを有効にしてください。');
    }
    
    return recommendations;
  }, [metrics, isLargeDataset, optimizationSettings]);

  // Throttled data processing for real-time updates
  const throttledDataProcessor = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (processor: () => void, delay: number = 300) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(processor, delay);
      };
    })(),
    []
  );

  return {
    optimizedData,
    metrics,
    optimizationSettings,
    isLargeDataset,
    cleanupMemory,
    measureRenderTime,
    getPerformanceRecommendations,
    throttledDataProcessor,
    updateOptimizationSettings: setOptimizationSettings
  };
}

// Hook for monitoring component performance
export function useComponentPerformance(componentName: string) {
  const [renderCount, setRenderCount] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState(0);
  
  useEffect(() => {
    const startTime = performance.now();
    setRenderCount(prev => prev + 1);
    
    return () => {
      const endTime = performance.now();
      setLastRenderTime(endTime - startTime);
      
      // Log slow renders
      if (endTime - startTime > 16) { // 60fps threshold
        console.warn(`Slow render detected in ${componentName}: ${(endTime - startTime).toFixed(2)}ms`);
      }
    };
  });
  
  return {
    renderCount,
    lastRenderTime
  };
}

// Hook for debouncing expensive operations
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for managing virtual scrolling
export function useVirtualScrolling(
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(start + visibleCount + 1, itemCount);
    
    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, itemCount]);
  
  const totalHeight = itemCount * itemHeight;
  const offsetY = visibleRange.start * itemHeight;
  
  return {
    visibleRange,
    totalHeight,
    offsetY,
    setScrollTop
  };
}