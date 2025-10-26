'use client';

import React from 'react';
import { Loader2, FileText, BarChart, Settings, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Basic loading spinner component
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
  );
}

// Loading overlay component
export interface LoadingOverlayProps {
  loading: boolean;
  message?: string;
  children: React.ReactNode;
  className?: string;
}

export function LoadingOverlay({ loading, message, children, className }: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="text-center">
            <LoadingSpinner size="lg" className="text-blue-600 mb-3" />
            {message && (
              <p className="text-sm text-gray-600 font-medium">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Progress bar component
export interface ProgressBarProps {
  progress: number;
  message?: string;
  className?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ progress, message, className, showPercentage = true }: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={cn('w-full', className)}>
      {message && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">{message}</span>
          {showPercentage && (
            <span className="text-sm font-medium text-gray-900">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

// Step-based loading indicator
export interface LoadingStep {
  id: string;
  label: string;
  icon?: React.ReactNode;
  status: 'pending' | 'active' | 'completed' | 'error';
}

export interface StepLoadingProps {
  steps: LoadingStep[];
  className?: string;
}

export function StepLoading({ steps, className }: StepLoadingProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center space-x-3">
          <div className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors',
            step.status === 'pending' && 'border-gray-300 bg-gray-50',
            step.status === 'active' && 'border-blue-500 bg-blue-50',
            step.status === 'completed' && 'border-green-500 bg-green-50',
            step.status === 'error' && 'border-red-500 bg-red-50'
          )}>
            {step.status === 'active' && <LoadingSpinner size="sm" className="text-blue-600" />}
            {step.status === 'completed' && <div className="w-3 h-3 bg-green-500 rounded-full" />}
            {step.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
            {step.status === 'pending' && step.icon && (
              <div className="text-gray-400">{step.icon}</div>
            )}
          </div>
          <span className={cn(
            'text-sm font-medium transition-colors',
            step.status === 'pending' && 'text-gray-500',
            step.status === 'active' && 'text-blue-600',
            step.status === 'completed' && 'text-green-600',
            step.status === 'error' && 'text-red-600'
          )}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// Skeleton loading component
export interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className={cn(
            'bg-gray-200 rounded',
            index === 0 ? 'h-4' : 'h-3 mt-2',
            index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

// Chart loading placeholder
export function ChartLoadingPlaceholder({ className }: { className?: string }) {
  return (
    <div className={cn('bg-gray-50 rounded-lg p-6', className)}>
      <div className="animate-pulse">
        {/* Chart title skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6" />
        
        {/* Chart area skeleton */}
        <div className="space-y-3">
          {/* Y-axis labels */}
          <div className="flex items-end space-x-2 h-32">
            {Array.from({ length: 8 }).map((_, index) => (
              <div 
                key={index}
                className="bg-gray-200 rounded-t"
                style={{ 
                  height: `${Math.random() * 80 + 20}%`,
                  width: '12%'
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
    </div>
  );
}