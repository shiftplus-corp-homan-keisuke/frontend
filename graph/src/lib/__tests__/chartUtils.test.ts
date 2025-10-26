import { 
  processDataForChart, 
  getSeriesColor, 
  isChartTypeCompatibleWithMultipleAxes,
  getChartConfig,
  MultipleSeriesManager 
} from '../chartUtils';
import { ChartType } from '@/types';

describe('chartUtils', () => {
  describe('processDataForChart', () => {
    it('processes CSV data correctly for chart rendering', () => {
      const data = [
        { month: 'Jan', sales: '100', profit: '20' },
        { month: 'Feb', sales: '150', profit: '30' },
      ];
      
      const result = processDataForChart(data, 'month', ['sales', 'profit']);
      
      expect(result).toEqual([
        { name: 'Jan', sales: 100, profit: 20 },
        { name: 'Feb', sales: 150, profit: 30 },
      ]);
    });

    it('handles non-numeric values by converting to 0', () => {
      const data = [
        { month: 'Jan', sales: 'invalid', profit: null },
      ];
      
      const result = processDataForChart(data, 'month', ['sales', 'profit']);
      
      expect(result).toEqual([
        { name: 'Jan', sales: 0, profit: 0 },
      ]);
    });
  });

  describe('getSeriesColor', () => {
    it('returns colors from the default palette', () => {
      expect(getSeriesColor(0)).toBe('#8884d8');
      expect(getSeriesColor(1)).toBe('#82ca9d');
    });

    it('cycles through colors when index exceeds palette length', () => {
      const color0 = getSeriesColor(0);
      const color10 = getSeriesColor(10);
      expect(color0).toBe(color10);
    });
  });

  describe('isChartTypeCompatibleWithMultipleAxes', () => {
    it('returns true for bar and line charts', () => {
      expect(isChartTypeCompatibleWithMultipleAxes('bar')).toBe(true);
      expect(isChartTypeCompatibleWithMultipleAxes('line')).toBe(true);
    });

    it('returns false for pie charts', () => {
      expect(isChartTypeCompatibleWithMultipleAxes('pie')).toBe(false);
    });
  });

  describe('getChartConfig', () => {
    it('generates correct chart configuration', () => {
      const config = getChartConfig('month', ['sales', 'profit'], 'bar');
      
      expect(config.xAxis.dataKey).toBe('name');
      expect(config.yAxes).toHaveLength(2);
      expect(config.yAxes[0].dataKey).toBe('sales');
      expect(config.yAxes[1].dataKey).toBe('profit');
      expect(config.chartType).toBe('bar');
    });
  });
});

describe('MultipleSeriesManager', () => {
  let manager: MultipleSeriesManager;

  beforeEach(() => {
    manager = new MultipleSeriesManager(5); // Use smaller limit for testing
  });

  describe('canAddSeries', () => {
    it('returns true when under the limit', () => {
      expect(manager.canAddSeries(['series1', 'series2'])).toBe(true);
    });

    it('returns false when at the limit', () => {
      const series = ['s1', 's2', 's3', 's4', 's5'];
      expect(manager.canAddSeries(series)).toBe(false);
    });
  });

  describe('addSeries', () => {
    it('adds a new series when possible', () => {
      const result = manager.addSeries(['series1'], 'series2');
      expect(result).toEqual(['series1', 'series2']);
    });

    it('does not add duplicate series', () => {
      const result = manager.addSeries(['series1'], 'series1');
      expect(result).toEqual(['series1']);
    });

    it('does not add series when at limit', () => {
      const series = ['s1', 's2', 's3', 's4', 's5'];
      const result = manager.addSeries(series, 'newSeries');
      expect(result).toEqual(series);
    });
  });

  describe('removeSeries', () => {
    it('removes the specified series', () => {
      const result = manager.removeSeries(['s1', 's2', 's3'], 's2');
      expect(result).toEqual(['s1', 's3']);
    });

    it('returns unchanged array if series not found', () => {
      const series = ['s1', 's2'];
      const result = manager.removeSeries(series, 's3');
      expect(result).toEqual(series);
    });
  });

  describe('moveSeriesUp', () => {
    it('moves series up correctly', () => {
      const result = manager.moveSeriesUp(['s1', 's2', 's3'], 1);
      expect(result).toEqual(['s2', 's1', 's3']);
    });

    it('does not move first item up', () => {
      const series = ['s1', 's2', 's3'];
      const result = manager.moveSeriesUp(series, 0);
      expect(result).toEqual(series);
    });
  });

  describe('moveSeriesDown', () => {
    it('moves series down correctly', () => {
      const result = manager.moveSeriesDown(['s1', 's2', 's3'], 0);
      expect(result).toEqual(['s2', 's1', 's3']);
    });

    it('does not move last item down', () => {
      const series = ['s1', 's2', 's3'];
      const result = manager.moveSeriesDown(series, 2);
      expect(result).toEqual(series);
    });
  });

  describe('isChartTypeCompatible', () => {
    it('allows all chart types for single series', () => {
      expect(manager.isChartTypeCompatible('pie', 1)).toBe(true);
      expect(manager.isChartTypeCompatible('bar', 1)).toBe(true);
      expect(manager.isChartTypeCompatible('line', 1)).toBe(true);
    });

    it('restricts pie charts for multiple series', () => {
      expect(manager.isChartTypeCompatible('pie', 2)).toBe(false);
      expect(manager.isChartTypeCompatible('bar', 2)).toBe(true);
      expect(manager.isChartTypeCompatible('line', 2)).toBe(true);
    });
  });

  describe('getCompatibleChartTypes', () => {
    it('returns all types for single series', () => {
      const types = manager.getCompatibleChartTypes(1);
      expect(types).toEqual(['bar', 'line', 'pie']);
    });

    it('excludes pie chart for multiple series', () => {
      const types = manager.getCompatibleChartTypes(2);
      expect(types).toEqual(['bar', 'line']);
    });
  });

  describe('getSeriesInfo', () => {
    it('generates series info with colors and indices', () => {
      const info = manager.getSeriesInfo(['sales', 'profit']);
      
      expect(info).toHaveLength(2);
      expect(info[0]).toEqual({
        name: 'sales',
        color: '#8884d8',
        index: 0
      });
      expect(info[1]).toEqual({
        name: 'profit',
        color: '#82ca9d',
        index: 1
      });
    });
  });

  describe('generateLegendData', () => {
    it('generates legend data correctly', () => {
      const legend = manager.generateLegendData(['sales', 'profit']);
      
      expect(legend).toEqual([
        { name: 'sales', color: '#8884d8' },
        { name: 'profit', color: '#82ca9d' }
      ]);
    });
  });
});