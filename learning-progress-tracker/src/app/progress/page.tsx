'use client';

import { useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { BarChart3, Calendar } from 'lucide-react';
import { StudyTimeChart, PhaseProgressChart } from '@/components/dashboard';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { useLearningStore } from '@/stores';

export default function ProgressPage() {
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
              進捗可視化
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              学習進捗の詳細な分析と可視化
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              期間選択
            </Button>
            <Button>
              <BarChart3 className="mr-2 h-4 w-4" />
              レポート出力
            </Button>
          </div>
        </div>

        {/* 全体統計 */}
        <DashboardOverview userId={userId} />

        {/* フェーズ別進捗チャート */}
        <PhaseProgressChart userId={userId} height={350} />

        {/* 学習時間チャート */}
        <StudyTimeChart userId={userId} height={350} />
      </div>
    </MainLayout>
  );
}