# Step 2: コンポーネント型設計

## 📅 学習期間・目標

**期間**: Step 2
**総学習時間**: 6 時間
**学習スタイル**: 理論 20% + 実践コード 50% + 演習 30%

### 🎯 Step 2 到達目標

- [ ] Props 型の高度な設計パターンの習得
- [ ] Generic Components の実装と活用
- [ ] Component Composition の型安全な実装
- [ ] 再利用可能なコンポーネントライブラリの設計
- [ ] forwardRef と useImperativeHandle の型安全な活用

## 📚 理論学習内容

### Day 8-10: Props 型の高度な設計パターン

#### 🎯 条件付き Props 型の実装

```tsx
// 1. 条件付きProps型の基本パターン
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

// 2. Union Props パターン
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

// 3. 排他的Props型
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

interface BaseButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

type CombinedButtonProps = BaseButtonProps & ButtonProps;

function Button(props: CombinedButtonProps): JSX.Element {
  const { children, disabled, size = 'md', variant } = props;

  if (variant === 'link') {
    return (
      <a
        href={props.href}
        target={props.target}
        className={`btn btn-link btn-${size} ${disabled ? 'disabled' : ''}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={props.onClick}
      disabled={disabled}
      className={`btn btn-button btn-${size}`}
    >
      {children}
    </button>
  );
}

// 4. 動的Props型
interface DynamicFormProps<T extends Record<string, any>> {
  schema: FormSchema<T>;
  initialValues: T;
  onSubmit: (values: T) => void;
}

type FormSchema<T> = {
  [K in keyof T]: {
    type: 'text' | 'number' | 'email' | 'select';
    label: string;
    required?: boolean;
    options?: T[K] extends string ? string[] : never;
    validation?: (value: T[K]) => string | null;
  };
};

function DynamicForm<T extends Record<string, any>>({
  schema,
  initialValues,
  onSubmit,
}: DynamicFormProps<T>): JSX.Element {
  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>({});

  const handleChange = <K extends keyof T>(field: K, value: T[K]): void => {
    setValues(prev => ({ ...prev, [field]: value }));

    // バリデーション
    const fieldSchema = schema[field];
    if (fieldSchema.validation) {
      const error = fieldSchema.validation(value);
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.entries(schema).map(([key, fieldSchema]) => {
        const fieldKey = key as keyof T;
        const fieldValue = values[fieldKey];
        const fieldError = errors[fieldKey];

        return (
          <div key={key} className="form-field">
            <label>{fieldSchema.label}</label>
            {fieldSchema.type === 'select' && fieldSchema.options ? (
              <select
                value={String(fieldValue)}
                onChange={(e) => handleChange(fieldKey, e.target.value as T[keyof T])}
              >
                {fieldSchema.options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={fieldSchema.type}
                value={String(fieldValue)}
                onChange={(e) => {
                  const value = fieldSchema.type === 'number'
                    ? Number(e.target.value)
                    : e.target.value;
                  handleChange(fieldKey, value as T[keyof T]);
                }}
              />
            )}
            {fieldError && <span className="error">{fieldError}</span>}
          </div>
        );
      })}
      <button type="submit">Submit</button>
    </form>
  );
}

// 使用例
interface UserForm {
  name: string;
  age: number;
  email: string;
  role: 'admin' | 'user';
}

const userSchema: FormSchema<UserForm> = {
  name: {
    type: 'text',
    label: 'Name',
    required: true,
    validation: (value) => value.length < 2 ? 'Name must be at least 2 characters' : null,
  },
  age: {
    type: 'number',
    label: 'Age',
    validation: (value) => value < 18 ? 'Must be 18 or older' : null,
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
};
```

### Day 11-12: Generic Components の実装

#### 🧩 Generic Table Component

````typescript
// 5. 高度なGeneric Table実装
interface Column<T> {
  key: keyof T;
  title: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
  sorter?: (a: T, b: T) => number;
}

interface TableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  rowKey?: keyof T | ((record: T) => string | number);
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
### Day 13-14: Component Composition と forwardRef

#### 🔗 forwardRef の型安全な実装

```typescript
// 6. forwardRef の高度な活用
interface CustomInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  error?: string;
  helperText?: string;
  size: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled' | 'standard';
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({
    label,
    error,
    helperText,
    size,
    variant = 'outlined',
    startAdornment,
    endAdornment,
    className = '',
    ...props
  }, ref) => {
    const inputClassName = `
      input
      input-${size}
      input-${variant}
      ${error ? 'error' : ''}
      ${startAdornment ? 'has-start-adornment' : ''}
      ${endAdornment ? 'has-end-adornment' : ''}
      ${className}
    `.trim();

    return (
      <div className="form-field">
        <label className="form-label">{label}</label>
        <div className="input-wrapper">
          {startAdornment && (
            <div className="input-adornment start">{startAdornment}</div>
          )}
          <input
            ref={ref}
            className={inputClassName}
            {...props}
          />
          {endAdornment && (
            <div className="input-adornment end">{endAdornment}</div>
          )}
        </div>
        {error && <span className="error-message">{error}</span>}
        {helperText && !error && (
          <span className="helper-text">{helperText}</span>
        )}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';

// 7. useImperativeHandle の活用
interface ModalHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  focus: () => void;
}

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal = React.forwardRef<ModalHandle, ModalProps>(
  ({ title, children, onClose, size = 'md' }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const modalRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => {
        setIsOpen(false);
        onClose?.();
      },
      toggle: () => setIsOpen(prev => !prev),
      focus: () => modalRef.current?.focus(),
    }));

    const handleEscapeKey = React.useCallback((event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        onClose?.();
      }
    }, [isOpen, onClose]);

    React.useEffect(() => {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [handleEscapeKey]);

    if (!isOpen) return null;

    return (
      <div className="modal-backdrop">
        <div
          ref={modalRef}
          className={`modal modal-${size}`}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="modal-title"
        >
          <div className="modal-header">
            <h2 id="modal-title">{title}</h2>
            <button
              className="modal-close"
              onClick={() => {
                setIsOpen(false);
                onClose?.();
              }}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';
````

## 🎯 実践演習

### 演習 2-1: 高度な Generic Components 🔰

```typescript
// 以下の要件を満たすGeneric Componentsを実装せよ

// 1. DataList Component
interface DataListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  loadMore?: () => void;
  hasMore?: boolean;
  virtualized?: boolean;
  itemHeight?: number;
}

// 要件:
// - 任意の型Tのデータを表示
// - 仮想化オプション（大量データ対応）
// - 無限スクロール対応
// - ローディング・エラー状態の管理
// - 空状態の表示

// 2. Form Component
interface FormProps<T extends Record<string, any>> {
  initialValues: T;
  validationSchema?: ValidationSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
  children: (formState: FormState<T>) => React.ReactNode;
}

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  setError: <K extends keyof T>(key: K, error: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
}

// 要件:
// - 型安全なフォーム状態管理
// - バリデーション機能
// - Render Props パターン
// - 送信状態の管理
```

### 演習 2-2: Component Composition System 🔶

```typescript
// 以下の要件を満たすCard Composition Systemを実装せよ

// 使用例:
// <Card>
//   <Card.Header>
//     <Card.Title>Card Title</Card.Title>
//     <Card.Actions>
//       <Button>Edit</Button>
//     </Card.Actions>
//   </Card.Header>
//   <Card.Body>
//     <Card.Media src="image.jpg" alt="Image" />
//     <Card.Content>
//       <p>Card content goes here</p>
//     </Card.Content>
//   </Card.Body>
//   <Card.Footer>
//     <Card.Actions>
//       <Button variant="primary">Save</Button>
//       <Button variant="secondary">Cancel</Button>
//     </Card.Actions>
//   </Card.Footer>
// </Card>

// 要件:
// 1. Context を使った状態共有
// 2. 各子コンポーネントの型安全性
// 3. 柔軟なレイアウト対応
// 4. アクセシビリティ対応
// 5. カスタマイズ可能なスタイリング

interface CardContextType {
  variant: "default" | "outlined" | "elevated";
  size: "sm" | "md" | "lg";
  clickable: boolean;
  onClick?: () => void;
}

// 実装要件:
// - CardContext の型安全な実装
// - 各子コンポーネントの適切な型定義
// - forwardRef の活用
// - displayName の設定
```

### 演習 2-3: 実用的なコンポーネントライブラリ 🔥

```typescript
// 以下の要件を満たすコンポーネントライブラリを作成せよ

// 1. DataGrid Component（高機能テーブル）
// 要件:
// - ソート・フィルタリング機能
// - 行選択（単一・複数）
// - ページネーション
// - 列の表示/非表示切り替え
// - 列幅のリサイズ
// - 仮想化対応（大量データ）
// - エクスポート機能

// 2. DatePicker Component
// 要件:
// - 日付・日時・期間選択
// - カレンダー表示
// - 入力フォーマット対応
// - 最小・最大日付制限
// - 無効日付の設定
// - 国際化対応

// 3. FileUpload Component
// 要件:
// - ドラッグ&ドロップ対応
// - 複数ファイル選択
// - ファイル形式制限
// - サイズ制限
// - プレビュー機能
// - アップロード進捗表示
// - エラーハンドリング

// 実装要件:
// - 完全な型安全性
// - アクセシビリティ対応
// - レスポンシブデザイン
// - カスタマイズ可能なスタイリング
// - Storybook でのドキュメント化
```

## 📊 Step 2 評価基準

### 理解度チェックリスト

#### Props 型設計 (30%)

- [ ] 条件付き Props 型を実装できる
- [ ] Union Props パターンを活用できる
- [ ] 排他的 Props 型を設計できる
- [ ] 動的 Props 型を実装できる

#### Generic Components (35%)

- [ ] Generic Table を実装できる
- [ ] 型推論が適切に働くコンポーネントを作成できる
- [ ] 複雑な Generic 制約を活用できる
- [ ] 再利用可能な Generic パターンを設計できる

#### Component Composition (25%)

- [ ] forwardRef を型安全に実装できる
- [ ] useImperativeHandle を活用できる
- [ ] Context を使った状態共有ができる
- [ ] Compound Components パターンを実装できる

#### 実践応用 (10%)

- [ ] 実用的なコンポーネントライブラリを設計できる
- [ ] アクセシビリティを考慮できる
- [ ] パフォーマンスを意識した実装ができる
- [ ] 保守性の高いコード設計ができる

### 成果物チェックリスト

- [ ] **Generic Components**: Table、List、Form 等の汎用コンポーネント
- [ ] **Composition System**: Card、Modal 等の Compound Components
- [ ] **型安全な Props**: 条件付き・Union・排他的 Props 型の実装例
- [ ] **コンポーネントライブラリ**: 10 個以上の再利用可能コンポーネント

## 🔄 Step 3 への準備

### 次週学習内容の予習

```typescript
// Step 3で学習するState・Event管理の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. useState の型安全な活用
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState<boolean>(false);

// 2. useEffect の依存配列型管理
useEffect(() => {
  // 副作用の処理
}, [dependency1, dependency2]); // 依存配列の型安全性

// 3. Event Handler の型定義
const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
  event.preventDefault();
  // フォーム処理
};

// 4. カスタムフックの基本
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = useCallback(() => setCount((c) => c + 1), []);
  const decrement = useCallback(() => setCount((c) => c - 1), []);
  return { count, increment, decrement };
}
```

### 環境準備

- [ ] Storybook の導入と設定
- [ ] テストライブラリの拡張（React Testing Library）
- [ ] CSS-in-JS ライブラリの選択と設定
- [ ] コンポーネントドキュメント化の準備

### 学習継続のコツ

1. **コンポーネント設計の習慣化**: 毎日小さなコンポーネントを作成
2. **型安全性の徹底**: any 型を一切使わない実装
3. **再利用性の追求**: 汎用的なコンポーネント設計
4. **パフォーマンス意識**: React DevTools での最適化確認

---

**📌 重要**: Step 2 は React コンポーネントの型安全な設計パターンを習得する重要な期間です。Generic Components と Component Composition の理解により、後の高度な状態管理やパフォーマンス最適化がスムーズに進みます。
total: number;
onChange: (page: number, pageSize: number) => void;
};
sorting?: {
field: keyof T;
direction: 'asc' | 'desc';
onChange: (field: keyof T, direction: 'asc' | 'desc') => void;
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
onRowClick?: (record: T, index: number) => void;
emptyText?: string;
className?: string;
}

function Table<T extends Record<string, any>>({
data,
columns,
rowKey = 'id',
loading = false,
pagination,
sorting,
filtering,
selection,
onRowClick,
emptyText = 'No data',
className = '',
}: TableProps<T>): JSX.Element {
const getRowKey = (record: T, index: number): string | number => {
if (typeof rowKey === 'function') {
return rowKey(record);
}
return (record[rowKey] as string | number) ?? index;
};

const handleSort = (column: Column<T>): void => {
if (!column.sortable || !sorting) return;

    const newDirection =
      sorting.field === column.key && sorting.direction === 'asc'
        ? 'desc'
        : 'asc';
    
    sorting.onChange(column.key, newDirection);

};

if (loading) {
return <div className="table-loading">Loading...</div>;
}

if (data.length === 0) {
return <div className="table-empty">{emptyText}</div>;
}

return (
<div className={`table-container ${className}`}>
<table className="table">
<thead>
<tr>
{selection && (
<th className="table-selection">
{selection.multiple && (
<input
type="checkbox"
checked={selection.selectedKeys.length === data.length}
onChange={(e) => {
if (e.target.checked) {
const allKeys = data.map((record, index) => getRowKey(record, index));
selection.onChange(allKeys);
} else {
selection.onChange([]);
}
}}
/>
)}
</th>
)}
{columns.map((column) => (
<th
key={String(column.key)}
style={{
                  width: column.width,
                  textAlign: column.align || 'left',
                }}
className={column.sortable ? 'sortable' : ''}
onClick={() => handleSort(column)} >
<div className="table-header-content">
{column.title}
{column.sortable && sorting && (
<span className="sort-indicator">
{sorting.field === column.key && (
sorting.direction === 'asc' ? '↑' : '↓'
)}
</span>
)}
</div>
</th>
))}
</tr>
</thead>
<tbody>
{data.map((record, index) => {
const key = getRowKey(record, index);
const isSelected = selection?.selectedKeys.includes(key) || false;

            return (
              <tr
                key={key}
                className={`
                  ${isSelected ? 'selected' : ''}
                  ${onRowClick ? 'clickable' : ''}
                `}
                onClick={() => onRowClick?.(record, index)}
              >
                {selection && (
                  <td className="table-selection">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        const selectedKeys = selection.selectedKeys;
                        if (selection.multiple) {
                          const newSelectedKeys = selectedKeys.includes(key)
                            ? selectedKeys.filter(k => k !== key)
                            : [...selectedKeys, key];
                          selection.onChange(newSelectedKeys);
                        } else {
                          selection.onChange(selectedKeys.includes(key) ? [] : [key]);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map((column) => {
                  const value = record[column.key];
                  return (
                    <td
                      key={String(column.key)}
                      style={{ textAlign: column.align || 'left' }}
                    >
                      {column.render
                        ? column.render(value, record, index)
                        : String(value)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    
      {pagination && (
        <div className="table-pagination">
          <button
            disabled={pagination.current === 1}
            onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
          >
            Previous
          </button>
          <span>
            Page {pagination.current} of {Math.ceil(pagination.total / pagination.pageSize)}
          </span>
          <button
            disabled={pagination.current * pagination.pageSize >= pagination.total}
            onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
          >
            Next
          </button>
        </div>
      )}
    </div>

);
}
