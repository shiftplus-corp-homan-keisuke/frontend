'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { CSVUploader } from '@/components/CSVUploader';
import { AxisSelector } from '@/components/AxisSelector';
import { ChartTypeSelector } from '@/components/ChartTypeSelector';
import { ChartRenderer } from '@/components/ChartRenderer';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { MultipleSeriesHandler } from '@/components/MultipleSeriesHandler';
import { ParsedCSVData, ChartType, AppState } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { FileText, BarChart, Settings, Eye } from '@/components/ui/icons';
import { useToast, toast } from '@/components/ui/toast';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { LiveRegionManager, announceToScreenReader } from '@/lib/accessibility';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const { addToast } = useToast();

  // Centralized application state
  const [appState, setAppState] = useState<AppState>({
    csvData: null,
    selectedXAxis: null,
    selectedYAxes: [],
    chartType: 'bar',
    loading: false,
    error: null
  });

  // Performance optimization
  const {
    optimizedData,
    metrics,
    isLargeDataset,
    cleanupMemory,
    getPerformanceRecommendations
  } = usePerformanceOptimization(appState.csvData);

  // Keyboard navigation state
  const [focusedStep, setFocusedStep] = useState<number>(1);

  // Refs for keyboard navigation
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  // Live region manager for accessibility announcements
  const liveRegionManager = useRef<LiveRegionManager | null>(null);

  // Initialize accessibility features
  useEffect(() => {
    liveRegionManager.current = new LiveRegionManager();

    return () => {
      liveRegionManager.current?.destroy();
    };
  }, []);

  // Cleanup memory when component unmounts or data changes
  useEffect(() => {
    return () => {
      cleanupMemory();
    };
  }, [cleanupMemory]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.altKey) {
      switch (e.key) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          e.preventDefault();
          const stepNumber = parseInt(e.key);
          setFocusedStep(stepNumber);
          stepRefs.current[stepNumber - 1]?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (focusedStep < 5) {
            const nextStep = focusedStep + 1;
            setFocusedStep(nextStep);
            stepRefs.current[nextStep - 1]?.focus();
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (focusedStep > 1) {
            const prevStep = focusedStep - 1;
            setFocusedStep(prevStep);
            stepRefs.current[prevStep - 1]?.focus();
          }
          break;
      }
    }
  }, [focusedStep]);

  // Derived state for UI logic (using optimized data)
  const isDataLoaded = useMemo(() => optimizedData !== null, [optimizedData]);
  const isAxisSelected = useMemo(() =>
    appState.selectedXAxis !== null || appState.selectedYAxes.length > 0,
    [appState.selectedXAxis, appState.selectedYAxes]
  );
  const isChartReady = useMemo(() =>
    optimizedData !== null &&
    appState.selectedXAxis !== null &&
    appState.selectedYAxes.length > 0,
    [optimizedData, appState.selectedXAxis, appState.selectedYAxes]
  );

  // Performance recommendations
  const performanceRecommendations = useMemo(() =>
    getPerformanceRecommendations(),
    [getPerformanceRecommendations]
  );

  // File upload handler with loading state
  const handleFileUpload = useCallback((data: ParsedCSVData) => {
    setAppState(prev => ({
      ...prev,
      csvData: data,
      error: null,
      selectedXAxis: null,
      selectedYAxes: [],
      chartType: 'bar',
      loading: false
    }));

    // Show success toast
    addToast(toast.success(
      'ファイルアップロード完了',
      `${data.data.length}行のデータが読み込まれました`
    ));

    // Announce success to screen readers with performance info
    const announcement = `ファイルが正常にアップロードされました。${data.data.length}行のデータが読み込まれました。${data.data.length > 1000 ? '大容量データセットが検出されました。パフォーマンス最適化が適用されます。' : ''}`;
    liveRegionManager.current?.announce(announcement, 'polite');
  }, [addToast]);

  // Error handler
  const handleError = useCallback((errorMessage: string) => {
    setAppState(prev => ({
      ...prev,
      error: errorMessage,
      csvData: null,
      selectedXAxis: null,
      selectedYAxes: [],
      chartType: 'bar',
      loading: false
    }));

    // Show error toast
    addToast(toast.error(
      'エラーが発生しました',
      errorMessage
    ));
  }, [addToast]);

  // Error dismissal
  const handleErrorDismiss = useCallback(() => {
    setAppState(prev => ({ ...prev, error: null }));
  }, []);

  // Error retry handler
  const handleErrorRetry = useCallback(() => {
    setAppState(prev => ({ ...prev, error: null }));
    // Could trigger re-upload or other retry logic here
  }, []);

  // X-axis selection handler
  const handleXAxisChange = useCallback((axis: string) => {
    setAppState(prev => ({ ...prev, selectedXAxis: axis }));
  }, []);

  // Y-axes selection handler
  const handleYAxesChange = useCallback((axes: string[]) => {
    setAppState(prev => ({ ...prev, selectedYAxes: axes }));
  }, []);

  // Chart type change handler
  const handleChartTypeChange = useCallback((type: ChartType) => {
    setAppState(prev => ({ ...prev, chartType: type }));

    // Show info toast for chart type change
    const chartTypeNames = {
      bar: '棒グラフ',
      line: '折れ線グラフ',
      pie: '円グラフ'
    };

    addToast(toast.info(
      'グラフタイプを変更',
      `${chartTypeNames[type]}に変更されました`
    ));
  }, [addToast]);

  // Preview update handler
  const handlePreviewUpdate = useCallback(() => {
    // Trigger any necessary updates when selections change
    console.log('Preview update:', {
      xAxis: appState.selectedXAxis,
      yAxes: appState.selectedYAxes,
      chartType: appState.chartType
    });
  }, [appState.selectedXAxis, appState.selectedYAxes, appState.chartType]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"
      onKeyDown={handleKeyDown}
    >
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
      >
        メインコンテンツにスキップ
      </a>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              CSV Chart Generator - Test
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              CSVファイルをアップロードしてインタラクティブなグラフを生成します。
              データの可視化を簡単に行えます。
            </p>
            <div className="mt-4 text-sm text-slate-500">
              <p>キーボードショートカット: Alt + 1-5 でステップ間を移動、Alt + ↑↓ で前後のステップに移動</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-8" role="main">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className={`flex items-center space-x-2 ${isDataLoaded ? 'text-green-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDataLoaded ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                }`}>
                <FileText className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">データ読み込み</span>
            </div>

            <Separator orientation="horizontal" className="w-8" />

            <div className={`flex items-center space-x-2 ${isAxisSelected ? 'text-blue-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAxisSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                }`}>
                <Settings className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">軸設定</span>
            </div>

            <Separator orientation="horizontal" className="w-8" />

            <div className={`flex items-center space-x-2 ${isChartReady ? 'text-purple-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isChartReady ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'
                }`}>
                <BarChart className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">グラフ生成</span>
            </div>

            <Separator orientation="horizontal" className="w-8" />

            <div className={`flex items-center space-x-2 ${isChartReady ? 'text-emerald-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isChartReady ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}>
                <Eye className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">表示</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {appState.error && (
          <div className="mb-6">
            <ErrorDisplay
              error={appState.error}
              onDismiss={handleErrorDismiss}
              onRetry={handleErrorRetry}
            />
          </div>
        )}

        {/* Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Control Panel - Left Side on Desktop, Top on Mobile */}
          <div className="lg:col-span-5 space-y-6">
            {/* Step 1: CSV Upload */}
            <Card
              ref={(el) => { stepRefs.current[0] = el; }}
              tabIndex={-1}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" aria-hidden="true" />
                  1. CSVファイルをアップロード
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CSVUploader
                  onFileUpload={handleFileUpload}
                  onError={handleError}
                  loading={appState.loading}
                />
              </CardContent>
            </Card>

            {/* Step 2: Data Preview */}
            {optimizedData && (
              <Card
                ref={(el) => { stepRefs.current[1] = el; }}
                tabIndex={-1}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" aria-hidden="true" />
                    2. データプレビュー
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Performance indicators */}
                  {isLargeDataset && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3" role="status" aria-live="polite">
                      <div className="flex items-center gap-2 text-amber-800">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-sm font-medium">大容量データセット検出</span>
                      </div>
                      <p className="text-xs text-amber-700 mt-1">
                        パフォーマンス最適化が適用されています。
                        {optimizedData.meta.truncated && ` 表示は${optimizedData.data.length}行に制限されています。`}
                      </p>
                      {performanceRecommendations.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-amber-800">推奨事項:</p>
                          <ul className="text-xs text-amber-700 list-disc list-inside">
                            {performanceRecommendations.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Memory usage indicator */}
                  {metrics.memoryUsage > 50 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">メモリ使用量</span>
                        <span className="text-xs text-blue-600">{metrics.memoryUsage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(metrics.memoryUsage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-2">
                      列ヘッダー ({optimizedData.headers.length}個)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {optimizedData.headers.map((header, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {header}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-2">
                      データ行数: {optimizedData.data.length}行
                      {optimizedData.meta.truncated && (
                        <span className="text-xs text-amber-600 ml-2">
                          (元: {(optimizedData.meta as any).originalRowCount || optimizedData.data.length}行)
                        </span>
                      )}
                    </h3>

                    {optimizedData.data.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border border-slate-200 rounded" role="table" aria-label="データプレビューテーブル">
                          <thead className="bg-slate-50">
                            <tr>
                              {optimizedData.headers.slice(0, 3).map((header, index) => (
                                <th key={index} className="text-left p-2 font-medium border-b border-slate-200" scope="col">
                                  {header}
                                </th>
                              ))}
                              {optimizedData.headers.length > 3 && (
                                <th className="text-left p-2 font-medium border-b border-slate-200" scope="col">...</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {optimizedData.data.slice(0, 3).map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-b border-slate-100">
                                {optimizedData.headers.slice(0, 3).map((header, colIndex) => (
                                  <td key={colIndex} className="p-2 text-slate-600">
                                    {row[header] !== null ? String(row[header]) : '-'}
                                  </td>
                                ))}
                                {optimizedData.headers.length > 3 && (
                                  <td className="p-2 text-slate-400">...</td>
                                )}
                              </tr>
                            ))}
                            {optimizedData.data.length > 3 && (
                              <tr>
                                <td colSpan={Math.min(optimizedData.headers.length, 3) + (optimizedData.headers.length > 3 ? 1 : 0)}
                                  className="p-2 text-center text-slate-500 text-xs">
                                  ... さらに {optimizedData.data.length - 3} 行
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    <p>区切り文字: "{optimizedData.meta.delimiter}"</p>
                    <p>改行文字: {optimizedData.meta.linebreak === '\n' ? 'LF' : optimizedData.meta.linebreak === '\r\n' ? 'CRLF' : 'その他'}</p>
                    {optimizedData.meta.truncated && (
                      <p className="text-amber-600">注意: パフォーマンス向上のため表示が制限されています</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Axis Selection */}
            {optimizedData && (
              <Card
                ref={(el) => { stepRefs.current[2] = el; }}
                tabIndex={-1}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" aria-hidden="true" />
                    3. 軸の選択
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AxisSelector
                    headers={optimizedData.headers}
                    selectedXAxis={appState.selectedXAxis}
                    selectedYAxes={appState.selectedYAxes}
                    onXAxisChange={handleXAxisChange}
                    onYAxesChange={handleYAxesChange}
                    csvData={optimizedData}
                    onPreviewUpdate={handlePreviewUpdate}
                    maxYAxes={10}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 4: Multiple Series Management */}
            {optimizedData && appState.selectedYAxes.length > 0 && (
              <Card
                ref={(el) => { stepRefs.current[3] = el; }}
                tabIndex={-1}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5" aria-hidden="true" />
                    4. データ系列管理
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MultipleSeriesHandler
                    selectedYAxes={appState.selectedYAxes}
                    onYAxesChange={handleYAxesChange}
                    maxSeries={10}
                    chartType={appState.chartType}
                    onChartTypeChange={handleChartTypeChange}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 5: Chart Type Selection */}
            {optimizedData && isAxisSelected && (
              <Card
                ref={(el) => { stepRefs.current[4] = el; }}
                tabIndex={-1}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5" aria-hidden="true" />
                    5. グラフタイプの選択
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartTypeSelector
                    selectedType={appState.chartType}
                    onTypeChange={handleChartTypeChange}
                    disabled={!appState.selectedXAxis || appState.selectedYAxes.length === 0}
                    multipleYAxes={appState.selectedYAxes.length > 1}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chart Display - Right Side on Desktop, Bottom on Mobile */}
          <div className="lg:col-span-7">
            {isChartReady ? (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    グラフ表示
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartRenderer
                    data={optimizedData!.data}
                    xAxis={appState.selectedXAxis!}
                    yAxes={appState.selectedYAxes}
                    chartType={appState.chartType}
                    loading={appState.loading}
                    error={appState.error}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center text-slate-500">
                    <BarChart className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-medium mb-2">グラフプレビュー</h3>
                    <p className="text-sm">
                      {!optimizedData
                        ? 'CSVファイルをアップロードしてください'
                        : !appState.selectedXAxis
                          ? 'X軸を選択してください'
                          : appState.selectedYAxes.length === 0
                            ? 'Y軸を選択してください'
                            : 'グラフを生成中...'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}