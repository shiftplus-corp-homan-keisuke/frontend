# STEP01 補足資料：開発環境ガイド

> 🛠️ **このファイルについて**: React × TypeScript の開発環境構築から設定まで、効率的な開発のためのセットアップガイドです。

---

## 📚 目次

- [必要なソフトウェア](#必要なソフトウェア)
- [新規プロジェクト作成](#新規プロジェクト作成)
- [開発環境設定](#開発環境設定)
- [VSCode設定](#vscode設定)
- [パッケージ管理](#パッケージ管理)
- [ビルドツール設定](#ビルドツール設定)
- [デバッグ環境](#デバッグ環境)
- [テスト環境](#テスト環境)
- [本番環境準備](#本番環境準備)

---

## 必要なソフトウェア

### 基本要件

| ソフトウェア | 推奨バージョン | 用途 |
|-------------|---------------|------|
| **Node.js** | 18.x 以上 | JavaScript実行環境 |
| **npm** | 9.x 以上 | パッケージ管理 |
| **Git** | 2.x 以上 | バージョン管理 |
| **VSCode** | 最新版 | エディタ |

### インストール手順

#### 1. Node.js のインストール

```bash
# 公式サイトからダウンロード
# https://nodejs.org/

# バージョン確認
node --version
npm --version

# 推奨: Node Version Manager (nvm) を使用
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Windows
# https://github.com/coreybutler/nvm-windows

# nvmでNode.jsをインストール
nvm install 18
nvm use 18
```

#### 2. Git のインストール

```bash
# macOS (Homebrew)
brew install git

# Windows
# https://git-scm.com/download/win

# Ubuntu/Debian
sudo apt-get install git

# バージョン確認
git --version
```

#### 3. VSCode のインストール

```bash
# 公式サイトからダウンロード
# https://code.visualstudio.com/

# macOS (Homebrew Cask)
brew install --cask visual-studio-code

# Windows (Chocolatey)
choco install vscode
```

---

## 新規プロジェクト作成

### Create React App を使用した作成

```bash
# TypeScript テンプレートでプロジェクト作成
npx create-react-app my-react-app --template typescript

# プロジェクトディレクトリに移動
cd my-react-app

# 開発サーバー起動
npm start
```

### Vite を使用した作成（推奨）

```bash
# Viteでプロジェクト作成
npm create vite@latest my-react-app -- --template react-ts

# プロジェクトディレクトリに移動
cd my-react-app

# 依存関係をインストール
npm install

# 開発サーバー起動
npm run dev
```

### 手動でのプロジェクト作成

```bash
# プロジェクトディレクトリ作成
mkdir my-react-app
cd my-react-app

# package.json 初期化
npm init -y

# React と TypeScript の依存関係をインストール
npm install react react-dom
npm install --save-dev @types/react @types/react-dom typescript

# 開発用依存関係をインストール
npm install --save-dev @vitejs/plugin-react vite
```

### プロジェクト構造

```
my-react-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 開発環境設定

### TypeScript 設定 (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Vite 設定 (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
```

### ESLint 設定 (.eslintrc.json)

```json
{
  "env": {
    "browser": true,
    "es2020": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "react-hooks",
    "@typescript-eslint",
    "jsx-a11y"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

### Prettier 設定 (.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid"
}
```

---

## VSCode設定

### 推奨拡張機能

```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "usernamehw.errorlens",
    "gruntfuggly.todo-tree",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### ワークスペース設定

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  
  "files.associations": {
    "*.css": "tailwindcss"
  },
  
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### デバッグ設定

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    },
    {
      "name": "Attach to Chrome",
      "port": 9222,
      "request": "attach",
      "type": "chrome",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### タスク設定

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "script": "start",
      "group": "build",
      "label": "npm: start",
      "detail": "npm run start"
    },
    {
      "type": "npm",
      "script": "build",
      "group": "build",
      "label": "npm: build",
      "detail": "npm run build"
    },
    {
      "type": "npm",
      "script": "test",
      "group": "test",
      "label": "npm: test",
      "detail": "npm run test"
    },
    {
      "type": "npm",
      "script": "lint",
      "group": "build",
      "label": "npm: lint",
      "detail": "npm run lint"
    }
  ]
}
```

---

## パッケージ管理

### 基本的な依存関係

```json
// package.json
{
  "name": "my-react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

### よく使用される追加パッケージ

```bash
# ルーティング
npm install react-router-dom
npm install --save-dev @types/react-router-dom

# 状態管理
npm install zustand
# または
npm install @reduxjs/toolkit react-redux

# スタイリング
npm install styled-components
npm install --save-dev @types/styled-components
# または
npm install tailwindcss postcss autoprefixer

# フォーム管理
npm install react-hook-form
npm install @hookform/resolvers yup

# HTTP クライアント
npm install axios
# または
npm install @tanstack/react-query

# ユーティリティ
npm install lodash
npm install --save-dev @types/lodash

# 日付操作
npm install date-fns
# または
npm install dayjs

# アイコン
npm install react-icons

# UI コンポーネント
npm install @mui/material @emotion/react @emotion/styled
# または
npm install antd
```

---

## ビルドツール設定

### 本番ビルド最適化

```typescript
// vite.config.ts (本番用設定)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // 本番では無効
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // console.log を削除
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
})
```

### 環境変数設定

```bash
# .env.local
VITE_API_URL=http://localhost:8000/api
VITE_APP_TITLE=My React App
VITE_ENABLE_ANALYTICS=false
```

```bash
# .env.production
VITE_API_URL=https://api.myapp.com
VITE_APP_TITLE=My React App
VITE_ENABLE_ANALYTICS=true
```

```typescript
// src/config/env.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  appTitle: import.meta.env.VITE_APP_TITLE || 'React App',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}
```

---

## デバッグ環境

### React Developer Tools

```bash
# Chrome拡張機能をインストール
# https://chrome.google.com/webstore/detail/react-developer-tools/

# Firefox拡張機能をインストール
# https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

### ブラウザデバッグ設定

```typescript
// src/utils/debug.ts
export const debug = {
  log: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  
  error: (message: string, error?: any) => {
    if (import.meta.env.DEV) {
      console.error(`[ERROR] ${message}`, error);
    }
  },
  
  table: (data: any) => {
    if (import.meta.env.DEV) {
      console.table(data);
    }
  },
};

// 使用例
debug.log('Component rendered', { props, state });
```

### パフォーマンス監視

```typescript
// src/utils/performance.ts
export const performance = {
  mark: (name: string) => {
    if (import.meta.env.DEV) {
      window.performance.mark(name);
    }
  },
  
  measure: (name: string, startMark: string, endMark: string) => {
    if (import.meta.env.DEV) {
      window.performance.measure(name, startMark, endMark);
      const measure = window.performance.getEntriesByName(name)[0];
      console.log(`${name}: ${measure.duration}ms`);
    }
  },
};

// 使用例
performance.mark('component-render-start');
// レンダリング処理
performance.mark('component-render-end');
performance.measure('component-render', 'component-render-start', 'component-render-end');
```

---

## テスト環境

### Vitest 設定

```bash
# テスト関連パッケージをインストール
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

```typescript
// vite.config.ts にテスト設定を追加
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'

// グローバルなテストセットアップ
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
```

### テストの例

```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from '../Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

---

## 本番環境準備

### Docker 設定

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### CI/CD 設定 (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run type check
      run: npm run type-check
    
    - name: Run tests
      run: npm run test
    
    - name: Build
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to production
      run: |
        # デプロイスクリプト
        echo "Deploying to production..."
```

---

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 1. ポートが既に使用されている

```bash
# ポートを確認
lsof -ti:3000

# プロセスを終了
kill -9 $(lsof -ti:3000)

# 別のポートで起動
npm run dev -- --port 3001
```

#### 2. node_modules の問題

```bash
# キャッシュをクリア
npm cache clean --force

# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

#### 3. TypeScript エラー

```bash
# TypeScript の型チェック
npm run type-check

# 型定義ファイルを再インストール
npm install --save-dev @types/react @types/react-dom
```

---

## 📚 参考リソース

### 公式ドキュメント
- [React 公式ドキュメント](https://react.dev/)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/)
- [Vite 公式ドキュメント](https://vitejs.dev/)

### 開発ツール
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Can I Use](https://caniuse.com/)

### コミュニティ
- [React Community](https://react.dev/community)
- [TypeScript Community](https://www.typescriptlang.org/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/reactjs+typescript)

---

> 💡 **ヒント**: 開発環境は一度設定すれば長期間使用できます。時間をかけて丁寧に設定し、チーム全体で統一された環境を構築することで、開発効率が大幅に向上します。