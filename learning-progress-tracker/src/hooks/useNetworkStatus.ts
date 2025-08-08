/**
 * ネットワーク状態を監視し、オンライン/オフライン状態を管理するカスタムフック
 */

import { useEffect, useState } from 'react';
import { networkStatusManager, dataSyncManager } from '@/lib/storage';
import { useLearningStore } from '@/stores/learning-store';
import { useUIStore } from '@/stores/ui-store';

export interface NetworkStatus {
  isOnline: boolean;
  isConnecting: boolean;
  lastOnlineTime: Date | null;
  connectionType: string | null;
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: networkStatusManager.getStatus(),
    isConnecting: false,
    lastOnlineTime: null,
    connectionType: null,
  });

  const setOnlineStatus = useLearningStore(state => state.setOnlineStatus);
  const addNotification = useUIStore(state => state.addNotification);

  useEffect(() => {
    // 初期状態を設定
    const initialStatus = networkStatusManager.getStatus();
    setNetworkStatus(prev => ({
      ...prev,
      isOnline: initialStatus,
      lastOnlineTime: initialStatus ? new Date() : null,
    }));
    setOnlineStatus(initialStatus);

    // ネットワーク状態の変更を監視
    const removeListener = networkStatusManager.addListener((isOnline) => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline,
        isConnecting: false,
        lastOnlineTime: isOnline ? new Date() : prev.lastOnlineTime,
      }));
      
      setOnlineStatus(isOnline);

      // ユーザーに通知
      if (isOnline) {
        addNotification({
          userId: 'system',
          title: 'オンラインに復帰',
          message: 'インターネット接続が復旧しました。データを同期しています...',
          type: 'success',
          read: false,
        });
        
        // オンライン復帰時に自動同期
        dataSyncManager.processOfflineQueue().catch(error => {
          console.error('Auto sync failed after coming online', error);
          addNotification({
            userId: 'system',
            title: '同期エラー',
            message: 'データの同期に失敗しました。手動で同期を試してください。',
            type: 'error',
            read: false,
          });
        });
      } else {
        addNotification({
          userId: 'system',
          title: 'オフライン',
          message: 'インターネット接続が切断されました。オフラインモードで動作します。',
          type: 'warning',
          read: false,
        });
      }
    });

    // Connection API が利用可能な場合、接続タイプを取得
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        setNetworkStatus(prev => ({
          ...prev,
          connectionType: connection.effectiveType || connection.type || null,
        }));

        const handleConnectionChange = () => {
          setNetworkStatus(prev => ({
            ...prev,
            connectionType: connection.effectiveType || connection.type || null,
          }));
        };

        connection.addEventListener('change', handleConnectionChange);
        
        return () => {
          removeListener();
          connection.removeEventListener('change', handleConnectionChange);
        };
      }
    }

    return removeListener;
  }, [setOnlineStatus, addNotification]);

  return networkStatus;
}

/**
 * データ同期状態を管理するカスタムフック
 */
export function useSyncStatus() {
  const [syncStatus, setSyncStatus] = useState(() => dataSyncManager.getSyncStatus());
  const manualSync = useLearningStore(state => state.manualSync);
  const addNotification = useUIStore(state => state.addNotification);

  useEffect(() => {
    // 定期的に同期状態を更新
    const interval = setInterval(() => {
      setSyncStatus(dataSyncManager.getSyncStatus());
    }, 5000); // 5秒ごとに更新

    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async () => {
    try {
      setSyncStatus(prev => ({ ...prev, inProgress: true }));
      
      const success = await manualSync();
      
      if (success) {
        addNotification({
          userId: 'system',
          title: '同期完了',
          message: 'データの同期が正常に完了しました。',
          type: 'success',
          read: false,
        });
      } else {
        addNotification({
          userId: 'system',
          title: '同期失敗',
          message: 'データの同期に失敗しました。ネットワーク接続を確認してください。',
          type: 'error',
          read: false,
        });
      }
    } catch (error) {
      console.error('Manual sync error', error);
      addNotification({
        userId: 'system',
        title: '同期エラー',
        message: 'データの同期中にエラーが発生しました。',
        type: 'error',
        read: false,
      });
    } finally {
      setSyncStatus(prev => ({ ...prev, inProgress: false }));
    }
  };

  return {
    ...syncStatus,
    manualSync: handleManualSync,
  };
}

/**
 * オフライン対応のデータ操作フック
 */
export function useOfflineCapableActions() {
  const networkStatus = useNetworkStatus();
  const addNotification = useUIStore(state => state.addNotification);

  const executeWithOfflineSupport = async <T>(
    action: () => Promise<T>,
    offlineAction: () => void,
    actionName: string
  ): Promise<T | null> => {
    try {
      if (networkStatus.isOnline) {
        return await action();
      } else {
        // オフライン時はローカルで実行し、キューに追加
        offlineAction();
        
        addNotification({
          userId: 'system',
          title: 'オフライン操作',
          message: `${actionName}をオフラインで実行しました。オンライン復帰時に同期されます。`,
          type: 'info',
          read: false,
        });
        
        return null;
      }
    } catch (error) {
      console.error(`Error executing ${actionName}`, error);
      
      // エラー時もオフライン操作として処理
      offlineAction();
      
      addNotification({
        userId: 'system',
        title: '操作エラー',
        message: `${actionName}でエラーが発生しました。オフライン操作として記録されます。`,
        type: 'warning',
        read: false,
      });
      
      return null;
    }
  };

  return {
    executeWithOfflineSupport,
    isOnline: networkStatus.isOnline,
  };
}

/**
 * ローカルストレージの使用量を監視するフック
 */
export function useStorageUsage() {
  const [storageInfo, setStorageInfo] = useState<{
    used: number;
    available: number;
    percentage: number;
  } | null>(null);

  useEffect(() => {
    const updateStorageInfo = async () => {
      try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          const used = estimate.usage || 0;
          const quota = estimate.quota || 0;
          const available = quota - used;
          const percentage = quota > 0 ? (used / quota) * 100 : 0;

          setStorageInfo({
            used,
            available,
            percentage,
          });
        }
      } catch (error) {
        console.error('Failed to get storage estimate', error);
      }
    };

    updateStorageInfo();
    
    // 定期的に更新
    const interval = setInterval(updateStorageInfo, 30000); // 30秒ごと

    return () => clearInterval(interval);
  }, []);

  return storageInfo;
}

/**
 * データのエクスポート/インポート機能を提供するフック
 */
export function useDataPortability() {
  const exportData = useLearningStore(state => state.exportData);
  const importData = useLearningStore(state => state.importData);
  const addNotification = useUIStore(state => state.addNotification);

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `learning-progress-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      addNotification({
        userId: 'system',
        title: 'エクスポート完了',
        message: '学習データのエクスポートが完了しました。',
        type: 'success',
        read: false,
      });
    } catch (error) {
      console.error('Export failed', error);
      addNotification({
        userId: 'system',
        title: 'エクスポートエラー',
        message: 'データのエクスポートに失敗しました。',
        type: 'error',
        read: false,
      });
    }
  };

  const handleImport = (file: File) => {
    return new Promise<boolean>((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          const success = importData(data);
          
          if (success) {
            addNotification({
              userId: 'system',
              title: 'インポート完了',
              message: '学習データのインポートが完了しました。',
              type: 'success',
              read: false,
            });
          } else {
            addNotification({
              userId: 'system',
              title: 'インポートエラー',
              message: 'データのインポートに失敗しました。ファイル形式を確認してください。',
              type: 'error',
              read: false,
            });
          }
          
          resolve(success);
        } catch (error) {
          console.error('Import failed', error);
          addNotification({
            userId: 'system',
            title: 'インポートエラー',
            message: 'データのインポート中にエラーが発生しました。',
            type: 'error',
            read: false,
          });
          resolve(false);
        }
      };
      
      reader.onerror = () => {
        addNotification({
          userId: 'system',
          title: 'ファイル読み込みエラー',
          message: 'ファイルの読み込みに失敗しました。',
          type: 'error',
          read: false,
        });
        resolve(false);
      };
      
      reader.readAsText(file);
    });
  };

  return {
    exportData: handleExport,
    importData: handleImport,
  };
}