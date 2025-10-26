import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorDisplay } from '../ErrorDisplay';
import { ErrorType, AppError } from '@/types';

describe('Enhanced ErrorDisplay', () => {
  const mockOnDismiss = jest.fn();
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display string error with basic functionality', () => {
    render(
      <ErrorDisplay 
        error="Simple error message" 
        onDismiss={mockOnDismiss}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('エラー')).toBeInTheDocument();
    expect(screen.getByText('Simple error message')).toBeInTheDocument();
    expect(screen.getByText('再試行')).toBeInTheDocument();
    expect(screen.getByText('解決方法')).toBeInTheDocument();
  });

  it('should display AppError with enhanced features', () => {
    const appError: AppError = {
      type: ErrorType.FILE_PARSE_ERROR,
      message: 'CSV parsing failed',
      details: {
        originalError: 'Invalid delimiter',
        suggestions: ['Check file format', 'Verify delimiter']
      }
    };

    render(
      <ErrorDisplay 
        error={appError} 
        onDismiss={mockOnDismiss}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('ファイル解析エラー')).toBeInTheDocument();
    expect(screen.getByText('CSV parsing failed')).toBeInTheDocument();
    expect(screen.getByText('重要')).toBeInTheDocument(); // Severity badge
  });

  it('should show suggestions when clicked', () => {
    const appError: AppError = {
      type: ErrorType.INVALID_DATA_TYPE,
      message: 'Invalid data type',
      details: {
        suggestions: ['Use numeric data', 'Check column format']
      }
    };

    render(<ErrorDisplay error={appError} />);

    const suggestionsButton = screen.getByText('解決方法');
    fireEvent.click(suggestionsButton);

    expect(screen.getByText('Use numeric data')).toBeInTheDocument();
    expect(screen.getByText('Check column format')).toBeInTheDocument();
  });

  it('should call retry handler when retry button is clicked', () => {
    render(
      <ErrorDisplay 
        error="Test error" 
        onRetry={mockOnRetry}
      />
    );

    const retryButton = screen.getByText('再試行');
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should call dismiss handler when close button is clicked', () => {
    render(
      <ErrorDisplay 
        error="Test error" 
        onDismiss={mockOnDismiss}
      />
    );

    const closeButton = screen.getByLabelText('エラーを閉じる');
    fireEvent.click(closeButton);

    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('should show technical details when details button is clicked', () => {
    const appError: AppError = {
      type: ErrorType.FILE_PARSE_ERROR,
      message: 'Parse error',
      details: {
        originalError: 'Delimiter not found',
        timestamp: '2023-01-01T00:00:00.000Z'
      }
    };

    render(<ErrorDisplay error={appError} />);

    const detailsButton = screen.getByText('詳細');
    fireEvent.click(detailsButton);

    expect(screen.getByText('技術的詳細:')).toBeInTheDocument();
    expect(screen.getByText(/"originalError": "Delimiter not found"/)).toBeInTheDocument();
  });

  it('should not render when error is null', () => {
    const { container } = render(<ErrorDisplay error={null} />);
    expect(container.firstChild).toBeNull();
  });
});