import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Main Application Integration', () => {
  it('renders the main page with all key sections', () => {
    render(<Home />);
    
    // Check if the main title is rendered
    expect(screen.getByText('CSV Chart Generator')).toBeInTheDocument();
    
    // Check if the progress indicator is rendered
    expect(screen.getByText('データ読み込み')).toBeInTheDocument();
    expect(screen.getByText('軸設定')).toBeInTheDocument();
    expect(screen.getByText('グラフ生成')).toBeInTheDocument();
    expect(screen.getByText('表示')).toBeInTheDocument();
    
    // Check if the CSV upload section is rendered
    expect(screen.getByText('1. CSVファイルをアップロード')).toBeInTheDocument();
    
    // Check if the chart preview area is rendered
    expect(screen.getByText('グラフプレビュー')).toBeInTheDocument();
    expect(screen.getByText('CSVファイルをアップロードしてください')).toBeInTheDocument();
  });

  it('has responsive layout structure', () => {
    render(<Home />);
    
    // Check if the main container has responsive classes
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('container');
    
    // Check if the grid layout is present
    const gridElement = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-12');
    expect(gridElement).toBeInTheDocument();
  });

  it('shows proper initial state', () => {
    render(<Home />);
    
    // Initially, no data should be loaded
    expect(screen.queryByText('2. データプレビュー')).not.toBeInTheDocument();
    expect(screen.queryByText('3. 軸の選択')).not.toBeInTheDocument();
    
    // Chart preview should show the initial message
    expect(screen.getByText('CSVファイルをアップロードしてください')).toBeInTheDocument();
  });
});