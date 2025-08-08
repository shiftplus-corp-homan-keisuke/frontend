// Export all stores from this file
export * from './learning-store';
export * from './ui-store';
export * from './timer-store';

// Combined store provider for easy access
export const useStores = () => ({
  learning: useLearningStore,
  ui: useUIStore,
  timer: useTimerStore,
});

// Import the hooks for the combined export
import { useLearningStore } from './learning-store';
import { useUIStore } from './ui-store';
import { useTimerStore } from './timer-store';