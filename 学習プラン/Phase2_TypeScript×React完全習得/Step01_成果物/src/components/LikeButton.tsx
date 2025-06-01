import { useState } from 'react';

/**
 * いいねボタンコンポーネントのProps型定義
 */
interface LikeButtonProps {
  /** 初期いいね数（デフォルト: 0） */
  initialLikes?: number;
  /** いいね数変更時のコールバック関数（オプショナル） */
  onLikeChange?: (likes: number, isLiked: boolean) => void;
}

/**
 * いいねボタンコンポーネント
 * 
 * 【課題】以下の機能を実装してください：
 * 1. いいね数の表示と管理
 * 2. ボタンクリックでいいね数を増減
 * 3. いいね済み状態の視覚的表示
 * 4. TypeScriptによる型安全な実装
 * 
 * 【実装のヒント】
 * - useState を使用していいね数と状態を管理
 * - ボタンの色やアイコンを状態に応じて変更
 * - onLikeChange コールバックの呼び出し
 */
function LikeButton({
  initialLikes = 0,
  onLikeChange,
}: LikeButtonProps) {
  // TODO: ここに実装してください
  // 1. いいね数の状態管理
  // 2. いいね済み状態の管理
  // 3. クリックハンドラーの実装
  // 4. 適切なスタイリング

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#f8f9fa',
        border: '2px dashed #dee2e6',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#6c757d',
      }}
    >
      <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
        📝 課題: LikeButton コンポーネントを実装してください
      </p>
      <p style={{ margin: '0', fontSize: '12px' }}>
        このプレースホルダーを実際のいいねボタンに置き換えてください
      </p>
    </div>
  );
}

export default LikeButton;