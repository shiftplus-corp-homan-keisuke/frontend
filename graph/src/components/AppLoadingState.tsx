'use client';

import React from 'react';
import { FileText, BarChart, Settings, Eye, CheckCircle, Loader2 } from 'lucide-react';
import { LoadingOverlay, StepLoading, LoadingStep } from '@/components/ui/loading';
import { cn } from '@/lib/utils';

interface AppLoadingStateProps {
  loading: boolean;
  currentStage?: string;
  progress?: number;
  message?: string;
  className?: string;
}

export function AppLoadingState({ 
  loading, 
  currentStage, 
  progress = 0, 
  message,
  className 
}: AppLoadingStateProps) {
  if (!loading) return null;

  // Define application workflow steps
  const workflowSteps: LoadingStep[] = [
    {
      id: 'upload',
      label: 'ファイルアップロード',
      icon: <FileText className="w-4 h-4" />,
      status: currentStage === 'upload' ? 'active' : 
              ['validation', 'parsing', 'processing', 'complete'].includes(currentStage || '') ? 'completed' : 'pending'
    },
    {
      id: 'validation',
      label: 'データ検証',
      icon: <Settings className="w-4 h-4" />,
      status: currentStage === 'validation' ? 'active' : 
              ['parsing', 'processing', 'complete'].includes(currentStage || '') ? 'completed' : 'pending'
    },
    {
      id: 'processing',
      label: 'データ処理',
      icon: <BarChart className="w-4 h-4" />,
      status: currentStage === 'processing' ? 'active' : 
              currentStage === 'complete' ? 'completed' : 'pending'
    },
    {
      id: 'complete',
      label: '完了',
      icon: <Eye className="w-4 h-4" />,
      status: currentStage === 'complete' ? 'completed' : 'pending'
    }
  ];

  return (
    <div className={cn('bg-white border rounded-lg p-6 shadow-sm', className)}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          処理中...
        </h3>
        {message && (
          <p className="text-sm text-gray-600">{message}</p>
        )}
      </div>

      {/* Progress bar */}
      {progress > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">進行状況</span>
            <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Step indicator */}
      <StepLoading steps={workflowSteps} />

      {/* Additional info */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          処理には数秒かかる場合があります。しばらくお待ちください。
        </p>
      </div>
    </div>
  );
}

// Specialized loading states for different operations
export function FileUploadLoadingState({ progress, message }: { progress: number; message?: string }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900">
            {message || 'ファイルをアップロード中...'}
          </p>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-sm font-medium text-blue-900">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

export function ChartGenerationLoadingState({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="text-center">
        <div className="relative mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <BarChart className="absolute inset-0 m-auto h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-blue-900 mb-1">
          グラフを生成中
        </h3>
        <p className="text-sm text-blue-700">
          {message || 'データを処理してグラフを作成しています...'}
        </p>
        <div className="mt-4 flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function DataValidationLoadingState({ columnCount, message }: { columnCount?: number; message?: string }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <Settings className="h-6 w-6 text-yellow-600 animate-pulse" />
        <div className="flex-1">
          <p className="text-sm font-medium text-yellow-900">
            {message || 'データを検証中...'}
          </p>
          {columnCount && (
            <p className="text-xs text-yellow-700 mt-1">
              {columnCount}個の列を分析しています
            </p>
          )}
        </div>
      </div>
    </div>
  );
}