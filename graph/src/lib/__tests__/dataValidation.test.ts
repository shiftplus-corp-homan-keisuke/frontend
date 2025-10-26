import { describe, it, expect } from 'vitest';
import {
  detectColumnDataType,
  validateColumns,
  isValidXAxisColumn,
  isValidYAxisColumn,
  getColumnWarnings
} from '../dataValidation';
import { ParsedCSVData, ColumnValidation } from '@/types';

describe('dataValidation', () => {
  describe('detectColumnDataType', () => {
    it('should detect number type for numeric values', () => {
      const values = ['10', '20', '30.5', '0'];
      expect(detectColumnDataType(values)).toBe('number');
    });

    it('should detect string type for text values', () => {
      const values = ['apple', 'banana', 'cherry'];
      expect(detectColumnDataType(values)).toBe('string');
    });

    it('should detect mixed type for mixed values', () => {
      const values = ['10', 'apple', '20', 'banana'];
      expect(detectColumnDataType(values)).toBe('mixed');
    });

    it('should handle null and empty values', () => {
      const values = [null, '', '10', '20'];
      expect(detectColumnDataType(values)).toBe('number');
    });

    it('should return string for empty column', () => {
      const values: (string | number | null)[] = [];
      expect(detectColumnDataType(values)).toBe('string');
    });

    it('should detect number type when 80% or more are numbers', () => {
      const values = ['10', '20', '30', '40', 'text']; // 80% numbers
      expect(detectColumnDataType(values)).toBe('number');
    });

    it('should detect mixed type when less than 80% are numbers', () => {
      const values = ['10', '20', 'text1', 'text2']; // 50% numbers
      expect(detectColumnDataType(values)).toBe('mixed');
    });
  });

  describe('validateColumns', () => {
    const mockCSVData: ParsedCSVData = {
      headers: ['Name', 'Age', 'Salary', 'Mixed'],
      data: [
        { Name: 'John', Age: '30', Salary: '50000', Mixed: '10' },
        { Name: 'Jane', Age: '25', Salary: '45000', Mixed: 'text' },
        { Name: 'Bob', Age: '35', Salary: '', Mixed: '20' }
      ],
      meta: {
        delimiter: ',',
        linebreak: '\n',
        aborted: false,
        truncated: false,
        cursor: 100
      }
    };

    it('should validate all columns correctly', () => {
      const validations = validateColumns(mockCSVData);
      
      expect(validations).toHaveLength(4);
      
      // Name column - string type
      const nameValidation = validations.find(v => v.columnName === 'Name');
      expect(nameValidation?.dataType).toBe('string');
      expect(nameValidation?.hasNullValues).toBe(false);
      expect(nameValidation?.sampleValues).toEqual(['John', 'Jane', 'Bob']);

      // Age column - number type
      const ageValidation = validations.find(v => v.columnName === 'Age');
      expect(ageValidation?.dataType).toBe('number');
      expect(ageValidation?.hasNullValues).toBe(false);

      // Salary column - has null values
      const salaryValidation = validations.find(v => v.columnName === 'Salary');
      expect(salaryValidation?.hasNullValues).toBe(true);

      // Mixed column - mixed type
      const mixedValidation = validations.find(v => v.columnName === 'Mixed');
      expect(mixedValidation?.dataType).toBe('mixed');
    });

    it('should handle empty data gracefully', () => {
      const emptyCSVData: ParsedCSVData = {
        headers: ['Empty'],
        data: [{ Empty: '' }, { Empty: null }],
        meta: {
          delimiter: ',',
          linebreak: '\n',
          aborted: false,
          truncated: false,
          cursor: 0
        }
      };

      const validations = validateColumns(emptyCSVData);
      expect(validations[0].dataType).toBe('string');
      expect(validations[0].hasNullValues).toBe(true);
      expect(validations[0].sampleValues).toEqual([]);
    });
  });

  describe('isValidXAxisColumn', () => {
    it('should return true for column with data', () => {
      const validation: ColumnValidation = {
        columnName: 'Name',
        dataType: 'string',
        hasNullValues: false,
        sampleValues: ['John', 'Jane']
      };
      
      expect(isValidXAxisColumn(validation)).toBe(true);
    });

    it('should return false for column without data', () => {
      const validation: ColumnValidation = {
        columnName: 'Empty',
        dataType: 'string',
        hasNullValues: true,
        sampleValues: []
      };
      
      expect(isValidXAxisColumn(validation)).toBe(false);
    });
  });

  describe('isValidYAxisColumn', () => {
    it('should return true for numeric column with data', () => {
      const validation: ColumnValidation = {
        columnName: 'Age',
        dataType: 'number',
        hasNullValues: false,
        sampleValues: [30, 25, 35]
      };
      
      expect(isValidYAxisColumn(validation)).toBe(true);
    });

    it('should return false for non-numeric column', () => {
      const validation: ColumnValidation = {
        columnName: 'Name',
        dataType: 'string',
        hasNullValues: false,
        sampleValues: ['John', 'Jane']
      };
      
      expect(isValidYAxisColumn(validation)).toBe(false);
    });

    it('should return false for numeric column without data', () => {
      const validation: ColumnValidation = {
        columnName: 'Empty',
        dataType: 'number',
        hasNullValues: true,
        sampleValues: []
      };
      
      expect(isValidYAxisColumn(validation)).toBe(false);
    });
  });

  describe('getColumnWarnings', () => {
    it('should return warning for column with null values', () => {
      const validation: ColumnValidation = {
        columnName: 'Salary',
        dataType: 'number',
        hasNullValues: true,
        sampleValues: [50000, 45000]
      };
      
      const warnings = getColumnWarnings(validation, true);
      expect(warnings).toContain('この列には空の値が含まれています');
    });

    it('should return warning for non-numeric Y-axis column', () => {
      const validation: ColumnValidation = {
        columnName: 'Name',
        dataType: 'string',
        hasNullValues: false,
        sampleValues: ['John', 'Jane']
      };
      
      const warnings = getColumnWarnings(validation, true);
      expect(warnings).toContain('この列は数値データではありません。Y軸には数値データを選択することをお勧めします');
    });

    it('should return warning for mixed type Y-axis column', () => {
      const validation: ColumnValidation = {
        columnName: 'Mixed',
        dataType: 'mixed',
        hasNullValues: false,
        sampleValues: [10, 'text', 20]
      };
      
      const warnings = getColumnWarnings(validation, true);
      expect(warnings).toContain('この列には数値以外のデータが含まれています。グラフが正しく表示されない可能性があります');
    });

    it('should return warning for empty column', () => {
      const validation: ColumnValidation = {
        columnName: 'Empty',
        dataType: 'string',
        hasNullValues: true,
        sampleValues: []
      };
      
      const warnings = getColumnWarnings(validation, false);
      expect(warnings).toContain('この列にはデータが含まれていません');
    });

    it('should return no warnings for valid numeric Y-axis column', () => {
      const validation: ColumnValidation = {
        columnName: 'Age',
        dataType: 'number',
        hasNullValues: false,
        sampleValues: [30, 25, 35]
      };
      
      const warnings = getColumnWarnings(validation, true);
      expect(warnings).toHaveLength(0);
    });

    it('should not return Y-axis warnings for X-axis columns', () => {
      const validation: ColumnValidation = {
        columnName: 'Name',
        dataType: 'string',
        hasNullValues: false,
        sampleValues: ['John', 'Jane']
      };
      
      const warnings = getColumnWarnings(validation, false);
      expect(warnings).not.toContain('この列は数値データではありません');
    });
  });
});