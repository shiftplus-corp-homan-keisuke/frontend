import { ParsedCSVData } from '@/types'

/**
 * Creates a mock CSV file for testing
 */
export function createMockCSVFile(content: string, filename = 'test.csv', type = 'text/csv'): File {
  return new File([content], filename, { type })
}

/**
 * Creates mock parsed CSV data for testing
 */
export function createMockParsedData(
  headers: string[] = ['name', 'age', 'city'],
  data: Record<string, any>[] = [
    { name: 'John', age: '25', city: 'Tokyo' },
    { name: 'Jane', age: '30', city: 'Osaka' }
  ]
): ParsedCSVData {
  return {
    headers,
    data,
    meta: {
      delimiter: ',',
      linebreak: '\n',
      aborted: false,
      truncated: false,
      cursor: 0
    }
  }
}

/**
 * Creates a large file for testing file size limits
 */
export function createLargeCSVFile(sizeInBytes: number): File {
  const content = 'a'.repeat(sizeInBytes)
  return new File([content], 'large.csv', { type: 'text/csv' })
}

/**
 * Common CSV test data
 */
export const TEST_CSV_DATA = {
  VALID_BASIC: 'name,age,city\nJohn,25,Tokyo\nJane,30,Osaka',
  VALID_WITH_EMPTY_CELLS: 'name,age,city\nJohn,,Tokyo\nJane,30,',
  SEMICOLON_DELIMITER: 'name;age;city\nJohn;25;Tokyo\nJane;30;Osaka',
  TAB_DELIMITER: 'name\tage\tcity\nJohn\t25\tTokyo\nJane\t30\tOsaka',
  HEADERS_ONLY: 'name,age,city',
  EMPTY_FILE: '',
  NO_HEADERS: ',,,\ndata1,data2,data3',
  WITH_BOM: '\uFEFFname,age\nJohn,25',
  WITH_WHITESPACE: ' name , age , city \nJohn,25,Tokyo'
}