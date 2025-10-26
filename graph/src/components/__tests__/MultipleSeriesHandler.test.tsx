import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultipleSeriesHandler } from '../MultipleSeriesHandler';
import { ChartType } from '@/types';

describe('MultipleSeriesHandler', () => {
  const mockOnYAxesChange = jest.fn();
  const mockOnChartTypeChange = jest.fn();

  const defaultProps = {
    selectedYAxes: ['sales', 'profit'],
    onYAxesChange: mockOnYAxesChange,
    maxSeries: 10,
    chartType: 'bar' as ChartType,
    onChartTypeChange: mockOnChartTypeChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders multiple series correctly', () => {
    render(<MultipleSeriesHandler {...defaultProps} />);
    
    expect(screen.getByText('データ系列管理')).toBeInTheDocument();
    expect(screen.getByText('2/10個の系列')).toBeInTheDocument();
    expect(screen.getByText('sales')).toBeInTheDocument();
    expect(screen.getByText('profit')).toBeInTheDocument();
  });

  it('shows multiple series information when more than one series is selected', () => {
    render(<MultipleSeriesHandler {...defaultProps} />);
    
    expect(screen.getByText('複数系列表示中')).toBeInTheDocument();
    expect(screen.getByText('各系列は異なる色で表示されます')).toBeInTheDocument();
  });

  it('allows removing a series', () => {
    render(<MultipleSeriesHandler {...defaultProps} />);
    
    const removeButtons = screen.getAllByTitle('系列を削除');
    fireEvent.click(removeButtons[0]);
    
    expect(mockOnYAxesChange).toHaveBeenCalledWith(['profit']);
  });

  it('allows reordering series', () => {
    render(<MultipleSeriesHandler {...defaultProps} />);
    
    const moveUpButtons = screen.getAllByTitle('上に移動');
    const moveDownButtons = screen.getAllByTitle('下に移動');
    
    // Move second item up
    fireEvent.click(moveUpButtons[1]);
    expect(mockOnYAxesChange).toHaveBeenCalledWith(['profit', 'sales']);
    
    // Move first item down
    fireEvent.click(moveDownButtons[0]);
    expect(mockOnYAxesChange).toHaveBeenCalledWith(['profit', 'sales']);
  });

  it('restricts chart types when multiple series are selected', () => {
    render(<MultipleSeriesHandler {...defaultProps} />);
    
    expect(screen.getByText('棒グラフ')).toBeInTheDocument();
    expect(screen.getByText('折れ線グラフ')).toBeInTheDocument();
    expect(screen.getByText('円グラフ (無効)')).toBeInTheDocument();
  });

  it('allows chart type change for compatible types', () => {
    render(<MultipleSeriesHandler {...defaultProps} />);
    
    const lineChartButton = screen.getByText('折れ線グラフ');
    fireEvent.click(lineChartButton);
    
    expect(mockOnChartTypeChange).toHaveBeenCalledWith('line');
  });

  it('does not render when no series are selected', () => {
    const props = { ...defaultProps, selectedYAxes: [] };
    const { container } = render(<MultipleSeriesHandler {...props} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('shows legend preview for multiple series', () => {
    render(<MultipleSeriesHandler {...defaultProps} />);
    
    expect(screen.getByText('凡例プレビュー')).toBeInTheDocument();
  });

  it('shows series limit warning when approaching maximum', () => {
    const props = {
      ...defaultProps,
      selectedYAxes: Array.from({ length: 8 }, (_, i) => `series${i + 1}`),
      maxSeries: 10,
    };
    
    render(<MultipleSeriesHandler {...props} />);
    
    expect(screen.getByText(/系列数が多くなると、グラフの可読性が低下する可能性があります/)).toBeInTheDocument();
  });
});