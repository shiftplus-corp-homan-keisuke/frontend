# STEP02 以降 React 学習ファイル作成プロンプト

## 🎯 このプロンプトの目的

STEP01 の成功パターンを継承し、STEP02 以降の学習ファイルを体系的に作成するための生成 AI 向け指示書です。

## 📋 作成対象ファイル構成

以下のファイル群を、指定された STEP ナンバーで作成してください：

### メインファイル群

1. `STEP0X_[テーマ名]_基礎とTypeScript統合.md` - メイン学習ガイド
2. `STEP0X_Session1_[セッション1テーマ].md` - セッション分割ファイル（学習内容に応じて 3-6 セッション）
3. `STEP0X_Session2_[セッション2テーマ].md`
4. `STEP0X_Session3_[セッション3テーマ].md`
5. `STEP0X_SessionN-1_[セッションN-1テーマ].md` （学習トピック数に応じて調整）
6. `STEP0X_SessionN_実践プロジェクト.md` （最終セッションは必ず実践プロジェクト）

### 補足資料群

7. `STEP0X_補足_専門用語集.md` - 専門用語詳細解説
8. `STEP0X_補足_開発環境ガイド.md` - 環境構築ガイド
9. `STEP0X_補足_実践コード例.md` - 段階的コード例集
10. `STEP0X_補足_トラブルシューティング.md` - エラー解決ガイド
11. `STEP0X_補足_参考リソース.md` - 学習リソース集

### 実践プロジェクト

12. `STEP0X_実践プロジェクト/` フォルダ（React+TypeScript+Vite プロジェクト）

## 🏗️ 実践プロジェクト構築ガイド

### 📋 プロジェクト構造テンプレート

実践プロジェクトは以下の構造で構築してください：

```
STEP0X_実践プロジェクト/
├── package.json                    # 依存関係とスクリプト定義
├── tsconfig.json                   # TypeScript基本設定
├── tsconfig.app.json              # アプリケーション用TypeScript設定
├── tsconfig.node.json             # Node.js用TypeScript設定
├── vite.config.ts                 # Vite設定（React + TailwindCSS統合）
├── eslint.config.js               # ESLint設定（React Hooks対応）
├── index.html                     # エントリーポイント
├── README.md                      # 実装手順ガイド
├── src/
│   ├── main.tsx                   # Reactアプリケーションエントリーポイント
│   ├── App.tsx                    # メインアプリケーションコンポーネント（学習者実装）
│   ├── demo.html                  # 完成形デモファイル（視覚的参考）
│   ├── types/
│   │   └── index.ts              # TypeScript型定義（事前実装）
│   ├── data/
│   │   └── sampleData.ts         # サンプルデータ（事前実装）
│   ├── components/               # 学習者実装コンポーネント
│   │   ├── ProfileCard.tsx       # プロフィールカードコンポーネント
│   │   ├── SkillList.tsx         # スキルリストコンポーネント
│   │   └── ProfileEditor.tsx     # プロフィール編集コンポーネント
│   └── styles/                   # スタイルファイル（必要に応じて）
└── public/                       # 静的ファイル
```

### ⚙️ 設定ファイル完全版

#### 1. package.json
```json
{
  "name": "step0x-実践プロジェクト名",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.1.8",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "tailwindcss": "^4.1.8"
  },
  "devDependencies": {
    "@eslint/js": "^9.25.0",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.4.1",
    "eslint": "^9.25.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^16.0.0",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.30.1",
    "vite": "^6.3.5"
  }
}
```

#### 2. tsconfig.app.json
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

#### 3. vite.config.ts
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

#### 4. eslint.config.js
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
```

### 📁 事前実装ファイル群

#### 1. 型定義ファイル（src/types/index.ts）
```typescript
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
```

#### 2. サンプルデータファイル（src/data/sampleData.ts）
```typescript
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
```

#### 3. 完成形デモファイル（src/demo.html）
```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>プロフィールカードアプリ - 完成デモ</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
          sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        padding: 20px;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .header {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        color: white;
        padding: 24px;
        text-align: center;
      }

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        font-weight: bold;
        margin: 0 auto 16px;
        border: 3px solid rgba(255, 255, 255, 0.3);
      }

      /* 以下、完成形のスタイルが続く... */
    </style>
  </head>
  <body>
    <!-- 完成形のHTMLマークアップ -->
    <div class="container">
      <div class="header">
        <div class="avatar">山</div>
        <h1>山田太郎</h1>
        <p>yamada.taro@example.com</p>
      </div>
      <!-- 以下、完成形のコンテンツが続く... -->
    </div>
  </body>
</html>
```

### 🤖 生成AI向け自動生成指示

#### プロジェクト自動生成テンプレート
```markdown
以下の手順で実践プロジェクトを生成してください：

1. **プロジェクトディレクトリ作成**
   - `STEP0X_実践プロジェクト/` フォルダを作成

2. **設定ファイル生成**
   - package.json（上記の依存関係を使用）
   - TypeScript設定ファイル群（tsconfig.json, tsconfig.app.json, tsconfig.node.json）
   - Vite設定（React + TailwindCSS統合）
   - ESLint設定（React Hooks対応）

3. **事前実装ファイル生成**
   - 型定義ファイル（src/types/index.ts）
   - サンプルデータファイル（src/data/sampleData.ts）
   - 完成形デモファイル（src/demo.html）

4. **学習者実装ファイル準備**
   - 空のコンポーネントファイル（ProfileCard.tsx, SkillList.tsx, ProfileEditor.tsx）
   - 基本的なApp.tsxテンプレート
   - main.tsxエントリーポイント

5. **README.md作成**
   - 実装手順ガイド
   - 段階的な実装ステップ
   - 完成目標の明示
```

#### STEPごとのカスタマイズポイント
```markdown
各STEPに応じて以下をカスタマイズしてください：

**STEP02（State管理）**
- useState, useEffectを使用したコンポーネント
- フォーム入力とバリデーション
- 条件付きレンダリング

**STEP03（イベント処理）**
- クリックイベント、フォームイベント
- カスタムイベントハンドラー
- イベント伝播の制御

**STEP04（コンポーネント設計）**
- Props設計とコンポーネント分割
- 再利用可能なコンポーネント
- コンポーネント間の通信

**STEP05（カスタムHooks）**
- ロジックの抽象化
- 状態管理の分離
- 副作用の管理

**STEP06（パフォーマンス最適化）**
- React.memo, useMemo, useCallback
- 仮想化とレンダリング最適化
- バンドルサイズ最適化
```

### 📝 実装品質チェックリスト

#### 技術要件
- [ ] React 19.1.0 + TypeScript 5.8.3 + Vite 6.3.5 + TailwindCSS 4.1.8の使用
- [ ] 厳密なTypeScript設定（strict mode有効）
- [ ] ESLint設定（React Hooks対応）
- [ ] 適切なコンポーネント分割
- [ ] 型安全性の確保

#### 学習効果
- [ ] 段階的な実装手順の提供
- [ ] 完成形デモによる目標の可視化
- [ ] 事前実装ファイルによる学習支援
- [ ] 実践的なプロジェクト構造の体験

#### 品質保証
- [ ] エラーハンドリングの実装
- [ ] アクセシビリティの考慮
- [ ] レスポンシブデザインの対応
- [ ] パフォーマンスの最適化

## 🏗️ 各ファイルの構造テンプレート

### 📝 メインファイル構造（`STEP0X_[テーマ名]_基礎とTypeScript統合.md`）

````markdown
# STEP0X: [テーマ名]基礎と TypeScript 統合（セッション分割学習）

> 💡 **対象**: TypeScript 上級者・React 初心者
> 🎯 **形式**: 講師サポート付きセッション分割学習（学習内容に応じて 3-6 セッション、最終は実践プロジェクト）
> ⏰ **総時間**: 270-540 分（4.5-9 時間）

## 📚 関連補足資料

この STEP の学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./STEP0X_補足_専門用語集.md)** - [テーマ] + TypeScript の重要な概念と用語の詳細解説
- 🛠️ **[開発環境ガイド](./STEP0X_補足_開発環境ガイド.md)** - [テーマ] + TypeScript 環境構築と設定方法
- 💻 **[実践コード例](./STEP0X_補足_実践コード例.md)** - 段階的な[テーマ]実装例集
- 🚨 **[トラブルシューティング](./STEP0X_補足_トラブルシューティング.md)** - よくあるエラーと解決方法
- 📚 **[参考リソース](./STEP0X_補足_参考リソース.md)** - 学習に役立つリンク集

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してください 🐰

## 📅 STEP 概要

**学習目標**:

- [ ] [具体的な学習目標 1]
- [ ] [具体的な学習目標 2]
- [ ] [具体的な学習目標 3]
- [ ] [具体的な学習目標 4]
- [ ] [具体的な学習目標 5]

**前提知識**:

- TypeScript 中級レベル（ジェネリクス、ユニオン型、条件型等の理解）
- React 基礎レベルの理解
- [前の STEP で学習した内容]

---

## ⏰ セッション構成（学習内容に応じて 3-6 セッション、最終は実践プロジェクト）

| セッション                                                     | 時間  | 内容                  | 対象レクチャー | 成果物               |
| -------------------------------------------------------------- | ----- | --------------------- | -------------- | -------------------- |
| **[Session1](./STEP0X_Session1_[セッション1テーマ].md)**       | 90 分 | [セッション 1 内容]   | 1-8            | [成果物 1]           |
| **[Session2](./STEP0X_Session2_[セッション2テーマ].md)**       | 90 分 | [セッション 2 内容]   | 9-16           | [成果物 2]           |
| **[Session3](./STEP0X_Session3_[セッション3テーマ].md)**       | 90 分 | [セッション 3 内容]   | 17-24          | [成果物 3]           |
| **[SessionN-1](./STEP0X_SessionN-1_[セッションN-1テーマ].md)** | 90 分 | [セッション N-1 内容] | 25-30          | [成果物 N-1]         |
| **[SessionN](./STEP0X_SessionN_実践プロジェクト.md)**          | 90 分 | **実践プロジェクト**  | 31-32          | **完成プロジェクト** |

### セッション数決定ガイドライン（学習内容分割 + 実践プロジェクト）

**基本構成**: 理論学習セッション（2-5 個） + 実践プロジェクトセッション（1 個）

- **3 セッション**: 理論 2 セッション + 実践プロジェクト 1 セッション
  - 学習トピックが少ない場合（基本概念 1-2 個）
- **4 セッション**: 理論 3 セッション + 実践プロジェクト 1 セッション
  - 標準的な学習内容（基本概念 2-3 個）
- **5 セッション**: 理論 4 セッション + 実践プロジェクト 1 セッション
  - 豊富な学習内容（基本概念 3-4 個）
- **6 セッション**: 理論 5 セッション + 実践プロジェクト 1 セッション
  - 非常に多い学習内容（基本概念 4-5 個）

**最終セッション（実践プロジェクト）の役割**:

- その STEP で学んだ全ての概念を統合
- 実際に動作するプロジェクトの完成
- 学習内容の実践的な応用
- 理解度の総合的な確認

---

## 🗺️ 学習フローマップ

```mermaid
graph TD
    A[STEP0X開始] --> B[Session1: [セッション1テーマ]]
    B --> C[Session2: [セッション2テーマ]]
    C --> D[Session3: [セッション3テーマ]]
    D --> E{学習内容に応じて}
    E -->|3セッション構成| F1[SessionN: 実践プロジェクト]
    E -->|4セッション構成| D1[Session4: [セッション4テーマ]]
    E -->|5セッション構成| D2[Session4: [セッション4テーマ]]
    E -->|6セッション構成| D3[Session4: [セッション4テーマ]]

    D1 --> F2[SessionN: 実践プロジェクト]
    D2 --> E2[Session5: [セッション5テーマ]]
    D3 --> E3[Session5: [セッション5テーマ]]

    E2 --> F3[SessionN: 実践プロジェクト]
    E3 --> E4[Session6: [セッション6テーマ]]
    E4 --> F4[SessionN: 実践プロジェクト]

    F1 --> G[STEP0X完了]
    F2 --> G
    F3 --> G
    F4 --> G

    B --> B1[[Session1詳細1]]
    B --> B2[[Session1詳細2]]
    B --> B3[[Session1詳細3]]

    C --> C1[[Session2詳細1]]
    C --> C2[[Session2詳細2]]
    C --> C3[[Session2詳細3]]

    D --> D4[[Session3詳細1]]
    D --> D5[[Session3詳細2]]
    D --> D6[[Session3詳細3]]

    F1 --> F1A[[統合実践1]]
    F1 --> F1B[[統合実践2]]
    F1 --> F1C[[プロジェクト完成]]
```
````

## 🎯 TypeScript 統合の特徴

### 1. [特徴 1 のタイトル]

- [詳細説明 1]
- [詳細説明 2]
- [詳細説明 3]

### 2. [特徴 2 のタイトル]

- [詳細説明 1]
- [詳細説明 2]
- [詳細説明 3]

### 3. [特徴 3 のタイトル]

- [詳細説明 1]
- [詳細説明 2]
- [詳細説明 3]

## 📊 STEP0X 評価基準

### 技術習得度（70%）

#### [評価項目 1]（25%）

- [ ] [具体的な習得項目 1]
- [ ] [具体的な習得項目 2]
- [ ] [具体的な習得項目 3]

#### [評価項目 2]（25%）

- [ ] [具体的な習得項目 1]
- [ ] [具体的な習得項目 2]
- [ ] [具体的な習得項目 3]

#### [評価項目 3]（20%）

- [ ] [具体的な習得項目 1]
- [ ] [具体的な習得項目 2]
- [ ] [具体的な習得項目 3]

### 実践活用度（30%）

#### [実践項目 1]（15%）

- [ ] [実践的な習得項目 1]
- [ ] [実践的な習得項目 2]

#### [実践項目 2]（15%）

- [ ] [実践的な習得項目 1]
- [ ] [実践的な習得項目 2]

---

## 🚀 次のステップ

**STEP0X 完了後の学習パス**:

- 🔜 **STEP0[X+1]**: [次の STEP テーマ]
- 📈 **応用課題**: [応用学習の提案]
- 🔄 **復習推奨**: [復習すべき重要項目]

**学習継続のコツ**:

- [学習継続のアドバイス 1]
- [学習継続のアドバイス 2]
- [学習継続のアドバイス 3]

---

💡 **学習サポート**: 疑問や課題があれば、補足資料を参照するか、講師にお気軽にご相談ください！

````

### 📝 セッションファイル構造（`STEP0X_SessionN_[テーマ].md`）

```markdown
# STEP0X Session N: [セッションテーマ]

> ⏰ **セッション時間**: 90分
> 🎯 **目標**: [このセッションの具体的な学習目標]
> 📋 **前提**: [前提知識や前セッションからの継続項目]

## 📅 セッション構成

| 時間 | 内容 | 形式 | 成果物 |
|------|------|------|--------|
| 0-15分 | [導入内容] | 講義 | [理解確認] |
| 15-45分 | [メイン学習1] | 実践 | [コード作成] |
| 45-75分 | [メイン学習2] | 実践 | [機能実装] |
| 75-90分 | [まとめ・振り返り] | 討論 | [学習記録] |

## 🎯 学習目標の詳細

### 💡 このセッションで身につけること
- [ ] [具体的スキル1]
- [ ] [具体的スキル2]
- [ ] [具体的スキル3]

### 📝 成果物
- [具体的な成果物の説明]
- [期待される品質レベル]

## 📚 レクチャー N-M: [レクチャータイトル]

### 🔍 なぜこの技術が重要なのか

💡 **実務での価値**:
- [実務での具体的な価値1]
- [実務での具体的な価値2]
- [実務での具体的な価値3]

🎯 **解決する課題**:
- [解決される具体的な問題1]
- [解決される具体的な問題2]

### 📝 実装の詳細解説

#### Level 1: 基礎実装
```typescript
// 💡 基本的な実装例
[基礎的なTypeScriptコード例]
````

**🔍 解説ポイント**:

- [重要なポイント 1]
- [重要なポイント 2]

#### Level 2: 型安全な実装

```typescript
// 🎯 型安全性を高めた実装
[より型安全なコード例];
```

**⚠️ 注意点**:

- [注意すべきポイント 1]
- [注意すべきポイント 2]

#### Level 3: 実践的実装

```typescript
// 🚀 実務レベルの実装
[実務で使えるレベルのコード例];
```

**📝 実装のコツ**:

- [実装時のコツ 1]
- [実装時のコツ 2]

### 💻 実践演習

#### 演習 N-M: [演習タイトル]

**🎯 演習目的**: [演習の狙い]

**📋 要件**:

- [要件 1]
- [要件 2]
- [要件 3]

**💡 ヒント**:

- [ヒント 1]
- [ヒント 2]

**✅ 期待される結果**:

- [期待される動作 1]
- [期待される動作 2]

### 🔍 理解度チェック

以下の質問に答えられるかチェックしてみましょう：

1. **基礎理解**: [基礎的な質問]
2. **応用理解**: [応用的な質問]
3. **実践理解**: [実践的な質問]

## 🗒️ セッションまとめ

### ✅ 今回学んだこと

- [学習内容 1]
- [学習内容 2]
- [学習内容 3]

### 📝 次回への準備

- [次回に向けた準備項目 1]
- [次回に向けた準備項目 2]

### 🔄 復習推奨項目

- [復習すべき重要項目 1]
- [復習すべき重要項目 2]

---

**次のセッション**: [次のセッション名とテーマ]

````

### 📝 実践プロジェクトセッションファイル構造（`STEP0X_SessionN_実践プロジェクト.md`）

```markdown
# STEP0X SessionN: 実践プロジェクト - [プロジェクト名]

> ⏰ **セッション時間**: 90分
> 🎯 **目標**: STEP0Xで学んだ全ての概念を統合した実践プロジェクトの完成
> 📋 **前提**: Session1〜SessionN-1で学習した全ての内容

## 📅 セッション構成

| 時間 | 内容 | 形式 | 成果物 |
|------|------|------|--------|
| 0-15分 | プロジェクト要件確認・設計レビュー | 講義 | 設計理解 |
| 15-60分 | 統合実装・機能完成 | 実践 | 動作するプロジェクト |
| 60-80分 | テスト・デバッグ・最適化 | 実践 | 完成品質向上 |
| 80-90分 | 成果発表・学習振り返り | 討論 | 学習総括 |

## 🎯 実践プロジェクトの目標

### 💡 このプロジェクトで統合すること
- [ ] [Session1で学んだ概念の実践応用]
- [ ] [Session2で学んだ概念の実践応用]
- [ ] [Session3で学んだ概念の実践応用]
- [ ] [SessionN-1で学んだ概念の実践応用]

### 📝 最終成果物
- [完成プロジェクトの詳細説明]
- [期待される品質レベルと機能要件]
- [技術的な実装要件]

## 🚀 プロジェクト実装ガイド

### 📋 実装要件

#### 必須機能
1. **[機能1]**: [詳細説明]
   - 使用技術: [Session Xで学んだ技術]
   - 実装ポイント: [重要な実装のコツ]

2. **[機能2]**: [詳細説明]
   - 使用技術: [Session Yで学んだ技術]
   - 実装ポイント: [重要な実装のコツ]

3. **[機能3]**: [詳細説明]
   - 使用技術: [Session Zで学んだ技術]
   - 実装ポイント: [重要な実装のコツ]

#### 技術要件
- **TypeScript**: [このSTEPで学んだ型活用パターン]
- **React**: [このSTEPで学んだReactパターン]
- **品質**: [エラーハンドリング、型安全性、パフォーマンス要件]

### 💻 段階的実装手順

#### Phase 1: プロジェクト基盤構築（15分）
```typescript
// 🏗️ プロジェクト構造とベースコンポーネント
[基盤となるコード例]
```

**実装チェックポイント**:
- [ ] [基盤チェック項目1]
- [ ] [基盤チェック項目2]

#### Phase 2: 核心機能実装（30分）
```typescript
// 🎯 メイン機能の実装
[核心機能のコード例]
```

**実装チェックポイント**:
- [ ] [核心機能チェック項目1]
- [ ] [核心機能チェック項目2]

#### Phase 3: 統合・最適化（15分）
```typescript
// ⚡ 統合と最適化
[統合・最適化のコード例]
```

**実装チェックポイント**:
- [ ] [統合チェック項目1]
- [ ] [統合チェック項目2]

### 🔍 品質チェック

#### 機能面
- [ ] **動作確認**: 全ての機能が期待通りに動作する
- [ ] **エラーハンドリング**: 適切なエラー処理が実装されている
- [ ] **ユーザビリティ**: 使いやすいインターフェースが実現されている

#### 技術面
- [ ] **型安全性**: TypeScriptの型システムが効果的に活用されている
- [ ] **コード品質**: 可読性・保守性の高いコードが書かれている
- [ ] **パフォーマンス**: 実用的なパフォーマンスが確保されている

### 🎓 学習統合の確認

以下の質問に答えて、学習内容の統合度を確認しましょう：

1. **概念統合**: このプロジェクトでSTEP0Xの学習内容をどのように統合しましたか？
2. **技術選択**: なぜその技術選択をしたのか、理由を説明できますか？
3. **改善点**: さらに改善するとしたら、どのような点を改善しますか？

## 🗒️ プロジェクト完成まとめ

### ✅ 完成した機能

- [完成機能1とその技術的ポイント]
- [完成機能2とその技術的ポイント]
- [完成機能3とその技術的ポイント]

### 📈 習得できたスキル

- [習得スキル1]
- [習得スキル2]
- [習得スキル3]

### 🔄 今後の発展可能性

- [発展アイデア1]
- [発展アイデア2]
- [発展アイデア3]

---

**STEP0X完了**: おめでとうございます！次のSTEPに進む準備が整いました 🎉

```

### 📝 実践プロジェクトセッションファイル構造（`STEP0X_SessionN_実践プロジェクト.md`）

```markdown
# STEP0X Session N: 実践プロジェクト - [プロジェクト名]

> ⏰ **セッション時間**: 90分
> 🎯 **目標**: STEP0Xで学んだ全ての概念を統合した実践プロジェクトの完成
> 📋 **前提**: Session1-N-1で学習した全ての内容の理解

## 📅 セッション構成

| 時間 | 内容 | 形式 | 成果物 |
|------|------|------|--------|
| 0-15分 | プロジェクト概要と設計レビュー | 講義 | 設計理解 |
| 15-60分 | 統合実装とコード作成 | 実践 | 完成プロジェクト |
| 60-80分 | テスト・デバッグ・最適化 | 実践 | 品質向上 |
| 80-90分 | 成果発表・振り返り | 討論 | 学習総括 |

## 🎯 実践プロジェクトの目標

### 💡 このセッションで統合すること
- [ ] [Session1で学んだ概念の実践応用]
- [ ] [Session2で学んだ概念の実践応用]
- [ ] [Session3で学んだ概念の実践応用]
- [ ] [SessionN-1で学んだ概念の実践応用]

### 📝 最終成果物
- [完成プロジェクトの詳細説明]
- [期待される機能と品質レベル]
- [実務レベルでの活用可能性]

## 🚀 プロジェクト仕様

### 📋 機能要件
1. **[機能1]**: [詳細説明]
2. **[機能2]**: [詳細説明]
3. **[機能3]**: [詳細説明]

### � 技術要件
- **フレームワーク**: React 18 + TypeScript 5
- **ビルドツール**: Vite 5
- **スタイリング**: [使用するCSS技術]
- **STEP固有技術**: [このSTEPで学んだ特定技術]

### 📊 品質基準
- [ ] **型安全性**: 全てのコンポーネントが適切に型定義されている
- [ ] **再利用性**: コンポーネントが他のプロジェクトでも使用可能
- [ ] **保守性**: コードが読みやすく、拡張しやすい構造
- [ ] **パフォーマンス**: 実用的なパフォーマンスを実現

## 💻 実装ガイド

### Phase 1: プロジェクト構造の構築（15分）
```typescript
// 🏗️ プロジェクト構造の設計
[プロジェクト構造のコード例]
```

### Phase 2: コア機能の実装（30分）
```typescript
// 🎯 メイン機能の実装
[コア機能のコード例]
```

### Phase 3: 統合と最適化（15分）
```typescript
// 🚀 統合実装と最適化
[統合・最適化のコード例]
```

## 🔍 実装チェックポイント

### ✅ 機能面
- [ ] [機能1]が正常に動作する
- [ ] [機能2]が正常に動作する
- [ ] [機能3]が正常に動作する

### ✅ 技術面
- [ ] TypeScriptエラーが0件
- [ ] ESLintエラーが0件
- [ ] 適切なコンポーネント分割
- [ ] 型安全な実装

### ✅ 品質面
- [ ] コードの可読性
- [ ] 再利用可能性
- [ ] パフォーマンス
- [ ] エラーハンドリング

## 🗒️ プロジェクト総括

### ✅ STEP0X学習内容の統合確認

- [Session1の学習内容] → [実践プロジェクトでの活用方法]
- [Session2の学習内容] → [実践プロジェクトでの活用方法]
- [Session3の学習内容] → [実践プロジェクトでの活用方法]
- [SessionN-1の学習内容] → [実践プロジェクトでの活用方法]

### 📝 実務への応用

- [実務での活用シーン1]
- [実務での活用シーン2]
- [実務での活用シーン3]

### 🔄 継続学習の提案

- [次のSTEPへの準備項目]
- [さらなる深化学習の提案]
- [実務プロジェクトでの応用アイデア]

---

**STEP0X完了**: おめでとうございます！次のSTEPでさらなる成長を目指しましょう！

````

## 🎨 コンテンツ作成のガイドライン

### 📋 STEP01 から継承する品質基準

#### 1. **コンポーネント定義の統一**

- ✅ **推奨**: `function` 宣言を基本とする
- 📚 **教育目的**: `React.FC` も併記して比較解説
- 🎯 **一貫性**: すべてのコード例でこの方針を適用

#### 2. **段階的学習構造**

- **Level 1**: 基礎実装（理解しやすさ重視）
- **Level 2**: 型安全な実装（TypeScript 活用）
- **Level 3**: 実践実装（実務レベル）
- **Level 4**: 高度な実装（上級者向け）

#### 3. **解説パターンの統一**

- 💡 **なぜ重要なのか** - 実務での価値を明示
- 🎯 **どういう場面で使うのか** - 具体的な使用場面
- 📝 **コードの詳細解説** - 段階的な実装例
- ⚠️ **注意点・制約** - 気をつけるべきポイント
- 🚀 **応用・発展** - より高度な活用法

#### 4. **実践重視の姿勢**

- 動作する完全なコード例の提供
- 実務で即座に活用できる品質
- エラーハンドリングを含む堅牢な実装
- パフォーマンスを考慮した最適化

### 🔧 TypeScript 統合の深化方針

#### 1. **型システムの活用レベル向上**

- 基礎 STEP より高度な型活用（ジェネリクス、条件型、マップ型など）
- 実務レベルの複雑な型定義パターン
- 型安全性と開発効率の両立

#### 2. **エラーハンドリングの充実**

- TypeScript コンパイルエラーの詳細解説
- React 特有の型エラーパターンと解決法
- デバッグ効率化のテクニック集

#### 3. **パフォーマンス考慮**

- 型計算コストを意識した実装
- バンドルサイズへの影響を考慮
- 実行時パフォーマンスとのバランス

### 📚 補足資料の充実方針

#### 1. **専門用語集**（`STEP0X_補足_専門用語集.md`）

```markdown
# STEP0X 補足資料：専門用語集

> 💡 **このファイルについて**: STEP0X で学習する[テーマ] × TypeScript の重要な概念と用語を詳細に解説します。

## 📚 目次

- [基礎概念](#基礎概念)
- [TypeScript 関連用語](#typescript関連用語)
- [実践パターン](#実践パターン)
- [パフォーマンス最適化](#パフォーマンス最適化)
- [開発ツール](#開発ツール)

## [基礎概念]

### [用語 1]

**定義**: [明確な定義]
**なぜ重要なのか**: [実務での価値・解決する課題]
**実例**: [TypeScript コード例]
**関連用語**: [関連する他の用語へのリンク]
```

#### 2. **開発環境ガイド**（`STEP0X_補足_開発環境ガイド.md`）

```markdown
# STEP0X 補足資料：開発環境ガイド

## 🛠️ 環境構築手順

### 1. プロジェクト作成

\`\`\`bash
npm create vite@latest step0x-project -- --template react-ts
cd step0x-project
npm install
\`\`\`

### 2. 必要なパッケージ追加

\`\`\`bash
npm install [STEP 固有のパッケージ]
npm install -D [開発用パッケージ]
\`\`\`

### 3. 設定ファイル解説

- **tsconfig.json**: [TypeScript 設定の詳細解説]
- **vite.config.ts**: [Vite 設定の詳細解説]
- **eslint.config.js**: [ESLint 設定の詳細解説]
```

#### 3. **実践コード例**（`STEP0X_補足_実践コード例.md`）

```markdown
# STEP0X 補足資料：実践コード例

## 📚 段階的実装例

### Level 1: 基礎実装

\`\`\`typescript
// 💡 [基礎的な実装の説明]
[基礎コード例]
\`\`\`

### Level 2: 型安全な実装

\`\`\`typescript
// 🎯 [型安全性を高めた実装の説明]
[型安全なコード例]
\`\`\`

### Level 3: 実践的実装

\`\`\`typescript
// 🚀 [実務レベルの実装の説明]
[実務レベルのコード例]
\`\`\`

### Level 4: 高度な実装

\`\`\`typescript
// ⚡ [高度な実装の説明]
[上級者向けコード例]
\`\`\`
```

#### 4. **トラブルシューティング**（`STEP0X_補足_トラブルシューティング.md`）

```markdown
# STEP0X 補足資料：トラブルシューティング

## 🚨 よくあるエラーと解決方法

### [エラーカテゴリ 1]: TypeScript エラー

#### エラー: [具体的なエラーメッセージ]

**原因**: [エラーの根本原因]
**解決方法**: [段階的な解決手順]
**予防策**: [同様のエラーを防ぐ方法]

### [エラーカテゴリ 2]: React 実行時エラー

#### エラー: [具体的なエラーメッセージ]

**原因**: [エラーの根本原因]
**解決方法**: [段階的な解決手順]
**予防策**: [同様のエラーを防ぐ方法]
```

#### 5. **参考リソース**（`STEP0X_補足_参考リソース.md`）

```markdown
# STEP0X 補足資料：参考リソース

## 📚 公式ドキュメント

- [React 公式ドキュメント](https://react.dev/)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/)

## 🎯 STEP0X 関連の学習リソース

- [STEP0X 特化のリソース集]

## 🛠️ 開発ツール・拡張機能

- [推奨 VS Code 拡張機能]
- [開発効率化ツール]

## 🌟 コミュニティ・質問サイト

- [React 関連のコミュニティ]
- [TypeScript 関連のフォーラム]
```

## 📝 具体的な作成指示

### 🎯 プロンプト使用手順

#### Step 1: テーマ・対象レベルの明確化

```
**STEPナンバー**: [例: STEP02]
**STEPテーマ**: [例: コンポーネント型設計とジェネリクス活用]
**対象レベル**: TypeScript上級者・React初心者（[前STEP]完了者）
**前提知識**: [具体的な前提知識項目]
```

#### Step 2: セッション構成の設計

```
**セッション構成（学習内容に応じて3-6セッション、最終は実践プロジェクト）**:
1. Session1: [90分のセッション1テーマ]
2. Session2: [90分のセッション2テーマ]
3. Session3: [90分のセッション3テーマ]
4. SessionN-1: [90分のセッションN-1テーマ] （学習内容に応じて調整）
5. SessionN: 実践プロジェクト（90分） （最終セッションは必ず実践プロジェクト）

**セッション数の決定基準**:
- 学習トピック数と複雑さに応じて理論セッション数を調整（2-5セッション）
- 最終セッションは必ずそのSTEPの学習内容を統合した実践プロジェクト
```

#### Step 3: 実践プロジェクト仕様

```
**実践プロジェクト**: [プロジェクト概要]
**主要機能**:
- [機能1]
- [機能2]
- [機能3]
**技術スタック**: React18 + TypeScript5 + Vite5 + [STEP固有技術]
```

### 💡 使用例：STEP02 のケーススタディ

**完全な作成プロンプト例**:

```
上記のテンプレートとガイドラインに従って、以下のSTEP02ファイル群を作成してください：

**STEPナンバー**: STEP02
**STEPテーマ**: コンポーネント型設計とジェネリクス活用
**対象レベル**: TypeScript上級者・React初心者（STEP01完了者）
**前提知識**:
- STEP01で学習したReact基礎概念
- ユニオン型、ジェネリクス、条件型の深い理解
- コンポーネント合成パターンの基礎

**セッション構成例（5セッション）**:
1. Session1: Generic Componentの基礎と型パラメータ設計（90分）
2. Session2: 条件付きProps型とユニオン型活用（90分）
3. Session3: Compound Componentパターンと型安全な合成（90分）
4. Session4: forwardRefとuseImperativeHandleの型活用（90分）
5. Session5: 実践プロジェクト - 型安全なUIコンポーネントライブラリ完成（90分）

**実践プロジェクト**: 型安全なUIコンポーネントライブラリ
**主要機能**:
- Generic Button コンポーネント（variant、size、loading状態対応）
- 型安全な Input コンポーネント（バリデーション、ref対応）
- Compound Modal コンポーネント（Header、Body、Footer合成）
- 動的な Table コンポーネント（ジェネリック データ表示）
- Polymorphic コンポーネント（as prop パターン）
**技術スタック**: React18 + TypeScript5 + Vite5 + Tailwind CSS

**重点学習項目**:
- ジェネリクスを活用した再利用可能なコンポーネント設計
- 条件型・マップ型を使った高度な型操作
- forwardRef・useImperativeHandleでの型安全な実装
- Compound Componentパターンでの型安全な合成
- Polymorphic componentパターンの実装

上記仕様に基づき、STEP02の学習ファイル群（メインファイル + セッションファイル + 補足資料 + 実践プロジェクト）を完全に作成してください。
```

## ✅ 品質チェックリスト

作成したファイルが以下の基準を満たしているか確認してください：

### 📋 構造面（STEP01 との整合性確認）

- [ ] **ファイル数**: 指定されたメインファイル + 実践プロジェクトがすべて作成されている
  - メインファイル ×1、セッションファイル ×3-6（学習内容に応じて）、補足資料 ×5、実践プロジェクト ×1
- [ ] **ファイル命名**: `STEP0X_` プレフィックスで統一されている
- [ ] **相互参照**: ファイル間のリンクが正しく設定されている（相対パス使用）
- [ ] **セッション構成**: 学習内容の分割に応じた適切なセッション数（3-6 セッション ×90 分）で、最終セッションは実践プロジェクトが設計されている
- [ ] **学習フローマップ**: Mermaid を使用した視覚的なフローが作成されている

### 📋 内容面（STEP01 品質基準準拠）

- [ ] **難易度設定**: TypeScript 上級者・React 初心者向けの適切なレベル
- [ ] **コード例**: Level 1-4 の段階的実装例が豊富に含まれている
- [ ] **コンポーネント定義**: `function` 宣言ベースで統一（`React.FC` も教育目的で併記）
- [ ] **型安全性**: 実務レベルの型活用パターンが含まれている
- [ ] **実践重視**: 動作する完全なコード例の提供

### 📋 教育面（STEP01 教育方針継承）

- [ ] **価値説明**: 「なぜ重要か」「実務での価値」の解説が充実
- [ ] **段階的学習**: 基礎 → 応用 → 実践 → 高度の学習構造
- [ ] **実践演習**: 各セッションに適切な演習課題が設計されている
- [ ] **理解度チェック**: 基礎・応用・実践の 3 段階質問が各セッションに含まれている
- [ ] **エラー対策**: 実際に遭遇しやすいエラーパターンと解決法を網羅

### 📋 技術面（STEP01 技術基準準拠）

- [ ] **プロジェクト構成**: React18 + TypeScript5 + Vite5 + ESLint9 対応
- [ ] **設定ファイル**: tsconfig.json（strict mode）、vite.config.ts、eslint.config.js
- [ ] **依存関係**: package.json に適切なバージョン指定
- [ ] **型定義**: src/types/index.ts での中央集約型管理
- [ ] **コード品質**: バレルエクスポート、ユーティリティ関数の型安全性

### 📋 補足資料品質

- [ ] **専門用語集**: 定義・価値・実例・関連用語の 4 要素構成
- [ ] **開発環境ガイド**: 環境構築 → 設定 → トラブルシューティングの完全な手順
- [ ] **実践コード例**: Level 1-4 の段階別実装例集
- [ ] **トラブルシューティング**: エラー → 原因 → 解決 → 予防の 4 段階解説
- [ ] **参考リソース**: 公式・学習・ツール・コミュニティの 4 カテゴリ分類

## 🎯 最終的な成果物

このプロンプトを使用することで、以下が期待できます：

1. **体系的な学習コンテンツ**: STEP01 と同等以上の品質
2. **実践的なスキル習得**: 実務で即座に活用可能な知識
3. **段階的な成長**: 無理のない学習進度設計
4. **継続的な学習**: 次の STEP への自然な流れ

**このプロンプトを活用して、効果的な React 学習コンテンツを作成してください！**
