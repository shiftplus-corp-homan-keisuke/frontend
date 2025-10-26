import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CSVUploader } from '../CSVUploader'
import { parseCSVFile } from '@/lib/csvParser'

// Mock the csvParser module
vi.mock('@/lib/csvParser', () => ({
  parseCSVFile: vi.fn(),
  validateFile: vi.fn()
}))

const mockParseCSVFile = vi.mocked(parseCSVFile)
const mockValidateFile = vi.mocked(require('@/lib/csvParser').validateFile)

describe('CSVUploader', () => {
  const mockOnFileUpload = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockValidateFile.mockReturnValue({
      isValid: true,
      errors: [],
      warnings: []
    })
  })

  it('should render upload area with correct text', () => {
    render(
      <CSVUploader 
        onFileUpload={mockOnFileUpload} 
        onError={mockOnError} 
      />
    )

    expect(screen.getByText('CSVファイルをドラッグ&ドロップ')).toBeInTheDocument()
    expect(screen.getByText(/ファイルを選択/)).toBeInTheDocument()
  })

  it('should show file size limit', () => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    render(
      <CSVUploader 
        onFileUpload={mockOnFileUpload} 
        onError={mockOnError}
        maxFileSize={maxSize}
      />
    )

    expect(screen.getByText('最大ファイルサイズ: 5 MB')).toBeInTheDocument()
  })

  it('should handle successful file upload', async () => {
    const mockData = {
      headers: ['name', 'age'],
      data: [{ name: 'John', age: '25' }],
      meta: {
        delimiter: ',',
        linebreak: '\n',
        aborted: false,
        truncated: false,
        cursor: 0
      }
    }

    mockParseCSVFile.mockResolvedValue({
      success: true,
      data: mockData
    })

    render(
      <CSVUploader 
        onFileUpload={mockOnFileUpload} 
        onError={mockOnError} 
      />
    )

    const file = new File(['name,age\nJohn,25'], 'test.csv', { type: 'text/csv' })
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith(mockData)
    })
  })

  it('should handle file validation errors', async () => {
    mockValidateFile.mockReturnValue({
      isValid: false,
      errors: ['ファイルサイズが大きすぎます。'],
      warnings: []
    })

    render(
      <CSVUploader 
        onFileUpload={mockOnFileUpload} 
        onError={mockOnError} 
      />
    )

    const file = new File(['large content'], 'large.csv', { type: 'text/csv' })
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('ファイルサイズが大きすぎます。')
    })
    expect(mockOnFileUpload).not.toHaveBeenCalled()
  })

  it('should handle parsing errors', async () => {
    mockParseCSVFile.mockResolvedValue({
      success: false,
      error: 'CSVファイルの形式が正しくありません。'
    })

    render(
      <CSVUploader 
        onFileUpload={mockOnFileUpload} 
        onError={mockOnError} 
      />
    )

    const file = new File(['invalid,csv,content'], 'invalid.csv', { type: 'text/csv' })
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('CSVファイルの形式が正しくありません。')
    })
    expect(mockOnFileUpload).not.toHaveBeenCalled()
  })

  it('should show loading state during file processing', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise(resolve => {
      resolvePromise = resolve
    })
    mockParseCSVFile.mockReturnValue(promise)

    render(
      <CSVUploader 
        onFileUpload={mockOnFileUpload} 
        onError={mockOnError} 
      />
    )

    const file = new File(['name,age\nJohn,25'], 'test.csv', { type: 'text/csv' })
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    // Should show loading state
    expect(screen.getByText(/ファイルを処理中/)).toBeInTheDocument()

    // Resolve the promise
    resolvePromise!({
      success: true,
      data: {
        headers: ['name', 'age'],
        data: [{ name: 'John', age: '25' }],
        meta: { delimiter: ',', linebreak: '\n', aborted: false, truncated: false, cursor: 0 }
      }
    })

    await waitFor(() => {
      expect(screen.queryByText(/ファイルを処理中/)).not.toBeInTheDocument()
    })
  })

  it('should handle drag and drop', async () => {
    const mockData = {
      headers: ['name', 'age'],
      data: [{ name: 'John', age: '25' }],
      meta: {
        delimiter: ',',
        linebreak: '\n',
        aborted: false,
        truncated: false,
        cursor: 0
      }
    }

    mockParseCSVFile.mockResolvedValue({
      success: true,
      data: mockData
    })

    render(
      <CSVUploader 
        onFileUpload={mockOnFileUpload} 
        onError={mockOnError} 
      />
    )

    const file = new File(['name,age\nJohn,25'], 'test.csv', { type: 'text/csv' })
    const dropZone = screen.getByRole('button')

    // Simulate drag over
    fireEvent.dragOver(dropZone, {
      dataTransfer: {
        files: [file]
      }
    })

    // Simulate drop
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file]
      }
    })

    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith(mockData)
    })
  })

  it('should show selected file information', async () => {
    mockParseCSVFile.mockResolvedValue({
      success: true,
      data: {
        headers: ['name', 'age'],
        data: [{ name: 'John', age: '25' }],
        meta: { delimiter: ',', linebreak: '\n', aborted: false, truncated: false, cursor: 0 }
      }
    })

    render(
      <CSVUploader 
        onFileUpload={mockOnFileUpload} 
        onError={mockOnError} 
      />
    )

    const file = new File(['name,age\nJohn,25'], 'test.csv', { type: 'text/csv' })
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument()
    })
  })

  it('should allow file removal', async () => {
    mockParseCSVFile.mockResolvedValue({
      success: true,
      data: {
        headers: ['name', 'age'],
        data: [{ name: 'John', age: '25' }],
        meta: { delimiter: ',', linebreak: '\n', aborted: false, truncated: false, cursor: 0 }
      }
    })

    render(
      <CSVUploader 
        onFileUpload={mockOnFileUpload} 
        onError={mockOnError} 
      />
    )

    const file = new File(['name,age\nJohn,25'], 'test.csv', { type: 'text/csv' })
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument()
    })

    // Click remove button
    const removeButton = screen.getByRole('button', { name: '' }) // X button
    fireEvent.click(removeButton)

    expect(screen.queryByText('test.csv')).not.toBeInTheDocument()
  })

  it('should handle unexpected errors gracefully', async () => {
    mockParseCSVFile.mockRejectedValue(new Error('Unexpected error'))

    render(
      <CSVUploader 
        onFileUpload={mockOnFileUpload} 
        onError={mockOnError} 
      />
    )

    const file = new File(['name,age\nJohn,25'], 'test.csv', { type: 'text/csv' })
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('ファイルの処理中にエラーが発生しました。')
    })
  })
})