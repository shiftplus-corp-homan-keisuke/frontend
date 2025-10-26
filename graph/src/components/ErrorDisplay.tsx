'use client';

import React, { useState } from 'react';
import { AlertCircle, X, RefreshCw, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ErrorDisplayProps, AppError, ErrorType } from '@/types';
import { ErrorHandler } from '@/lib/errorHandler';
import { cn } from '@/lib/utils';

export function ErrorDisplay({ error, onDismiss, onRetry }: ErrorDisplayProps & { onRetry?: () => void }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  if (!error) return null;

  // Handle both string errors and AppError objects
  const isAppError = typeof error !== 'string';
  const errorInfo = isAppError 
    ? ErrorHandler.getErrorMessage(error as AppError)
    : {
        title: 'エラー',
        message: error,
        suggestions: ['ファイルを確認して再試行してください'],
        severity: 'medium' as const
      };

  const getErrorIcon = () => {
    const iconClass = "h-5 w-5";
    switch (errorInfo.severity) {
      case 'high':
        return <AlertCircle className={cn(iconClass, "text-red-500")} />;
      case 'medium':
        return <AlertCircle className={cn(iconClass, "text-yellow-500")} />;
      case 'low':
        return <AlertCircle className={cn(iconClass, "text-blue-500")} />;
      default:
        return <AlertCircle className={cn(iconClass, "text-red-500")} />;
    }
  };

  const getErrorStyles = () => {
    switch (errorInfo.severity) {
      case 'high':
        return "bg-red-50 border-red-200 text-red-800";
      case 'medium':
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case 'low':
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-red-50 border-red-200 text-red-800";
    }
  };

  const getSeverityBadge = () => {
    const badges = {
      high: { text: '重要', class: 'bg-red-100 text-red-800' },
      medium: { text: '警告', class: 'bg-yellow-100 text-yellow-800' },
      low: { text: '情報', class: 'bg-blue-100 text-blue-800' }
    };
    
    const badge = badges[errorInfo.severity];
    return (
      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', badge.class)}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className={cn(
      "border rounded-lg p-4 mb-4 shadow-sm",
      getErrorStyles()
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {getErrorIcon()}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm">
                {errorInfo.title}
              </h3>
              {getSeverityBadge()}
            </div>
            
            <p className="text-sm mt-1 leading-relaxed">
              {errorInfo.message}
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-white/50 hover:bg-white/80 rounded-md transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  再試行
                </button>
              )}
              
              {errorInfo.suggestions.length > 0 && (
                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-white/50 hover:bg-white/80 rounded-md transition-colors"
                >
                  <HelpCircle className="h-3 w-3" />
                  解決方法
                  {showSuggestions ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              )}

              {isAppError && (error as AppError).details && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-white/50 hover:bg-white/80 rounded-md transition-colors"
                >
                  詳細
                  {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              )}
            </div>

            {/* Suggestions */}
            {showSuggestions && errorInfo.suggestions.length > 0 && (
              <div className="mt-3 p-3 bg-white/30 rounded-md">
                <h4 className="text-xs font-medium mb-2">解決方法:</h4>
                <ul className="text-xs space-y-1">
                  {errorInfo.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-current opacity-60">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Technical details */}
            {showDetails && isAppError && (error as AppError).details && (
              <div className="mt-3 p-3 bg-white/30 rounded-md">
                <h4 className="text-xs font-medium mb-2">技術的詳細:</h4>
                <div className="text-xs font-mono bg-black/10 p-2 rounded overflow-auto max-h-32">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify((error as AppError).details, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 p-1 hover:bg-black/10 rounded-full transition-colors flex-shrink-0"
            type="button"
            aria-label="エラーを閉じる"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Helper component for inline error messages
export function InlineError({ message, className }: { message: string; className?: string }) {
  return (
    <div className={cn("flex items-center space-x-2 text-red-600 text-sm", className)}>
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}

// Helper component for warning messages
export function WarningMessage({ message, className }: { message: string; className?: string }) {
  return (
    <div className={cn("flex items-center space-x-2 text-yellow-600 text-sm", className)}>
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}