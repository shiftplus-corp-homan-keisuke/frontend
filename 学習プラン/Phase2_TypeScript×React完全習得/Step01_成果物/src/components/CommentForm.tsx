import { useState } from 'react';
import { Comment } from '@/types';

/**
 * コメントフォームコンポーネントのProps型定義
 */
interface CommentFormProps {
  /** コメント投稿時のコールバック関数 */
  onSubmit: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  /** 投稿者名のプレースホルダー（デフォルト: "名前を入力"） */
  authorPlaceholder?: string;
  /** コメント内容のプレースホルダー（デフォルト: "コメントを入力"） */
  contentPlaceholder?: string;
}

/**
 * コメント投稿フォームコンポーネント
 * 
 * 【課題】以下の機能を実装してください：
 * 1. コメント入力フィールド（投稿者名、コメント内容）
 * 2. 投稿ボタン
 * 3. フォーム送信時の処理
 * 4. 入力値の状態管理
 * 5. バリデーション（空文字チェック）
 * 
 * 【実装のヒント】
 * - useState を使用して入力値を管理
 * - フォーム送信時に onSubmit コールバックを呼び出し
 * - 送信後にフォームをリセット
 * - 適切なバリデーションとエラーハンドリング
 */
function CommentForm({
  onSubmit,
  authorPlaceholder = "名前を入力",
  contentPlaceholder = "コメントを入力",
}: CommentFormProps): JSX.Element {
  // TODO: ここに実装してください
  // 1. 投稿者名の状態管理
  // 2. コメント内容の状態管理
  // 3. フォーム送信ハンドラーの実装
  // 4. 入力変更ハンドラーの実装
  // 5. バリデーション機能

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
        📝 課題: CommentForm コンポーネントを実装してください
      </p>
      <p style={{ margin: '0', fontSize: '12px' }}>
        このプレースホルダーを実際のコメントフォームに置き換えてください
      </p>
    </div>
  );
}

export default CommentForm;