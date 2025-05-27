# Step01_補足_トラブルシューティング.md

# Step 1: React 基礎と TypeScript 統合 - トラブルシューティング

> 🐰 **このファイルについて**: React + TypeScript 開発でよく遭遇するエラーと解決方法を初心者にもわかりやすく解説します。

## 📖 目次

- [TypeScript コンパイルエラー](#typescript-コンパイルエラー)
- [React 特有のエラー](#react-特有のエラー)
- [JSX 関連のエラー](#jsx-関連のエラー)
- [Props と型エラー](#props-と型エラー)
- [Hooks 関連のエラー](#hooks-関連のエラー)
- [開発環境のエラー](#開発環境のエラー)
- [ビルド・デプロイエラー](#ビルドデプロイエラー)
- [パフォーマンス問題](#パフォーマンス問題)

---

## TypeScript コンパイルエラー

### 1. 型注釈エラー

#### エラー: `Type 'string' is not assignable to type 'number'`

**問題のコード**:
```typescript
interface UserProps {
  age: number;
}

function User({ age }: UserProps) {
  return <div>Age: {age}</div>;
}

// エラーが発生
<User age="25" />
```

**解決方法**:
```typescript
// 解決方法1: 正しい型で渡す
<User age={25} />

// 解決方法2: 型変換
<User age={parseInt("25")} />

// 解決方法3: Props型を修正（文字列も受け入れる）
interface UserProps {
  age: number | string;
}

function User({ age }: UserProps) {
  const numericAge = typeof age === 'string' ? parseInt(age) : age;
  return <div>Age: {numericAge}</div>;
}
```

#### エラー: `Property 'xxx' does not exist on type`

**問題のコード**:
```typescript
interface User {
  name: string;
  age: number;
}

function displayUser(user: User) {
  console.log(user.email); // エラー: Property 'email' does not exist
}
```

**解決方法**:
```typescript
// 解決方法1: インターフェースに追加
interface User {
  name: string;
  age: number;
  email: string; // 追加
}

// 解決方法2: オプショナルプロパティ
interface User {
  name: string;
  age: number;
  email?: string; // オプショナル
}

function displayUser(user: User) {
  if (user.email) {
    console.log(user.email);
  }
}

// 解決方法3: 型アサーション（注意して使用）
function displayUser(user: User) {
  console.log((user as any).email);
}
```

### 2. null/undefined エラー

#### エラー: `Object is possibly 'null' or 'undefined'`

**問題のコード**:
```typescript
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <div>
      <h1>{user.name}</h1> {/* エラー: Object is possibly 'null' */}
    </div>
  );
}
```

**解決方法**:
```typescript
// 解決方法1: 条件付きレンダリング
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  );
}

// 解決方法2: Optional Chaining
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <div>
      <h1>{user?.name || 'Unknown'}</h1>
    </div>
  );
}

// 解決方法3: 論理演算子
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <div>
      {user && <h1>{user.name}</h1>}
    </div>
  );
}
```

---

## React 特有のエラー

### 3. React Hook エラー

#### エラー: `React Hook "useState" is called conditionally`

**問題のコード**:
```typescript
function MyComponent({ showState }: { showState: boolean }) {
  if (showState) {
    const [count, setCount] = useState(0); // エラー: 条件付きでHookを呼び出し
  }
  
  return <div>Component</div>;
}
```

**解決方法**:
```typescript
// 解決方法1: Hookを常に呼び出す
function MyComponent({ showState }: { showState: boolean }) {
  const [count, setCount] = useState(0);
  
  if (!showState) {
    return <div>State hidden</div>;
  }
  
  return (
    <div>
      Count: {count}
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// 解決方法2: コンポーネントを分割
function StatefulComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      Count: {count}
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

function MyComponent({ showState }: { showState: boolean }) {
  if (!showState) {
    return <div>State hidden</div>;
  }
  
  return <StatefulComponent />;
}
```

#### エラー: `Cannot read property 'xxx' of undefined` (useEffect)

**問題のコード**:
```typescript
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User>();
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  useEffect(() => {
    console.log(user.name); // エラー: user が undefined の可能性
  }, [user]);
  
  return <div>{user?.name}</div>;
}
```

**解決方法**:
```typescript
// 解決方法1: 条件チェック
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User>();
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  useEffect(() => {
    if (user) {
      console.log(user.name);
    }
  }, [user]);
  
  return <div>{user?.name}</div>;
}

// 解決方法2: 初期値を設定
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  useEffect(() => {
    if (user) {
      console.log(user.name);
    }
  }, [user]);
  
  return <div>{user?.name}</div>;
}
```

---

## JSX 関連のエラー

### 4. JSX 要素エラー

#### エラー: `JSX element implicitly has type 'any'`

**問題のコード**:
```typescript
function MyComponent() {
  const element = <div>Hello</div>; // 型が推論されない場合
  return element;
}
```

**解決方法**:
```typescript
// 解決方法1: 明示的な型注釈
function MyComponent(): JSX.Element {
  const element: JSX.Element = <div>Hello</div>;
  return element;
}

// 解決方法2: React.ReactElement を使用
function MyComponent(): React.ReactElement {
  const element: React.ReactElement = <div>Hello</div>;
  return element;
}

// 解決方法3: 直接返す
function MyComponent(): JSX.Element {
  return <div>Hello</div>;
}
```

#### エラー: `'React' must be in scope when using JSX`

**問題のコード**:
```typescript
// React 16以前の書き方
function MyComponent() {
  return <div>Hello</div>; // エラー: React がインポートされていない
}
```

**解決方法**:
```typescript
// 解決方法1: React をインポート（React 16以前）
import React from 'react';

function MyComponent() {
  return <div>Hello</div>;
}

// 解決方法2: 新しいJSX変換を使用（React 17+）
// tsconfig.json で "jsx": "react-jsx" を設定
function MyComponent() {
  return <div>Hello</div>; // React のインポート不要
}
```

---

## Props と型エラー

### 5. Props 型エラー

#### エラー: `Type '{}' is missing the following properties`

**問題のコード**:
```typescript
interface ButtonProps {
  text: string;
  onClick: () => void;
}

function Button({ text, onClick }: ButtonProps) {
  return <button onClick={onClick}>{text}</button>;
}

// エラー: 必須プロパティが不足
<Button />
```

**解決方法**:
```typescript
// 解決方法1: 必須プロパティを渡す
<Button text="Click me" onClick={() => console.log('clicked')} />

// 解決方法2: オプショナルプロパティにする
interface ButtonProps {
  text?: string;
  onClick?: () => void;
}

function Button({ text = 'Button', onClick = () => {} }: ButtonProps) {
  return <button onClick={onClick}>{text}</button>;
}

// 解決方法3: デフォルトProps を使用
interface ButtonProps {
  text: string;
  onClick: () => void;
}

function Button({ text, onClick }: ButtonProps) {
  return <button onClick={onClick}>{text}</button>;
}

Button.defaultProps = {
  text: 'Button',
  onClick: () => {},
};
```

#### エラー: `Type 'ReactNode' is not assignable to type 'string'`

**問題のコード**:
```typescript
interface TitleProps {
  title: string;
}

function Title({ title }: TitleProps) {
  return <h1>{title}</h1>;
}

// エラー: ReactNode を string に渡そうとしている
<Title title={<span>Hello</span>} />
```

**解決方法**:
```typescript
// 解決方法1: 型を ReactNode に変更
interface TitleProps {
  title: React.ReactNode;
}

function Title({ title }: TitleProps) {
  return <h1>{title}</h1>;
}

// 解決方法2: 文字列のみを受け入れる
<Title title="Hello" />

// 解決方法3: Union型を使用
interface TitleProps {
  title: string | React.ReactElement;
}
```

---

## Hooks 関連のエラー

### 6. useState エラー

#### エラー: `Argument of type 'string' is not assignable to parameter of type 'SetStateAction<number>'`

**問題のコード**:
```typescript
function Counter() {
  const [count, setCount] = useState(0);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCount(event.target.value); // エラー: string を number に設定
  };
  
  return <input onChange={handleChange} />;
}
```

**解決方法**:
```typescript
// 解決方法1: 型変換
function Counter() {
  const [count, setCount] = useState(0);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCount(Number(event.target.value));
  };
  
  return <input type="number" onChange={handleChange} />;
}

// 解決方法2: 文字列として管理
function Counter() {
  const [count, setCount] = useState('0');
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCount(event.target.value);
  };
  
  return <input onChange={handleChange} />;
}

// 解決方法3: 型ガード
function Counter() {
  const [count, setCount] = useState(0);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numValue = Number(value);
    
    if (!isNaN(numValue)) {
      setCount(numValue);
    }
  };
  
  return <input type="number" onChange={handleChange} />;
}
```

### 7. useEffect エラー

#### エラー: `Effect callbacks are synchronous to prevent race conditions`

**問題のコード**:
```typescript
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(async () => { // エラー: async 関数を直接使用
    const userData = await fetchUser(userId);
    setUser(userData);
  }, [userId]);
  
  return <div>{user?.name}</div>;
}
```

**解決方法**:
```typescript
// 解決方法1: 内部で async 関数を定義
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUser(userId);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    
    fetchData();
  }, [userId]);
  
  return <div>{user?.name}</div>;
}

// 解決方法2: Promise を使用
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(error => console.error('Failed to fetch user:', error));
  }, [userId]);
  
  return <div>{user?.name}</div>;
}

// 解決方法3: カスタムHook を使用
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await fetchUser(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);
  
  return { user, loading, error };
}

function UserProfile({ userId }: { userId: string }) {
  const { user, loading, error } = useUser(userId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{user?.name}</div>;
}
```

---

## 開発環境のエラー

### 8. モジュール解決エラー

#### エラー: `Cannot find module '@/components/Button'`

**問題**: パスエイリアスが設定されていない

**解決方法**:
```typescript
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

#### エラー: `Module not found: Error: Can't resolve 'react'`

**問題**: React がインストールされていない

**解決方法**:
```bash
# React をインストール
npm install react react-dom

# TypeScript 用の型定義をインストール
npm install -D @types/react @types/react-dom
```

---

## ビルド・デプロイエラー

### 9. ビルドエラー

#### エラー: `TypeScript error in xxx.tsx: Type error`

**問題**: 型エラーがあるままビルドしようとしている

**解決方法**:
```bash
# 型チェックを実行
npm run type-check

# エラーを修正後、再ビルド
npm run build

# 型チェックを無視してビルド（非推奨）
npm run build -- --no-type-check
```

#### エラー: `Out of memory` during build

**問題**: メモリ不足

**解決方法**:
```bash
# Node.js のメモリ制限を増加
export NODE_OPTIONS="--max-old-space-size=4096"

# または package.json で設定
{
  "scripts": {
    "build": "cross-env NODE_OPTIONS=\"--max-old-space-size=4096\" vite build"
  }
}
```

---

## パフォーマンス問題

### 10. レンダリング問題

#### 問題: 不要な再レンダリング

**問題のコード**:
```typescript
function Parent() {
  const [count, setCount] = useState(0);
  
  const expensiveValue = {
    data: 'some data',
    calculate: () => {
      // 重い計算
      return count * 1000;
    }
  };
  
  return (
    <div>
      <Child value={expensiveValue} />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

const Child = ({ value }: { value: any }) => {
  console.log('Child rendered'); // 毎回実行される
  return <div>{value.calculate()}</div>;
};
```

**解決方法**:
```typescript
// 解決方法1: React.memo を使用
const Child = React.memo(({ value }: { value: any }) => {
  console.log('Child rendered');
  return <div>{value.calculate()}</div>;
});

// 解決方法2: useMemo を使用
function Parent() {
  const [count, setCount] = useState(0);
  
  const expensiveValue = useMemo(() => ({
    data: 'some data',
    calculate: () => count * 1000
  }), [count]);
  
  return (
    <div>
      <Child value={expensiveValue} />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// 解決方法3: useCallback を使用
function Parent() {
  const [count, setCount] = useState(0);
  
  const calculate = useCallback(() => {
    return count * 1000;
  }, [count]);
  
  const expensiveValue = useMemo(() => ({
    data: 'some data',
    calculate
  }), [calculate]);
  
  return (
    <div>
      <Child value={expensiveValue} />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

## 🚨 緊急時の対処法

### 開発サーバーが起動しない

```bash
# 1. node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install

# 2. キャッシュをクリア
npm start -- --reset-cache

# 3. ポートを変更
npm start -- --port 3001
```

### TypeScript エラーが大量に発生

```bash
# 1. TypeScript サーバーを再起動（VS Code）
# Ctrl+Shift+P → "TypeScript: Restart TS Server"

# 2. 段階的に strict モードを無効化
# tsconfig.json で一時的に "strict": false

# 3. 型チェックを段階的に有効化
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": true,  // 段階的に有効化
    "strictNullChecks": false
  }
}
```

---

**📌 重要**: エラーが発生した際は、まずエラーメッセージをよく読み、該当する解決方法を試してください。それでも解決しない場合は、エラーメッセージをそのまま検索エンジンで調べることで、多くの場合解決策が見つかります。