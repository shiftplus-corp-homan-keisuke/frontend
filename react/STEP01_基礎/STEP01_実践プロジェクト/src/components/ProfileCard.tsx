import React from 'react';
import type { CompleteProfile } from '../types';

// プロフィールカード表示コンポーネントのProps型定義
interface ProfileCardProps {
  profile: CompleteProfile;
  onEdit: () => void;
}

/**
 * プロフィールカード表示コンポーネント
 * 
 * 学習者が実装する内容：
 * 1. プロフィール情報の表示（名前、メール、自己紹介、場所）
 * 2. アバター表示（文字列の場合は名前の最初の文字を表示）
 * 3. 編集ボタンの実装
 * 4. 条件付きレンダリング（オプション項目の表示制御）
 */
function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  // TODO: 学習者が実装
  // ヒント: profile-card, profile-header, profile-info クラスを使用
  
  return (
    <div>
      {/* ここにプロフィールカードのJSXを実装してください */}
      <p>ProfileCard コンポーネントを実装してください</p>
    </div>
  );
}

export default ProfileCard;