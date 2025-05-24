# Week 3: Supabase統合・認証

## 📅 学習期間・目標

**期間**: Week 3（7日間）
**総学習時間**: 12時間（平日1.5時間、週末3時間）
**学習スタイル**: Supabase基礎40% + 認証システム40% + Prisma統合20%

### 🎯 Week 3 到達目標

- [ ] Supabaseプロジェクト設定と基本理解
- [ ] 型安全な認証システムの実装
- [ ] Prisma + Supabase統合
- [ ] Row Level Security（RLS）の実装
- [ ] セッション管理とミドルウェア

## 📚 理論学習内容

### Day 15-16: Supabaseプロジェクト設定

#### 🎯 Supabaseの基本概念と設定

```typescript
// 1. Supabaseの主要機能
interface SupabaseFeatures {
  database: {
    description: 'PostgreSQLマネージドデータベース';
    features: ['リアルタイム更新', 'Row Level Security', '自動API生成'];
  };
  
  authentication: {
    description: '包括的な認証システム';
    providers: ['Email/Password', 'OAuth', 'Magic Links', 'Phone Auth'];
  };
  
  storage: {
    description: 'ファイルストレージシステム';
    features: ['画像最適化', 'CDN配信', 'アクセス制御'];
  };
  
  edgeFunctions: {
    description: 'サーバーレス関数';
    runtime: 'Deno';
    features: ['TypeScript対応', 'グローバル配信'];
  };
  
  realtime: {
    description: 'リアルタイム機能';
    features: ['データベース変更監視', 'WebSocket', 'Presence'];
  };
}

// 2. 環境変数設定
// .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

// 3. Supabaseクライアント設定
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

// Client Component用
export const createClient = () => createClientComponentClient<Database>();

// Server Component用
export const createServerClient = () => 
  createServerComponentClient<Database>({ cookies });

// Route Handler用
export const createRouteClient = () => 
  createRouteHandlerClient<Database>({ cookies });
```

#### 🎯 データベース型定義

```typescript
// 4. データベース型定義の生成
// types/database.ts（Supabase CLIで自動生成）
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'user' | 'moderator';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'user' | 'moderator';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'user' | 'moderator';
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'admin' | 'user' | 'moderator';
    };
  };
}
```

### Day 17-19: 認証システム実装

#### 🎯 認証コンテキストとフォーム

```typescript
// 5. 認証コンテキスト
// contexts/auth-context.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: 'google' | 'github') => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // 初期認証状態の取得
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithProvider = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    // ローカル状態を更新
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithProvider,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

## 🎯 実践演習

### 演習 3-1: Supabase認証システム構築 🔶

**目標**: 完全な認証システムの実装

```typescript
// 実装する認証機能
interface AuthenticationFeatures {
  emailPassword: 'メール・パスワード認証';
  oauthProviders: 'Google・GitHub OAuth';
  magicLinks: 'マジックリンク認証';
  emailVerification: 'メール確認機能';
  passwordReset: 'パスワードリセット';
  sessionManagement: 'セッション管理';
  roleBasedAccess: 'ロールベースアクセス制御';
}

// セキュリティ要件
interface SecurityRequirements {
  rls: 'Row Level Security実装';
  middleware: 'ルート保護ミドルウェア';
  validation: '入力値検証';
  sanitization: 'データサニタイゼーション';
}
```

### 演習 3-2: データベース設計・RLS実装 🔥

**目標**: セキュアなデータベース設計

```sql
-- 実装するテーブル構造
-- users, projects, project_members, tasks, comments

-- RLSポリシー要件
-- 1. ユーザーは自分の情報のみアクセス可能
-- 2. プロジェクトメンバーのみプロジェクトデータにアクセス可能
-- 3. 管理者は全データにアクセス可能
-- 4. タスクの担当者・作成者のみ更新可能
```

## 📊 Week 3 評価基準

### 理解度チェックリスト

#### Supabase基礎 (30%)
- [ ] Supabaseの主要機能を理解している
- [ ] プロジェクト設定を適切に行える
- [ ] 型定義を正しく生成・活用できる
- [ ] クライアント設定を最適化できる

#### 認証システム (40%)
- [ ] 複数の認証方法を実装できる
- [ ] セッション管理を適切に行える
- [ ] 認証状態を効率的に管理できる
- [ ] セキュリティを考慮した実装ができる

#### データベース統合 (20%)
- [ ] Prisma + Supabaseを統合できる
- [ ] RLSポリシーを実装できる
- [ ] 型安全なデータアクセスを実現できる
- [ ] マイグレーションを管理できる

#### 実践応用 (10%)
- [ ] ミドルウェアを実装できる
- [ ] エラーハンドリングを適切に行える
- [ ] ユーザー体験を最適化できる
- [ ] セキュリティベストプラクティスを適用できる

### 成果物チェックリスト

- [ ] **認証システム**: 完全な認証・認可システム
- [ ] **データベース設計**: RLS対応セキュアDB設計
- [ ] **Prisma統合**: 型安全なORM統合
- [ ] **ミドルウェア**: ルート保護システム

## 🔄 Week 4 への準備

### 次週学習内容の予習

```typescript
// Week 4で学習するAPI Routes・リアルタイム機能の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. API Routes
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  // データ取得処理
  return Response.json({ data });
}

// 2. Supabase Realtime
const channel = supabase
  .channel('tasks')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'tasks' },
    (payload) => console.log('Change received!', payload)
  )
  .subscribe();
```

### 環境準備

- [ ] API Routes の基本理解
- [ ] WebSocket・リアルタイム通信の概念確認
- [ ] Edge Functions の調査
- [ ] ファイルアップロードの仕組み理解

---

**📌 重要**: Week 3ではSupabaseとの統合により、フルスタック開発の基盤を構築します。認証システムとデータベース設計を確実に理解することで、Week 4以降の高度な機能実装がスムーズに進みます。