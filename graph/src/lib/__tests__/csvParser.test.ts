import { describe, it, expect, beforeEach } from 'vitest'
import { validateFile, parseCSVFile, validateCSVData, MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '../csvParser'
import { ParsedCSVData } from '@/types'
import { createMockCSVFile, createMockParsedData, createLargeCSVFile, TEST_CSV_DATA } from '@/test/testUtils'

describe('csvParser', () => {
  describe('validateFile', () => {
    it('should validate a valid CSV file', () => {
      const validFile = createMockCSVFile(TEST_CSV_DATA.VALID_BASIC)
      const result = validateFile(validFile)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject files that are too large', () => {
      const largeContent = 'a'.repeat(MAX_FILE_SIZE + 1)
      const largeFile = new File([largeContent], 'large.csv', { type: 'text/csv' })
      const result = validateFile(largeFile)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(`ファイルサイズが大きすぎます。最大${MAX_FILE_SIZE / (1024 * 1024)}MBまでです。`)
    })

    it('should reject non-CSV files', () => {
      const txtFile = new File(['some text'], 'test.txt', { type: 'text/plain' })
      const result = validateFile(txtFile)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('CSVファイルのみサポートされています。')
    })

    it('should reject empty files', () => {
      const emptyFile = new File([], 'empty.csv', { type: 'text/csv' })
      const result = validateFile(emptyFile)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('ファイルが空です。')
    })

    it('should accept CSV files with .csv extension even without proper MIME type', () => {
      const csvFile = new File(['name,age\nJohn,25'], 'test.csv', { type: 'application/octet-stream' })
      const result = validateFile(csvFile)
      
      expect(result.isValid).toBe(true)
    })
  })

  describe('parseCSVFile', () => {
    it('should parse a valid CSV file with headers', async () => {
      const csvContent = 'name,age,city\nJohn,25,Tokyo\nJane,30,Osaka'
      const file = new File([csvContent], 'test.csv', { type: 'text/csv' })
      
      const result = await parseCSVFile(file)
      
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data!.headers).toEqual(['name', 'age', 'city'])
      expect(result.data!.data).toHaveLength(2)
      expect(result.data!.data[0]).toEqual({ name: 'John', age: '25', city: 'Tokyo' })
      expect(result.data!.data[1]).toEqual({ name: 'Jane', age: '30', city: 'Osaka' })
    })

    it('should handle CSV with different delimiters', async () => {
      const csvContent = 'name;age;city\nJohn;25;Tokyo\nJane;30;Osaka'
      const file = new File([csvContent], 'test.csv', { type: 'text/csv' })
      
      const result = await parseCSVFile(file)
      
      expect(result.success).toBe(true)
      expect(result.data!.meta.delimiter).toBe(';')
    })

    it('should handle empty cells as null', async () => {
      const csvContent = 'name,age,city\nJohn,,Tokyo\nJane,30,'
      const file = new File([csvContent], 'test.csv', { type: 'text/csv' })
      
      const result = await parseCSVFile(file)
      
      expect(result.success).toBe(true)
      expect(result.data!.data[0]).toEqual({ name: 'John', age: null, city: 'Tokyo' })
      expect(result.data!.data[1]).toEqual({ name: 'Jane', age: '30', city: null })
    })

    it('should skip completely empty rows', async () => {
      const csvContent = 'name,age\nJohn,25\n\n\nJane,30\n'
      const file = new File([csvContent], 'test.csv', { type: 'text/csv' })
      
      const result = await parseCSVFile(file)
      
      expect(result.success).toBe(true)
      expect(result.data!.data).toHaveLength(2)
    })

    it('should return error for invalid file', async () => {
      const invalidFile = new File([''], 'empty.csv', { type: 'text/csv' })
      
      const result = await parseCSVFile(invalidFile)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('ファイルが空です。')
    })

    it('should return error for file with no data rows', async () => {
      const headerOnlyContent = 'name,age,city'
      const file = new File([headerOnlyContent], 'headers-only.csv', { type: 'text/csv' })
      
      const result = await parseCSVFile(file)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('CSVファイルに有効なデータ行が含まれていません。')
    })

    it('should return error for file with no valid headers', async () => {
      const noHeaderContent = ',,,\ndata1,data2,data3'
      const file = new File([noHeaderContent], 'no-headers.csv', { type: 'text/csv' })
      
      const result = await parseCSVFile(file)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('CSVファイルに有効な列ヘッダーが見つかりません。')
    })

    it('should handle files with BOM (Byte Order Mark)', async () => {
      const bomContent = '\uFEFFname,age\nJohn,25'
      const file = new File([bomContent], 'bom.csv', { type: 'text/csv' })
      
      const result = await parseCSVFile(file)
      
      expect(result.success).toBe(true)
      expect(result.data!.headers).toEqual(['name', 'age'])
    })

    it('should trim whitespace from headers', async () => {
      const csvContent = ' name , age , city \nJohn,25,Tokyo'
      const file = new File([csvContent], 'whitespace.csv', { type: 'text/csv' })
      
      const result = await parseCSVFile(file)
      
      expect(result.success).toBe(true)
      expect(result.data!.headers).toEqual(['name', 'age', 'city'])
    })
  })

  describe('validateCSVData', () => {
    const validData: ParsedCSVData = {
      headers: ['name', 'age', 'city'],
      data: [
        { name: 'John', age: '25', city: 'Tokyo' },
        { name: 'Jane', age: '30', city: 'Osaka' }
      ],
      meta: {
        delimiter: ',',
        linebreak: '\n',
        aborted: false,
        truncated: false,
        cursor: 0
      }
    }

    it('should validate correct CSV data', () => {
      const result = validateCSVData(validData)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect missing headers', () => {
      const dataWithoutHeaders = { ...validData, headers: [] }
      const result = validateCSVData(dataWithoutHeaders)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('列ヘッダーが見つかりません。')
    })

    it('should detect missing data', () => {
      const dataWithoutRows = { ...validData, data: [] }
      const result = validateCSVData(dataWithoutRows)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('データ行が見つかりません。')
    })

    it('should warn about duplicate headers', () => {
      const dataWithDuplicates = { 
        ...validData, 
        headers: ['name', 'age', 'name'] 
      }
      const result = validateCSVData(dataWithDuplicates)
      
      expect(result.isValid).toBe(true)
      expect(result.warnings).toContain('重複する列ヘッダーが見つかりました: name')
    })

    it('should warn about inconsistent row structure', () => {
      const inconsistentData = {
        ...validData,
        data: [
          { name: 'John', age: '25', city: 'Tokyo' },
          { name: 'Jane', age: '30' } // Missing city column
        ]
      }
      const result = validateCSVData(inconsistentData)
      
      expect(result.isValid).toBe(true)
      expect(result.warnings.some(w => w.includes('行のデータで列数が一致しません'))).toBe(true)
    })
  })
})