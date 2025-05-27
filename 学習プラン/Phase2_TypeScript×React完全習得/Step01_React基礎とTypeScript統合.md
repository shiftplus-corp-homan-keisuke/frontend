# Step 1: React 基礎と TypeScript 統合（React初心者・TypeScript上級者向け）

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step01_補足_専門用語集.md) - React + TypeScript の重要な概念と用語の詳細解説
> - 🛠️ [開発環境ガイド](./Step01_補足_開発環境ガイド.md) - React 19 + TypeScript 環境構築と設定方法
> - ⚙️ [設定ファイル解説](./Step01_補足_設定ファイル解説.md) - tsconfig.json、vite.config.ts 等の詳細設定
> - 💻 [実践コード例](./Step01_補足_実践コード例.md) - 段階的なコンポーネント作成例集
> - 🚨 [トラブルシューティング](./Step01_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step01_補足_参考リソース.md) - 学習に役立つリンク集

## 📅 学習期間・目標

**期間**: Step 1
**総学習時間**: 6 時間
**学習スタイル**: 理論 25% + 実践コード 45% + 演習 30%

### 🎯 Step 1 到達目標

- [ ] React の基本概念とコンポーネント思考の理解
- [ ] React 19 + TypeScript 開発環境の構築
- [ ] 基本的な JSX と型システムの統合理解
- [ ] 段階的な型安全コンポーネント設計の習得
- [ ] 実用的な React アプリケーションの作成

## 📚 理論学習内容

### Section 1: React 基礎理解（1.5時間）

#### 🎯 React とは何か（TypeScript 上級者向け解説）

> 💡 **TypeScript 上級者への配慮**: React の概念を TypeScript の型システムと関連付けて説明します

**💡 なぜ React を学ぶのか**

TypeScript 上級者にとって、React は型安全性を保ちながら宣言的 UI を構築できる最適なライブラリです。関数型プログラミングの概念と TypeScript の型システムが自然に融合します。

**🎯 React の核心概念**

```typescript
// 1. コンポーネント = 型安全な関数
// TypeScript の関数型と同じように、入力（Props）と出力（JSX.Element）が明確
type ComponentFunction<P> = (props: P) => JSX.Element;

// 2. 宣言的 UI = 状態から UI への純粋関数
// state => UI の関数として捉える
type UIFunction<S> = (state: S) => JSX.Element;

// 3. 単方向データフロー = 型安全なデータの流れ
// Parent -> Child への Props 型の継承
interface ParentState {
  user: User;
  settings: Settings;
}

interface ChildProps {
  user: User; // Parent から Child への型安全な受け渡し
}
```

#### 🧩 コンポーネント思考法

**💡 TypeScript 上級者向けの理解**

React コンポーネントは、TypeScript の関数と同じ原則で設計します：

```typescript
// 1. 純粋関数としてのコンポーネント
// 同じ Props なら常に同じ結果を返す
function PureComponent({ name }: { name: string }): JSX.Element {
  return <h1>Hello, {name}!</h1>;
}

// 2. 型安全な合成（Composition）
// 小さなコンポーネントを組み合わせて大きなコンポーネントを作る
interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps): JSX.Element {
  return (
    <div>
      <Avatar src={user.avatar} />
      <UserName name={user.name} />
      <UserEmail email={user.email} />
    </div>
  );
}

// 3. 関心の分離
// 各コンポーネントは単一の責任を持つ（SRP）
function Avatar({ src }: { src: string }): JSX.Element {
  return <img src={src} alt="User avatar" />;
}

function UserName({ name }: { name: string }): JSX.Element {
  return <h2>{name}</h2>;
}

function UserEmail({ email }: { email: string }): JSX.Element {
  return <p>{email}</p>;
}
```

#### 📝 JSX 基本記法（型システム統合）

**💡 JSX = TypeScript + XML の融合**

```typescript
// 1. JavaScript 式の埋め込み（型安全）
function Greeting({ name, age }: { name: string; age: number }): JSX.Element {
  const message = `Hello, ${name}!`; // string 型
  const isAdult = age >= 18; // boolean 型
  
  return (
    <div>
      <h1>{message}</h1>
      {isAdult && <p>You are an adult.</p>}
      <p>Age: {age}</p>
    </div>
  );
}

// 2. 条件付きレンダリング（型ガード活用）
function StatusMessage({ status }: { status: 'loading' | 'success' | 'error' }): JSX.Element {
  // TypeScript の型ガードと同じ考え方
  switch (status) {
    case 'loading':
      return <div>Loading...</div>;
    case 'success':
      return <div>Success!</div>;
    case 'error':
      return <div>Error occurred</div>;
    default:
      // TypeScript の exhaustive check
      const _exhaustiveCheck: never = status;
      return _exhaustiveCheck;
  }
}

// 3. リストレンダリング（配列型の活用）
function UserList({ users }: { users: User[] }): JSX.Element {
  return (
    <ul>
      {users.map((user: User) => (
        <li key={user.id}>
          <UserCard user={user} />
        </li>
      ))}
    </ul>
  );
}
```

### Section 2: 環境構築（1時間）

#### 🛠️ React 19 + TypeScript 開発環境セットアップ

> 💡 **詳細解説**: 完全な環境構築手順は [Step01\_補足\_開発環境ガイド.md](./Step01_補足_開発環境ガイド.md) を見てね 🐰

**💡 TypeScript 上級者向けの最適化設定**

```bash
# 1. 最新の React 19 + TypeScript 環境
npm create vite@latest react-ts-app -- --template react-ts
cd react-ts-app
npm install

# 2. TypeScript 上級者向けの追加ツール
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D @types/react @types/react-dom

# 3. 開発サーバー起動
npm run dev
```

#### ⚙️ TypeScript 設定（React 特化・最小構成）

```json
// tsconfig.json - React 初心者向けの最小設定
{
  "compilerOptions": {
    // 基本設定
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    
    // React 設定
    "jsx": "react-jsx",        // React 17+ の新しい JSX 変換
    "allowJs": false,          // TypeScript のみ使用
    "noEmit": true,           // Vite がビルドを担当
    
    // 型チェック（段階的に厳しく）
    "strict": true,           // 厳密な型チェック
    "noImplicitAny": true,    // any 型の暗黙的使用を禁止
    "strictNullChecks": true, // null/undefined の厳密チェック
    
    // 開発体験向上
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    
    // パス解決
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### 🎯 基本 Props 型（30分）

**💡 TypeScript 上級者なら理解しやすい Props 型設計**

```typescript
// 1. 基本的な Props 型定義
interface GreetingProps {
  name: string;
  age?: number;           // オプショナル型
  isVip: boolean;
  hobbies: string[];      // 配列型
}

function Greeting({ name, age, isVip, hobbies }: GreetingProps): JSX.Element {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>Age: {age}</p>}
      {isVip && <span>⭐ VIP Member</span>}
      <ul>
        {hobbies.map((hobby, index) => (
          <li key={index}>{hobby}</li>
        ))}
      </ul>
    </div>
  );
}

// 2. Union 型を活用した Props
interface AlertProps {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  dismissible?: boolean;
}

function Alert({ type, message, dismissible = false }: AlertProps): JSX.Element {
  const getIcon = (): string => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
    }
  };

  return (
    <div className={`alert alert-${type}`}>
      <span>{getIcon()}</span>
      <span>{message}</span>
      {dismissible && <button>×</button>}
    </div>
  );
}

// 3. オブジェクト型の Props
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface UserCardProps {
  user: User;
  showEmail?: boolean;
}

function UserCard({ user, showEmail = true }: UserCardProps): JSX.Element {
  return (
    <div className="user-card">
      {user.avatar && <img src={user.avatar} alt={`${user.name}'s avatar`} />}
      <h3>{user.name}</h3>
      {showEmail && <p>{user.email}</p>}
    </div>
  );
}
```

#### 🖱️ イベントハンドラー型（30分）

**💡 React 特有のイベント型システム**

```typescript
// 1. 基本的なイベントハンドラー
function Button(): JSX.Element {
  // React.MouseEvent<HTMLButtonElement> - React 特有の型
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    console.log('Button clicked!');
    console.log('Event target:', event.target);
    console.log('Current target:', event.currentTarget);
  };

  return <button onClick={handleClick}>Click me</button>;
}

// 2. フォームイベントの処理
function ContactForm(): JSX.Element {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault(); // デフォルト動作を防ぐ
    console.log('Form submitted');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type } = event.target;
    console.log(`${name}: ${value} (${type})`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Your name"
        onChange={handleInputChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Your email"
        onChange={handleInputChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// 3. カスタムイベントハンドラー型
interface CustomButtonProps {
  onClick: (message: string) => void; // カスタムコールバック型
  children: React.ReactNode;
}

function CustomButton({ onClick, children }: CustomButtonProps): JSX.Element {
  const handleClick = (): void => {
    onClick('Custom button clicked!');
  };

  return <button onClick={handleClick}>{children}</button>;
}
```

#### 🔄 useState 型（30分）

**💡 React の状態管理と TypeScript の型システム**

```typescript
import React, { useState } from 'react';

// 1. 基本的な useState の型
function Counter(): JSX.Element {
  // TypeScript が自動で number 型を推論
  const [count, setCount] = useState<number>(0);

  const increment = (): void => {
    setCount(count + 1);
  };

  const decrement = (): void => {
    setCount(prev => prev - 1); // 関数型更新
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

// 2. オブジェクト状態の管理
interface FormData {
  name: string;
  email: string;
  age: number;
}

function UserForm(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    age: 0,
  });

  const updateField = (field: keyof FormData, value: string | number): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
        placeholder="Email"
      />
      <input
        type="number"
        value={formData.age}
        onChange={(e) => updateField('age', Number(e.target.value))}
        placeholder="Age"
      />
    </div>
  );
}

// 3. 配列状態の管理
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function TodoList(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>('');

  const addTodo = (): void => {
    if (inputText.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
#### 演習 4-1: カウンターアプリ（30分）

```typescript
// 要件:
// - カウンターの値を表示
// - +1, -1, リセットボタン
// - 負の値は表示しない
// - 型安全な実装

interface CounterAppProps {
  initialValue?: number;
  maxValue?: number;
}

function CounterApp({ initialValue = 0, maxValue = 100 }: CounterAppProps): JSX.Element {
  const [count, setCount] = useState<number>(initialValue);

  const increment = (): void => {
    setCount(prev => Math.min(prev + 1, maxValue));
  };

  const decrement = (): void => {
    setCount(prev => Math.max(prev - 1, 0));
  };

  const reset = (): void => {
    setCount(initialValue);
  };

  return (
    <div className="counter-app">
      <h2>Counter: {count}</h2>
      <div>
        <button onClick={decrement} disabled={count <= 0}>
          -1
        </button>
        <button onClick={increment} disabled={count >= maxValue}>
          +1
        </button>
        <button onClick={reset}>Reset</button>
      </div>
      {count >= maxValue && <p>Maximum value reached!</p>}
    </div>
  );
}
```

#### 演習 4-2: 簡単な Todo リスト（45分）

```typescript
// 要件:
// - Todo の追加・削除・完了切り替え
// - 入力バリデーション
// - フィルタリング機能
// - 型安全な実装

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type FilterType = 'all' | 'active' | 'completed';

function SimpleTodoApp(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>('all');

  const addTodo = (): void => {
    const trimmedText = inputText.trim();
    if (trimmedText) {
      const newTodo: Todo = {
        id: Date.now(),
        text: trimmedText,
        completed: false,
        createdAt: new Date(),
      };
      setTodos(prev => [...prev, newTodo]);
      setInputText('');
    }
  };

  const deleteTodo = (id: number): void => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: number): void => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <div className="todo-app">
      <h2>Simple Todo List</h2>
      
      <div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Add a new todo"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo} disabled={!inputText.trim()}>
          Add
        </button>
      </div>

      <div>
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          All ({todos.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'active' : ''}
        >
          Active ({todos.filter(t => !t.completed).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'active' : ''}
        >
          Completed ({todos.filter(t => t.completed).length})
        </button>
      </div>

      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ 
              textDecoration: todo.completed ? 'line-through' : 'none',
              opacity: todo.completed ? 0.6 : 1
            }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {filteredTodos.length === 0 && (
        <p>No todos {filter !== 'all' ? `in ${filter}` : ''}</p>
      )}
    </div>
  );
}
```

#### 演習 4-3: 基本フォーム（15分）

```typescript
// 要件:
// - 名前、メール、年齢の入力
// - バリデーション機能
// - 送信時の型チェック

interface FormData {
  name: string;
  email: string;
  age: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  age?: string;
}

function BasicForm(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    age: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.age < 0 || formData.age > 120) {
      newErrors.age = 'Age must be between 0 and 120';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
    }
  };

  const updateField = (field: keyof FormData, value: string | number): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <label>Age:</label>
        <input
          type="number"
          value={formData.age}
          onChange={(e) => updateField('age', Number(e.target.value))}
        />
        {errors.age && <span className="error">{errors.age}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```
        text: inputText,
        completed: false,
      };
      setTodos(prev => [...prev, newTodo]);
      setInputText('');
    }
  };

  const toggleTodo = (id: number): void => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Add a todo"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### 🎨 条件付きレンダリング型（30分）

**💡 TypeScript の型ガードを React で活用**

```typescript
// 1. 基本的な条件付きレンダリング
interface LoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
}

function LoadingWrapper({ isLoading, children }: LoadingProps): JSX.Element {
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
}

// 2. Union 型を使った状態管理
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

interface DataDisplayProps<T> {
  state: AsyncState<T>;
  renderData: (data: T) => React.ReactNode;
}

function DataDisplay<T>({ state, renderData }: DataDisplayProps<T>): JSX.Element {
  switch (state.status) {
    case 'idle':
      return <div>Click to load data</div>;
    case 'loading':
      return <div>Loading...</div>;
    case 'success':
      return <div>{renderData(state.data)}</div>;
    case 'error':
      return <div>Error: {state.error}</div>;
  }
}

// 3. Optional Chaining と Nullish Coalescing
interface UserProfileProps {
  user?: User | null;
}

function UserProfile({ user }: UserProfileProps): JSX.Element {
  return (
    <div>
      <h1>{user?.name ?? 'Guest User'}</h1>
      {user?.avatar && <img src={user.avatar} alt="Avatar" />}
      <p>{user?.email ?? 'No email provided'}</p>
    </div>
  );
}
```

### Section 4: 実践演習（1.5時間）
#### 🚀 Hello World の作成

```typescript
// src/App.tsx - 最初の型安全なコンポーネント
function App(): JSX.Element {
  return (
    <div>
      <h1>Hello, TypeScript + React!</h1>
      <p>React 初心者（TypeScript 上級者）向け学習開始</p>
    </div>
  );
}

export default App;
```

### Section 3: 段階的型導入（2時間）

#### 📝 TypeScript 設定（React 特化）

> 💡 **詳細解説**: tsconfig.json の各オプションの詳細は [Step01\_補足\_設定ファイル解説.md](./Step01_補足_設定ファイル解説.md) を見てね 🐰

**💡 なぜこの設定が重要なのか**

React + TypeScript プロジェクトでは、JSX の処理、モジュール解決、型チェックの厳密性など、React 特有の要件に合わせた TypeScript 設定が必要です。適切な設定により、開発効率と型安全性を両立できます。

**🎯 どういう場面で使うのか**

- **プロジェクト初期設定**: 型安全で効率的な開発環境の構築
- **チーム開発**: 統一されたコード品質とスタイルの確保
- **大規模アプリケーション**: スケーラブルな型システムの構築

```json
// tsconfig.json
{
  "compilerOptions": {
    // 基本設定
    "target": "ES2020", // 出力するJavaScriptのバージョン
    "lib": ["ES2020", "DOM", "DOM.Iterable"], // 使用可能なライブラリ
    "allowJs": false, // JavaScript ファイルの混在を禁止
    "skipLibCheck": true, // ライブラリの型チェックをスキップ

    // モジュール設定
    "esModuleInterop": false, // CommonJS との互換性
    "allowSyntheticDefaultImports": true, // デフォルトインポートの許可
    "module": "ESNext", // モジュールシステム
    "moduleResolution": "bundler", // Vite 用のモジュール解決
    "resolveJsonModule": true, // JSON ファイルのインポート許可
    "isolatedModules": true, // 単一ファイルでの変換対応

    // React 設定
    "jsx": "react-jsx", // React 17+ の新しい JSX 変換
    "noEmit": true, // TypeScript はビルドしない（Vite が担当）

    // 型チェック設定（段階的に厳しく）
    "strict": true, // 厳密な型チェック
    "noUnusedLocals": true, // 未使用のローカル変数を検出
    "noUnusedParameters": true, // 未使用のパラメータを検出
    "exactOptionalPropertyTypes": true, // オプショナルプロパティの厳密チェック
    "noImplicitReturns": true, // 暗黙的な return の禁止
    "noFallthroughCasesInSwitch": true, // switch 文の fallthrough 検出
    "forceConsistentCasingInFileNames": true, // ファイル名の大文字小文字統一

    // パス解決（開発効率向上）
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"], // src ディレクトリへのエイリアス
      "@/components/*": ["src/components/*"], // コンポーネントへの直接アクセス
      "@/hooks/*": ["src/hooks/*"], // カスタムフックへの直接アクセス
      "@/types/*": ["src/types/*"] // 型定義への直接アクセス
    }
  },
  "include": ["src"], // 型チェック対象ディレクトリ
  "references": [{ "path": "./tsconfig.node.json" }] // Node.js 用設定の参照
}
```

**📝 設定の詳細解説**

- **jsx: "react-jsx"**: React 17+ の新しい JSX 変換を使用（`import React` が不要）
- **strict: true**: 型安全性を最大化（初心者は段階的に有効化推奨）
- **paths**: 相対パスの代わりにエイリアスを使用してインポートを簡潔に

**⚠️ よくある間違いと注意点**

```json
// ❌ 間違い: 古い JSX 変換
{
  "jsx": "react"  // React 16 以前の方式
}

// ✅ 正解: 新しい JSX 変換
{
  "jsx": "react-jsx"  // React 17+ の方式
}

// ❌ 間違い: 緩い型チェック
{
  "strict": false,
  "noImplicitAny": false
}

// ✅ 正解: 段階的な厳密化
{
  "strict": true,           // 最初は true から開始
  "noUnusedLocals": true,   // 段階的に追加
  "exactOptionalPropertyTypes": true
}
```

**🚀 React 19 対応の最適化設定**

```json
{
  "compilerOptions": {
    // React 19 の新機能に対応
    "target": "ES2022", // より新しい JavaScript 機能を活用
    "lib": ["ES2022", "DOM", "DOM.Iterable"],

    // パフォーマンス最適化
    "incremental": true, // インクリメンタルコンパイル
    "tsBuildInfoFile": ".tsbuildinfo", // ビルド情報のキャッシュ

    // 開発体験の向上
    "pretty": true, // エラーメッセージの色付け
    "listEmittedFiles": false, // 出力ファイル一覧の非表示
    "listFiles": false // 処理ファイル一覧の非表示
  }
}
```

#### 🎯 React 19 の新機能と TypeScript

```typescript
// 1. React 19の新しいHooks
import { use, useOptimistic, useFormStatus } from "react";

// use Hook - Promise/Contextの値を読み取り
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise);
  return <div>Hello, {user.name}!</div>;
}

// useOptimistic - 楽観的更新
function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state: Todo[], newTodo: Todo) => [...state, newTodo]
  );

  return (
    <div>
      {optimisticTodos.map((todo) => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
}

// useFormStatus - フォーム状態の取得
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}
```

### Section 2: JSX の型システム理解

#### 🔍 JSX 型の基本概念

> 💡 **詳細解説**: JSX 型システムの詳細と応用例は [Step01\_補足\_専門用語集.md#jsx 型システム](./Step01_補足_専門用語集.md#jsx型システム) を見てね 🐰

**💡 なぜこの概念が重要なのか**

JSX の型システムを理解することは、React + TypeScript 開発の基盤となります。適切な型定義により、コンポーネントの入出力が明確になり、実行時エラーを防ぎ、優れた開発体験を提供します。

**🎯 どういう場面で使うのか**

- **コンポーネント設計**: 再利用可能で型安全なコンポーネントの作成
- **Props 管理**: 複雑なデータ構造の型安全な受け渡し
- **子要素管理**: 柔軟で安全な子要素の型定義
- **ライブラリ開発**: 他の開発者が使いやすい型定義の提供

```typescript
// 1. JSX要素の型定義
// JSX.Element - 最も一般的な戻り値型
function Welcome(): JSX.Element {
  return <h1>Hello, World!</h1>;
}

// ReactNode - より柔軟な型（null, undefined, string, number等も含む）
function Wrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return <div>{children}</div>;
}

// ReactElement - 特定のReact要素型
function createButton(): React.ReactElement<ButtonProps> {
  return <button>Click me</button>;
}

// 2. JSX.IntrinsicElements - HTML要素の型
type DivProps = JSX.IntrinsicElements["div"];
type ButtonProps = JSX.IntrinsicElements["button"];

function CustomDiv(props: DivProps): JSX.Element {
  return <div {...props} />;
}

// 3. コンポーネントの型定義パターン
// 関数コンポーネント（推奨）
interface GreetingProps {
  name: string;
  age?: number;
  onGreet?: (message: string) => void;
}

function Greeting({ name, age, onGreet }: GreetingProps): JSX.Element {
  const handleClick = (): void => {
    const message = `Hello, ${name}! ${age ? `You are ${age} years old.` : ""}`;
    onGreet?.(message);
  };

  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>Age: {age}</p>}
      <button onClick={handleClick}>Greet</button>
    </div>
  );
}

// 4. 子要素の型管理
interface ContainerProps {
  children: React.ReactNode;
  title?: string;
}

function Container({ children, title }: ContainerProps): JSX.Element {
  return (
    <div>
      {title && <h2>{title}</h2>}
      <div>{children}</div>
    </div>
  );
}

// 特定の子要素型を指定
interface ButtonGroupProps {
  children: React.ReactElement<ButtonProps> | React.ReactElement<ButtonProps>[];
}

function ButtonGroup({ children }: ButtonGroupProps): JSX.Element {
  return <div className="button-group">{children}</div>;
}
```

#### 🎨 HTMLAttributes の継承パターン

```typescript
// 5. HTML属性の継承
interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "danger";
  size: "sm" | "md" | "lg";
  loading?: boolean;
}

function CustomButton({
  variant,
  size,
  loading = false,
  children,
  disabled,
  ...props
}: CustomButtonProps): JSX.Element {
  const className = `btn btn-${variant} btn-${size} ${
    loading ? "loading" : ""
  }`;

  return (
    <button className={className} disabled={disabled || loading} {...props}>
      {loading ? "Loading..." : children}
    </button>
  );
}

// 6. Input要素の型安全な拡張
interface CustomInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  error?: string;
  size: "sm" | "md" | "lg";
}

function CustomInput({
  label,
  error,
  size,
  className = "",
  ...props
}: CustomInputProps): JSX.Element {
  const inputClassName = `input input-${size} ${
    error ? "error" : ""
  } ${className}`;

  return (
    <div className="form-field">
      <label>{label}</label>
      <input className={inputClassName} {...props} />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

// 7. イベントハンドラーの型安全性
interface FormData {
  username: string;
  email: string;
  age: number;
}

function ContactForm(): JSX.Element {
  const [formData, setFormData] = React.useState<FormData>({
    username: "",
    email: "",
    age: 0,
  });

  // 型安全なイベントハンドラー
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value, type } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CustomInput
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
        size="md"
      />
      <CustomInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        size="md"
      />
      <CustomInput
        label="Age"
        name="age"
        type="number"
        value={formData.age.toString()}
        onChange={handleInputChange}
        size="md"
      />
      <CustomButton type="submit" variant="primary" size="md">
        Submit
      </CustomButton>
    </form>
  );
}
```

### Section 3: 基本コンポーネント設計

#### 🧩 コンポーネント設計パターン

```typescript
// 8. 条件付きレンダリングの型安全性
interface AlertProps {
  type: "success" | "warning" | "error" | "info";
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

function Alert({
  type,
  message,
  dismissible = false,
  onDismiss,
}: AlertProps): JSX.Element {
  const getIcon = (): string => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      default:
        return "";
    }
  };

  return (
    <div className={`alert alert-${type}`}>
      <span className="alert-icon">{getIcon()}</span>
      <span className="alert-message">{message}</span>
      {dismissible && (
        <button className="alert-dismiss" onClick={onDismiss}>
          ×
        </button>
      )}
    </div>
  );
}

// 9. リスト表示の型安全なパターン
interface ListItem {
  id: number;
  title: string;
  description?: string;
  completed?: boolean;
}

interface ListProps<T extends ListItem> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  loading?: boolean;
}

function List<T extends ListItem>({
  items,
  renderItem,
  emptyMessage = "No items found",
  loading = false,
}: ListProps<T>): JSX.Element {
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (items.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <ul className="list">
      {items.map((item, index) => (
        <li key={item.id} className="list-item">
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

// 使用例
interface Todo extends ListItem {
  dueDate?: Date;
  priority: "low" | "medium" | "high";
}

function TodoApp(): JSX.Element {
  const [todos] = React.useState<Todo[]>([
    {
      id: 1,
      title: "Learn TypeScript",
      description: "Complete Phase 1",
      completed: true,
      priority: "high",
    },
    {
      id: 2,
      title: "Learn React",
      description: "Start Phase 2",
      completed: false,
      priority: "medium",
      dueDate: new Date("2024-12-31"),
    },
  ]);

  return (
    <List
      items={todos}
      renderItem={(todo) => (
        <div>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <span className={`priority priority-${todo.priority}`}>
            {todo.priority}
          </span>
          {todo.dueDate && (
            <span className="due-date">
              Due: {todo.dueDate.toLocaleDateString()}
            </span>
          )}
        </div>
      )}
      emptyMessage="No todos yet!"
    />
  );
}

// 10. モーダルコンポーネントの型設計
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps): JSX.Element | null {
  // ポータルを使用する場合の型安全な実装
  if (!isOpen) return null;

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = React.useCallback(
    (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [handleEscapeKey]);

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal modal-${size}`}>
        {title && (
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
```

## 🎯 実践演習

### 演習 1-1: 基本コンポーネント作成 🔰

```typescript
// 以下の要件を満たすコンポーネントを作成せよ

// 1. Card コンポーネント
interface CardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  variant?: "default" | "outlined" | "elevated";
  clickable?: boolean;
  onClick?: () => void;
}

// 要件:
// - title は必須、subtitle はオプション
// - children でカード内容を表示
// - actions でボタンなどのアクション要素を配置
// - variant でカードのスタイルを変更
// - clickable が true の場合、onClick イベントを処理

// 2. Badge コンポーネント
interface BadgeProps {
  children: React.ReactNode;
  variant: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
}

// 要件:
// - variant は必須（色の種類）
// - size でバッジのサイズを制御
// - rounded で角丸の有無を制御

// 3. Avatar コンポーネント
interface AvatarProps {
  src?: string;
  alt?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fallbackColor?: string;
}

// 要件:
// - src がある場合は画像を表示
// - src がない場合は name の頭文字を表示
// - size でアバターのサイズを制御
// - fallbackColor で背景色を指定
```

### 演習 1-2: フォームコンポーネント 🔶

```typescript
// 以下の要件を満たすフォームシステムを作成せよ

// 1. FormField コンポーネント
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactElement;
}

// 2. Select コンポーネント
interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: Option[];
  value?: string | number;
  placeholder?: string;
  multiple?: boolean;
  onChange: (value: string | number | (string | number)[]) => void;
  disabled?: boolean;
}

// 3. Checkbox コンポーネント
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
}

// 4. 統合フォーム例
interface UserFormData {
  name: string;
  email: string;
  age: number;
  country: string;
  interests: string[];
  newsletter: boolean;
}

// 要件:
// - 全てのフィールドが型安全
// - バリデーション機能
// - エラー表示機能
// - 送信時の型チェック
```

### 演習 1-3: 実用的なアプリケーション作成 🔥

```typescript
// シンプルな天気アプリを作成せよ

// 1. 天気データの型定義
interface WeatherData {
  location: string;
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy";
  humidity: number;
  windSpeed: number;
  forecast: DailyForecast[];
}

interface DailyForecast {
  date: Date;
  high: number;
  low: number;
  condition: WeatherData["condition"];
}

// 2. コンポーネント要件
// - WeatherCard: 現在の天気を表示
// - ForecastList: 週間予報を表示
// - SearchBar: 都市名で検索
// - LoadingSpinner: ローディング状態
// - ErrorMessage: エラー表示

// 3. 機能要件
// - 都市名での天気検索
// - ローディング状態の管理
// - エラーハンドリング
// - レスポンシブデザイン
// - 型安全なAPI呼び出し

// 実装例の骨格
function WeatherApp(): JSX.Element {
  const [weather, setWeather] = React.useState<WeatherData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const searchWeather = async (city: string): Promise<void> => {
    // API呼び出しの実装
  };

  return <div className="weather-app">{/* コンポーネントの実装 */}</div>;
}
```

## 📊 Step 1 評価基準

### 理解度チェックリスト

#### React 基礎理解 (25%)

- [ ] React の基本概念（コンポーネント、Props、State）を理解している
- [ ] JSX の基本記法を習得している
- [ ] コンポーネント思考で UI を設計できる
- [ ] 宣言的 UI の概念を理解している

#### TypeScript 統合 (30%)

- [ ] 基本的な Props 型を定義できる
- [ ] イベントハンドラーを型安全に実装できる
- [ ] useState を型安全に使用できる
- [ ] 条件付きレンダリングを型安全に実装できる

#### 実践応用 (30%)

- [ ] カウンターアプリを作成できる
- [ ] 簡単な Todo リストを作成できる
- [ ] 基本的なフォーム処理を実装できる
- [ ] エラーハンドリングを適切に実装できる

#### 開発環境 (15%)

- [ ] React 19 + TypeScript 環境を構築できる
- [ ] 基本的な tsconfig.json を設定できる
- [ ] 開発サーバーを起動できる
- [ ] TypeScript エラーを理解し解決できる

### 成果物チェックリスト

- [ ] **開発環境**: React 19 + TypeScript 環境の構築
- [ ] **基本コンポーネント**: 型安全な関数コンポーネント群
- [ ] **カウンターアプリ**: useState を使った状態管理
- [ ] **Todo リスト**: 配列状態の管理とCRUD操作
- [ ] **基本フォーム**: バリデーション付きフォーム処理

## 🔄 Step 2 への準備

### 次週学習内容の予習

```typescript
// Step 2で学習するGeneric Componentsの基礎概念
// 以下のコードを読んで理解しておくこと

// 1. Generic Props
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

// 2. Generic Hooks
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // 実装
}

// 3. Conditional Types
type ButtonProps<T extends "button" | "link"> = T extends "button"
  ? React.ButtonHTMLAttributes<HTMLButtonElement>
  : React.AnchorHTMLAttributes<HTMLAnchorElement>;
```

### 環境準備

- [ ] Storybook の導入検討
- [ ] テスト環境の準備（Vitest + Testing Library）
- [ ] CSS-in-JS または CSS Modules の選択
- [ ] ESLint ルールの追加設定

### 学習継続のコツ

1. **毎日のコーディング**: 最低 30 分のコンポーネント作成
2. **型エラーの理解**: エラーメッセージを読み解く習慣
3. **React DevTools 活用**: コンポーネント構造の確認
4. **コードレビュー**: 自分のコードを客観視する

---

**📌 重要**: Step 1 は React 初心者（TypeScript 上級者）にとって React + TypeScript の基盤となる重要な期間です。React の基本概念を理解し、TypeScript の知識を活かした型安全なコンポーネント設計を習得することで、後の高度な機能学習がスムーズに進みます。段階的な学習アプローチにより、TypeScript の経験を活かしながら React を効率的に習得できます。
