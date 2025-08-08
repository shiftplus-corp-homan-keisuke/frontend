'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  CheckSquare, 
  BarChart3, 
  FolderOpen, 
  Calendar, 
  BookOpen, 
  Settings,
  Clock,
  X
} from 'lucide-react';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'ダッシュボード',
    href: '/',
    icon: Home,
  },
  {
    name: 'タスク管理',
    href: '/tasks',
    icon: CheckSquare,
    badge: '12',
  },
  {
    name: '学習時間記録',
    href: '/timer',
    icon: Clock,
  },
  {
    name: '進捗可視化',
    href: '/progress',
    icon: BarChart3,
  },
  {
    name: '成果物管理',
    href: '/artifacts',
    icon: FolderOpen,
  },
  {
    name: '学習計画',
    href: '/schedule',
    icon: Calendar,
  },
  {
    name: 'リソース',
    href: '/resources',
    icon: BookOpen,
  },
  {
    name: '設定',
    href: '/settings',
    icon: Settings,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  className 
}) => {
  const pathname = usePathname();

  return (
    <>
      {/* サイドバー */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* モバイル用クローズボタン */}
        <div className="flex justify-end p-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="サイドバーを閉じる"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* ナビゲーションメニュー */}
        <nav className="px-4 pb-4 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      // モバイルでリンクをクリックしたらサイドバーを閉じる
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                      isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* フッター情報 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>学習進捗管理システム</p>
            <p>v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};