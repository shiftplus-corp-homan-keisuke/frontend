# Step01_補足_専門用語集.md

# Step 1: React 基礎と TypeScript 統合 - 専門用語集

> 🐰 **このファイルについて**: React + TypeScript 開発で重要な概念と用語を初心者にもわかりやすく解説します。

## 📖 目次

- [JSX型システム](#jsx型システム)
- [Props型定義パターン](#props型定義パターン)
- [イベントハンドラーの型](#イベントハンドラーの型)
- [React Hooks の型](#react-hooks-の型)
- [コンポーネント型設計パターン](#コンポーネント型設計パターン)
- [条件付きレンダリングの型安全性](#条件付きレンダリングの型安全性)

---

## JSX型システム

### JSX.Element

**定義**: React コンポーネントが返す最も一般的な型

**特徴**:
- 単一のReact要素を表現
- null や undefined は含まない
- 最も厳密なJSX戻り値型

**使用例**:
```typescript
function Button(): JSX.Element {
  return <button>Click me</button>;
}

// ❌ エラー: JSX.Element は null を返せない
function ConditionalButton(show: boolean): JSX.Element {
  if (!show) return null; // Type 'null' is not assignable to type 'JSX.Element'
  return <button>Click me</button>;
}
```

**いつ使うか**:
- 必ず何かしらのJSX要素を返すコンポーネント
- 型安全性を最大化したい場合
- ライブラリのAPI設計時

### React.ReactNode

**定義**: React が子要素として受け入れる全ての型の統合型

**特徴**:
- JSX.Element, string, number, boolean, null, undefined を含む
- 最も柔軟なReact型
- 子要素の型として最適

**型定義**:
```typescript
type ReactNode = 
  | ReactElement 
  | string 
  | number 
  | boolean 
  | null 
  | undefined 
  | ReactNodeArray;
```

**使用例**:
```typescript
interface ContainerProps {
  children: React.ReactNode; // 何でも受け入れる
}

function Container({ children }: ContainerProps): JSX.Element {
  return <div>{children}</div>;
}

// 全て有効
<Container>Hello World</Container>           // string
<Container>{42}</Container>                  // number
<Container><Button /></Container>            // JSX.Element
<Container>{true && <Button />}</Container>  // boolean | JSX.Element
<Container>{null}</Container>                // null
```

**いつ使うか**:
- 子要素を受け取るコンポーネント
- 柔軟性が必要な場合
- 条件付きレンダリングを含む場合

### React.ReactElement

**定義**: React要素の型情報を含む特定の型

**特徴**:
- Props の型情報を保持
- より具体的な型制約が可能
- ジェネリクスで型パラメータを指定可能

**使用例**:
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
}

// 特定のコンポーネント型を指定
function createButton(): React.ReactElement<ButtonProps> {
  return <Button variant="primary">Click me</Button>;
}

// 子要素の型を制限
interface ButtonGroupProps {
  children: React.ReactElement<ButtonProps> | React.ReactElement<ButtonProps>[];
}

function ButtonGroup({ children }: ButtonGroupProps): JSX.Element {
  return <div className="button-group">{children}</div>;
}
```

**いつ使うか**:
- 特定のコンポーネント型のみを受け入れたい場合
- Props の型安全性を保証したい場合
- コンポーネントライブラリの設計時

### JSX.IntrinsicElements

**定義**: HTML要素の型定義を提供するインターフェース

**特徴**:
- 全てのHTML要素の型が定義済み
- HTML属性の型安全性を提供
- カスタムコンポーネントでHTML属性を継承する際に使用

**使用例**:
```typescript
// HTML要素の型を取得
type DivProps = JSX.IntrinsicElements['div'];
type ButtonProps = JSX.IntrinsicElements['button'];
type InputProps = JSX.IntrinsicElements['input'];

// HTML属性を継承したカスタムコンポーネント
interface CustomButtonProps extends JSX.IntrinsicElements['button'] {
  variant: 'primary' | 'secondary';
  loading?: boolean;
}

function CustomButton({ variant, loading, ...props }: CustomButtonProps): JSX.Element {
  return (
    <button 
      {...props} 
      className={`btn btn-${variant} ${loading ? 'loading' : ''}`}
      disabled={loading || props.disabled}
    />
  );
}
```

**いつ使うか**:
- HTML要素を拡張するカスタムコンポーネント作成時
- 既存のHTML属性をそのまま受け継ぎたい場合
- 型安全なHTML属性の操作が必要な場合

---

## Props型定義パターン

### 基本的なProps型定義

**インターフェース vs 型エイリアス**:

```typescript
// インターフェース（推奨）
interface UserCardProps {
  name: string;
  age: number;
  email?: string; // オプショナル
}

// 型エイリアス
type UserCardProps = {
  name: string;
  age: number;
  email?: string;
};
```

**推奨**: インターフェースを使用（拡張性、デバッグ情報の観点で優秀）

### オプショナルプロパティ

**定義**: 必須ではないプロパティ

```typescript
interface ModalProps {
  isOpen: boolean;        // 必須
  title?: string;         // オプショナル
  onClose?: () => void;   // オプショナル
}

// デフォルト値の設定
function Modal({ isOpen, title = "Modal", onClose }: ModalProps): JSX.Element {
  // ...
}
```

### HTMLAttributes の継承

**パターン1: extends を使用**:
```typescript
interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}
```

**パターン2: Omit を使用して特定属性を除外**:
```typescript
interface CustomInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  error?: string;
  size: 'sm' | 'md' | 'lg'; // カスタムsize型
}
```

**パターン3: Pick を使用して特定属性のみ選択**:
```typescript
interface CustomButtonProps extends Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'disabled'> {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
}
```

### 条件付きProps型

**Union型を使用**:
```typescript
type ButtonProps = 
  | { variant: 'link'; href: string; onClick?: never }
  | { variant: 'button'; href?: never; onClick: () => void };

function Button(props: ButtonProps): JSX.Element {
  if (props.variant === 'link') {
    return <a href={props.href}>Link Button</a>;
  }
  return <button onClick={props.onClick}>Button</button>;
}
```

---

## イベントハンドラーの型

### 基本的なイベント型

```typescript
// マウスイベント
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  console.log('Button clicked');
};

// 入力イベント
const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  console.log(event.target.value);
};

// フォームイベント
const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
  event.preventDefault();
  // フォーム処理
};

// キーボードイベント
const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
  if (event.key === 'Enter') {
    // Enter キー処理
  }
};
```

### カスタムイベントハンドラー

```typescript
// カスタムイベントハンドラーの型定義
type SelectHandler = (value: string, option: Option) => void;
type ChangeHandler<T> = (value: T) => void;

interface SelectProps {
  options: Option[];
  onSelect: SelectHandler;
  onChange: ChangeHandler<string>;
}
```

### イベントハンドラーのベストプラクティス

```typescript
interface FormData {
  username: string;
  email: string;
}

function ContactForm(): JSX.Element {
  const [formData, setFormData] = React.useState<FormData>({
    username: '',
    email: ''
  });

  // 型安全なイベントハンドラー
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 特定フィールド用のハンドラー
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData(prev => ({
      ...prev,
      username: event.target.value
    }));
  };

  return (
    <form>
      <input 
        name="username"
        value={formData.username}
        onChange={handleInputChange} // 汎用ハンドラー
      />
      <input 
        name="email"
        value={formData.email}
        onChange={handleUsernameChange} // 専用ハンドラー
      />
    </form>
  );
}
```

---

## React Hooks の型

### useState

```typescript
// 型推論を活用
const [count, setCount] = useState(0); // number型として推論

// 明示的な型指定
const [user, setUser] = useState<User | null>(null);

// 複雑な状態の型定義
interface AppState {
  loading: boolean;
  error: string | null;
  data: User[];
}

const [state, setState] = useState<AppState>({
  loading: false,
  error: null,
  data: []
});
```

### useEffect

```typescript
// 基本的な使用
useEffect(() => {
  // 副作用の処理
}, []);

// クリーンアップ関数
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Timer tick');
  }, 1000);

  return (): void => {
    clearInterval(timer);
  };
}, []);

// 非同期処理（async/awaitは直接使用不可）
useEffect(() => {
  const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch('/api/users');
      const users: User[] = await response.json();
      setUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  fetchData();
}, []);
```

### useRef

```typescript
// DOM要素への参照
const inputRef = useRef<HTMLInputElement>(null);

// 値の保持
const countRef = useRef<number>(0);

// 使用例
function FocusInput(): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (): void => {
    inputRef.current?.focus(); // null チェック
  };

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );
}
```

### カスタムHooks

```typescript
// カスタムHookの型定義
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T): void => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

// 使用例
function App(): JSX.Element {
  const [name, setName] = useLocalStorage<string>('name', '');
  const [settings, setSettings] = useLocalStorage<AppSettings>('settings', defaultSettings);

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </div>
  );
}
```

---

## コンポーネント型設計パターン

### 関数コンポーネント（推奨）

```typescript
// 基本的な関数コンポーネント
interface GreetingProps {
  name: string;
  age?: number;
}

function Greeting({ name, age }: GreetingProps): JSX.Element {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>Age: {age}</p>}
    </div>
  );
}

// React.FC を使用（非推奨）
const Greeting: React.FC<GreetingProps> = ({ name, age }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>Age: {age}</p>}
    </div>
  );
};
```

**推奨**: 通常の関数宣言を使用（React.FC は children が自動で含まれるため混乱を招く）

### Generic Components

```typescript
// ジェネリックコンポーネント
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>): JSX.Element {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

// 使用例
interface User {
  id: number;
  name: string;
}

function UserList(): JSX.Element {
  const users: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];

  return (
    <List
      items={users}
      keyExtractor={(user) => user.id}
      renderItem={(user) => <span>{user.name}</span>}
    />
  );
}
```

### Higher-Order Components (HOC)

```typescript
// HOCの型定義
function withLoading<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & { loading?: boolean }> {
  return function WithLoadingComponent(props: P & { loading?: boolean }): JSX.Element {
    const { loading, ...restProps } = props;
    
    if (loading) {
      return <div>Loading...</div>;
    }
    
    return <Component {...(restProps as P)} />;
  };
}

// 使用例
interface UserProfileProps {
  user: User;
}

function UserProfile({ user }: UserProfileProps): JSX.Element {
  return <div>{user.name}</div>;
}

const UserProfileWithLoading = withLoading(UserProfile);

// 使用
<UserProfileWithLoading user={user} loading={isLoading} />
```

### Render Props パターン

```typescript
// Render Props の型定義
interface MouseTrackerProps {
  children: (mouse: { x: number; y: number }) => React.ReactNode;
}

function MouseTracker({ children }: MouseTrackerProps): JSX.Element {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent): void => {
    setMouse({
      x: event.clientX,
      y: event.clientY
    });
  };

  return (
    <div onMouseMove={handleMouseMove}>
      {children(mouse)}
    </div>
  );
}

// 使用例
function App(): JSX.Element {
  return (
    <MouseTracker>
      {(mouse) => (
        <p>Mouse position: {mouse.x}, {mouse.y}</p>
      )}
    </MouseTracker>
  );
}
```

---

## 条件付きレンダリングの型安全性

### 基本的な条件付きレンダリング

```typescript
interface UserProps {
  user: User | null;
  loading: boolean;
}

function UserComponent({ user, loading }: UserProps): JSX.Element {
  // 論理演算子を使用
  if (loading) {
    return <div>Loading...</div>;
  }

  // 三項演算子
  return user ? (
    <div>Welcome, {user.name}!</div>
  ) : (
    <div>Please log in</div>
  );
}
```

### 型ガードを使用した安全な条件付きレンダリング

```typescript
// 型ガード関数
function isUser(value: User | null): value is User {
  return value !== null && typeof value.name === 'string';
}

function UserProfile({ user }: { user: User | null }): JSX.Element {
  if (!isUser(user)) {
    return <div>No user data</div>;
  }

  // この時点で user は User 型として扱われる
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Union型を使用した状態管理

```typescript
// 状態をUnion型で定義
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: string };

function UserList(): JSX.Element {
  const [state, setState] = useState<LoadingState>({ status: 'idle' });

  // 型安全な条件分岐
  switch (state.status) {
    case 'idle':
      return <button onClick={fetchUsers}>Load Users</button>;
    
    case 'loading':
      return <div>Loading...</div>;
    
    case 'success':
      return (
        <ul>
          {state.data.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      );
    
    case 'error':
      return <div>Error: {state.error}</div>;
    
    default:
      // TypeScript が全てのケースをチェック
      const _exhaustive: never = state;
      return _exhaustive;
  }
}
```

### Optional Chaining と Nullish Coalescing

```typescript
interface NestedUser {
  profile?: {
    avatar?: {
      url?: string;
    };
  };
}

function UserAvatar({ user }: { user: NestedUser }): JSX.Element {
  // Optional Chaining で安全にアクセス
  const avatarUrl = user.profile?.avatar?.url;
  
  // Nullish Coalescing でデフォルト値を設定
  const displayUrl = avatarUrl ?? '/default-avatar.png';

  return <img src={displayUrl} alt="User Avatar" />;
}
```

---

## 🎯 実践的な使い分けガイド

### JSX戻り値型の選択

| 用途 | 推奨型 | 理由 |
|------|--------|------|
| 通常のコンポーネント | `JSX.Element` | 明確で一貫性がある |
| 子要素を受け取る | `React.ReactNode` | 最大の柔軟性 |
| 条件付きレンダリング | `JSX.Element \| null` | 明示的なnull許可 |
| ライブラリAPI | `React.ReactElement<T>` | 型安全性の最大化 |

### Props設計の指針

1. **必須プロパティを明確に**: オプショナルは最小限に
2. **Union型で状態を表現**: 不正な状態を型レベルで防ぐ
3. **HTML属性の継承**: 既存の型を活用して一貫性を保つ
4. **ジェネリクスで再利用性向上**: 型安全性を保ちながら柔軟性を確保

### エラー回避のコツ

1. **null/undefined チェック**: Optional Chaining を活用
2. **型ガードの使用**: 実行時の型安全性を確保
3. **exhaustive check**: Union型の全ケースを処理
4. **適切なデフォルト値**: Nullish Coalescing を活用

---

**📌 重要**: この専門用語集は React + TypeScript 開発の基礎となる概念をカバーしています。実際の開発では、これらの概念を組み合わせて使用することで、型安全で保守性の高いコンポーネントを作成できます。