# Step02_補足_専門用語集.md

# Step 2: コンポーネント型設計 - 専門用語集

> 🐰 **このファイルについて**: Generic Components、Props型設計、Component Compositionで重要な概念と用語を初心者にもわかりやすく解説します。

## 📖 目次

- [Generic Components](#generic-components)
- [Props型設計パターン](#props型設計パターン)
- [Component Composition](#component-composition)
- [forwardRef と useImperativeHandle](#forwardref-と-useimperativehandle)
- [Compound Components](#compound-components)

---

## Generic Components

### Generic型とは

**定義**: 型パラメータを受け取り、様々な型に対応できる汎用的な型定義

**特徴**:
- 型安全性を保ちながら再利用性を実現
- コンパイル時に具体的な型が決定される
- 一つのコンポーネントで複数のデータ型に対応可能

**TypeScript での型定義**:
```typescript
// 基本的なGeneric Component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>): JSX.Element {
  return (
    <ul>
      {items.map((item, index) => {
        const key = keyExtractor ? keyExtractor(item, index) : index;
        return <li key={key}>{renderItem(item, index)}</li>;
      })}
    </ul>
  );
}
```

**使用例**:
```typescript
// 文字列配列の場合
<List<string>
  items={['Apple', 'Banana', 'Cherry']}
  renderItem={(item) => <span>{item}</span>}
/>

// オブジェクト配列の場合
interface User {
  id: number;
  name: string;
  email: string;
}

<List<User>
  items={users}
  renderItem={(user) => <div>{user.name} - {user.email}</div>}
  keyExtractor={(user) => user.id}
/>
```

**いつ使うか**:
- データテーブルで任意の型のデータを表示したい場合
- リストコンポーネントで様々なアイテム型に対応したい場合
- フォームで動的な型構造に対応したい場合

**関連概念**:
- **型制約 (Type Constraints)**: `T extends Record<string, any>` のような制約
- **型推論 (Type Inference)**: TypeScriptが自動的に型を推測する機能
- **条件付き型 (Conditional Types)**: `T extends U ? X : Y` の形式

**よくある間違い**:
```typescript
// ❌ 間違い: 制約が不十分
interface BadTableProps<T> {
  data: T[];
  columns: string[]; // 型安全性が失われる
}

// ✅ 正しい: 適切な制約と型定義
interface GoodTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Array<{
    key: keyof T;
    title: string;
    render?: (value: T[keyof T], record: T) => React.ReactNode;
  }>;
}
```

---

### Generic制約 (Generic Constraints)

**定義**: Generic型パラメータに対して特定の条件を課すメカニズム

**特徴**:
- `extends` キーワードを使用して制約を定義
- 型安全性を保ちながら柔軟性を提供
- より具体的な型操作を可能にする

**TypeScript での型定義**:
```typescript
// 基本的な制約
interface HasId {
  id: string | number;
}

interface SelectProps<T extends HasId> {
  options: T[];
  value?: T['id'];
  onChange: (option: T) => void;
  getLabel: (option: T) => string;
}

// 複雑な制約
interface FormProps<T extends Record<string, any>> {
  schema: {
    [K in keyof T]: {
      type: 'text' | 'number' | 'email';
      label: string;
      required?: boolean;
      validation?: (value: T[K]) => string | null;
    };
  };
  initialValues: T;
  onSubmit: (values: T) => void;
}
```

**使用例**:
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
}

// 両方の型で使用可能（どちらもHasIdを満たすため）
<Select<User>
  options={users}
  getLabel={(user) => user.name}
  onChange={(user) => console.log(user.id)}
/>

<Select<Product>
  options={products}
  getLabel={(product) => product.title}
  onChange={(product) => console.log(product.id)}
/>
```

**いつ使うか**:
- 特定のプロパティを持つオブジェクトのみを受け入れたい場合
- 型安全性を保ちながら柔軟なAPIを提供したい場合
- 複雑なデータ構造に対応する汎用コンポーネントを作成する場合

---

## Props型設計パターン

### 条件付きProps型

**定義**: 特定の条件に基づいてPropsの型が変化する型定義パターン

**特徴**:
- 条件分岐により異なるProps構造を実現
- 型安全性を保ちながら柔軟なAPI設計が可能
- コンパイル時に不正な組み合わせを検出

**TypeScript での型定義**:
```typescript
// 基本的な条件付きProps
type ConditionalProps<T extends boolean> = T extends true
  ? { required: true; value: string }
  : { required?: false; value?: string };

interface FormFieldProps<T extends boolean = false> {
  label: string;
  name: string;
  error?: string;
} & ConditionalProps<T>;

// より複雑な条件付きProps
type InputProps<T extends 'text' | 'number' | 'email'> = {
  type: T;
  label: string;
  name: string;
} & (T extends 'text'
  ? { value: string; onChange: (value: string) => void; maxLength?: number }
  : T extends 'number'
  ? { value: number; onChange: (value: number) => void; min?: number; max?: number }
  : { value: string; onChange: (value: string) => void; pattern?: string });
```

**使用例**:
```typescript
// 必須フィールド
<FormField<true>
  label="Email"
  name="email"
  required={true}
  value="user@example.com" // 必須
/>

// 任意フィールド
<FormField<false>
  label="Phone"
  name="phone"
  // value は省略可能
/>

// 型別の入力フィールド
<Input<'text'>
  type="text"
  label="Name"
  value={name}
  onChange={setName}
  maxLength={50}
/>

<Input<'number'>
  type="number"
  label="Age"
  value={age}
  onChange={setAge}
  min={0}
  max={120}
/>
```

**いつ使うか**:
- フォームフィールドの必須/任意を型で制御したい場合
- 入力タイプに応じて異なるプロパティを提供したい場合
- APIの使用方法を型で制約したい場合

---

### 排他的Props型 (Discriminated Union Props)

**定義**: 複数のProps構造のうち、一つだけが有効になる型定義パターン

**特徴**:
- Union型を使用して排他的な選択肢を表現
- `never` 型を使用して不要なプロパティを排除
- 型安全性により不正な組み合わせを防止

**TypeScript での型定義**:
```typescript
// 基本的な排他的Props
type ButtonProps =
  | {
      variant: 'link';
      href: string;
      target?: '_blank' | '_self';
      onClick?: never;
    }
  | {
      variant: 'button';
      onClick: () => void;
      href?: never;
      target?: never;
    };

// より複雑な排他的Props
type DataDisplayProps<T> =
  | {
      mode: 'table';
      data: T[];
      columns: Column<T>[];
      pagination?: PaginationConfig;
      onRowClick?: never;
      renderCard?: never;
    }
  | {
      mode: 'cards';
      data: T[];
      renderCard: (item: T, index: number) => React.ReactNode;
      columns?: never;
      pagination?: never;
      onRowClick?: (item: T) => void;
    }
  | {
      mode: 'list';
      data: T[];
      renderItem: (item: T, index: number) => React.ReactNode;
      columns?: never;
      pagination?: never;
      renderCard?: never;
      onRowClick?: never;
    };
```

**使用例**:
```typescript
// リンクボタン
<Button
  variant="link"
  href="/about"
  target="_blank"
  // onClick は使用不可（型エラー）
>
  About Us
</Button>

// アクションボタン
<Button
  variant="button"
  onClick={() => console.log('clicked')}
  // href は使用不可（型エラー）
>
  Click Me
</Button>

// テーブル表示
<DataDisplay
  mode="table"
  data={users}
  columns={userColumns}
  pagination={{ page: 1, size: 10 }}
  // renderCard は使用不可（型エラー）
/>

// カード表示
<DataDisplay
  mode="cards"
  data={users}
  renderCard={(user) => <UserCard user={user} />}
  onRowClick={(user) => navigate(`/users/${user.id}`)}
  // columns は使用不可（型エラー）
/>
```

**いつ使うか**:
- ボタンコンポーネントでリンクとアクションを区別したい場合
- 表示モードに応じて異なるプロパティセットを提供したい場合
- APIの誤用を型レベルで防止したい場合

---

### 動的Props型

**定義**: 実行時の値に基づいてProps構造が決定される型定義パターン

**特徴**:
- Mapped Typesを活用した動的な型生成
- スキーマベースの型安全なフォーム構築
- 型推論による開発効率の向上

**TypeScript での型定義**:
```typescript
// 動的フォームスキーマ
type FormSchema<T> = {
  [K in keyof T]: {
    type: 'text' | 'number' | 'email' | 'select' | 'checkbox';
    label: string;
    required?: boolean;
    options?: T[K] extends string ? readonly string[] : never;
    validation?: (value: T[K]) => string | null;
  };
};

interface DynamicFormProps<T extends Record<string, any>> {
  schema: FormSchema<T>;
  initialValues: T;
  onSubmit: (values: T) => void;
}

// 動的テーブル列定義
type ColumnConfig<T> = {
  [K in keyof T]?: {
    title: string;
    sortable?: boolean;
    filterable?: boolean;
    render?: (value: T[K], record: T) => React.ReactNode;
    width?: number | string;
  };
};

interface DynamicTableProps<T extends Record<string, any>> {
  data: T[];
  columns: ColumnConfig<T>;
  visibleColumns?: (keyof T)[];
}
```

**使用例**:
```typescript
// 動的フォーム
interface UserForm {
  name: string;
  age: number;
  email: string;
  role: 'admin' | 'user';
  active: boolean;
}

const userSchema: FormSchema<UserForm> = {
  name: {
    type: 'text',
    label: 'Name',
    required: true,
    validation: (value) => value.length < 2 ? 'Too short' : null,
  },
  age: {
    type: 'number',
    label: 'Age',
    validation: (value) => value < 18 ? 'Must be 18+' : null,
  },
  email: {
    type: 'email',
    label: 'Email',
    required: true,
  },
  role: {
    type: 'select',
    label: 'Role',
    options: ['admin', 'user'],
  },
  active: {
    type: 'checkbox',
    label: 'Active',
  },
};

<DynamicForm
  schema={userSchema}
  initialValues={{ name: '', age: 0, email: '', role: 'user', active: true }}
  onSubmit={(values) => console.log(values)} // 型安全
/>

// 動的テーブル
const userColumns: ColumnConfig<User> = {
  name: {
    title: 'Name',
    sortable: true,
    render: (name, user) => <strong>{name}</strong>,
  },
  email: {
    title: 'Email',
    filterable: true,
  },
  createdAt: {
    title: 'Created',
    render: (date) => new Date(date).toLocaleDateString(),
  },
};

<DynamicTable
  data={users}
  columns={userColumns}
  visibleColumns={['name', 'email']}
/>
```

**いつ使うか**:
- 設定ベースでフォームを動的生成したい場合
- テーブルの列構成を柔軟に変更したい場合
- スキーマ駆動開発を行いたい場合

---

## Component Composition

### Context API

**定義**: React コンポーネント間で状態を共有するためのメカニズム

**特徴**:
- Props drilling を回避
- 型安全な状態共有
- Provider/Consumer パターン

**TypeScript での型定義**:
```typescript
// 基本的なContext定義
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

const ThemeContext = React.createContext<ThemeContextType | null>(null);

// カスタムフック
function useTheme(): ThemeContextType {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Provider コンポーネント
interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: 'light' | 'dark';
}

function ThemeProvider({ children, initialTheme = 'light' }: ThemeProviderProps): JSX.Element {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(initialTheme);

  const colors = React.useMemo(() => ({
    light: {
      primary: '#007bff',
      secondary: '#6c757d',
      background: '#ffffff',
    },
    dark: {
      primary: '#0d6efd',
      secondary: '#6c757d',
      background: '#212529',
    },
  }), []);

  const toggleTheme = React.useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value: ThemeContextType = React.useMemo(() => ({
    theme,
    toggleTheme,
    colors: colors[theme],
  }), [theme, toggleTheme, colors]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**使用例**:
```typescript
// アプリケーションレベル
function App(): JSX.Element {
  return (
    <ThemeProvider initialTheme="light">
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}

// コンポーネント内での使用
function Header(): JSX.Element {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <header style={{ backgroundColor: colors.background }}>
      <h1 style={{ color: colors.primary }}>My App</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </header>
  );
}
```

**いつ使うか**:
- 深い階層のコンポーネント間で状態を共有したい場合
- テーマやユーザー情報などのグローバル状態を管理したい場合
- Props drilling を避けたい場合

---

## forwardRef と useImperativeHandle

### forwardRef

**定義**: 親コンポーネントから子コンポーネントのDOM要素にアクセスするためのReact機能

**特徴**:
- ref を子コンポーネントに転送
- DOM操作やフォーカス制御に使用
- 型安全な ref の受け渡し

**TypeScript での型定義**:
```typescript
// 基本的なforwardRef
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="input-group">
        <label className="input-label">{label}</label>
        <input
          ref={ref}
          className={`input ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// 複雑なforwardRef
interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}

interface ModalHandle {
  open: () => void;
  close: () => void;
  focus: () => void;
}

const Modal = React.forwardRef<ModalHandle, ModalProps>(
  ({ title, children, onClose }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const modalRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => {
        setIsOpen(false);
        onClose?.();
      },
      focus: () => modalRef.current?.focus(),
    }));

    if (!isOpen) return null;

    return (
      <div className="modal-backdrop">
        <div
          ref={modalRef}
          className="modal"
          tabIndex={-1}
          role="dialog"
        >
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

Modal.displayName = 'Modal';
```

**使用例**:
```typescript
function LoginForm(): JSX.Element {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const modalRef = React.useRef<ModalHandle>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // バリデーションエラーがある場合、該当フィールドにフォーカス
    if (!email) {
      emailRef.current?.focus();
      return;
    }
    // 成功時はモーダルを開く
    modalRef.current?.open();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          ref={emailRef}
          label="Email"
          type="email"
          required
        />
        <button type="submit">Login</button>
      </form>

      <Modal
        ref={modalRef}
        title="Login Successful"
        onClose={() => console.log('Modal closed')}
      >
        <p>Welcome back!</p>
      </Modal>
    </>
  );
}
```

**いつ使うか**:
- DOM要素に直接アクセスしてフォーカス制御を行いたい場合
- 親コンポーネントから子コンポーネントのメソッドを呼び出したい場合
- サードパーティライブラリとの統合で DOM 操作が必要な場合

---

## Compound Components

### Compound Components パターン

**定義**: 複数の関連するコンポーネントを組み合わせて一つの機能を実現するデザインパターン

**特徴**:
- 柔軟で再利用可能なコンポーネント設計
- Context を使った状態共有
- 宣言的で直感的なAPI

**TypeScript での型定義**:
```typescript
// Card Compound Components
interface CardContextType {
  variant: 'default' | 'outlined' | 'elevated';
  size: 'sm' | 'md' | 'lg';
}

const CardContext = React.createContext<CardContextType | null>(null);

function useCardContext(): CardContextType {
  const context = React.useContext(CardContext);
  if (!context) {
    throw new Error('Card components must be used within a Card');
  }
  return context;
}

// メインCard コンポーネント
interface CardProps {
  children: React.ReactNode;
  variant?: CardContextType['variant'];
  size?: CardContextType['size'];
  className?: string;
}

function Card({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: CardProps): JSX.Element {
  const value: CardContextType = { variant, size };

  return (
    <CardContext.Provider value={value}>
      <div className={`card card-${variant} card-${size} ${className}`}>
        {children}
      </div>
    </CardContext.Provider>
  );
}

// 子コンポーネント群
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

function CardHeader({ children, className = '' }: CardHeaderProps): JSX.Element {
  const { size } = useCardContext();
  return (
    <div className={`card-header card-header-${size} ${className}`}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

function CardBody({ children, className = '' }: CardBodyProps): JSX.Element {
  const { size } = useCardContext();
  return (
    <div className={`card-body card-body-${size} ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

function CardFooter({ children, className = '' }: CardFooterProps): JSX.Element {
  const { size } = useCardContext();
  return (
    <div className={`card-footer card-footer-${size} ${className}`}>
      {children}
    </div>
  );
}

// Compound Components の組み立て
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
```

**使用例**:
```typescript
function ProductCard({ product }: { product: Product }): JSX.Element {
  return (
    <Card variant="outlined" size="md">
      <Card.Header>
        <h3>{product.name}</h3>
        <span className="price">${product.price}</span>
      </Card.Header>
      <Card.Body>
        <img src={product.image} alt={product.name} />
        <p>{product.description}</p>
      </Card.Body>
      <Card.Footer>
        <button className="btn-primary">Add to Cart</button>
        <button className="btn-secondary">View Details</button>
      </Card.Footer>
    </Card>
  );
}

// 柔軟な使用方法
function SimpleCard(): JSX.Element {
  return (
    <Card variant="elevated" size="lg">
      <Card.Body>
        <h2>Simple Card</h2>
        <p>This card only has a body.</p>
      </Card.Body>
    </Card>
  );
}
```

**いつ使うか**:
- 複雑なUIコンポーネントを柔軟に組み合わせたい場合
- 一貫性のあるデザインシステムを構築したい場合
- ユーザーが自由にレイアウトを組み合わせられるAPIを提供したい場合

**関連概念**:
- **Render Props**: 関数を子要素として受け取るパターン
- **Higher-Order Components (HOC)**: コンポーネントを拡張するパターン
- **Context API**: 状態共有のメカニズム

**よくある間違い**:
```typescript
// ❌ 間違い: Context の型チェックが不十分
const BadContext = React.createContext<any>(null);

function BadComponent() {
  const context = React.useContext(BadContext);
  return <div>{context.someProperty}</div>; // 実行時エラーの可能性
}

// ✅ 正しい: 適切な型定義と型ガード
interface ContextType {
  someProperty: string;
}

const GoodContext = React.createContext<ContextType | null>(null);

function GoodComponent() {
  const context = React.useContext(GoodContext);
  if (!context) {
    throw new Error('GoodComponent must be used within a Provider');
  }
  return <div>{context.someProperty}</div>;
}
```

---

**📌 重要**: これらの概念は相互に関連しており、組み合わせることでより強力で柔軟なコンポーネントシステムを構築できます。実際のプロジェクトでは、要件に応じて適切なパターンを選択し、型安全性を保ちながら実装することが重要です。