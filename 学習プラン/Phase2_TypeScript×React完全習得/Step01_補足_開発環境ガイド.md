# Step01_補足_開発環境ガイド.md

# Step 1: React 基礎と TypeScript 統合 - 開発環境ガイド

> 🐰 **このファイルについて**: React 19 + TypeScript の完全な開発環境構築手順を初心者にもわかりやすく解説します。

## 📖 目次

- [前提条件の確認](#前提条件の確認)
- [Node.js LTS版について](#nodejs-lts版について)
- [プロジェクト作成手順](#プロジェクト作成手順)
- [VS Code拡張機能の推奨設定](#vs-code拡張機能の推奨設定)
- [React DevToolsの使い方](#react-devtoolsの使い方)
- [デバッグ環境の設定](#デバッグ環境の設定)
- [ホットリロードとTypeScriptの連携](#ホットリロードとtypescriptの連携)
- [パフォーマンス最適化設定](#パフォーマンス最適化設定)

---

## 前提条件の確認

### システム要件

**最小要件**:
- OS: Windows 10/11, macOS 10.15+, Ubuntu 18.04+
- RAM: 8GB以上（推奨: 16GB以上）
- ストレージ: 5GB以上の空き容量

**推奨環境**:
- SSD ストレージ（高速なファイルアクセス）
- 安定したインターネット接続
- 最新のブラウザ（Chrome, Firefox, Safari, Edge）

### 必要なツール

1. **Node.js** (LTS版)
2. **npm** または **yarn** (パッケージマネージャー)
3. **Git** (バージョン管理)
4. **VS Code** (推奨エディター)

---

## Node.js LTS版について

### LTS版とは

**LTS (Long Term Support)**: 長期サポート版
- 安定性が重視されたバージョン
- 18ヶ月間のアクティブサポート
- 30ヶ月間のメンテナンスサポート
- プロダクション環境での使用に推奨

### インストール手順

#### Windows

```bash
# 1. Node.js公式サイトからLTS版をダウンロード
# https://nodejs.org/

# 2. インストーラーを実行
# - "Add to PATH" オプションを有効にする
# - npm も同時にインストールされる

# 3. インストール確認
node --version  # v20.x.x
npm --version   # 10.x.x
```

#### macOS

```bash
# 方法1: 公式インストーラー
# https://nodejs.org/ からダウンロード

# 方法2: Homebrew（推奨）
brew install node@20

# 方法3: nvm（Node Version Manager）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

#### Ubuntu/Linux

```bash
# 方法1: NodeSource リポジトリ
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 方法2: Snap
sudo snap install node --classic

# 方法3: nvm（推奨）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

### バージョン管理のベストプラクティス

```bash
# nvm を使用したバージョン管理
nvm list                    # インストール済みバージョン一覧
nvm install 20.10.0        # 特定バージョンのインストール
nvm use 20.10.0            # バージョン切り替え
nvm alias default 20.10.0  # デフォルトバージョン設定

# プロジェクトごとの Node.js バージョン指定
echo "20.10.0" > .nvmrc
nvm use  # .nvmrc のバージョンを使用
```

---

## プロジェクト作成手順

### Step 1: Vite + React + TypeScript プロジェクト作成

```bash
# 1. プロジェクト作成
npm create vite@latest my-react-app -- --template react-ts

# 2. プロジェクトディレクトリに移動
cd my-react-app

# 3. 依存関係のインストール
npm install

# 4. 開発サーバー起動
npm run dev
```

### Step 2: 追加パッケージのインストール

```bash
# TypeScript 関連
npm install -D typescript @types/react @types/react-dom

# ESLint + Prettier
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier

# React 関連ツール
npm install -D @vitejs/plugin-react
npm install -D @types/node  # Node.js の型定義

# 開発支援ツール
npm install -D concurrently  # 複数コマンドの並列実行
npm install -D cross-env     # 環境変数の設定
```

### Step 3: プロジェクト構造の確認

```
my-react-app/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/     # 作成推奨
│   ├── hooks/         # 作成推奨
│   ├── types/         # 作成推奨
│   ├── utils/         # 作成推奨
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### Step 4: 推奨ディレクトリ構造の作成

```bash
# 推奨ディレクトリの作成
mkdir src/components src/hooks src/types src/utils src/styles

# 基本的なファイルの作成
touch src/types/index.ts
touch src/utils/index.ts
touch src/hooks/index.ts
```

---

## VS Code拡張機能の推奨設定

### 必須拡張機能

```json
// .vscode/extensions.json
{
  "recommendations": [
    // TypeScript 関連
    "ms-vscode.vscode-typescript-next",
    
    // React 関連
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    
    // コード品質
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    
    // 開発支援
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-close-tag",
    
    // Git 関連
    "eamodio.gitlens",
    
    // その他
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml"
  ]
}
```

### VS Code 設定

```json
// .vscode/settings.json
{
  // TypeScript 設定
  "typescript.preferences.quoteStyle": "single",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.suggest.autoImports": true,
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  
  // エディター設定
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  
  // ファイル設定
  "files.autoSave": "onFocusChange",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  
  // 検索設定
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  },
  
  // Emmet 設定
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  
  // React 特有設定
  "typescript.preferences.jsx": "react-jsx",
  "javascript.preferences.jsx": "react-jsx"
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
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true,
      "resolveSourceMapLocations": [
        "${workspaceFolder}/**",
        "!**/node_modules/**"
      ]
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
      "label": "dev",
      "type": "npm",
      "script": "dev",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "build",
      "type": "npm",
      "script": "build",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "type-check",
      "type": "shell",
      "command": "npx tsc --noEmit",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

---

## React DevToolsの使い方

### インストール

**ブラウザ拡張機能**:
- [Chrome Web Store](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### 基本的な使い方

#### 1. コンポーネントツリーの確認

```typescript
// App.tsx
function App(): JSX.Element {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <Header title="My App" />
      <Counter count={count} onIncrement={() => setCount(count + 1)} />
      <Footer />
    </div>
  );
}
```

**DevTools での確認方法**:
1. ブラウザの開発者ツールを開く (F12)
2. "Components" タブを選択
3. コンポーネントツリーを確認
4. 各コンポーネントの Props と State を確認

#### 2. Props と State の監視

```typescript
interface CounterProps {
  count: number;
  onIncrement: () => void;
}

function Counter({ count, onIncrement }: CounterProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p>Count: {count}</p>
      <button onClick={onIncrement}>
        {isHovered ? 'Click me!' : 'Increment'}
      </button>
    </div>
  );
}
```

**監視方法**:
- コンポーネントを選択
- 右側パネルで Props と State の値を確認
- 値の変更をリアルタイムで監視

#### 3. パフォーマンス分析

```typescript
// React.memo を使用した最適化
const ExpensiveComponent = React.memo(({ data }: { data: string[] }) => {
  console.log('ExpensiveComponent rendered');
  
  return (
    <ul>
      {data.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
});
```

**Profiler の使用**:
1. "Profiler" タブを選択
2. 記録開始ボタンをクリック
3. アプリケーションを操作
4. 記録停止
5. レンダリング時間とコンポーネントの更新を分析

---

## デバッグ環境の設定

### ブラウザでのデバッグ

#### 1. ソースマップの活用

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // ソースマップを有効化
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

#### 2. console.log の効果的な使用

```typescript
function UserProfile({ userId }: { userId: string }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log('🔍 UserProfile: useEffect triggered', { userId });
    
    const fetchUser = async () => {
      try {
        console.log('📡 Fetching user data...');
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        
        console.log('✅ User data received:', userData);
        setUser(userData);
      } catch (error) {
        console.error('❌ Error fetching user:', error);
      } finally {
        setLoading(false);
        console.log('🏁 Loading completed');
      }
    };
    
    fetchUser();
  }, [userId]);
  
  if (loading) {
    console.log('⏳ Rendering loading state');
    return <div>Loading...</div>;
  }
  
  if (!user) {
    console.log('👤 No user data, rendering empty state');
    return <div>User not found</div>;
  }
  
  console.log('🎨 Rendering user profile', user);
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

#### 3. React Error Boundary

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('🚨 Error Boundary caught an error:', error);
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Error details:', error, errorInfo);
    // エラーログサービスに送信
    // logErrorToService(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', border: '1px solid red' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// 使用例
function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <Header />
      <MainContent />
      <Footer />
    </ErrorBoundary>
  );
}
```

### VS Code でのデバッグ

#### 1. ブレークポイントの設定

```typescript
function calculateTotal(items: CartItem[]): number {
  let total = 0;
  
  for (const item of items) {
    // ここにブレークポイントを設定
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
  }
  
  return total;
}
```

**ブレークポイント設定方法**:
1. VS Code で該当行の行番号左側をクリック
2. 赤い点（ブレークポイント）が表示される
3. F5 でデバッグ開始
4. ブレークポイントで実行が停止
5. 変数の値を確認、ステップ実行が可能

#### 2. デバッグコンソールの活用

```typescript
function processUserData(users: User[]): ProcessedUser[] {
  return users.map(user => {
    // デバッグコンソールで確認可能
    const processed = {
      id: user.id,
      displayName: `${user.firstName} ${user.lastName}`,
      isActive: user.lastLoginDate > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    };
    
    return processed;
  });
}
```

---

## ホットリロードとTypeScriptの連携

### Vite の高速リロード

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Fast Refresh の設定
      fastRefresh: true,
    })
  ],
  server: {
    // ホットリロード設定
    hmr: {
      overlay: true, // エラーオーバーレイ表示
    },
    // ファイル監視設定
    watch: {
      usePolling: true, // WSL環境での推奨設定
    },
  },
  // TypeScript 設定
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
});
```

### TypeScript の増分コンパイル

```json
// tsconfig.json
{
  "compilerOptions": {
    // 増分コンパイル有効化
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",
    
    // 高速化設定
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    
    // モジュール解決の最適化
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### 開発効率化のスクリプト

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "dev:host": "vite --host",
    "dev:debug": "vite --debug",
    "build": "tsc && vite build",
    "build:analyze": "vite build --mode analyze",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    "dev:all": "concurrently \"npm run type-check:watch\" \"npm run dev\""
  }
}
```

---

## パフォーマンス最適化設定

### バンドル分析

```bash
# バンドル分析ツールのインストール
npm install -D rollup-plugin-visualizer

# vite.config.ts に追加
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
});
```

### 開発サーバーの最適化

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    // ポート設定
    port: 3000,
    strictPort: true,
    
    // CORS 設定
    cors: true,
    
    // プロキシ設定（API サーバー連携）
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
    
    // ファイル監視の最適化
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },
  
  // ビルド最適化
  build: {
    // チャンク分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns'],
        },
      },
    },
    
    // 圧縮設定
    minify: 'esbuild',
    target: 'esnext',
    
    // ソースマップ
    sourcemap: true,
  },
});
```

### メモリ使用量の最適化

```bash
# Node.js のメモリ制限を増加
export NODE_OPTIONS="--max-old-space-size=4096"

# または package.json のスクリプトで
{
  "scripts": {
    "dev": "cross-env NODE_OPTIONS=\"--max-old-space-size=4096\" vite",
    "build": "cross-env NODE_OPTIONS=\"--max-old-space-size=4096\" tsc && vite build"
  }
}
```

---

## 🚨 トラブルシューティング

### よくある問題と解決方法

#### 1. ポートが既に使用されている

```bash
# エラー: Port 3000 is already in use
# 解決方法1: 別のポートを使用
npm run dev -- --port 3001

# 解決方法2: プロセスを終了
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

#### 2. TypeScript エラーが表示されない

```bash
# VS Code の TypeScript サーバーを再起動
# Ctrl+Shift+P → "TypeScript: Restart TS Server"

# または手動で型チェック実行
npm run type-check
```

#### 3. ホットリロードが動作しない

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    watch: {
      usePolling: true, // WSL や Docker 環境で必要
      interval: 1000,
    },
  },
});
```

#### 4. インポートパスが解決されない

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"]
    }
  }
}
```

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

---

**📌 重要**: この開発環境ガイドに従って環境を構築することで、効率的で快適な React + TypeScript 開発が可能になります。問題が発生した場合は、トラブルシューティングセクションを参照してください。