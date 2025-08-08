'use client';

import { useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
import { DashboardOverview, RecentActivities, UpcomingDeadlines, TimerCard } from '@/components/dashboard';
import { useLearningStore } from '@/stores';

export default function Home() {
  const { currentUser, loadFromStorage } = useLearningStore();

  // コンポーネントマウント時にローカルストレージからデータを読み込み
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // デフォルトユーザーID（実際の実装では認証システムから取得）
  const userId = currentUser?.id || 'user-1';

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* ページヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              ダッシュボード
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              学習進捗の概要と最新の活動を確認できます
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button>
              <Target className="mr-2 h-4 w-4" />
              新しい目標を設定
            </Button>
          </div>
        </div>

        {/* 統計カード */}
        <DashboardOverview userId={userId} />

        {/* メインコンテンツエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* タイマーカード */}
          <TimerCard className="lg:col-span-1" />

          {/* 最近の活動 */}
          <RecentActivities limit={8} className="lg:col-span-1" />

          {/* 今後の予定 */}
          <UpcomingDeadlines limit={6} className="lg:col-span-1" />
        </div>
      </div>
    </MainLayout>
  );
}
