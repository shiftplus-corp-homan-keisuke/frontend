import { ErrorHandler } from '../errorHandler';
import { ErrorType } from '@/types';

describe('ErrorHandler', () => {
  describe('createError', () => {
    it('should create a standardized AppError', () => {
      const error = ErrorHandler.createError(
        ErrorType.FILE_PARSE_ERROR,
        'Test error message',
        { testDetail: 'value' },
        new Error('Original error')
      );

      expect(error.type).toBe(ErrorType.FILE_PARSE_ERROR);
      expect(error.message).toBe('Test error message');
      expect(error.details.testDetail).toBe('value');
      expect(error.details.originalError).toBe('Original error');
      expect(error.details.timestamp).toBeDefined();
    });
  });

  describe('handleFileError', () => {
    it('should handle file size errors', () => {
      const sizeError = new Error('File size too large');
      const appError = ErrorHandler.handleFileError(sizeError);

      expect(appError.type).toBe(ErrorType.FILE_SIZE_ERROR);
      expect(appError.message).toContain('ファイルサイズが大きすぎます');
    });

    it('should handle file format errors', () => {
      const formatError = new Error('Unsupported file format');
      const appError = ErrorHandler.handleFileError(formatError);

      expect(appError.type).toBe(ErrorType.UNSUPPORTED_FORMAT);
      expect(appError.message).toContain('サポートされていないファイル形式');
    });

    it('should handle parse errors', () => {
      const parseError = new Error('CSV parse failed - invalid delimiter');
      const appError = ErrorHandler.handleFileError(parseError);

      expect(appError.type).toBe(ErrorType.FILE_PARSE_ERROR);
      expect(appError.message).toContain('CSVファイルの解析に失敗');
    });

    it('should handle generic errors', () => {
      const genericError = new Error('Unknown error');
      const appError = ErrorHandler.handleFileError(genericError);

      expect(appError.type).toBe(ErrorType.FILE_PARSE_ERROR);
      expect(appError.message).toContain('ファイルの処理中にエラーが発生');
    });
  });

  describe('handleDataValidationError', () => {
    it('should create validation error for non-numeric data', () => {
      const error = ErrorHandler.handleDataValidationError('price', 'non-numeric');

      expect(error.type).toBe(ErrorType.INVALID_DATA_TYPE);
      expect(error.message).toContain('列「price」に数値以外のデータ');
      expect(error.details.columnName).toBe('price');
      expect(error.details.issue).toBe('non-numeric');
    });

    it('should create validation error for empty columns', () => {
      const error = ErrorHandler.handleDataValidationError('amount', 'empty-column');

      expect(error.type).toBe(ErrorType.INVALID_DATA_TYPE);
      expect(error.message).toContain('列「amount」にデータが含まれていません');
    });
  });

  describe('handleChartError', () => {
    it('should handle data format errors in chart rendering', () => {
      const chartError = new Error('Invalid data format for chart');
      const appError = ErrorHandler.handleChartError(chartError, 'bar');

      expect(appError.type).toBe(ErrorType.INVALID_DATA_TYPE);
      expect(appError.message).toContain('barグラフの生成に失敗');
      expect(appError.details.chartType).toBe('bar');
    });

    it('should handle rendering errors', () => {
      const renderError = new Error('Component render failed');
      const appError = ErrorHandler.handleChartError(renderError, 'line');

      expect(appError.type).toBe(ErrorType.NO_DATA);
      expect(appError.message).toContain('グラフの描画中にエラーが発生');
    });
  });

  describe('getErrorMessage', () => {
    it('should return comprehensive error information', () => {
      const appError = ErrorHandler.createError(
        ErrorType.FILE_SIZE_ERROR,
        'File too large',
        { maxSize: '10MB' }
      );

      const errorInfo = ErrorHandler.getErrorMessage(appError);

      expect(errorInfo.title).toBe('ファイルサイズエラー');
      expect(errorInfo.message).toBe('File too large');
      expect(errorInfo.suggestions).toContain('ファイルサイズを10MB以下に縮小してください');
      expect(errorInfo.severity).toBe('medium');
    });

    it('should include custom suggestions from error details', () => {
      const appError = ErrorHandler.createError(
        ErrorType.INVALID_DATA_TYPE,
        'Invalid data',
        { suggestions: ['Custom suggestion 1', 'Custom suggestion 2'] }
      );

      const errorInfo = ErrorHandler.getErrorMessage(appError);

      expect(errorInfo.suggestions).toContain('Custom suggestion 1');
      expect(errorInfo.suggestions).toContain('Custom suggestion 2');
    });
  });
});