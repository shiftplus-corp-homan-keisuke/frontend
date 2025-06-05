import type { CompleteProfile, Skill } from '../types';

// サンプルスキルデータ
export const sampleSkills: Skill[] = [
  {
    id: '1',
    name: 'React',
    level: 'intermediate',
    category: 'frontend'
  },
  {
    id: '2',
    name: 'TypeScript',
    level: 'beginner',
    category: 'frontend'
  },
  {
    id: '3',
    name: 'CSS',
    level: 'intermediate',
    category: 'frontend'
  },
  {
    id: '4',
    name: 'Node.js',
    level: 'beginner',
    category: 'backend'
  },
  {
    id: '5',
    name: 'Figma',
    level: 'intermediate',
    category: 'design'
  }
];

// デフォルトユーザープロフィール
export const defaultProfile: CompleteProfile = {
  id: '1',
  name: '山田太郎',
  email: 'yamada.taro@example.com',
  bio: 'フロントエンド開発を学習中です。React と TypeScript に興味があります。',
  location: '東京, 日本',
  joinDate: new Date('2024-01-15'),
  skills: sampleSkills
};

// スキルレベルの表示用ラベル
export const skillLevelLabels = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級'
} as const;

// スキルカテゴリの表示用ラベル
export const skillCategoryLabels = {
  frontend: 'フロントエンド',
  backend: 'バックエンド',
  design: 'デザイン'
} as const;

// スキルレベルの色設定
export const skillLevelColors = {
  beginner: '#fbbf24',    // 黄色
  intermediate: '#3b82f6', // 青色
  advanced: '#10b981'      // 緑色
} as const;