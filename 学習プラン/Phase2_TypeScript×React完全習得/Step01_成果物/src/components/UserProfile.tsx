import { User } from '@/types';

/**
 * ユーザープロフィールコンポーネントのProps型定義
 */
interface UserProfileProps {
  /** 表示するユーザー情報 */
  user: User;
}

/**
 * ユーザープロフィール表示コンポーネント
 * ユーザーの基本情報、統計情報を表示する
 */
function UserProfile({ user }: UserProfileProps): JSX.Element {
  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '24px',
        border: '1px solid #e1e5e9',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* プロフィール画像とユーザー名 */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img
          src={user.avatar || 'https://via.placeholder.com/120x120?text=User'}
          alt={`${user.name}のプロフィール画像`}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '4px solid #f8f9fa',
            marginBottom: '12px',
          }}
        />
        <h2
          style={{
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1a1a1a',
          }}
        >
          {user.name}
        </h2>
        <p
          style={{
            margin: '0',
            fontSize: '16px',
            color: '#6c757d',
          }}
        >
          {user.email}
        </p>
      </div>

      {/* 自己紹介文 */}
      {user.bio && (
        <div style={{ marginBottom: '20px' }}>
          <p
            style={{
              margin: '0',
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#495057',
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            {user.bio}
          </p>
        </div>
      )}

      {/* 統計情報 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '16px 0',
          borderTop: '1px solid #e9ecef',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#007bff',
              marginBottom: '4px',
            }}
          >
            {user.postsCount.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>投稿</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#28a745',
              marginBottom: '4px',
            }}
          >
            {user.followersCount.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>フォロワー</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#ffc107',
              marginBottom: '4px',
            }}
          >
            {user.followingCount.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>フォロー中</div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;