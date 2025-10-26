import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChartTypeSelector } from '../ChartTypeSelector';
import { ChartType } from '@/types';

describe('ChartTypeSelector', () => {
  const defaultProps = {
    selectedType: 'bar' as ChartType,
    onTypeChange: vi.fn(),
    disabled: false,
    multipleYAxes: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders chart type selection section', () => {
      render(<ChartTypeSelector {...defaultProps} />);
      
      expect(screen.getByText('グラフタイプ')).toBeInTheDocument();
      expect(screen.getByText('データの表示方法を選択してください')).toBeInTheDocument();
    });

    it('renders all chart type options', () => {
      render(<ChartTypeSelector {...defaultProps} />);
      
      expect(screen.getByText('棒グラフ')).toBeInTheDocument();
      expect(screen.getByText('折れ線グラフ')).toBeInTheDocument();
      expect(screen.getByText('円グラフ')).toBeInTheDocument();
    });

    it('shows descriptions for each chart type', () => {
      render(<ChartTypeSelector {...defaultProps} />);
      
      expect(screen.getByText('カテゴリ別の値を比較するのに適しています')).toBeInTheDocument();
      expect(screen.getByText('時系列データや傾向を表示するのに適しています')).toBeInTheDocument();
      expect(screen.getByText('全体に対する割合を表示するのに適しています（単一系列のみ）')).toBeInTheDocument();
    });

    it('shows multiple series support indicators', () => {
      render(<ChartTypeSelector {...defaultProps} />);
      
      const multipleSeriesIndicators = screen.getAllByText('複数系列対応');
      const singleSeriesIndicators = screen.getAllByText('単一系列のみ');
      
      expect(multipleSeriesIndicators).toHaveLength(2); // Bar and Line charts
      expect(singleSeriesIndicators).toHaveLength(1); // Pie chart
    });
  });

  describe('Chart Type Selection', () => {
    it('calls onTypeChange when a chart type is selected', () => {
      const onTypeChange = vi.fn();
      
      render(<ChartTypeSelector {...defaultProps} onTypeChange={onTypeChange} />);
      
      const lineChartButton = screen.getByText('折れ線グラフ').closest('button');
      fireEvent.click(lineChartButton!);
      
      expect(onTypeChange).toHaveBeenCalledWith('line');
    });

    it('highlights the selected chart type', () => {
      render(<ChartTypeSelector {...defaultProps} selectedType="line" />);
      
      const lineChartButton = screen.getByText('折れ線グラフ').closest('button');
      expect(lineChartButton).toHaveClass('bg-primary');
    });

    it('does not highlight unselected chart types', () => {
      render(<ChartTypeSelector {...defaultProps} selectedType="line" />);
      
      const barChartButton = screen.getByText('棒グラフ').closest('button');
      expect(barChartButton).not.toHaveClass('bg-primary');
    });
  });

  describe('Multiple Y-Axes Restrictions', () => {
    it('disables pie chart when multiple Y-axes are selected', () => {
      render(<ChartTypeSelector {...defaultProps} multipleYAxes={true} />);
      
      const pieChartButton = screen.getByText('円グラフ').closest('button');
      expect(pieChartButton).toBeDisabled();
    });

    it('keeps bar and line charts enabled when multiple Y-axes are selected', () => {
      render(<ChartTypeSelector {...defaultProps} multipleYAxes={true} />);
      
      const barChartButton = screen.getByText('棒グラフ').closest('button');
      const lineChartButton = screen.getByText('折れ線グラフ').closest('button');
      
      expect(barChartButton).not.toBeDisabled();
      expect(lineChartButton).not.toBeDisabled();
    });

    it('shows warning tooltip for disabled pie chart', () => {
      render(<ChartTypeSelector {...defaultProps} multipleYAxes={true} />);
      
      const warningIcon = screen.getByText('!');
      expect(warningIcon).toBeInTheDocument();
    });

    it('does not call onTypeChange for disabled chart types', () => {
      const onTypeChange = vi.fn();
      
      render(<ChartTypeSelector {...defaultProps} multipleYAxes={true} onTypeChange={onTypeChange} />);
      
      const pieChartButton = screen.getByText('円グラフ').closest('button');
      fireEvent.click(pieChartButton!);
      
      expect(onTypeChange).not.toHaveBeenCalled();
    });

    it('allows pie chart selection when single Y-axis is selected', () => {
      const onTypeChange = vi.fn();
      
      render(<ChartTypeSelector {...defaultProps} multipleYAxes={false} onTypeChange={onTypeChange} />);
      
      const pieChartButton = screen.getByText('円グラフ').closest('button');
      fireEvent.click(pieChartButton!);
      
      expect(onTypeChange).toHaveBeenCalledWith('pie');
    });
  });

  describe('Disabled State', () => {
    it('disables all chart types when disabled prop is true', () => {
      render(<ChartTypeSelector {...defaultProps} disabled={true} />);
      
      const barChartButton = screen.getByText('棒グラフ').closest('button');
      const lineChartButton = screen.getByText('折れ線グラフ').closest('button');
      const pieChartButton = screen.getByText('円グラフ').closest('button');
      
      expect(barChartButton).toBeDisabled();
      expect(lineChartButton).toBeDisabled();
      expect(pieChartButton).toBeDisabled();
    });

    it('does not call onTypeChange when disabled', () => {
      const onTypeChange = vi.fn();
      
      render(<ChartTypeSelector {...defaultProps} disabled={true} onTypeChange={onTypeChange} />);
      
      const barChartButton = screen.getByText('棒グラフ').closest('button');
      fireEvent.click(barChartButton!);
      
      expect(onTypeChange).not.toHaveBeenCalled();
    });
  });

  describe('Current Selection Info', () => {
    it('shows current selection info when a type is selected', () => {
      render(<ChartTypeSelector {...defaultProps} selectedType="bar" />);
      
      expect(screen.getByText('選択されたグラフタイプ')).toBeInTheDocument();
      expect(screen.getByText('タイプ: 棒グラフ')).toBeInTheDocument();
      expect(screen.getByText('複数系列対応: はい')).toBeInTheDocument();
    });

    it('shows correct multiple series support info for pie chart', () => {
      render(<ChartTypeSelector {...defaultProps} selectedType="pie" />);
      
      expect(screen.getByText('複数系列対応: いいえ')).toBeInTheDocument();
    });

    it('shows warning when pie chart is selected with multiple Y-axes', () => {
      render(<ChartTypeSelector {...defaultProps} selectedType="pie" multipleYAxes={true} />);
      
      expect(screen.getByText(/円グラフは複数系列に対応していません/)).toBeInTheDocument();
    });
  });

  describe('Help Text', () => {
    it('displays help text about chart type capabilities', () => {
      render(<ChartTypeSelector {...defaultProps} />);
      
      expect(screen.getByText('棒グラフと折れ線グラフは複数のY軸系列を同時に表示できます')).toBeInTheDocument();
      expect(screen.getByText('円グラフは単一のY軸系列のみ表示できます')).toBeInTheDocument();
      expect(screen.getByText('グラフタイプを変更しても、軸の選択は維持されます')).toBeInTheDocument();
    });
  });

  describe('State Maintenance Logic', () => {
    it('maintains selection when switching between compatible chart types', () => {
      const onTypeChange = vi.fn();
      
      // Start with bar chart
      const { rerender } = render(
        <ChartTypeSelector {...defaultProps} selectedType="bar" onTypeChange={onTypeChange} />
      );
      
      // Switch to line chart
      const lineChartButton = screen.getByText('折れ線グラフ').closest('button');
      fireEvent.click(lineChartButton!);
      
      expect(onTypeChange).toHaveBeenCalledWith('line');
      
      // Rerender with line chart selected
      rerender(
        <ChartTypeSelector {...defaultProps} selectedType="line" onTypeChange={onTypeChange} />
      );
      
      // Line chart should be highlighted
      expect(lineChartButton).toHaveClass('bg-primary');
    });

    it('prevents switching to incompatible chart type with multiple Y-axes', () => {
      const onTypeChange = vi.fn();
      
      render(<ChartTypeSelector {...defaultProps} multipleYAxes={true} onTypeChange={onTypeChange} />);
      
      const pieChartButton = screen.getByText('円グラフ').closest('button');
      fireEvent.click(pieChartButton!);
      
      // Should not call onTypeChange because pie chart doesn't support multiple series
      expect(onTypeChange).not.toHaveBeenCalled();
    });
  });
});