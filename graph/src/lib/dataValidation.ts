import { ParsedCSVData, ColumnValidation } from '@/types';

/**
 * Determines the data type of a column based on its values
 */
export function detectColumnDataType(values: (string | number | null)[]): 'string' | 'number' | 'mixed' {
  const nonNullValues = values.filter(value => value !== null && value !== undefined && value !== '');
  
  if (nonNullValues.length === 0) {
    return 'string'; // Default to string for empty columns
  }

  let numberCount = 0;
  let stringCount = 0;

  for (const value of nonNullValues) {
    const stringValue = String(value).trim();
    
    // Check if it's a valid number
    if (!isNaN(Number(stringValue)) && stringValue !== '') {
      numberCount++;
    } else {
      stringCount++;
    }
  }

  // If more than 80% are numbers, consider it a number column
  const numberRatio = numberCount / nonNullValues.length;
  if (numberRatio >= 0.8) {
    return 'number';
  } else if (numberRatio === 0) {
    return 'string';
  } else {
    return 'mixed';
  }
}

/**
 * Validates all columns in the CSV data
 */
export function validateColumns(csvData: ParsedCSVData): ColumnValidation[] {
  return csvData.headers.map(header => {
    const columnValues = csvData.data.map(row => row[header]);
    const dataType = detectColumnDataType(columnValues);
    const hasNullValues = columnValues.some(value => value === null || value === undefined || value === '');
    
    // Get sample values (first 5 non-null values)
    const sampleValues = columnValues
      .filter(value => value !== null && value !== undefined && value !== '')
      .slice(0, 5);

    return {
      columnName: header,
      dataType,
      hasNullValues,
      sampleValues
    };
  });
}

/**
 * Checks if a column is suitable for X-axis (categorical or numeric)
 */
export function isValidXAxisColumn(validation: ColumnValidation): boolean {
  // X-axis can be any type, but should have some data
  return validation.sampleValues.length > 0;
}

/**
 * Checks if a column is suitable for Y-axis (should be numeric)
 */
export function isValidYAxisColumn(validation: ColumnValidation): boolean {
  return validation.dataType === 'number' && validation.sampleValues.length > 0;
}

/**
 * Gets validation warnings for a column selection
 */
export function getColumnWarnings(validation: ColumnValidation, isYAxis: boolean = false): string[] {
  const warnings: string[] = [];

  if (validation.hasNullValues) {
    warnings.push('この列には空の値が含まれています');
  }

  if (isYAxis && validation.dataType !== 'number') {
    if (validation.dataType === 'mixed') {
      warnings.push('この列には数値以外のデータが含まれています。グラフが正しく表示されない可能性があります');
    } else {
      warnings.push('この列は数値データではありません。Y軸には数値データを選択することをお勧めします');
    }
  }

  if (validation.sampleValues.length === 0) {
    warnings.push('この列にはデータが含まれていません');
  }

  return warnings;
}