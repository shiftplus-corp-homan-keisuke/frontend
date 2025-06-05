import React, { useState } from 'react';
import type { CompleteProfile } from './types';
import { defaultProfile } from './data/sampleData';
import ProfileCard from './components/ProfileCard';
import SkillList from './components/SkillList';
import ProfileEditor from './components/ProfileEditor';
import './styles/App.css';

/**
 * メインアプリケーションコンポーネント
 *
 * 学習者が実装する内容：
 * 1. プロフィール状態管理（useState使用）
 * 2. 編集モードの切り替え機能
 * 3. プロフィール更新処理
 * 4. 条件付きレンダリング（表示モード/編集モード）
 */
function App() {
  // TODO: 学習者が実装
  // ヒント: useState でプロフィールデータと編集モード状態を管理
  
  const [profile, setProfile] = useState<CompleteProfile>(defaultProfile);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // TODO: 以下の関数を実装してください
  
  // 編集モード開始
  const handleEditStart = () => {
    // 編集モードに切り替える処理を実装
  };

  // 編集キャンセル
  const handleEditCancel = () => {
    // 編集モードを終了する処理を実装
  };

  // プロフィール保存
  const handleProfileSave = (updatedProfile: CompleteProfile) => {
    // プロフィールを更新して編集モードを終了する処理を実装
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">プロフィールカード</h1>
        <p className="app-description">React × TypeScript 実践プロジェクト</p>
      </header>

      <main>
        {/* TODO: 条件付きレンダリングを実装 */}
        {/* 編集モードの場合: ProfileEditor を表示 */}
        {/* 表示モードの場合: ProfileCard と SkillList を表示 */}
        
        {/* 実装例のヒント */}
        <div>
          <ProfileCard
            profile={profile}
            onEdit={handleEditStart}
          />
          
          <SkillList skills={profile.skills} />
        </div>
        
        {/* 編集モード時の表示例 */}
        {/*
        <ProfileEditor
          profile={profile}
          onSave={handleProfileSave}
          onCancel={handleEditCancel}
        />
        */}
      </main>
    </div>
  );
}

export default App;
