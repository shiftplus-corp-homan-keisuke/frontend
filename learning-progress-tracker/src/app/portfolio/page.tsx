'use client';

import React from 'react';
import { Portfolio } from '@/components/artifacts/Portfolio';

// 現在はハードコードされたユーザーIDを使用
// 実際のアプリケーションでは認証システムから取得
const CURRENT_USER_ID = 'user-1';

export default function PortfolioPage() {
  return (
    <Portfolio 
      userId={CURRENT_USER_ID}
      isPublic={false}
      showHeader={true}
      theme="light"
    />
  );
}