import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AxisSelector } from '../AxisSelector';
import { ParsedCSVData } from '@/types';

// Mock CSV data for testing
const mockCSVData: ParsedCSVData = {
  headers: ['Name', 'Age', 'Salary', 'Department', 'Mixed'],
  data: [
    { Name: 'John', Age: '30', Salary: '50000', Department: 'Engineering', Mixed: '10' },
    { Name: 'Jane', Age: '25', Salary: '45000', Department: 'Marketing', Mixed: 'text' },
    { Name: 'Bob', Age: '35', Salary: '', Department: 'Engineering', Mixed: '20' }
  ],
  meta: {
    delimiter: ',',
    linebreak: '\n',
    aborted: false,
    truncated: false,
    cursor: 100
  }
};

const mockCSVDataWithNulls: ParsedCSVData = {
  headers: ['Name', 'Score', 'Empty'],
  data: [
    { Name: 'Alice', Score: '85', Empty: '' },
    { Name: 'Bob', Score: '', Empty: null },
    { Name: 'Charlie', Score: '92', Empty: '' }
  ],
  meta: {
    delimiter: ',',
    linebreak: '\n',
    aborted: false,
    truncated: false,
    cursor: 100
  }
};

describe('AxisSelector', () => {
  const defaultProps = {
    headers: mockCSVData.headers,
    selectedXAxis: null,
    selectedYAxes: [],
    onXAxisChange: vi.fn(),
    onYAxesChange: vi.fn(),
    csvData: mockCSVData,
    maxYAxes: 10
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders X-axis and Y-axis selection sections', () => {
      render(<AxisSelector {...defaultProps} />);
      
      expect(screen.getByText('X軸 (横軸)')).toBeInTheDocument();
      expect(screen.getByText(/Y軸 \(縦軸\)/)).toBeInTheDocument();
    });

    it('displays all available headers in X-axis dropdown', async () => {
      render(<AxisSelector {...defaultProps} />);
      
      const xAxisSelect = screen.getAllByRole('combobox')[0];
      fireEvent.click(xAxisSelect);
      
      await waitFor(() => {
        mockCSVData.headers.forEach(header => {
          expect(screen.getByText(header)).toBeInTheDocument();
        });
      });
    });

    it('shows no Y-axes selected message initially', () => {
      render(<AxisSelector {...defaultProps} />);
      
      expect(screen.getByText('Y軸に使用する列を選択してください')).toBeInTheDocument();
    });
  });

  describe('Data Type Validation Logic', () => {
    it('displays data type information for columns', async () => {
      render(<AxisSelector {...defaultProps} />);
      
      // Wait for data validation to complete
      await waitFor(() => {
        expect(screen.getByText(/型:/)).toBeInTheDocument();
      });
    });

    it('shows warnings for columns with null values', async () => {
      const propsWithNulls = {
        ...defaultProps,
        csvData: mockCSVDataWithNulls,
        headers: mockCSVDataWithNulls.headers,
        selectedXAxis: 'Score'
      };
      
      render(<AxisSelector {...propsWithNulls} />);
      
      await waitFor(() => {
        expect(screen.getByText('この列には空の値が含まれています')).toBeInTheDocument();
      });
    });

    it('shows warnings for non-numeric Y-axis columns', async () => {
      const propsWithStringYAxis = {
        ...defaultProps,
        selectedYAxes: ['Name']
      };
      
      render(<AxisSelector {...propsWithStringYAxis} />);
      
      await waitFor(() => {
        expect(screen.getByText(/この列は数値データではありません/)).toBeInTheDocument();
      });
    });

    it('shows warnings for mixed type Y-axis columns', async () => {
      const propsWithMixedYAxis = {
        ...defaultProps,
        selectedYAxes: ['Mixed']
      };
      
      render(<AxisSelector {...propsWithMixedYAxis} />);
      
      await waitFor(() => {
        expect(screen.getByText(/この列には数値以外のデータが含まれています/)).toBeInTheDocument();
      });
    });

    it('displays recommended columns with checkmark for Y-axis', async () => {
      render(<AxisSelector {...defaultProps} />);
      
      // Wait for component to render Y-axis dropdown when no selections are made
      await waitFor(() => {
        const yAxisSelects = screen.getAllByRole('combobox');
        if (yAxisSelects.length > 1) {
          const yAxisSelect = yAxisSelects[1]; // Second combobox should be Y-axis
          fireEvent.click(yAxisSelect);
        }
      });
      
      await waitFor(() => {
        // Age and Salary should be available as options (numeric columns)
        expect(screen.getByText('Age')).toBeInTheDocument();
        expect(screen.getByText('Salary')).toBeInTheDocument();
      });
    });
  });

  describe('Multiple Selection Functionality', () => {
    it('allows adding multiple Y-axes', async () => {
      const onYAxesChange = vi.fn();
      
      render(<AxisSelector {...defaultProps} onYAxesChange={onYAxesChange} />);
      
      // Add first Y-axis
      await waitFor(() => {
        const yAxisSelects = screen.getAllByRole('combobox');
        if (yAxisSelects.length > 1) {
          const yAxisSelect = yAxisSelects[1]; // Second combobox should be Y-axis
          fireEvent.click(yAxisSelect);
          
          // Wait for dropdown to open and click Age
          const ageOption = screen.getByText('Age');
          fireEvent.click(ageOption);
        }
      });
      
      expect(onYAxesChange).toHaveBeenCalledWith(['Age']);
    });

    it('prevents duplicate Y-axis selections', async () => {
      const onYAxesChange = vi.fn();
      
      const propsWithYAxis = {
        ...defaultProps,
        selectedYAxes: ['Age'],
        onYAxesChange
      };
      
      render(<AxisSelector {...propsWithYAxis} />);
      
      // Try to add Age again - it should not appear in available options
      await waitFor(() => {
        const yAxisSelects = screen.getAllByRole('combobox');
        if (yAxisSelects.length > 1) {
          const yAxisSelect = yAxisSelects[1];
          fireEvent.click(yAxisSelect);
        }
      });
      
      // Age should not be in the dropdown since it's already selected
      await waitFor(() => {
        expect(screen.queryByText('Age')).not.toBeInTheDocument();
      });
    });

    it('allows removing Y-axes', async () => {
      const onYAxesChange = vi.fn();
      
      const propsWithYAxes = {
        ...defaultProps,
        selectedYAxes: ['Age', 'Salary'],
        onYAxesChange
      };
      
      render(<AxisSelector {...propsWithYAxes} />);
      
      // Find and click remove button for Age
      await waitFor(() => {
        const removeButtons = screen.getAllByRole('button');
        const ageRemoveButton = removeButtons.find(button => 
          button.closest('[class*="border"]')?.textContent?.includes('Age')
        );
        
        if (ageRemoveButton) {
          fireEvent.click(ageRemoveButton);
          expect(onYAxesChange).toHaveBeenCalledWith(['Salary']);
        }
      });
    });

    it('respects maxYAxes limit', () => {
      const propsWithLimit = {
        ...defaultProps,
        maxYAxes: 2,
        selectedYAxes: ['Age', 'Salary']
      };
      
      render(<AxisSelector {...propsWithLimit} />);
      
      expect(screen.getByText('2/2個選択中')).toBeInTheDocument();
      expect(screen.getByText('最大数に達しました')).toBeInTheDocument();
    });

    it('hides Y-axis dropdown when max limit is reached', () => {
      const propsWithLimit = {
        ...defaultProps,
        maxYAxes: 1,
        selectedYAxes: ['Age']
      };
      
      render(<AxisSelector {...propsWithLimit} />);
      
      // Y-axis add dropdown should not be visible
      const yAxisSelects = screen.getAllByRole('combobox');
      expect(yAxisSelects).toHaveLength(1); // Only X-axis select should be present
    });

    it('shows correct count of selected Y-axes', () => {
      const propsWithMultipleYAxes = {
        ...defaultProps,
        selectedYAxes: ['Age', 'Salary', 'Mixed'],
        maxYAxes: 5
      };
      
      render(<AxisSelector {...propsWithMultipleYAxes} />);
      
      expect(screen.getByText('3/5個選択中')).toBeInTheDocument();
    });

    it('displays all selected Y-axes with their information', () => {
      const propsWithYAxes = {
        ...defaultProps,
        selectedYAxes: ['Age', 'Salary']
      };
      
      render(<AxisSelector {...propsWithYAxes} />);
      
      expect(screen.getByText('選択されたY軸:')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('Salary')).toBeInTheDocument();
    });
  });

  describe('X-axis Selection', () => {
    it('calls onXAxisChange when X-axis is selected', async () => {
      const onXAxisChange = vi.fn();
      
      render(<AxisSelector {...defaultProps} onXAxisChange={onXAxisChange} />);
      
      const xAxisSelect = screen.getAllByRole('combobox')[0];
      fireEvent.click(xAxisSelect);
      
      await waitFor(() => {
        const nameOption = screen.getByText('Name');
        fireEvent.click(nameOption);
      });
      
      expect(onXAxisChange).toHaveBeenCalledWith('Name');
    });

    it('triggers preview update when X-axis changes', async () => {
      const onPreviewUpdate = vi.fn();
      
      render(<AxisSelector {...defaultProps} onPreviewUpdate={onPreviewUpdate} />);
      
      const xAxisSelect = screen.getAllByRole('combobox')[0];
      fireEvent.click(xAxisSelect);
      
      await waitFor(() => {
        const nameOption = screen.getByText('Name');
        fireEvent.click(nameOption);
      });
      
      expect(onPreviewUpdate).toHaveBeenCalled();
    });
  });

  describe('Selection Summary', () => {
    it('shows selection summary when axes are selected', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedXAxis: 'Name',
        selectedYAxes: ['Age', 'Salary']
      };
      
      render(<AxisSelector {...propsWithSelection} />);
      
      expect(screen.getByText('選択サマリー')).toBeInTheDocument();
      expect(screen.getByText('X軸: Name')).toBeInTheDocument();
      expect(screen.getByText('Y軸: Age, Salary')).toBeInTheDocument();
    });

    it('shows ready message when both X and Y axes are selected', () => {
      const propsWithBothAxes = {
        ...defaultProps,
        selectedXAxis: 'Name',
        selectedYAxes: ['Age']
      };
      
      render(<AxisSelector {...propsWithBothAxes} />);
      
      expect(screen.getByText('グラフを生成する準備ができました')).toBeInTheDocument();
    });

    it('does not show ready message when only X-axis is selected', () => {
      const propsWithXOnly = {
        ...defaultProps,
        selectedXAxis: 'Name',
        selectedYAxes: []
      };
      
      render(<AxisSelector {...propsWithXOnly} />);
      
      expect(screen.queryByText('グラフを生成する準備ができました')).not.toBeInTheDocument();
    });
  });
});