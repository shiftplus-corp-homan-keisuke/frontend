# Step 2: コンポーネント型設計

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step02_補足_専門用語集.md) - Generic Components、Props型設計、Component Compositionの詳細解説
> - 🛠️ [開発環境ガイド](./Step02_補足_開発環境ガイド.md) - コンポーネント開発に最適化された環境構築と設定方法
> - ⚙️ [設定ファイル解説](./Step02_補足_設定ファイル解説.md) - TypeScript設定とコンポーネント開発の最適化
> - 💻 [実践コード例](./Step02_補足_実践コード例.md) - Level 1-4の段階的Generic Components実装集
> - 🚨 [トラブルシューティング](./Step02_補足_トラブルシューティング.md) - コンポーネント型設計でよくあるエラーと解決方法
> - 📚 [参考リソース](./Step02_補足_参考リソース.md) - コンポーネント設計パターンの学習リソース集

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

**💡 なぜ条件付きProps型が重要なのか**

TypeScript上級者にとって、条件付きProps型は以下の価値を提供します：
- **コンパイル時の型安全性保証**: 実行時エラーを事前に防止
- **IDE支援による開発効率向上**: 自動補完と型チェックの恩恵
- **APIの意図を明確に表現**: コンポーネントの使用方法を型で制約
- **保守性の向上**: リファクタリング時の安全性確保

**🎯 どういう場面で使うのか**

実際の開発現場では以下のような場面で活用されます：
- **フォームフィールドの必須/任意切り替え**: バリデーション要件に応じた型制御
- **ボタンコンポーネントのvariant別Props**: リンクボタンとアクションボタンの排他制御
- **モーダルの表示モード別設定**: 確認モーダルと入力モーダルの型分岐
- **データ表示コンポーネントの表示形式切り替え**: テーブル表示とカード表示の型管理

**📝 コードの詳細解説**

以下のLevel 1-4の段階的実装で、条件付きProps型をマスターしましょう：

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

**⚠️ よくある間違いと注意点**

条件付きProps型を実装する際の典型的なエラーパターンと対策：

1. **never型の使い忘れ**: 排他制御が効かない問題
   ```typescript
   // ❌ 間違い: never型を使わないと両方のプロパティが存在可能
   type BadButtonProps = {
     variant: 'link';
     href: string;
     onClick: () => void; // これが問題
   }
   
   // ✅ 正しい: never型で排他制御
   type GoodButtonProps = {
     variant: 'link';
     href: string;
     onClick?: never;
   }
   ```

2. **条件分岐の網羅性不足**: 予期しない型エラーの発生
   ```typescript
   // ❌ 間違い: すべてのケースを網羅していない
   type IncompleteProps<T> = T extends 'text' ? { value: string } : never;
   
   // ✅ 正しい: すべてのケースを明示的に定義
   type CompleteProps<T> = T extends 'text'
     ? { value: string }
     : T extends 'number'
     ? { value: number }
     : { value: unknown };
   ```

3. **ジェネリック制約の不適切な設定**: 型推論の失敗
   ```typescript
   // ❌ 間違い: 制約が厳しすぎる
   interface BadFormProps<T extends 'text' | 'number'> {
     type: T;
     value: T extends 'text' ? string : number;
   }
   
   // ✅ 正しい: 適切な制約設定
   interface GoodFormProps<T extends string> {
     type: T;
     value: T extends 'text' ? string : T extends 'number' ? number : unknown;
   }
   ```

**🚀 TypeScriptでの改善点**

従来のJavaScriptと比較したTypeScriptの優位性：

- **コンパイル時エラー検出**: 実行時に発生するプロパティ不整合をコンパイル時に発見
- **IDEサポートの向上**: 自動補完により開発効率が大幅に向上
- **リファクタリング安全性**: 型定義の変更時に影響範囲を自動検出
- **ドキュメント効果**: 型定義自体がAPIドキュメントとして機能

> 💡 **詳細解説**: 条件付きProps型の詳細は [Step02_補足_専門用語集.md#条件付きprops型](./Step02_補足_専門用語集.md#条件付きprops型) を見てね 🐰

### Day 11-12: Generic Components の実装

**💡 なぜGeneric Componentsが重要なのか**

TypeScript上級者にとって、Generic Componentsは以下の価値を提供します：
- **型安全性を保ちながらの再利用性実現**: 一つのコンポーネントで複数の型に対応
- **複雑なデータ構造に対応した柔軟なコンポーネント**: エンタープライズレベルの要件に対応
- **ライブラリレベルの品質を持つコンポーネント設計**: 保守性と拡張性の両立
- **開発効率の大幅向上**: 汎用コンポーネントによるDRY原則の実現

**🎯 どういう場面で使うのか**

実際のプロジェクトでは以下のような場面で威力を発揮します：
- **データテーブル**: 任意の型のデータを表示する汎用テーブル
- **フォームビルダー**: 動的なフォーム構造に対応するフォームシステム
- **リストコンポーネント**: 様々なアイテム型に対応する一覧表示
- **モーダルシステム**: 異なるコンテンツ型に対応する汎用モーダル

**📝 コードの詳細解説**

以下のLevel 1-4の段階的実装で、Generic Componentsをマスターしましょう：

#### 🧩 Generic Table Component

```typescript
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
```

**⚠️ よくある間違いと注意点**

Generic Componentsを実装する際の典型的なエラーパターンと対策：

1. **Generic制約の過度な複雑化**: 使いにくいAPIの原因
```typescript
   // ❌ 間違い: 制約が複雑すぎる
   interface BadTableProps<
     T extends Record<string, string | number | boolean>,
     K extends keyof T & string,
     V extends T[K] & (string | number)
   > {
     data: T[];
     sortKey: K;
     sortValue: V;
   }
   
   // ✅ 正しい: シンプルで実用的な制約
   interface GoodTableProps<T extends Record<string, any>> {
     data: T[];
     sortKey?: keyof T;
   }
```

2. **型推論の阻害**: 明示的な型指定が必要になる問題
```typescript
   // ❌ 間違い: 型推論が働かない
   function badComponent<T>(props: { data: T[] }): JSX.Element {
     return <div>{JSON.stringify(props.data)}</div>;
   }
   
   // ✅ 正しい: 型推論が適切に働く
   function goodComponent<T extends Record<string, any>>(
     props: { data: T[] }
   ): JSX.Element {
     return <div>{JSON.stringify(props.data)}</div>;
   }
   ```

3. **パフォーマンスの考慮不足**: 不要な再レンダリングの発生
```typescript
   // ❌ 間違い: 毎回新しいオブジェクトを作成
   function BadTable<T>({ data, columns }: TableProps<T>) {
     return (
       <table>
         {data.map((item, index) => (
           <tr key={index}> {/* indexをkeyに使用は危険 */}
             {columns.map(col => (
               <td key={col.key}>{item[col.key]}</td>
             ))}
           </tr>
         ))}
       </table>
     );
   }
   
   // ✅ 正しい: 適切なkey設定とメモ化
   const GoodTable = React.memo(<T extends Record<string, any>>({
     data,
     columns,
     keyExtractor = (item: T) => item.id
   }: TableProps<T>) => {
     return (
       <table>
         {data.map((item, index) => (
           <tr key={keyExtractor(item)}>
             {columns.map(col => (
               <td key={String(col.key)}>{item[col.key]}</td>
             ))}
           </tr>
         ))}
       </table>
     );
   });
```

**🚀 TypeScriptでの改善点**

Generic ComponentsにおけるTypeScriptの優位性：

- **型安全性を保ちながら高い再利用性を実現**: 一つのコンポーネントで複数の型に対応
- **コンパイル時の型チェックによる品質向上**: 実行時エラーの大幅削減
- **IDEサポートによる開発体験の向上**: 自動補完と型ヒントの恩恵
- **リファクタリング安全性**: 型定義の変更時に影響範囲を自動検出

> 💡 **詳細解説**: Generic Componentsの詳細は [Step02_補足_専門用語集.md#generic-components](./Step02_補足_専門用語集.md#generic-components) を見てね 🐰

### Day 13-14: Component Composition と forwardRef

**💡 なぜComponent Compositionが重要なのか**

TypeScript上級者にとって、Component Compositionは以下の価値を提供します：
- **複雑なUIを型安全に構築する手法**: エンタープライズレベルのUI要件に対応
- **再利用可能で拡張性の高いコンポーネント設計**: 保守性と柔軟性の両立
- **Context APIとの組み合わせによる状態共有**: 効率的な状態管理の実現
- **ライブラリレベルのAPI設計パターン**: プロフェッショナルな開発スキル

**🎯 どういう場面で使うのか**

実際のプロジェクトでは以下のような場面で威力を発揮します：
- **カードコンポーネント**: Header、Body、Footerの柔軟な組み合わせ
- **モーダルシステム**: Modal、Header、Body、Footerの構造化
- **ナビゲーション**: Nav、Item、Dropdownの階層構造
- **フォームレイアウト**: Form、Field、Label、Inputの組み合わせ

**📝 コードの詳細解説**

以下のLevel 1-4の段階的実装で、Component Compositionをマスターしましょう：

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
```

**⚠️ よくある間違いと注意点**

Component Compositionを実装する際の典型的なエラーパターンと対策：

1. **Contextの型安全性の確保不足**: 実行時エラーの原因
   ```typescript
   // ❌ 間違い: Contextの型チェックが不十分
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

2. **forwardRefの型定義ミス**: ref の型安全性の問題
   ```typescript
   // ❌ 間違い: 型定義が不適切
   const BadInput = React.forwardRef((props: any, ref: any) => {
     return <input ref={ref} {...props} />;
   });
   
   // ✅ 正しい: 適切な型定義
   interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
     label: string;
   }
   
   const GoodInput = React.forwardRef<HTMLInputElement, InputProps>(
     ({ label, ...props }, ref) => {
       return (
         <div>
           <label>{label}</label>
           <input ref={ref} {...props} />
         </div>
       );
     }
   );
   ```

3. **useImperativeHandleの過度な使用**: カプセル化の破綻
   ```typescript
   // ❌ 間違い: 内部実装を過度に公開
   const BadComponent = React.forwardRef((props, ref) => {
     const [state, setState] = React.useState('');
     
     React.useImperativeHandle(ref, () => ({
       state,        // 内部状態を直接公開（危険）
       setState,     // 内部状態の変更を直接公開（危険）
       element: elementRef.current,
     }));
   });
   
   // ✅ 正しい: 必要最小限のAPIのみ公開
   const GoodComponent = React.forwardRef((props, ref) => {
     React.useImperativeHandle(ref, () => ({
       focus: () => elementRef.current?.focus(),
       reset: () => setState(''),
     }));
   });
   ```

**🚀 TypeScriptでの改善点**

Component CompositionにおけるTypeScriptの優位性：

- **Contextの型安全性による実行時エラーの防止**: null チェックの強制
- **forwardRefの適切な型定義によるrefの型安全性**: HTMLElement型の保証
- **displayNameの設定による開発ツールでの可読性向上**: React DevToolsでの識別性
- **Compound Componentsの型安全な実装**: 子コンポーネントの型制約

> 💡 **詳細解説**: Component Compositionの詳細は [Step02_補足_専門用語集.md#component-composition](./Step02_補足_専門用語集.md#component-composition) を見てね 🐰

## 🎯 実践演習

### 演習体系について

各演習は以下の4つのレベルに分類され、段階的にスキルアップできるよう設計されています：

- **🔰 Level 1**: 基本的なGeneric Components実装
- **🔶 Level 2**: 型安全なProps設計とComposition
- **🔥 Level 3**: 実用的なコンポーネントライブラリ
- **⭐ Level 4**: プロダクションレベルの高度な実装

各レベルには明確な学習目標と評価基準が設定されており、実際のプロジェクトで即戦力となるスキルを身につけることができます。

### 演習 2-1: Generic Data Components 🔰

**学習目標**: Generic型を活用した再利用可能なデータ表示コンポーネントの実装

**課題内容**:

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

// 2. DataGrid Component
interface DataGridProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  onRowClick?: (item: T, index: number) => void;
}

interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], item: T, index: number) => React.ReactNode;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

// 要件:
// - 型安全な列定義
// - カスタムレンダラー対応
// - 行クリックイベント
// - レスポンシブ対応
```

**評価基準**:
- [ ] Generic型の適切な使用（30点）
- [ ] 型安全性の確保（25点）
- [ ] エラーハンドリング（20点）
- [ ] 使いやすいAPI設計（15点）
- [ ] アクセシビリティ対応（10点）

**合格ライン**: 70点以上

### 演習 2-2: Advanced Props Design 🔶

**学習目標**: 条件付きProps型と排他的Props型を活用した高度なコンポーネント設計

**課題内容**:

```typescript
// 以下の要件を満たすButton Componentを実装せよ

// 1. 条件付きProps型の実装
type ButtonProps = BaseButtonProps & (
  | LinkButtonProps
  | ActionButtonProps
  | SubmitButtonProps
);

interface BaseButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

interface LinkButtonProps {
  as: 'link';
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  onClick?: never;
  type?: never;
}

interface ActionButtonProps {
  as?: 'button';
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  href?: never;
  target?: never;
  rel?: never;
  type?: 'button' | 'reset';
}

interface SubmitButtonProps {
  as?: 'button';
  type: 'submit';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  href?: never;
  target?: never;
  rel?: never;
}

// 要件:
// - 排他的Props型による型安全性
// - as propによる要素の切り替え
// - 適切なHTML属性の型定義
// - アクセシビリティ対応
```

**評価基準**:
- [ ] 排他的Props型の実装（35点）
- [ ] 型安全性の確保（30点）
- [ ] API設計の使いやすさ（20点）
- [ ] アクセシビリティ対応（15点）

**合格ライン**: 75点以上

### 演習 2-3: Component Composition System 🔥

**学習目標**: Context APIとCompound Componentsを活用した複雑なUIシステムの構築

**課題内容**:

```typescript
// 以下の要件を満たすModal Systemを実装せよ

// 使用例:
// <Modal>
//   <Modal.Trigger asChild>
//     <Button>Open Modal</Button>
//   </Modal.Trigger>
//   <Modal.Content>
//     <Modal.Header>
//       <Modal.Title>Modal Title</Modal.Title>
//       <Modal.Close />
//     </Modal.Header>
//     <Modal.Body>
//       <p>Modal content goes here</p>
//     </Modal.Body>
//     <Modal.Footer>
//       <Modal.Close asChild>
//         <Button variant="outline">Cancel</Button>
//       </Modal.Close>
//       <Button>Confirm</Button>
//     </Modal.Footer>
//   </Modal.Content>
// </Modal>

// 要件:
// 1. Context を使った状態共有
// 2. Compound Components パターン
// 3. Portal を使った DOM 外レンダリング
// 4. フォーカス管理とキーボードナビゲーション
// 5. アニメーション対応
// 6. アクセシビリティ完全対応（ARIA属性、フォーカストラップ等）
```

**評価基準**:
- [ ] Compound Componentsの実装（25点）
- [ ] Context APIの活用（20点）
- [ ] アクセシビリティ対応（20点）
- [ ] フォーカス管理（15点）
- [ ] アニメーション実装（10点）
- [ ] 型安全性（10点）

**合格ライン**: 80点以上

### 演習 2-4: Production-Ready Component Library ⭐

**学習目標**: プロダクションレベルの品質を持つコンポーネントライブラリの設計・実装

**課題内容**:

```typescript
// 以下の要件を満たすコンポーネントライブラリを作成せよ

// 1. テーマシステム
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string>;
  typography: {
    fontFamily: string;
    fontSize: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string>;
  };
}

// 2. 共通Props型
interface BaseComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  'data-testid'?: string;
}

// 3. 実装対象コンポーネント
// - Button (Link/Action/Submit variants)
// - Input (Text/Number/Email/Password variants)
// - Select (Single/Multiple selection)
// - Modal (Confirmation/Form/Custom content)
// - Table (Sortable/Filterable/Paginated)

// 要件:
// - 完全な型安全性
// - テーマシステム対応
// - アクセシビリティ完全対応
// - レスポンシブデザイン
// - ユニットテスト（90%以上のカバレッジ）
// - Storybook ドキュメント
// - パフォーマンス最適化
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
