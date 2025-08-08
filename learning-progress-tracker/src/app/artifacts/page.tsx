'use client';

import React from 'react';
import { ArtifactManager } from '@/components/artifacts/ArtifactManager';

// 現在はハードコードされたユーザーIDを使用
// 実際のアプリケーションでは認証システムから取得
const CURRENT_USER_ID = 'user-1';

export default function ArtifactsPage() {
  return (
    <ArtifactManager 
      userId={CURRENT_USER_ID}
      showStats={true}
      showUploadButton={true}
    />
  );
}