# Step01_補足_設定ファイル解説.md

# Step 1: React 基礎と TypeScript 統合 - 設定ファイル解説

> 🐰 **このファイルについて**: React + TypeScript プロジェクトの各種設定ファイルを詳細に解説し、最適な開発環境を構築するための知識を提供します。

## 📖 目次

- [tsconfig.json 設定詳細](#tsconfigjson-設定詳細)
- [vite.config.ts の詳細設定](#viteconfigts-の詳細設定)
- [ESLint設定 (React + TypeScript)](#eslint設定-react--typescript)
- [Prettier設定](#prettier設定)
- [package.json のスクリプト設定](#packagejson-のスクリプト設定)
- [環境変数の管理](#環境変数の管理)

---

## tsconfig.json 設定詳細

### 基本設定の解説

```json
{
  "compilerOptions": {
    // === 基本設定 ===
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    
    // === モジュール設定 ===
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    
    // === React 設定 ===
    "jsx": "react-jsx",
    "noEmit": true,
    
    // === 型チェック設定 ===
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,

    // === パス解決 ===
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"],
      "@/styles/*": ["src/styles/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 各オプションの詳細解説

#### 基本設定

| オプション | 説明 | 推奨値 | 理由 |
|-----------|------|--------|------|
| `target` | 出力するJavaScriptのバージョン | `ES2020` | モダンブラウザサポート、パフォーマンス最適化 |
| `lib` | 使用可能なライブラリ | `["ES2020", "DOM", "DOM.Iterable"]` | React開発に必要なAPI群 |
| `allowJs` | JavaScriptファイルの混在許可 | `false` | TypeScript純粋環境の維持 |
| `skipLibCheck` | ライブラリの型チェックスキップ | `true` | コンパイル速度向上 |

#### React特化設定

```json
{
  "compilerOptions": {
    // React 17+ の新しいJSX変換
    "jsx": "react-jsx",
    
    // TypeScriptはビルドしない（Viteが担当）
    "noEmit": true
  }
}
```

**JSX変換の比較**:

```typescript
// jsx: "react" (旧方式)
import React from 'react';
function App() {
  return React.createElement('div', null, 'Hello World');
}

// jsx: "react-jsx" (新方式)
// import React は不要
function App() {
  return <div>Hello World</div>;
}
```

#### 型チェック設定（段階的厳密化）

```json
{
  "compilerOptions": {
    // === レベル1: 基本的な型安全性 ===
    "strict": true,                        // 厳密な型チェック
    "noImplicitAny": true,                // any型の暗黙的使用を禁止
    
    // === レベル2: コード品質向上 ===
    "noUnusedLocals": true,               // 未使用のローカル変数を検出
    "noUnusedParameters": true,           // 未使用のパラメータを検出
    "noImplicitReturns": true,           // 暗黙的なreturnを禁止
    "noFallthroughCasesInSwitch": true,  // switch文のfallthrough検出
    
    // === レベル3: 高度な型安全性 ===
    "exactOptionalPropertyTypes": true,  // オプショナルプロパティの厳密チェック
    
    // === ファイルシステム ===
    "forceConsistentCasingInFileNames": true // ファイル名の大文字小文字統一
  }
}
```

#### パス解決設定

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // 基本エイリアス
      "@/*": ["src/*"],
      
      // 機能別エイリアス
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"],
      "@/styles/*": ["src/styles/*"],
      "@/assets/*": ["src/assets/*"]
    }
  }
}
```

**使用例**:
```typescript
// 相対パスの代わりに
import Button from '../../../components/ui/Button';
import { formatDate } from '../../../utils/date';

// エイリアスを使用
import Button from '@/components/ui/Button';
import { formatDate } from '@/utils/date';
```

---

## vite.config.ts の詳細設定

### 基本設定

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // プラグイン設定
  plugins: [
    react({
      // Fast Refresh の設定
      fastRefresh: true,
    }),
  ],
  
  // パス解決設定
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/styles': path.resolve(__dirname, './src/styles'),
    },
  },
  
  // 開発サーバー設定
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    open: true,
    
    // CORS設定
    cors: true,
    
    // プロキシ設定
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
    
    // ホットリロード設定
    hmr: {
      overlay: true,
    },
    
    // ファイル監視設定
    watch: {
      usePolling: true, // WSL環境での推奨
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },
  
  // ビルド設定
  build: {
    // 出力ディレクトリ
    outDir: 'dist',
    
    // ソースマップ
    sourcemap: true,
    
    // 圧縮設定
    minify: 'esbuild',
    
    // チャンク分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns'],
        },
      },
    },
  },
});
```

---

## ESLint設定 (React + TypeScript)

### .eslintrc.json

```json
{
  "env": {
    "browser": true,
    "es2020": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": [
    "react",
    "react-hooks",
    "@typescript-eslint",
    "jsx-a11y"
  ],
  "rules": {
    // === TypeScript 関連 ===
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    
    // === React 関連 ===
    "react/react-in-jsx-scope": "off", // React 17+では不要
    "react/prop-types": "off", // TypeScriptで型チェック
    "react/jsx-key": "error",
    
    // === React Hooks 関連 ===
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    
    // === 一般的なルール ===
    "no-console": "warn",
    "no-debugger": "error",
    "prefer-const": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

---

## Prettier設定

### .prettierrc.json

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "jsxSingleQuote": true,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### .prettierignore

```
node_modules/
dist/
build/
*.config.js
*.config.ts
*.log
.env*
```

---

## package.json のスクリプト設定

### 基本スクリプト

```json
{
  "scripts": {
    // === 開発 ===
    "dev": "vite",
    "dev:host": "vite --host",
    
    // === ビルド ===
    "build": "tsc && vite build",
    "build:analyze": "npm run build && npx vite-bundle-analyzer",
    
    // === プレビュー ===
    "preview": "vite preview",
    
    // === 型チェック ===
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    
    // === リンティング ===
    "lint": "eslint src --ext ts,tsx --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    
    // === フォーマット ===
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css,md}\"",
    
    // === 統合コマンド ===
    "dev:all": "concurrently \"npm run type-check:watch\" \"npm run dev\"",
    "check:all": "npm run type-check && npm run lint && npm run format:check",
    "fix:all": "npm run lint:fix && npm run format"
  }
}
```

---

## 環境変数の管理

### .env ファイル設定

```bash
# .env.local (ローカル開発用)
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_TITLE=My React App (Local)
VITE_ENABLE_DEVTOOLS=true

# .env.development
VITE_API_BASE_URL=https://dev-api.example.com/api
VITE_APP_TITLE=My React App (Development)
VITE_ENABLE_DEVTOOLS=true

# .env.production
VITE_API_BASE_URL=https://api.example.com/api
VITE_APP_TITLE=My React App
VITE_ENABLE_DEVTOOLS=false
```

### 型安全な環境変数

```typescript
// src/types/env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_ENABLE_DEVTOOLS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

```typescript
// src/config/env.ts
const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appTitle: import.meta.env.VITE_APP_TITLE,
  enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
} as const;

// バリデーション
if (!env.apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is required');
}

export default env;
```

---

## 🚨 よくある設定エラーと解決方法

### 1. パス解決エラー

**問題**: `@/components/Button` が解決されない

**解決方法**:
```typescript
// vite.config.ts
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 2. JSX変換エラー

**問題**: `React is not defined` エラー

**解決方法**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx"  // "react" から変更
  }
}
```

### 3. ESLint設定エラー

**問題**: `Parsing error: Cannot read file`

**解決方法**:
```json
// .eslintrc.json
{
  "parserOptions": {
    "project": "./tsconfig.json"  // 正しいパスを指定
  }
}
```

---

**📌 重要**: これらの設定ファイルは React + TypeScript 開発の基盤となります。プロジェクトの要件に応じて適切にカスタマイズし、チーム全体で統一された開発環境を構築することが重要です。