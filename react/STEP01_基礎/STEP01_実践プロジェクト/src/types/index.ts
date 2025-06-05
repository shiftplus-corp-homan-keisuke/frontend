// ユーザープロフィールの型定義
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar?: string;
  location?: string;
  joinDate: Date;
}

// スキルの型定義
export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'frontend' | 'backend' | 'design';
}

// 完全なプロフィールデータの型定義
export interface CompleteProfile extends UserProfile {
  skills: Skill[];
}

// プロフィール編集フォームの型定義
export interface ProfileFormData {
  name: string;
  email: string;
  bio: string;
  location: string;
}

// フォームエラーの型定義
export interface FormErrors {
  name?: string;
  email?: string;
  bio?: string;
  location?: string;
}