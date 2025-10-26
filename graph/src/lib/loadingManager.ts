import { useState, useCallback, useRef } from 'react';

// Loading state types
export interface LoadingState {
  isLoading: boolean;
  progress: number;
  message: string;
  stage: string;
  error: string | null;
}

export interface LoadingStage {
  id: string;
  name: string;
  message: string;
  weight: number; // Relative weight for progress calculation
}

// Default loading stages for CSV processing
export const CSV_PROCESSING_STAGES: LoadingStage[] = [
  {
    id: 'validation',
    name: 'ファイル検証',
    message: 'ファイルを検証しています...',
    weight: 10
  },
  {
    id: 'parsing',
    name: 'データ解析',
    message: 'CSVデータを解析しています...',
    weight: 40
  },
  {
    id: 'validation-data',
    name: 'データ検証',
    message: 'データの整合性を確認しています...',
    weight: 20
  },
  {
    id: 'processing',
    name: 'データ処理',
    message: 'データを処理しています...',
    weight: 20
  },
  {
    id: 'complete',
    name: '完了',
    message: '処理が完了しました',
    weight: 10
  }
];

export const CHART_GENERATION_STAGES: LoadingStage[] = [
  {
    id: 'data-preparation',
    name: 'データ準備',
    message: 'グラフ用データを準備しています...',
    weight: 30
  },
  {
    id: 'chart-config',
    name: '設定生成',
    message: 'グラフ設定を生成しています...',
    weight: 20
  },
  {
    id: 'rendering',
    name: 'レンダリング',
    message: 'グラフを描画しています...',
    weight: 40
  },
  {
    id: 'complete',
    name: '完了',
    message: 'グラフが生成されました',
    weight: 10
  }
];

// Loading manager hook
export function useLoadingManager(stages: LoadingStage[] = []) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    progress: 0,
    message: '',
    stage: '',
    error: null
  });

  const currentStageRef = useRef<number>(-1);
  const stagesRef = useRef<LoadingStage[]>(stages);

  // Update stages if they change
  const updateStages = useCallback((newStages: LoadingStage[]) => {
    stagesRef.current = newStages;
  }, []);

  // Start loading process
  const startLoading = useCallback((initialMessage?: string) => {
    currentStageRef.current = -1;
    setLoadingState({
      isLoading: true,
      progress: 0,
      message: initialMessage || '処理を開始しています...',
      stage: '',
      error: null
    });
  }, []);

  // Move to next stage
  const nextStage = useCallback((customMessage?: string) => {
    const stages = stagesRef.current;
    if (stages.length === 0) return;

    currentStageRef.current += 1;
    const stageIndex = Math.min(currentStageRef.current, stages.length - 1);
    const currentStage = stages[stageIndex];

    // Calculate progress based on completed stages
    const completedWeight = stages
      .slice(0, stageIndex)
      .reduce((sum, stage) => sum + stage.weight, 0);
    const totalWeight = stages.reduce((sum, stage) => sum + stage.weight, 0);
    const progress = Math.min((completedWeight / totalWeight) * 100, 100);

    setLoadingState(prev => ({
      ...prev,
      progress,
      message: customMessage || currentStage.message,
      stage: currentStage.id
    }));
  }, []);

  // Update progress within current stage
  const updateProgress = useCallback((stageProgress: number, message?: string) => {
    const stages = stagesRef.current;
    if (stages.length === 0) return;

    const stageIndex = Math.max(0, currentStageRef.current);
    const currentStage = stages[stageIndex];
    
    if (!currentStage) return;

    // Calculate overall progress
    const completedWeight = stages
      .slice(0, stageIndex)
      .reduce((sum, stage) => sum + stage.weight, 0);
    const currentStageWeight = currentStage.weight;
    const totalWeight = stages.reduce((sum, stage) => sum + stage.weight, 0);
    
    const currentStageProgress = (stageProgress / 100) * currentStageWeight;
    const overallProgress = ((completedWeight + currentStageProgress) / totalWeight) * 100;

    setLoadingState(prev => ({
      ...prev,
      progress: Math.min(overallProgress, 100),
      message: message || prev.message
    }));
  }, []);

  // Complete loading
  const completeLoading = useCallback((finalMessage?: string) => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false,
      progress: 100,
      message: finalMessage || '処理が完了しました',
      stage: 'complete'
    }));

    // Reset after a short delay
    setTimeout(() => {
      setLoadingState(prev => ({
        ...prev,
        progress: 0,
        message: '',
        stage: ''
      }));
    }, 1000);
  }, []);

  // Handle error
  const setError = useCallback((error: string) => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false,
      error,
      message: 'エラーが発生しました'
    }));
  }, []);

  // Reset loading state
  const reset = useCallback(() => {
    currentStageRef.current = -1;
    setLoadingState({
      isLoading: false,
      progress: 0,
      message: '',
      stage: '',
      error: null
    });
  }, []);

  return {
    loadingState,
    startLoading,
    nextStage,
    updateProgress,
    completeLoading,
    setError,
    reset,
    updateStages
  };
}

// Utility function to simulate loading with stages
export async function simulateStageLoading(
  stages: LoadingStage[],
  onUpdate: (progress: number, message: string, stage: string) => void,
  minDuration: number = 100
): Promise<void> {
  const totalWeight = stages.reduce((sum, stage) => sum + stage.weight, 0);
  let completedWeight = 0;

  for (const stage of stages) {
    onUpdate(
      (completedWeight / totalWeight) * 100,
      stage.message,
      stage.id
    );

    // Simulate stage processing time
    const stageDuration = Math.max(minDuration, (stage.weight / totalWeight) * 1000);
    await new Promise(resolve => setTimeout(resolve, stageDuration));

    completedWeight += stage.weight;
  }

  // Final update
  onUpdate(100, '完了しました', 'complete');
}

// Progress calculation utilities
export function calculateProgress(
  currentStage: number,
  stageProgress: number,
  stages: LoadingStage[]
): number {
  if (stages.length === 0) return 0;

  const totalWeight = stages.reduce((sum, stage) => sum + stage.weight, 0);
  const completedWeight = stages
    .slice(0, currentStage)
    .reduce((sum, stage) => sum + stage.weight, 0);
  
  const currentStageWeight = stages[currentStage]?.weight || 0;
  const currentProgress = (stageProgress / 100) * currentStageWeight;
  
  return Math.min(((completedWeight + currentProgress) / totalWeight) * 100, 100);
}

// Debounced loading state updater
export function createDebouncedUpdater(
  updateFn: (progress: number, message: string) => void,
  delay: number = 100
) {
  let timeoutId: NodeJS.Timeout | null = null;

  return (progress: number, message: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      updateFn(progress, message);
    }, delay);
  };
}