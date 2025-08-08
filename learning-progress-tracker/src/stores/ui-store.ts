import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ViewType, ThemeType, Notification } from '@/types';

interface UIStore {
  // State
  sidebarOpen: boolean;
  currentView: ViewType;
  theme: ThemeType;
  notifications: Notification[];
  isLoading: boolean;
  modalOpen: boolean;
  modalContent: React.ReactNode | null;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: ViewType) => void;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  setLoading: (loading: boolean) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  
  // Computed
  getUnreadNotificationsCount: () => number;
  getRecentNotifications: (limit?: number) => Notification[];
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        sidebarOpen: true,
        currentView: 'dashboard',
        theme: 'system',
        notifications: [],
        isLoading: false,
        modalOpen: false,
        modalContent: null,
        
        // Actions
        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar');
        },
        
        setSidebarOpen: (open) => {
          set({ sidebarOpen: open }, false, 'setSidebarOpen');
        },
        
        setCurrentView: (view) => {
          set({ currentView: view }, false, 'setCurrentView');
        },
        
        setTheme: (theme) => {
          set({ theme }, false, 'setTheme');
          
          // システムテーマの場合、実際のテーマを適用
          if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            document.documentElement.classList.toggle('dark', systemTheme === 'dark');
          } else {
            document.documentElement.classList.toggle('dark', theme === 'dark');
          }
        },
        
        toggleTheme: () => {
          const state = get();
          let newTheme: ThemeType;
          
          switch (state.theme) {
            case 'light':
              newTheme = 'dark';
              break;
            case 'dark':
              newTheme = 'system';
              break;
            case 'system':
            default:
              newTheme = 'light';
              break;
          }
          
          get().setTheme(newTheme);
        },
        
        addNotification: (notificationData) => {
          const newNotification: Notification = {
            ...notificationData,
            id: `notification_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            createdAt: new Date(),
          };
          
          set((state) => ({
            notifications: [newNotification, ...state.notifications].slice(0, 50) // 最新50件を保持
          }), false, 'addNotification');
          
          // 自動削除（エラー以外の通知は5秒後に削除）
          if (notificationData.type !== 'error') {
            setTimeout(() => {
              get().removeNotification(newNotification.id);
            }, 5000);
          }
        },
        
        removeNotification: (id) => {
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
          }), false, 'removeNotification');
        },
        
        clearAllNotifications: () => {
          set({ notifications: [] }, false, 'clearAllNotifications');
        },
        
        markNotificationAsRead: (id) => {
          set((state) => ({
            notifications: state.notifications.map(notification =>
              notification.id === id 
                ? { ...notification, read: true }
                : notification
            )
          }), false, 'markNotificationAsRead');
        },
        
        markAllNotificationsAsRead: () => {
          set((state) => ({
            notifications: state.notifications.map(notification => ({
              ...notification,
              read: true
            }))
          }), false, 'markAllNotificationsAsRead');
        },
        
        setLoading: (loading) => {
          set({ isLoading: loading }, false, 'setLoading');
        },
        
        openModal: (content) => {
          set({ 
            modalOpen: true, 
            modalContent: content 
          }, false, 'openModal');
        },
        
        closeModal: () => {
          set({ 
            modalOpen: false, 
            modalContent: null 
          }, false, 'closeModal');
        },
        
        // Computed functions
        getUnreadNotificationsCount: () => {
          const state = get();
          return state.notifications.filter(n => !n.read).length;
        },
        
        getRecentNotifications: (limit = 10) => {
          const state = get();
          return state.notifications.slice(0, limit);
        },
      }),
      {
        name: 'ui-store',
        // テーマとサイドバー状態のみを永続化
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
);