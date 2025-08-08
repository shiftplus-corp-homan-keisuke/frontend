'use client';

import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Bell, Palette, Database, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* ページヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              設定
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              アプリケーションの設定とプリファレンス
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 設定メニュー */}
          <div className="space-y-2">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  <a
                    href="#profile"
                    className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg"
                  >
                    <User className="h-4 w-4" />
                    <span>プロフィール</span>
                  </a>
                  <a
                    href="#notifications"
                    className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Bell className="h-4 w-4" />
                    <span>通知設定</span>
                  </a>
                  <a
                    href="#appearance"
                    className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Palette className="h-4 w-4" />
                    <span>外観</span>
                  </a>
                  <a
                    href="#data"
                    className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Database className="h-4 w-4" />
                    <span>データ管理</span>
                  </a>
                  <a
                    href="#privacy"
                    className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Shield className="h-4 w-4" />
                    <span>プライバシー</span>
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* 設定内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* プロフィール設定 */}
            <Card id="profile">
              <CardHeader>
                <CardTitle>プロフィール設定</CardTitle>
                <CardDescription>
                  個人情報と学習目標の設定
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="名前"
                    defaultValue="田中太郎"
                    placeholder="お名前を入力"
                  />
                  <Input
                    label="メールアドレス"
                    type="email"
                    defaultValue="tanaka@example.com"
                    placeholder="メールアドレスを入力"
                  />
                </div>
                <Input
                  label="学習目標"
                  defaultValue="2025年末までにフロントエンドエンジニアとして転職"
                  placeholder="学習目標を入力"
                />
                <div className="flex justify-end">
                  <Button>変更を保存</Button>
                </div>
              </CardContent>
            </Card>

            {/* 通知設定 */}
            <Card id="notifications">
              <CardHeader>
                <CardTitle>通知設定</CardTitle>
                <CardDescription>
                  学習リマインダーと進捗通知の設定
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">学習リマインダー</h4>
                    <p className="text-sm text-gray-600">
                      毎日の学習時間をリマインド
                    </p>
                  </div>
                  <Badge variant="success">有効</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">進捗レポート</h4>
                    <p className="text-sm text-gray-600">
                      週次の進捗レポートを送信
                    </p>
                  </div>
                  <Badge variant="success">有効</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">タスク期限通知</h4>
                    <p className="text-sm text-gray-600">
                      タスクの期限が近づいた時に通知
                    </p>
                  </div>
                  <Badge variant="secondary">無効</Badge>
                </div>
                <div className="flex justify-end">
                  <Button>設定を更新</Button>
                </div>
              </CardContent>
            </Card>

            {/* 外観設定 */}
            <Card id="appearance">
              <CardHeader>
                <CardTitle>外観設定</CardTitle>
                <CardDescription>
                  テーマとレイアウトの設定
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">テーマ</h4>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      ライト
                    </Button>
                    <Button variant="outline" size="sm">
                      ダーク
                    </Button>
                    <Button size="sm">
                      システム設定に従う
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">言語</h4>
                  <div className="flex space-x-2">
                    <Button size="sm">
                      日本語
                    </Button>
                    <Button variant="outline" size="sm">
                      English
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>設定を保存</Button>
                </div>
              </CardContent>
            </Card>

            {/* データ管理 */}
            <Card id="data">
              <CardHeader>
                <CardTitle>データ管理</CardTitle>
                <CardDescription>
                  学習データのバックアップとエクスポート
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">データエクスポート</h4>
                    <p className="text-sm text-gray-600">
                      学習データをJSON形式でエクスポート
                    </p>
                  </div>
                  <Button variant="outline">エクスポート</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">データインポート</h4>
                    <p className="text-sm text-gray-600">
                      バックアップデータをインポート
                    </p>
                  </div>
                  <Button variant="outline">インポート</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-600">データリセット</h4>
                    <p className="text-sm text-gray-600">
                      すべての学習データを削除
                    </p>
                  </div>
                  <Button variant="destructive">リセット</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}