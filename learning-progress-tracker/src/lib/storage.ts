/**
 * ローカルストレージとの同期機能を提供するユーティリティ
 * オフライン対応とデータ永続化をサポート
 */

import type { 
  Phase, 
  Task, 
  Progress, 
  StudySession, 
  Activity, 
  User 
} from '@/types';

// ストレージキーの定義
export const STORAGE_KEYS = {
  USER: 'learning-tracker-user',
  PHASES: 'learning-tracker-phases',
  TASKS: 'learning-tracker-tasks',
  PROGRESS: 'learning-tracker-progress',
  SESSIONS: 'learning-tracker-sessions',
  ACTIVITIES: 'learning-tracker-activities',
  LAST_SYNC: 'learning-tracker-last-sync',
  OFFLINE_QUEUE: 'learning-tracker-offline-queue',
} as const;

// オフライン操作のキューアイテム
export interface OfflineQueueItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'task' | 'session' | 'progress' | 'activity';
  data: any;
  timestamp: Date;
  retryCount: number;
}

// ストレージ操作のインターフェース
export interface StorageManager {
  // 基本操作
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  
  // エンティティ固有の操作
  getUser(): User | null;
  setUser(user: User): void;
  getPhases(): Phase[];
  setPhases(phases: Phase[]): void;
  getTasks(): Task[];
  setTasks(tasks: Task[]): void;
  getProgress(): Progress[];
  setProgress(progress: Progress[]): void;
  getSessions(): StudySession[];
  setSessions(sessions: StudySession[]): void;
  getActivities(): Activity[];
  setActivities(activities: Activity[]): void;
  
  // 同期関連
  getLastSyncTime(): Date | null;
  setLastSyncTime(time: Date): void;
  getOfflineQueue(): OfflineQueueItem[];
  addToOfflineQueue(item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'retryCount'>): void;
  removeFromOfflineQueue(id: string): void;
  clearOfflineQueue(): void;
  
  // ユーティリティ
  isOnline(): boolean;
  exportData(): string;
  importData(data: string): boolean;
}

class LocalStorageManager implements StorageManager {
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  get<T>(key: string): T | null {
    if (!this.isAvailable()) return null;
    
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      
      const parsed = JSON.parse(item);
      
      // 日付文字列を Date オブジェクトに変換
      return this.reviveDates(parsed);
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.isAvailable()) return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
      
      // ストレージが満杯の場合、古いデータを削除
      if (error instanceof DOMException && error.code === 22) {
        this.cleanupOldData();
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (retryError) {
          console.error(`Failed to set item after cleanup: ${key}`, retryError);
        }
      }
    }
  }

  remove(key: string): void {
    if (!this.isAvailable()) return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  }

  clear(): void {
    if (!this.isAvailable()) return;
    
    try {
      // 学習トラッカー関連のキーのみを削除
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }

  // エンティティ固有の操作
  getUser(): User | null {
    return this.get<User>(STORAGE_KEYS.USER);
  }

  setUser(user: User): void {
    this.set(STORAGE_KEYS.USER, user);
  }

  getPhases(): Phase[] {
    return this.get<Phase[]>(STORAGE_KEYS.PHASES) || [];
  }

  setPhases(phases: Phase[]): void {
    this.set(STORAGE_KEYS.PHASES, phases);
  }

  getTasks(): Task[] {
    return this.get<Task[]>(STORAGE_KEYS.TASKS) || [];
  }

  setTasks(tasks: Task[]): void {
    this.set(STORAGE_KEYS.TASKS, tasks);
  }

  getProgress(): Progress[] {
    return this.get<Progress[]>(STORAGE_KEYS.PROGRESS) || [];
  }

  setProgress(progress: Progress[]): void {
    this.set(STORAGE_KEYS.PROGRESS, progress);
  }

  getSessions(): StudySession[] {
    return this.get<StudySession[]>(STORAGE_KEYS.SESSIONS) || [];
  }

  setSessions(sessions: StudySession[]): void {
    this.set(STORAGE_KEYS.SESSIONS, sessions);
  }

  getActivities(): Activity[] {
    return this.get<Activity[]>(STORAGE_KEYS.ACTIVITIES) || [];
  }

  setActivities(activities: Activity[]): void {
    this.set(STORAGE_KEYS.ACTIVITIES, activities);
  }

  // 同期関連
  getLastSyncTime(): Date | null {
    const timestamp = this.get<string>(STORAGE_KEYS.LAST_SYNC);
    return timestamp ? new Date(timestamp) : null;
  }

  setLastSyncTime(time: Date): void {
    this.set(STORAGE_KEYS.LAST_SYNC, time.toISOString());
  }

  getOfflineQueue(): OfflineQueueItem[] {
    return this.get<OfflineQueueItem[]>(STORAGE_KEYS.OFFLINE_QUEUE) || [];
  }

  addToOfflineQueue(item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'retryCount'>): void {
    const queue = this.getOfflineQueue();
    const newItem: OfflineQueueItem = {
      ...item,
      id: `offline_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      timestamp: new Date(),
      retryCount: 0,
    };
    
    queue.push(newItem);
    this.set(STORAGE_KEYS.OFFLINE_QUEUE, queue);
  }

  removeFromOfflineQueue(id: string): void {
    const queue = this.getOfflineQueue();
    const filteredQueue = queue.filter(item => item.id !== id);
    this.set(STORAGE_KEYS.OFFLINE_QUEUE, filteredQueue);
  }

  clearOfflineQueue(): void {
    this.set(STORAGE_KEYS.OFFLINE_QUEUE, []);
  }

  // ユーティリティ
  isOnline(): boolean {
    return navigator.onLine;
  }

  exportData(): string {
    const data = {
      user: this.getUser(),
      phases: this.getPhases(),
      tasks: this.getTasks(),
      progress: this.getProgress(),
      sessions: this.getSessions(),
      activities: this.getActivities(),
      lastSync: this.getLastSyncTime(),
      exportedAt: new Date(),
    };
    
    return JSON.stringify(data, null, 2);
  }

  importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      
      if (parsed.user) this.setUser(parsed.user);
      if (parsed.phases) this.setPhases(parsed.phases);
      if (parsed.tasks) this.setTasks(parsed.tasks);
      if (parsed.progress) this.setProgress(parsed.progress);
      if (parsed.sessions) this.setSessions(parsed.sessions);
      if (parsed.activities) this.setActivities(parsed.activities);
      if (parsed.lastSync) this.setLastSyncTime(new Date(parsed.lastSync));
      
      return true;
    } catch (error) {
      console.error('Error importing data', error);
      return false;
    }
  }

  // プライベートメソッド
  private reviveDates(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'string') {
      // ISO 8601 日付文字列を検出
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
      if (isoDateRegex.test(obj)) {
        return new Date(obj);
      }
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.reviveDates(item));
    }
    
    if (typeof obj === 'object') {
      const result: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          result[key] = this.reviveDates(obj[key]);
        }
      }
      return result;
    }
    
    return obj;
  }

  private cleanupOldData(): void {
    try {
      // 古いセッションデータを削除（30日以上前）
      const sessions = this.getSessions();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentSessions = sessions.filter(session => 
        new Date(session.createdAt) > thirtyDaysAgo
      );
      
      if (recentSessions.length < sessions.length) {
        this.setSessions(recentSessions);
      }
      
      // 古いアクティビティを削除（最新100件のみ保持）
      const activities = this.getActivities();
      if (activities.length > 100) {
        const recentActivities = activities
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 100);
        this.setActivities(recentActivities);
      }
      
      // 処理済みのオフラインキューアイテムを削除
      const queue = this.getOfflineQueue();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentQueue = queue.filter(item => 
        new Date(item.timestamp) > sevenDaysAgo
      );
      
      if (recentQueue.length < queue.length) {
        this.set(STORAGE_KEYS.OFFLINE_QUEUE, recentQueue);
      }
    } catch (error) {
      console.error('Error during cleanup', error);
    }
  }
}

// シングルトンインスタンス
export const storageManager = new LocalStorageManager();

// オンライン/オフライン状態の監視
export class NetworkStatusManager {
  private listeners: Array<(isOnline: boolean) => void> = [];
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
    });
  }

  public getStatus(): boolean {
    return this.isOnline;
  }

  public addListener(callback: (isOnline: boolean) => void): () => void {
    this.listeners.push(callback);
    
    // リスナーを削除する関数を返す
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(isOnline: boolean): void {
    this.listeners.forEach(listener => {
      try {
        listener(isOnline);
      } catch (error) {
        console.error('Error in network status listener', error);
      }
    });
  }
}

// シングルトンインスタンス
export const networkStatusManager = new NetworkStatusManager();

// データ同期マネージャー
export class DataSyncManager {
  private syncInProgress: boolean = false;
  private syncQueue: Array<() => Promise<void>> = [];

  constructor(
    private storage: StorageManager,
    private networkStatus: NetworkStatusManager
  ) {
    // オンラインになったときに自動同期
    this.networkStatus.addListener((isOnline) => {
      if (isOnline && !this.syncInProgress) {
        this.processOfflineQueue();
      }
    });
  }

  // オフラインキューの処理
  async processOfflineQueue(): Promise<void> {
    if (this.syncInProgress || !this.networkStatus.getStatus()) {
      return;
    }

    this.syncInProgress = true;
    const queue = this.storage.getOfflineQueue();

    try {
      for (const item of queue) {
        try {
          await this.processQueueItem(item);
          this.storage.removeFromOfflineQueue(item.id);
        } catch (error) {
          console.error(`Failed to process queue item ${item.id}`, error);
          
          // リトライ回数を増やす
          item.retryCount++;
          
          // 最大リトライ回数に達した場合は削除
          if (item.retryCount >= 3) {
            this.storage.removeFromOfflineQueue(item.id);
          }
        }
      }
      
      // 同期時刻を更新
      this.storage.setLastSyncTime(new Date());
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processQueueItem(item: OfflineQueueItem): Promise<void> {
    // 実際のAPI呼び出しはここで実装
    // 現在はモック実装
    console.log(`Processing offline queue item: ${item.type} ${item.entity}`, item.data);
    
    // 実際の実装では、APIクライアントを使用してサーバーと同期
    // await apiClient.syncData(item);
  }

  // 手動同期
  async manualSync(): Promise<boolean> {
    try {
      await this.processOfflineQueue();
      return true;
    } catch (error) {
      console.error('Manual sync failed', error);
      return false;
    }
  }

  // 同期状態の取得
  getSyncStatus(): {
    inProgress: boolean;
    lastSync: Date | null;
    queueLength: number;
    isOnline: boolean;
  } {
    return {
      inProgress: this.syncInProgress,
      lastSync: this.storage.getLastSyncTime(),
      queueLength: this.storage.getOfflineQueue().length,
      isOnline: this.networkStatus.getStatus(),
    };
  }
}

// シングルトンインスタンス
export const dataSyncManager = new DataSyncManager(storageManager, networkStatusManager);