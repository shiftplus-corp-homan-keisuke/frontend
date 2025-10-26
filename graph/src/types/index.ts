// CSV Data Types
export interface ParsedCSVData {
  headers: string[];
  data: Record<string, any>[];
  meta: {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    truncated: boolean;
    cursor: number;
  };
}

export interface CSVParseResult {
  success: boolean;
  data?: ParsedCSVData;
  error?: string;
}

export interface CSVRow {
  [columnName: string]: string | number | null;
}

export interface ProcessedChartData {
  name: string; // X軸の値
  [yAxisName: string]: string | number; // Y軸の値（複数可能）
}

// Chart Configuration Types
export type ChartType = 'bar' | 'line' | 'pie';

export interface ChartConfig {
  xAxis: {
    dataKey: string;
    type: 'category' | 'number';
  };
  yAxes: Array<{
    dataKey: string;
    color: string;
    name: string;
  }>;
  chartType: ChartType;
}

// Application State Types
export interface AppState {
  csvData: ParsedCSVData | null;
  selectedXAxis: string | null;
  selectedYAxes: string[];
  chartType: ChartType;
  loading: boolean;
  error: string | null;
}

// Error Types
export enum ErrorType {
  FILE_PARSE_ERROR = 'FILE_PARSE_ERROR',
  INVALID_DATA_TYPE = 'INVALID_DATA_TYPE',
  NO_DATA = 'NO_DATA',
  COLUMN_NOT_FOUND = 'COLUMN_NOT_FOUND',
  FILE_SIZE_ERROR = 'FILE_SIZE_ERROR',
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ColumnValidation {
  columnName: string;
  dataType: 'string' | 'number' | 'mixed';
  hasNullValues: boolean;
  sampleValues: (string | number | null)[];
}

// Component Props Types
export interface CSVUploaderProps {
  onFileUpload: (data: ParsedCSVData) => void;
  onError: (error: string) => void;
  maxFileSize?: number;
  acceptedFormats?: string[];
  loading?: boolean;
}

export interface AxisSelectorProps {
  headers: string[];
  selectedXAxis: string | null;
  selectedYAxes: string[];
  onXAxisChange: (axis: string) => void;
  onYAxesChange: (axes: string[]) => void;
  maxYAxes?: number;
}

export interface ChartTypeSelectorProps {
  selectedType: ChartType;
  onTypeChange: (type: ChartType) => void;
  disabled?: boolean;
  multipleYAxes: boolean;
}

export interface ChartRendererProps {
  data: Record<string, any>[];
  xAxis: string;
  yAxes: string[];
  chartType: ChartType;
  loading?: boolean;
  error?: string | null;
}

export interface ErrorDisplayProps {
  error: AppError | string | null;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export interface LoadingStateProps {
  loading: boolean;
  message?: string;
}

// UI State Types
export interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  chartHeight: number;
}

// File Upload Types
export interface FileUploadState {
  isDragOver: boolean;
  isUploading: boolean;
  progress: number;
}

// Chart Color Palette
export type ChartColorPalette = string[];

export const DEFAULT_CHART_COLORS: ChartColorPalette = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#00ff00',
  '#0088fe',
  '#00c49f',
  '#ffbb28',
  '#ff8042',
  '#8dd1e1'
];

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type NonEmptyArray<T> = [T, ...T[]];

// Data Processing Types
export interface DataProcessingOptions {
  skipEmptyRows: boolean;
  trimWhitespace: boolean;
  convertNumbers: boolean;
  dateColumns?: string[];
}

// Chart Rendering Options
export interface ChartRenderingOptions {
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  colors?: ChartColorPalette;
}

// Event Handler Types
export type FileUploadHandler = (data: ParsedCSVData) => void;
export type ErrorHandler = (error: string | AppError) => void;
export type AxisChangeHandler = (axis: string) => void;
export type MultiAxisChangeHandler = (axes: string[]) => void;
export type ChartTypeChangeHandler = (type: ChartType) => void;

// Hook Return Types
export interface UseCSVParserReturn {
  parseCSV: (file: File) => Promise<CSVParseResult>;
  loading: boolean;
  error: string | null;
}

export interface UseChartDataReturn {
  chartData: ProcessedChartData[];
  loading: boolean;
  error: string | null;
  processData: (csvData: ParsedCSVData, xAxis: string, yAxes: string[]) => void;
}