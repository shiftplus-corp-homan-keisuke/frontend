# Step 1: React 基礎と TypeScript 統合

## 📅 学習期間・目標

**期間**: Step 1
**総学習時間**: 6 時間
**学習スタイル**: 理論 20% + 実践コード 50% + 演習 30%

### 🎯 Step 1 到達目標

- [ ] React 19 + TypeScript 開発環境の構築
- [ ] JSX の型システムの理解と実践
- [ ] 基本的なコンポーネント型設計の習得
- [ ] React 特有の型パターンの理解
- [ ] 簡単な React アプリケーションの作成

## 📚 理論学習内容

### Day 1-2: React 19 + TypeScript 環境構築

#### 🛠️ 開発環境セットアップ

```bash
# 1. Node.js確認（LTS版推奨）
node --version  # v20.x.x以上

# 2. React 19 + TypeScript プロジェクト作成
npm create vite@latest react-ts-app -- --template react-ts
cd react-ts-app
npm install

# 3. 追加の型定義とツール
npm install -D @types/react @types/react-dom
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D @vitejs/plugin-react

# 4. 開発サーバー起動確認
npm run dev
```

#### 📝 TypeScript 設定（React 特化）

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    // React特化設定
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    // パス解決
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/types/*": ["src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
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

### Day 3-4: JSX の型システム理解

#### 🔍 JSX 型の基本概念

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

### Day 5-7: 基本コンポーネント設計

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

#### React + TypeScript 基礎 (30%)

- [ ] 開発環境を適切に構築できる
- [ ] JSX.Element、ReactNode、ReactElement の違いを理解している
- [ ] 基本的なコンポーネント型定義ができる
- [ ] HTMLAttributes の継承パターンを活用できる

#### コンポーネント設計 (35%)

- [ ] Props 型を適切に設計できる
- [ ] 条件付きレンダリングを型安全に実装できる
- [ ] イベントハンドラーを型安全に実装できる
- [ ] 再利用可能なコンポーネントを作成できる

#### 実践応用 (25%)

- [ ] 実用的なアプリケーションを作成できる
- [ ] エラーハンドリングを適切に実装できる
- [ ] ローディング状態を管理できる
- [ ] ユーザーインタラクションを処理できる

#### 問題解決力 (10%)

- [ ] TypeScript エラーを理解し解決できる
- [ ] React DevTools を活用できる
- [ ] デバッグ手法を理解している
- [ ] ベストプラクティスを適用できる

### 成果物チェックリスト

- [ ] **開発環境**: React 19 + TypeScript 環境の構築
- [ ] **基本コンポーネント**: Card、Badge、Avatar、Button 等
- [ ] **フォームシステム**: 型安全なフォームコンポーネント群
- [ ] **実用アプリ**: 天気アプリまたは類似のアプリケーション

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

**📌 重要**: Step 1 は React + TypeScript の基盤となる重要な期間です。JSX の型システムと基本的なコンポーネント設計パターンを確実に習得することで、後の高度な機能学習がスムーズに進みます。
