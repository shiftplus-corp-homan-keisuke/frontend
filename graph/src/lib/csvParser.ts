import Papa from 'papaparse';
import { ParsedCSVData, CSVParseResult, ErrorType, ValidationResult } from '@/types';
import { ErrorHandler } from './errorHandler';

// Constants for file validation and performance optimization
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // Increased to 50MB for better large file support
export const LARGE_FILE_THRESHOLD = 5 * 1024 * 1024; // 5MB threshold for streaming
export const CHUNK_SIZE = 1024 * 1024; // 1MB chunks for streaming
export const MAX_PREVIEW_ROWS = 1000; // Limit preview rows for performance
export const ACCEPTED_FILE_TYPES = ['.csv', 'text/csv', 'application/csv'];

// Memory management utilities
class MemoryManager {
  private static instance: MemoryManager;
  private dataCache = new Map<string, any>();
  private maxCacheSize = 100 * 1024 * 1024; // 100MB cache limit
  private currentCacheSize = 0;

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  addToCache(key: string, data: any): void {
    const dataSize = this.estimateDataSize(data);
    
    // Clear cache if adding this data would exceed limit
    if (this.currentCacheSize + dataSize > this.maxCacheSize) {
      this.clearCache();
    }
    
    this.dataCache.set(key, data);
    this.currentCacheSize += dataSize;
  }

  getFromCache(key: string): any {
    return this.dataCache.get(key);
  }

  clearCache(): void {
    this.dataCache.clear();
    this.currentCacheSize = 0;
    
    // Force garbage collection if available
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc();
    }
  }

  private estimateDataSize(data: any): number {
    // Rough estimation of data size in bytes
    return JSON.stringify(data).length * 2; // UTF-16 encoding approximation
  }

  getMemoryUsage(): { used: number; limit: number; percentage: number } {
    return {
      used: this.currentCacheSize,
      limit: this.maxCacheSize,
      percentage: (this.currentCacheSize / this.maxCacheSize) * 100
    };
  }
}

/**
 * Validates file before parsing
 */
export function validateFile(file: File): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`ファイルサイズが大きすぎます。最大${MAX_FILE_SIZE / (1024 * 1024)}MBまでです。`);
  }

  // Check file type
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  
  if (!fileName.endsWith('.csv') && !ACCEPTED_FILE_TYPES.includes(fileType)) {
    errors.push('CSVファイルのみサポートされています。');
  }

  // Check if file is empty
  if (file.size === 0) {
    errors.push('ファイルが空です。');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Parses CSV file using PapaParse with performance optimizations
 */
export function parseCSVFile(file: File, onProgress?: (progress: number) => void): Promise<CSVParseResult> {
  return new Promise((resolve) => {
    // First validate the file
    const validation = validateFile(file);
    if (!validation.isValid) {
      resolve({
        success: false,
        error: validation.errors.join(' ')
      });
      return;
    }

    const memoryManager = MemoryManager.getInstance();
    const isLargeFile = file.size > LARGE_FILE_THRESHOLD;
    
    // Use streaming for large files
    if (isLargeFile) {
      parseCSVFileStreaming(file, onProgress, resolve, memoryManager);
    } else {
      parseCSVFileStandard(file, onProgress, resolve, memoryManager);
    }
  });
}

/**
 * Standard parsing for smaller files
 */
function parseCSVFileStandard(
  file: File, 
  onProgress: ((progress: number) => void) | undefined,
  resolve: (value: CSVParseResult) => void,
  memoryManager: MemoryManager
): void {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    trimHeaders: true,
    dynamicTyping: false,
    complete: (results) => {
      try {
        onProgress?.(50);
        const processedResult = processParseResults(results, memoryManager);
        onProgress?.(100);
        resolve(processedResult);
      } catch (error) {
        const appError = ErrorHandler.handleFileError(error);
        resolve({
          success: false,
          error: appError.message
        });
      }
    },
    error: (error) => {
      const appError = ErrorHandler.handleFileError(error);
      resolve({
        success: false,
        error: appError.message
      });
    }
  });
}

/**
 * Streaming parsing for large files with memory optimization
 */
function parseCSVFileStreaming(
  file: File,
  onProgress: ((progress: number) => void) | undefined,
  resolve: (value: CSVParseResult) => void,
  memoryManager: MemoryManager
): void {
  let headers: string[] = [];
  let processedRows: Record<string, any>[] = [];
  let totalRows = 0;
  let processedBytes = 0;
  
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    trimHeaders: true,
    dynamicTyping: false,
    chunk: (results, parser) => {
      try {
        // Update progress
        processedBytes += CHUNK_SIZE;
        const progress = Math.min((processedBytes / file.size) * 90, 90);
        onProgress?.(progress);

        // Process chunk
        if (results.data && results.data.length > 0) {
          // Get headers from first chunk
          if (headers.length === 0) {
            const firstRow = results.data[0] as Record<string, any>;
            headers = Object.keys(firstRow).filter(header => header.trim() !== '');
          }

          // Process rows in chunks to avoid memory spikes
          const chunkData = results.data
            .filter((row: any) => {
              return Object.values(row).some(value => 
                value !== null && value !== undefined && String(value).trim() !== ''
              );
            })
            .map((row: any) => {
              const cleanedRow: Record<string, any> = {};
              headers.forEach(header => {
                const value = row[header];
                cleanedRow[header] = (value === '' || value === undefined) ? null : value;
              });
              return cleanedRow;
            });

          processedRows.push(...chunkData);
          totalRows += chunkData.length;

          // Memory management: limit rows for very large files
          if (totalRows > MAX_PREVIEW_ROWS) {
            parser.abort();
            console.warn(`Large file detected. Processing limited to ${MAX_PREVIEW_ROWS} rows for performance.`);
          }

          // Check memory usage and clear cache if needed
          const memoryUsage = memoryManager.getMemoryUsage();
          if (memoryUsage.percentage > 80) {
            memoryManager.clearCache();
          }
        }
      } catch (error) {
        parser.abort();
        const appError = ErrorHandler.handleFileError(error);
        resolve({
          success: false,
          error: appError.message
        });
      }
    },
    complete: () => {
      try {
        onProgress?.(95);
        
        if (headers.length === 0) {
          resolve({
            success: false,
            error: 'CSVファイルに有効な列ヘッダーが見つかりません。'
          });
          return;
        }

        if (processedRows.length === 0) {
          resolve({
            success: false,
            error: 'CSVファイルに有効なデータ行が含まれていません。'
          });
          return;
        }

        const parsedData: ParsedCSVData = {
          headers,
          data: processedRows,
          meta: {
            delimiter: ',', // Default for streaming
            linebreak: '\n',
            aborted: totalRows > MAX_PREVIEW_ROWS,
            truncated: totalRows > MAX_PREVIEW_ROWS,
            cursor: processedRows.length
          }
        };

        // Cache the processed data
        memoryManager.addToCache(`csv_${file.name}_${file.size}`, parsedData);

        onProgress?.(100);
        resolve({
          success: true,
          data: parsedData
        });

      } catch (error) {
        const appError = ErrorHandler.handleFileError(error);
        resolve({
          success: false,
          error: appError.message
        });
      }
    },
    error: (error) => {
      const appError = ErrorHandler.handleFileError(error);
      resolve({
        success: false,
        error: appError.message
      });
    }
  });
}

/**
 * Process parse results with error handling and optimization
 */
function processParseResults(results: Papa.ParseResult<any>, memoryManager: MemoryManager): CSVParseResult {
  // Check for parsing errors
  if (results.errors && results.errors.length > 0) {
    const criticalErrors = results.errors.filter(error => error.type === 'Delimiter');
    if (criticalErrors.length > 0) {
      return {
        success: false,
        error: 'CSVファイルの形式が正しくありません。区切り文字を確認してください。'
      };
    }
  }

  // Check if we have data
  if (!results.data || results.data.length === 0) {
    return {
      success: false,
      error: 'CSVファイルにデータが含まれていません。'
    };
  }

  // Get headers from the first row keys
  const firstRow = results.data[0] as Record<string, any>;
  const headers = Object.keys(firstRow).filter(header => header.trim() !== '');

  if (headers.length === 0) {
    return {
      success: false,
      error: 'CSVファイルに有効な列ヘッダーが見つかりません。'
    };
  }

  // Clean and process the data with memory optimization
  const cleanedData = results.data
    .filter((row: any) => {
      return Object.values(row).some(value => 
        value !== null && value !== undefined && String(value).trim() !== ''
      );
    })
    .slice(0, MAX_PREVIEW_ROWS) // Limit rows for performance
    .map((row: any) => {
      const cleanedRow: Record<string, any> = {};
      headers.forEach(header => {
        const value = row[header];
        cleanedRow[header] = (value === '' || value === undefined) ? null : value;
      });
      return cleanedRow;
    });

  if (cleanedData.length === 0) {
    return {
      success: false,
      error: 'CSVファイルに有効なデータ行が含まれていません。'
    };
  }

  const parsedData: ParsedCSVData = {
    headers,
    data: cleanedData,
    meta: {
      delimiter: results.meta.delimiter,
      linebreak: results.meta.linebreak,
      aborted: results.meta.aborted || results.data.length > MAX_PREVIEW_ROWS,
      truncated: results.meta.truncated || results.data.length > MAX_PREVIEW_ROWS,
      cursor: results.meta.cursor
    }
  };

  return {
    success: true,
    data: parsedData
  };
}

/**
 * Get memory manager instance for external use
 */
export function getMemoryManager(): MemoryManager {
  return MemoryManager.getInstance();
}

/**
 * Validates CSV data structure
 */
export function validateCSVData(data: ParsedCSVData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if headers exist
  if (!data.headers || data.headers.length === 0) {
    errors.push('列ヘッダーが見つかりません。');
  }

  // Check for duplicate headers
  const duplicateHeaders = data.headers.filter((header, index) => 
    data.headers.indexOf(header) !== index
  );
  if (duplicateHeaders.length > 0) {
    warnings.push(`重複する列ヘッダーが見つかりました: ${duplicateHeaders.join(', ')}`);
  }

  // Check if data exists
  if (!data.data || data.data.length === 0) {
    errors.push('データ行が見つかりません。');
  }

  // Check data consistency
  if (data.data && data.data.length > 0) {
    const firstRowKeys = Object.keys(data.data[0]);
    const inconsistentRows = data.data.filter((row, index) => {
      const rowKeys = Object.keys(row);
      return rowKeys.length !== firstRowKeys.length || 
             !firstRowKeys.every(key => rowKeys.includes(key));
    });

    if (inconsistentRows.length > 0) {
      warnings.push(`${inconsistentRows.length}行のデータで列数が一致しません。`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}