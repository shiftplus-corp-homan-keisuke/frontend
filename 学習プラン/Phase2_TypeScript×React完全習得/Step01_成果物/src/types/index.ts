/**
 * ユーザー情報の型定義
 */
export interface User {
  /** ユーザーID */
  id: number;
  /** ユーザー名 */
  name: string;
  /** メールアドレス */
  email: string;
  /** プロフィール画像URL（オプショナル） */
  avatar?: string;
  /** 自己紹介文（オプショナル） */
  bio?: string;
  /** フォロワー数 */
  followersCount: number;
  /** フォロー数 */
  followingCount: number;
  /** 投稿数 */
  postsCount: number;
}

/**
 * コメント情報の型定義
 */
export interface Comment {
  /** コメントID */
  id: number;
  /** コメント内容 */
  content: string;
  /** 投稿者名 */
  author: string;
  /** 投稿日時 */
  createdAt: Date;
}