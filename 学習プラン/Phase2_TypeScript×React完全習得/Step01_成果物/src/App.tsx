import { useState } from 'react';
import UserProfile from '@/components/UserProfile';
import LikeButton from '@/components/LikeButton';
import CommentForm from '@/components/CommentForm';
import { User, Comment } from '@/types';

/**
 * サンプルユーザーデータ
 */
const sampleUser: User = {
  id: 1,
  name: '田中 太郎',
  email: 'tanaka@example.com',
  avatar: 'https://via.placeholder.com/120x120?text=田中',
  bio: 'フロントエンドエンジニアとして働いています。React と TypeScript が大好きです！',
  followersCount: 1250,
  followingCount: 320,
  postsCount: 89,
};

/**
 * メインアプリケーションコンポーネント
 */
function App() {
  const [user] = useState<User>(sampleUser);
  const [comments, setComments] = useState<Comment[]>([]);

  // いいねボタンのコールバック
  const handleLikeChange = (likes: number, isLiked: boolean): void => {
    console.log(`いいね数: ${likes}, いいね済み: ${isLiked}`);
  };

  // コメント投稿のコールバック
  const handleCommentSubmit = (commentData: Omit<Comment, 'id' | 'createdAt'>): void => {
    const newComment: Comment = {
      id: comments.length + 1,
      ...commentData,
      createdAt: new Date(),
    };
    setComments(prev => [...prev, newComment]);
    console.log('新しいコメント:', newComment);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {/* ヘッダー */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#343a40',
              margin: '0 0 8px 0',
            }}
          >
            ソーシャルメディア風プロフィールアプリ
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: '#6c757d',
              margin: '0',
            }}
          >
            React 19 + TypeScript 学習用サンプルアプリ
          </p>
        </header>

        {/* ユーザープロフィール */}
        <UserProfile user={user} />

        {/* 課題エリア */}
        <div
          style={{
            marginTop: '40px',
            padding: '24px',
            backgroundColor: '#ffffff',
            border: '1px solid #e1e5e9',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#343a40',
              margin: '0 0 16px 0',
            }}
          >
            📝 課題: 以下のコンポーネントを実装してください
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#495057',
                margin: '0 0 8px 0',
              }}
            >
              1. いいねボタンコンポーネント (LikeButton.tsx)
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#6c757d',
                margin: '0 0 12px 0',
                lineHeight: '1.5',
              }}
            >
              • いいね数の表示と管理<br />
              • ボタンクリックでいいね数を増減<br />
              • いいね済み状態の視覚的表示<br />
              • TypeScriptによる型安全な実装
            </p>
            
            {/* いいねボタンの配置場所 */}
            <LikeButton
              initialLikes={42}
              onLikeChange={handleLikeChange}
            />
          </div>

          <div>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#495057',
                margin: '0 0 8px 0',
              }}
            >
              2. コメント投稿フォーム (CommentForm.tsx)
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#6c757d',
                margin: '0 0 12px 0',
                lineHeight: '1.5',
              }}
            >
              • コメント入力フィールド<br />
              • 投稿ボタン<br />
              • フォーム送信時の処理<br />
              • 入力値の状態管理
            </p>
            
            {/* コメントフォームの配置場所 */}
            <CommentForm onSubmit={handleCommentSubmit} />
            
            {/* 投稿されたコメントの表示 */}
            {comments.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '12px', color: '#495057' }}>
                  投稿されたコメント ({comments.length}件)
                </h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      style={{
                        padding: '12px',
                        marginBottom: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e9ecef',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#495057' }}>
                        {comment.author}
                      </div>
                      <div style={{ color: '#6c757d', marginBottom: '4px' }}>
                        {comment.content}
                      </div>
                      <div style={{ fontSize: '12px', color: '#adb5bd' }}>
                        {comment.createdAt.toLocaleString('ja-JP')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* フッター */}
        <footer
          style={{
            textAlign: 'center',
            marginTop: '40px',
            padding: '20px',
            color: '#6c757d',
            fontSize: '14px',
          }}
        >
          <p style={{ margin: '0' }}>
            Phase2 Step01 - React基礎とTypeScript統合 学習用アプリ
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;