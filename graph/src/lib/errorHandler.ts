import { AppError, ErrorType } from '@/types';

// Enhanced error handling utilities
export class ErrorHandler {
  /**
   * Creates a standardized AppError from various error sources
   */
  static createError(
    type: ErrorType,
    message: string,
    details?: any,
    originalError?: Error
  ): AppError {
    return {
      type,
      message,
      details: {
        ...details,
        originalError: originalError?.message,
        stack: originalError?.stack,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Handles file upload errors with user-friendly messages
   */
  static handleFileError(error: any): AppError {
    if (error instanceof Error) {
      // File size errors
      if (error.message.includes('size') || error.message.includes('large')) {
        return this.createError(
          ErrorType.FILE_SIZE_ERROR,
          'ファイルサイズが大きすぎます。10MB以下のファイルを選択してください。',
          { maxSize: '10MB' },
          error
        );
      }

      // File format errors
      if (error.message.includes('format') || error.message.includes('type')) {
        return this.createError(
          ErrorType.UNSUPPORTED_FORMAT,
          'サポートされていないファイル形式です。CSVファイルを選択してください。',
          { supportedFormats: ['.csv'] },
          error
        );
      }

      // Parse errors
      if (error.message.includes('parse') || error.message.includes('delimiter')) {
        return this.createError(
          ErrorType.FILE_PARSE_ERROR,
          'CSVファイルの解析に失敗しました。ファイル形式と区切り文字を確認してください。',
          { 
            suggestion: '一般的な区切り文字: カンマ(,)、セミコロン(;)、タブ',
            commonIssues: ['不正な区切り文字', '破損したファイル', '空のファイル']
          },
          error
        );
      }
    }

    // Generic file error
    return this.createError(
      ErrorType.FILE_PARSE_ERROR,
      'ファイルの処理中にエラーが発生しました。ファイルを確認して再試行してください。',
      { errorType: 'unknown' },
      error instanceof Error ? error : new Error(String(error))
    );
  }

  /**
   * Handles data validation errors
   */
  static handleDataValidationError(columnName: string, issue: string): AppError {
    const messages: Record<string, string> = {
      'non-numeric': `列「${columnName}」に数値以外のデータが含まれています。Y軸には数値データを選択することをお勧めします。`,
      'empty-column': `列「${columnName}」にデータが含まれていません。`,
      'mixed-types': `列「${columnName}」に異なるデータ型が混在しています。`,
      'too-many-nulls': `列「${columnName}」に空の値が多く含まれています。`
    };

    return this.createError(
      ErrorType.INVALID_DATA_TYPE,
      messages[issue] || `列「${columnName}」でデータの問題が検出されました。`,
      { 
        columnName, 
        issue,
        suggestions: [
          'データの形式を確認してください',
          '空の値を適切な値に置き換えてください',
          '数値データには数字のみを使用してください'
        ]
      }
    );
  }

  /**
   * Handles chart rendering errors
   */
  static handleChartError(error: any, chartType: string): AppError {
    if (error instanceof Error) {
      // Data format errors
      if (error.message.includes('data') || error.message.includes('format')) {
        return this.createError(
          ErrorType.INVALID_DATA_TYPE,
          `${chartType}グラフの生成に失敗しました。データ形式を確認してください。`,
          { 
            chartType,
            commonCauses: [
              '選択した列に適切なデータが含まれていない',
              'X軸とY軸の組み合わせが不適切',
              'データに空の値が多すぎる'
            ]
          },
          error
        );
      }

      // Rendering errors
      if (error.message.includes('render') || error.message.includes('component')) {
        return this.createError(
          ErrorType.NO_DATA,
          'グラフの描画中にエラーが発生しました。データを確認して再試行してください。',
          { chartType },
          error
        );
      }
    }

    return this.createError(
      ErrorType.NO_DATA,
      'グラフの生成中に予期しないエラーが発生しました。',
      { chartType },
      error instanceof Error ? error : new Error(String(error))
    );
  }

  /**
   * Handles network or async operation errors
   */
  static handleAsyncError(operation: string, error: any): AppError {
    return this.createError(
      ErrorType.FILE_PARSE_ERROR,
      `${operation}中にエラーが発生しました。ネットワーク接続を確認して再試行してください。`,
      { 
        operation,
        retryable: true,
        timestamp: new Date().toISOString()
      },
      error instanceof Error ? error : new Error(String(error))
    );
  }

  /**
   * Gets user-friendly error message with recovery suggestions
   */
  static getErrorMessage(error: AppError): {
    title: string;
    message: string;
    suggestions: string[];
    severity: 'low' | 'medium' | 'high';
  } {
    const baseInfo = {
      title: this.getErrorTitle(error.type),
      message: error.message,
      suggestions: this.getRecoverySuggestions(error.type),
      severity: this.getErrorSeverity(error.type)
    };

    // Add specific suggestions from error details
    if (error.details?.suggestions) {
      baseInfo.suggestions = [...baseInfo.suggestions, ...error.details.suggestions];
    }

    return baseInfo;
  }

  private static getErrorTitle(type: ErrorType): string {
    const titles: Record<ErrorType, string> = {
      [ErrorType.FILE_PARSE_ERROR]: 'ファイル解析エラー',
      [ErrorType.FILE_SIZE_ERROR]: 'ファイルサイズエラー',
      [ErrorType.UNSUPPORTED_FORMAT]: 'サポートされていない形式',
      [ErrorType.INVALID_DATA_TYPE]: 'データ型エラー',
      [ErrorType.COLUMN_NOT_FOUND]: '列が見つかりません',
      [ErrorType.NO_DATA]: 'データなし'
    };
    return titles[type] || 'エラー';
  }

  private static getRecoverySuggestions(type: ErrorType): string[] {
    const suggestions: Record<ErrorType, string[]> = {
      [ErrorType.FILE_PARSE_ERROR]: [
        'CSVファイルの形式を確認してください',
        '区切り文字が正しいか確認してください',
        'ファイルが破損していないか確認してください'
      ],
      [ErrorType.FILE_SIZE_ERROR]: [
        'ファイルサイズを10MB以下に縮小してください',
        '不要な列やデータを削除してください'
      ],
      [ErrorType.UNSUPPORTED_FORMAT]: [
        'CSVファイル(.csv)を使用してください',
        'ExcelファイルをCSV形式で保存し直してください'
      ],
      [ErrorType.INVALID_DATA_TYPE]: [
        'Y軸には数値データを含む列を選択してください',
        'データに空の値がないか確認してください'
      ],
      [ErrorType.COLUMN_NOT_FOUND]: [
        'CSVファイルに列ヘッダーが含まれているか確認してください',
        'ファイルを再アップロードしてください'
      ],
      [ErrorType.NO_DATA]: [
        'CSVファイルにデータが含まれているか確認してください',
        'ファイルが空でないか確認してください'
      ]
    };
    return suggestions[type] || ['ファイルを確認して再試行してください'];
  }

  private static getErrorSeverity(type: ErrorType): 'low' | 'medium' | 'high' {
    const severityMap: Record<ErrorType, 'low' | 'medium' | 'high'> = {
      [ErrorType.FILE_PARSE_ERROR]: 'high',
      [ErrorType.FILE_SIZE_ERROR]: 'medium',
      [ErrorType.UNSUPPORTED_FORMAT]: 'medium',
      [ErrorType.INVALID_DATA_TYPE]: 'low',
      [ErrorType.COLUMN_NOT_FOUND]: 'medium',
      [ErrorType.NO_DATA]: 'medium'
    };
    return severityMap[type] || 'medium';
  }
}

// Error boundary utilities
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  errorHandler?: (error: any) => void
): T {
  return ((...args: any[]) => {
    try {
      const result = fn(...args);
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error) => {
          if (errorHandler) {
            errorHandler(error);
          } else {
            console.error('Unhandled async error:', error);
          }
          throw error;
        });
      }
      
      return result;
    } catch (error) {
      if (errorHandler) {
        errorHandler(error);
      } else {
        console.error('Unhandled error:', error);
      }
      throw error;
    }
  }) as T;
}

// Retry mechanism for failed operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw ErrorHandler.createError(
          ErrorType.FILE_PARSE_ERROR,
          `操作が${maxRetries}回失敗しました。`,
          { attempts: maxRetries, lastError: error },
          error instanceof Error ? error : new Error(String(error))
        );
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
}