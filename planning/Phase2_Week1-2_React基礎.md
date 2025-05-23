# Phase 2: Week 1-2 React 基礎 - TypeScript × React コンポーネント型設計

## 📅 学習期間・目標

**期間**: Week 1-2（2 週間）  
**総学習時間**: 40 時間（週 20 時間）

### 🎯 Week 1-2 到達目標

- [ ] React + TypeScript 環境構築の完全理解
- [ ] 型安全なコンポーネント設計パターンの習得
- [ ] Props 型設計と Generic Components の実装
- [ ] Ref と Event Handler の型安全な活用
- [ ] Compound Components パターンの実践

## 📖 理論学習内容

### Day 1-3: React + TypeScript 環境構築

#### 基本的な環境セットアップ

```typescript
// 1. プロジェクト初期化
// Vite + React + TypeScript テンプレート
npm create vite@latest my-react-app -- --template react-ts

// 2. 必要な型定義のインストール
npm install --save-dev @types/react @types/react-dom

// 3. tsconfig.json の最適化
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
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

// 4. ESLint + Prettier 設定
// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'react/prop-types': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
```

#### React コンポーネントの基本型定義

```typescript
// 5. 基本的なコンポーネント型パターン
import React from "react";

// Function Component の型定義
interface GreetingProps {
  name: string;
  age?: number;
  onGreet?: (message: string) => void;
}

// 方法1: React.FC を使用（推奨されない）
const Greeting: React.FC<GreetingProps> = ({ name, age, onGreet }) => {
  const handleClick = (): void => {
    const message = `Hello, ${name}! You are ${age ?? "unknown"} years old.`;
    onGreet?.(message);
  };

  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>Age: {age}</p>}
      <button onClick={handleClick}>Greet</button>
    </div>
  );
};

// 方法2: 直接関数として定義（推奨）
function GreetingBetter({ name, age, onGreet }: GreetingProps): JSX.Element {
  const handleClick = (): void => {
    const message = `Hello, ${name}! You are ${age ?? "unknown"} years old.`;
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

// 6. HTMLAttributes の継承
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "danger";
  size: "sm" | "md" | "lg";
  loading?: boolean;
}

function Button({
  variant,
  size,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps): JSX.Element {
  const className = `btn btn-${variant} btn-${size} ${
    loading ? "loading" : ""
  }`;

  return (
    <button className={className} disabled={disabled || loading} {...props}>
      {loading ? "Loading..." : children}
    </button>
  );
}
```

### Day 4-7: Props 型設計と Generic Components

#### 高度な Props 型設計

```typescript
// 7. 条件付き Props 型
type ConditionalProps<T extends boolean> = T extends true
  ? { required: true; value: string }
  : { required?: false; value?: string };

interface FormFieldProps<T extends boolean = false> {
  label: string;
  name: string;
  error?: string;
} & ConditionalProps<T>;

// 使用例
function RequiredField(): JSX.Element {
  return (
    <FormField<true>
      label="Email"
      name="email"
      required={true}
      value="user@example.com" // 必須
    />
  );
}

function OptionalField(): JSX.Element {
  return (
    <FormField<false>
      label="Phone"
      name="phone"
      // value は省略可能
    />
  );
}

// 8. Union Props パターン
type InputProps =
  | {
      type: 'text' | 'email' | 'password';
      value: string;
      onChange: (value: string) => void;
    }
  | {
      type: 'number';
      value: number;
      onChange: (value: number) => void;
      min?: number;
      max?: number;
    }
  | {
      type: 'checkbox';
      checked: boolean;
      onChange: (checked: boolean) => void;
    };

function Input(props: InputProps): JSX.Element {
  switch (props.type) {
    case 'text':
    case 'email':
    case 'password':
      return (
        <input
          type={props.type}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      );
    case 'number':
      return (
        <input
          type="number"
          value={props.value}
          min={props.min}
          max={props.max}
          onChange={(e) => props.onChange(Number(e.target.value))}
        />
      );
    case 'checkbox':
      return (
        <input
          type="checkbox"
          checked={props.checked}
          onChange={(e) => props.onChange(e.target.checked)}
        />
      );
  }
}
```

#### Generic Components の実装

```typescript
// 9. Generic Table Component
interface Column<T> {
  key: keyof T;
  title: string;
  width?: number;
  align?: "left" | "center" | "right";
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
  sorter?: (a: T, b: T) => number;
}

interface TableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  rowKey?: keyof T | ((record: T) => string | number);
  onRowClick?: (record: T, index: number) => void;
  loading?: boolean;
  emptyText?: string;
  className?: string;
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  rowKey = "id",
  onRowClick,
  loading = false,
  emptyText = "No data",
  className = "",
}: TableProps<T>): JSX.Element {
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return (record[rowKey] as string | number) ?? index;
  };

  if (loading) {
    return <div className="table-loading">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="table-empty">{emptyText}</div>;
  }

  return (
    <table className={`table ${className}`}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={String(column.key)}
              style={{
                width: column.width,
                textAlign: column.align || "left",
              }}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((record, index) => (
          <tr
            key={getRowKey(record, index)}
            onClick={() => onRowClick?.(record, index)}
            className={onRowClick ? "clickable" : ""}
          >
            {columns.map((column) => {
              const value = record[column.key];
              return (
                <td
                  key={String(column.key)}
                  style={{ textAlign: column.align || "left" }}
                >
                  {column.render
                    ? column.render(value, record, index)
                    : String(value)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// 使用例
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
}

function UserTable(): JSX.Element {
  const users: User[] = [
    {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      role: "admin",
      createdAt: new Date(),
    },
    {
      id: 2,
      name: "Bob",
      email: "bob@example.com",
      role: "user",
      createdAt: new Date(),
    },
  ];

  const columns: Column<User>[] = [
    { key: "name", title: "Name", width: 150 },
    { key: "email", title: "Email", width: 200 },
    {
      key: "role",
      title: "Role",
      width: 100,
      render: (role) => <span className={`badge badge-${role}`}>{role}</span>,
    },
    {
      key: "createdAt",
      title: "Created",
      width: 150,
      render: (date) => (date as Date).toLocaleDateString(),
    },
  ];

  return (
    <Table
      data={users}
      columns={columns}
      onRowClick={(user) => console.log("Clicked user:", user.name)}
    />
  );
}
```

### Day 8-14: Ref と Event Handler の型安全性

#### Ref の型安全な活用

```typescript
// 10. useRef の型安全な使用
import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

// DOM要素への参照
function FocusableInput(): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // null チェックが必要
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleClear = (): void => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Type here..." />
      <button onClick={handleClear}>Clear</button>
    </div>
  );
}

// 11. forwardRef の型安全な実装
interface CustomInputProps {
  label: string;
  error?: string;
  placeholder?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, error, placeholder, ...props }, ref) => {
    return (
      <div className="form-field">
        <label>{label}</label>
        <input
          ref={ref}
          placeholder={placeholder}
          className={error ? "error" : ""}
          {...props}
        />
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

// 使用例
function ParentComponent(): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <CustomInput
        ref={inputRef}
        label="Username"
        placeholder="Enter username"
      />
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );
}

// 12. useImperativeHandle の活用
interface ModalHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

interface ModalProps {
  title: string;
  children: React.ReactNode;
}

const Modal = forwardRef<ModalHandle, ModalProps>(
  ({ title, children }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),
    }));

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2>{title}</h2>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

// 使用例
function App(): JSX.Element {
  const modalRef = useRef<ModalHandle>(null);

  return (
    <div>
      <button onClick={() => modalRef.current?.open()}>Open Modal</button>
      <Modal ref={modalRef} title="Confirmation">
        <p>Are you sure you want to proceed?</p>
        <button onClick={() => modalRef.current?.close()}>Cancel</button>
      </Modal>
    </div>
  );
}
```

#### Event Handler の型安全性

```typescript
// 13. Event Handler の型定義
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

  const handleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log("Form submitted:", formData);
  };

  // カスタムイベントハンドラー
  const handleFieldChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleInputChange}
        placeholder="Username"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
      />
      <input
        name="age"
        type="number"
        value={formData.age}
        onChange={handleInputChange}
        placeholder="Age"
      />

      {/* カスタムハンドラーの使用 */}
      <button
        type="button"
        onClick={() => handleFieldChange("username", "default")}
      >
        Set Default Username
      </button>

      <button type="submit">Submit</button>
    </form>
  );
}
```

## 🎯 実践演習

### 演習 2-1: 型安全な UI コンポーネントライブラリ 🔰

**目標**: 再利用可能な型安全コンポーネントの作成

```typescript
// 以下の要件を満たすコンポーネントライブラリを実装せよ

// 1. Button コンポーネント
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "danger" | "ghost";
  size: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

// 2. Input コンポーネント
interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  size: "sm" | "md" | "lg";
  variant?: "outlined" | "filled" | "standard";
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

// 3. Select コンポーネント
interface Option<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface SelectProps<T = string> {
  options: Option<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  loading?: boolean;
  error?: string;
  label?: string;
}

// 4. Card コンポーネント
interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  media?: React.ReactNode;
  children: React.ReactNode;
  variant?: "elevated" | "outlined" | "filled";
  clickable?: boolean;
  onClick?: () => void;
}

// 実装要件:
// - 全てのコンポーネントでforwardRefを使用
// - 適切なdefaultPropsの設定
// - アクセシビリティの考慮
// - CSS-in-JSまたはCSS Modulesでのスタイリング
// - Storybookでのドキュメント化
```

**評価基準**:

- [ ] 型安全性が完全に確保されている
- [ ] 再利用性が高い設計になっている
- [ ] アクセシビリティが考慮されている
- [ ] パフォーマンスが最適化されている

### 演習 2-2: Generic Data Display Components 🔶

**目標**: データ表示用の汎用コンポーネント実装

```typescript
// 以下の要件を満たすデータ表示コンポーネントを実装せよ

// 1. DataList コンポーネント
interface DataListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  loadMore?: () => void;
  hasMore?: boolean;
}

// 2. DataGrid コンポーネント
interface GridColumn<T> {
  key: keyof T;
  title: string;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], record: T) => React.ReactNode;
}

interface DataGridProps<T> {
  data: T[];
  columns: GridColumn<T>[];
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  sorting?: {
    field: keyof T;
    direction: "asc" | "desc";
    onChange: (field: keyof T, direction: "asc" | "desc") => void;
  };
  filtering?: {
    filters: Partial<Record<keyof T, any>>;
    onChange: (filters: Partial<Record<keyof T, any>>) => void;
  };
  selection?: {
    selectedKeys: (string | number)[];
    onChange: (selectedKeys: (string | number)[]) => void;
    multiple?: boolean;
  };
}

// 3. VirtualizedList コンポーネント
interface VirtualizedListProps<T> {
  data: T[];
  itemHeight: number | ((index: number) => number);
  renderItem: (item: T, index: number) => React.ReactNode;
  height: number;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
}

// 実装要件:
// - 仮想化による大量データの効率的な表示
// - ソート・フィルタリング機能
// - 無限スクロール対応
// - キーボードナビゲーション
// - レスポンシブ対応
```

**評価基準**:

- [ ] 大量データでもパフォーマンスが良い
- [ ] 型推論が適切に働く
- [ ] 使いやすい API になっている
- [ ] 拡張性が確保されている

## 📊 Week 1-2 評価基準

### 理解度チェックリスト

#### React + TypeScript 基礎 (30%)

- [ ] 環境構築を適切に行える
- [ ] 基本的なコンポーネント型定義ができる
- [ ] Props の型安全性を確保できる
- [ ] Event Handler を型安全に実装できる

#### Generic Components (25%)

- [ ] Generic を使った再利用可能コンポーネントを作成できる
- [ ] 型推論が適切に働くコンポーネントを設計できる
- [ ] 条件付き Props 型を実装できる
- [ ] Union Props パターンを活用できる

#### Ref と Event 処理 (25%)

- [ ] useRef を型安全に使用できる
- [ ] forwardRef を適切に実装できる
- [ ] useImperativeHandle を活用できる
- [ ] 各種イベントハンドラーを型安全に実装できる

#### 実践応用 (20%)

- [ ] 実用的なコンポーネントライブラリを設計できる
- [ ] パフォーマンスを考慮した実装ができる
- [ ] アクセシビリティを考慮できる
- [ ] 保守性の高いコード設計ができる

### 成果物チェックリスト

- [ ] **UI コンポーネントライブラリ**: 5 つ以上の再利用可能コンポーネント
- [ ] **Generic コンポーネント**: データ表示用汎用コンポーネント
- [ ] **型定義集**: Props 型とイベント型の体系的な定義
- [ ] **ベストプラクティス集**: React + TypeScript の設計指針

## 🔄 Week 3-4 への準備

### 次週学習内容の予習

```typescript
// Week 3-4で学習する状態管理の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. useState の型安全な使用
const [user, setUser] = useState<User | null>(null);

// 2. useReducer の型定義
interface State {
  loading: boolean;
  data: User[];
  error: string | null;
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: User[] }
  | { type: "FETCH_ERROR"; payload: string };

// 3. Context の型安全な実装
interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}
```

### 環境準備

- [ ] 状態管理ライブラリの調査（Zustand, TanStack Query）
- [ ] テスト環境の構築（Vitest + Testing Library）
- [ ] Storybook の導入検討

### 学習継続のコツ

1. **コンポーネント設計の習慣化**: 毎日小さなコンポーネントを作成
2. **型安全性の徹底**: any 型を一切使わない実装
3. **再利用性の追求**: 汎用的なコンポーネント設計
4. **パフォーマンス意識**: React DevTools での最適化確認

---

**📌 重要**: Week 1-2 は React + TypeScript の基盤となる重要な期間です。型安全なコンポーネント設計パターンを確実に習得することで、後の高度な状態管理やパフォーマンス最適化がスムーズに進みます。
