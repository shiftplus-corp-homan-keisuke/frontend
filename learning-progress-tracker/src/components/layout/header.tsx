'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TimerStatus } from '@/components/timer';
import { Menu, Bell, User, Search } from 'lucide-react';

export interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen?: boolean;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  sidebarOpen,
  className 
}) => {
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-4">
        {/* 左側: メニューボタンとロゴ */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
            aria-label="メニューを開く"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LP</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white hidden sm:block">
              学習進捗管理
            </h1>
          </div>
        </div>

        {/* 中央: 検索バー（デスクトップのみ） */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="タスクやフェーズを検索..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* 右側: タイマーステータス、通知、ユーザーメニュー */}
        <div className="flex items-center space-x-4">
          {/* タイマーステータス */}
          <div className="hidden sm:block">
            <TimerStatus showDetails={true} />
          </div>

          <div className="flex items-center space-x-2">
            {/* 検索ボタン（モバイルのみ） */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="検索"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* 通知ボタン */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="通知"
            >
              <Bell className="h-5 w-5" />
              {/* 通知バッジ */}
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* ユーザーメニュー */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="ユーザーメニュー"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};