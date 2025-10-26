/**
 * Accessibility utilities for the CSV Chart Generator
 */

/**
 * Announces a message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove the announcement after it's been read
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}

/**
 * Manages focus for keyboard navigation
 */
export class FocusManager {
  private focusableElements: HTMLElement[] = [];
  private currentIndex = 0;

  constructor(container: HTMLElement) {
    this.updateFocusableElements(container);
  }

  updateFocusableElements(container: HTMLElement): void {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="radio"]:not([disabled])',
      '[role="checkbox"]:not([disabled])'
    ].join(', ');

    this.focusableElements = Array.from(
      container.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
  }

  focusNext(): boolean {
    if (this.focusableElements.length === 0) return false;
    
    this.currentIndex = (this.currentIndex + 1) % this.focusableElements.length;
    this.focusableElements[this.currentIndex]?.focus();
    return true;
  }

  focusPrevious(): boolean {
    if (this.focusableElements.length === 0) return false;
    
    this.currentIndex = this.currentIndex === 0 
      ? this.focusableElements.length - 1 
      : this.currentIndex - 1;
    this.focusableElements[this.currentIndex]?.focus();
    return true;
  }

  focusFirst(): boolean {
    if (this.focusableElements.length === 0) return false;
    
    this.currentIndex = 0;
    this.focusableElements[0]?.focus();
    return true;
  }

  focusLast(): boolean {
    if (this.focusableElements.length === 0) return false;
    
    this.currentIndex = this.focusableElements.length - 1;
    this.focusableElements[this.currentIndex]?.focus();
    return true;
  }

  getCurrentFocusedElement(): HTMLElement | null {
    return this.focusableElements[this.currentIndex] || null;
  }
}

/**
 * Keyboard navigation handler for components
 */
export function handleArrowKeyNavigation(
  event: KeyboardEvent,
  focusManager: FocusManager
): boolean {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      return focusManager.focusNext();
    case 'ArrowUp':
      event.preventDefault();
      return focusManager.focusPrevious();
    case 'Home':
      event.preventDefault();
      return focusManager.focusFirst();
    case 'End':
      event.preventDefault();
      return focusManager.focusLast();
    default:
      return false;
  }
}

/**
 * Creates a unique ID for accessibility purposes
 */
export function createAccessibilityId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validates color contrast for accessibility
 */
export function validateColorContrast(foreground: string, background: string): {
  ratio: number;
  isAACompliant: boolean;
  isAAACompliant: boolean;
} {
  // Simple contrast ratio calculation (simplified version)
  // In a real implementation, you'd use a proper color contrast library
  const getLuminance = (color: string): number => {
    // This is a simplified calculation
    // In practice, you'd parse the color properly and calculate luminance
    return 0.5; // Placeholder
  };

  const foregroundLuminance = getLuminance(foreground);
  const backgroundLuminance = getLuminance(background);
  
  const ratio = (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
                (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);

  return {
    ratio,
    isAACompliant: ratio >= 4.5,
    isAAACompliant: ratio >= 7
  };
}

/**
 * Provides screen reader friendly descriptions for chart data
 */
export function generateChartDescription(
  chartType: 'bar' | 'line' | 'pie',
  xAxis: string,
  yAxes: string[],
  dataLength: number
): string {
  const chartTypeNames = {
    bar: '棒グラフ',
    line: '折れ線グラフ',
    pie: '円グラフ'
  };

  const description = [
    `${chartTypeNames[chartType]}が表示されています。`,
    `X軸は${xAxis}を表示し、`,
    yAxes.length === 1 
      ? `Y軸は${yAxes[0]}を表示しています。`
      : `Y軸は${yAxes.join('、')}の${yAxes.length}つの系列を表示しています。`,
    `データポイントは${dataLength}個あります。`
  ].join('');

  return description;
}

/**
 * Provides keyboard shortcuts help text
 */
export function getKeyboardShortcutsHelp(): string {
  return [
    'キーボードショートカット:',
    'Alt + 1-5: ステップ間の移動',
    'Alt + ↑↓: 前後のステップに移動',
    'Tab: 次の要素にフォーカス',
    'Shift + Tab: 前の要素にフォーカス',
    'Enter/Space: ボタンやリンクの実行',
    'Esc: ダイアログやメニューを閉じる'
  ].join(' ');
}

/**
 * Manages live regions for dynamic content updates
 */
export class LiveRegionManager {
  private politeRegion: HTMLElement;
  private assertiveRegion: HTMLElement;

  constructor() {
    this.politeRegion = this.createLiveRegion('polite');
    this.assertiveRegion = this.createLiveRegion('assertive');
  }

  private createLiveRegion(priority: 'polite' | 'assertive'): HTMLElement {
    const region = document.createElement('div');
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.id = `live-region-${priority}`;
    document.body.appendChild(region);
    return region;
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const region = priority === 'polite' ? this.politeRegion : this.assertiveRegion;
    region.textContent = message;
    
    // Clear the message after announcement
    setTimeout(() => {
      region.textContent = '';
    }, 1000);
  }

  destroy(): void {
    if (this.politeRegion.parentNode) {
      this.politeRegion.parentNode.removeChild(this.politeRegion);
    }
    if (this.assertiveRegion.parentNode) {
      this.assertiveRegion.parentNode.removeChild(this.assertiveRegion);
    }
  }
}

/**
 * Performance monitoring for accessibility
 */
export class AccessibilityPerformanceMonitor {
  private startTime: number = 0;
  private metrics: { [key: string]: number } = {};

  startTiming(operation: string): void {
    this.startTime = performance.now();
    this.metrics[`${operation}_start`] = this.startTime;
  }

  endTiming(operation: string): number {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    this.metrics[`${operation}_duration`] = duration;
    
    // Log slow operations that might affect accessibility
    if (duration > 100) {
      console.warn(`Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  getMetrics(): { [key: string]: number } {
    return { ...this.metrics };
  }

  reportAccessibilityMetrics(): void {
    const report = {
      totalOperations: Object.keys(this.metrics).filter(key => key.endsWith('_duration')).length,
      slowOperations: Object.entries(this.metrics)
        .filter(([key, value]) => key.endsWith('_duration') && value > 100)
        .map(([key, value]) => ({ operation: key.replace('_duration', ''), duration: value })),
      averageResponseTime: this.calculateAverageResponseTime()
    };
    
    console.log('Accessibility Performance Report:', report);
  }

  private calculateAverageResponseTime(): number {
    const durations = Object.entries(this.metrics)
      .filter(([key]) => key.endsWith('_duration'))
      .map(([, value]) => value);
    
    return durations.length > 0 
      ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length 
      : 0;
  }
}