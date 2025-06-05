# STEP02 コンポーネント型設計 充実化詳細計画

## 📊 現状分析と改善方針

### 現在のStep02_コンポーネント型設計.mdの課題
- 補足資料へのリンクが存在しない
- 詳細解説が不足（💡🎯📝⚠️🚀パターンの未適用）
- 実践コード例が基本レベルに留まっている
- TypeScript上級者向けの高度な型活用解説が不足
- 成果物設計が具体性に欠ける

### 改善方針
- **品質重視**: 行数よりも内容の充実度を重視
- **実践重視**: 動作する実用的なコード例を豊富に提供
- **段階的学習**: Level 1-4の体系的な学習構造
- **型安全性**: TypeScript上級者向けの高度な型活用

## 🔄 STEP01からの継承事項

### STEP01で実施したHooks対応とfunction宣言への統一
**実施日**: 2025年6月6日
**対応内容**: STEP01基礎学習ファイル全体でのコンポーネント定義方式の統一

#### 統一されたコンポーネント定義方針
```typescript
// ✅ 推奨: function宣言（STEP02でも継承）
function ComponentName(props: Props) {
  return <div>{props.children}</div>;
}

// 📚 教育目的: React.FC（型定義学習用として併記）
const ComponentName: React.FC<Props> = (props) => {
  return <div>{props.children}</div>;
};
```

#### STEP02への影響と対応方針
1. **コンポーネント実装例**: すべてfunction宣言で統一
2. **型定義説明**: React.FCとfunction宣言の比較説明を含める
3. **Generic Components**: function宣言ベースで実装
4. **Component Composition**: function宣言 + forwardRef パターンを採用

#### 具体的な適用箇所
- Generic Components の実装例
- Compound Components パターン
- forwardRef を使用したコンポーネント
- useImperativeHandle を活用したコンポーネント
- 実践演習のサンプルコード

#### 教育的配慮
- TypeScript型定義の学習セクションでは React.FC の例も併記
- 「なぜfunction宣言を推奨するのか」の理由説明を追加
- 型推論の活用方法を具体例で示す

## 🎯 Phase 1: メインファイル拡充詳細計画

### 1.1 ファイル構造の再編成

```markdown
# Step 2: コンポーネント型設計

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
> [補足資料リンクセクション]

## 📅 学習期間・目標
[既存内容の拡充]

## 📚 理論学習内容（大幅拡充）

### Phase 1: Props型の高度な設計パターン（詳細化）
### Phase 2: Generic Components の実装と活用（新規追加）
### Phase 3: Component Composition と型安全性（詳細化）
### Phase 4: 実用的なコンポーネントライブラリ設計（新規追加）

## 🎯 実践演習（大幅拡充）
### 演習レベル体系化
### 実用的な課題設計

## 📊 評価基準（詳細化）
### 段階的評価システム

## 🔄 次のStepへの準備（拡充）
### 具体的な準備項目
```

### 1.2 補足資料リンクセクション（新規追加）

```markdown
> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step02_補足_専門用語集.md) - Generic Components、Props型設計、Component Compositionの詳細解説
> - 🛠️ [開発環境ガイド](./Step02_補足_開発環境ガイド.md) - コンポーネント開発に最適化された環境構築
> - ⚙️ [設定ファイル解説](./Step02_補足_設定ファイル解説.md) - TypeScript設定とコンポーネント開発の最適化
> - 💻 [実践コード例](./Step02_補足_実践コード例.md) - Level 1-4の段階的Generic Components実装集
> - 🚨 [トラブルシューティング](./Step02_補足_トラブルシューティング.md) - コンポーネント型設計でよくあるエラーと解決方法
> - 📚 [参考リソース](./Step02_補足_参考リソース.md) - コンポーネント設計パターンの学習リソース集
```

### 1.3 理論学習内容の詳細拡充

#### 1.3.1 Props型の高度な設計パターン（既存内容の大幅拡充）

**現在の内容を以下のように拡充：**

```typescript
// 💡 なぜ条件付きProps型が重要なのか
// TypeScript上級者にとって、Props型の条件分岐は以下の価値を提供：
// 1. コンパイル時の型安全性保証
// 2. IDE支援による開発効率向上
// 3. ランタイムエラーの事前防止
// 4. APIの意図を明確に表現

// 🎯 どういう場面で使うのか
// - フォームフィールドの必須/任意切り替え
// - ボタンコンポーネントのvariant別Props
// - モーダルの表示モード別設定
// - データ表示コンポーネントの表示形式切り替え

// 📝 コードの詳細解説（Level 1-4の段階的実装）

// Level 1: 基本的な条件付きProps
type BasicConditionalProps<T extends boolean> = T extends true
  ? { required: true; value: string }
  : { required?: false; value?: string };

// Level 2: 複雑な条件分岐
type AdvancedConditionalProps<T extends 'single' | 'multiple'> = {
  mode: T;
} & (T extends 'single'
  ? { value: string; onChange: (value: string) => void }
  : { values: string[]; onChange: (values: string[]) => void });

// Level 3: ネストした条件付きProps
type NestedConditionalProps<
  TMode extends 'view' | 'edit',
  TType extends 'text' | 'number'
> = {
  mode: TMode;
  type: TType;
} & (TMode extends 'edit'
  ? {
      onChange: TType extends 'text'
        ? (value: string) => void
        : (value: number) => void;
      validation?: TType extends 'text'
        ? (value: string) => string | null
        : (value: number) => string | null;
    }
  : {
      formatter?: TType extends 'text'
        ? (value: string) => string
        : (value: number) => string;
    });

// Level 4: 実用的な条件付きProps（実際のプロジェクトレベル）
interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  // 条件付きProps: selectionModeによってselection関連のPropsが変化
  selectionMode?: 'none' | 'single' | 'multiple';
} & (
  | { selectionMode?: 'none'; onSelectionChange?: never; selectedKeys?: never }
  | {
      selectionMode: 'single';
      onSelectionChange: (key: string | number | null) => void;
      selectedKeys?: string | number | null;
    }
  | {
      selectionMode: 'multiple';
      onSelectionChange: (keys: (string | number)[]) => void;
      selectedKeys?: (string | number)[];
    }
);

// ⚠️ よくある間違いと注意点
// 1. never型の使い忘れ → 排他制御が効かない
// 2. 条件分岐の網羅性不足 → 予期しない型エラー
// 3. ジェネリック制約の不適切な設定 → 型推論の失敗

// 🚀 TypeScriptでの改善点
// - JavaScriptでは実行時エラーになる型不整合をコンパイル時に検出
// - IDEの自動補完により開発効率が大幅向上
// - リファクタリング時の安全性確保
```

#### 1.3.2 Generic Components の実装と活用（新規追加）

```typescript
// 💡 なぜGeneric Componentsが重要なのか
// TypeScript上級者にとって、Generic Componentsは以下の価値を提供：
// 1. 型安全性を保ちながらの再利用性実現
// 2. 複雑なデータ構造に対応した柔軟なコンポーネント
// 3. ライブラリレベルの品質を持つコンポーネント設計
// 4. 保守性と拡張性の両立

// 🎯 どういう場面で使うのか
// - データテーブル（任意の型のデータを表示）
// - フォームビルダー（動的なフォーム構造）
// - リストコンポーネント（様々なアイテム型に対応）
// - モーダルシステム（異なるコンテンツ型に対応）

// 📝 コードの詳細解説（Level 1-4の段階的実装）

// Level 1: 基本的なGeneric Component
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

// Level 2: 制約付きGeneric Component
interface SelectProps<T extends { id: string | number; label: string }> {
  options: T[];
  value?: T['id'];
  onChange: (option: T) => void;
  placeholder?: string;
  disabled?: boolean;
}

function Select<T extends { id: string | number; label: string }>({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
}: SelectProps<T>): JSX.Element {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => {
        const selectedOption = options.find(
          (option) => String(option.id) === e.target.value
        );
        if (selectedOption) {
          onChange(selectedOption);
        }
      }}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// Level 3: 高度なGeneric制約
interface DataGridProps<
  T extends Record<string, any>,
  K extends keyof T = keyof T
> {
  data: T[];
  columns: Array<{
    key: K;
    title: string;
    render?: (value: T[K], record: T, index: number) => React.ReactNode;
    sortable?: boolean;
    width?: number | string;
  }>;
  sortBy?: K;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: K, direction: 'asc' | 'desc') => void;
  rowKey?: K | ((record: T) => string | number);
}

// Level 4: 実用的なGeneric Component（プロダクションレベル）
interface FormBuilderProps<T extends Record<string, any>> {
  schema: FormSchema<T>;
  initialValues?: Partial<T>;
  onSubmit: (values: T) => Promise<void> | void;
  validation?: ValidationRules<T>;
  children?: (formState: FormState<T>) => React.ReactNode;
}

type FormSchema<T> = {
  [K in keyof T]: {
    type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'textarea';
    label: string;
    required?: boolean;
    placeholder?: string;
    options?: T[K] extends string ? readonly string[] : never;
    min?: T[K] extends number ? number : never;
    max?: T[K] extends number ? number : never;
    rows?: T[K] extends string ? number : never;
  };
};

// ⚠️ よくある間違いと注意点
// 1. Generic制約の過度な複雑化 → 使いにくいAPI
// 2. 型推論の阻害 → 明示的な型指定が必要になる
// 3. パフォーマンスの考慮不足 → 不要な再レンダリング

// 🚀 TypeScriptでの改善点
// - 型安全性を保ちながら高い再利用性を実現
// - コンパイル時の型チェックによる品質向上
// - IDEサポートによる開発体験の向上
```

#### 1.3.3 Component Composition と型安全性（既存内容の詳細化）

```typescript
// 💡 なぜComponent Compositionが重要なのか
// TypeScript上級者にとって、Component Compositionは以下の価値を提供：
// 1. 複雑なUIを型安全に構築する手法
// 2. 再利用可能で拡張性の高いコンポーネント設計
// 3. Context APIとの組み合わせによる状態共有
// 4. ライブラリレベルのAPI設計パターン

// 🎯 どういう場面で使うのか
// - カードコンポーネント（Header、Body、Footer）
// - モーダルシステム（Modal、Header、Body、Footer）
// - ナビゲーション（Nav、Item、Dropdown）
// - フォームレイアウト（Form、Field、Label、Input）

// 📝 コードの詳細解説（Level 1-4の段階的実装）

// Level 1: 基本的なCompound Components
interface CardContextType {
  variant: 'default' | 'outlined' | 'elevated';
  size: 'sm' | 'md' | 'lg';
}

const CardContext = React.createContext<CardContextType | null>(null);

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
  const contextValue: CardContextType = { variant, size };

  return (
    <CardContext.Provider value={contextValue}>
      <div className={`card card-${variant} card-${size} ${className}`}>
        {children}
      </div>
    </CardContext.Provider>
  );
}

// Level 2: forwardRefを使った型安全なComposition
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = '' }, ref) => {
    const context = React.useContext(CardContext);
    if (!context) {
      throw new Error('CardHeader must be used within a Card');
    }

    return (
      <div ref={ref} className={`card-header ${className}`}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// Level 3: useImperativeHandleを活用した高度なComposition
interface ModalHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  focus: () => void;
}

interface ModalProps {
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClose?: () => void;
}

const Modal = React.forwardRef<ModalHandle, ModalProps>(
  ({ children, title, size = 'md', onClose }, ref) => {
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

    // 実装詳細...
  }
);

// Level 4: 実用的なComposition System（プロダクションレベル）
// 複雑なフォームレイアウトシステムの実装例
interface FormContextType<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  setError: <K extends keyof T>(key: K, error: string) => void;
  setTouched: <K extends keyof T>(key: K, touched: boolean) => void;
}

// ⚠️ よくある間違いと注意点
// 1. Context の型安全性の確保不足
// 2. forwardRef の型定義ミス
// 3. useImperativeHandle の過度な使用
// 4. Compound Components の命名規則不統一

// 🚀 TypeScriptでの改善点
// - Context の型安全性による実行時エラーの防止
// - forwardRef の適切な型定義による ref の型安全性
// - displayName の設定による開発ツールでの可読性向上
```

#### 1.3.4 実用的なコンポーネントライブラリ設計（新規追加）

```typescript
// 💡 なぜコンポーネントライブラリ設計が重要なのか
// TypeScript上級者にとって、ライブラリレベルの設計は以下の価値を提供：
// 1. 企業レベルの開発で求められる設計スキル
// 2. 保守性・拡張性・再利用性の三位一体実現
// 3. チーム開発での一貫性確保
// 4. パフォーマンスとアクセシビリティの両立

// 🎯 どういう場面で使うのか
// - 社内コンポーネントライブラリの構築
// - デザインシステムの実装
// - OSS ライブラリの開発
// - 大規模アプリケーションの共通コンポーネント

// 📝 コードの詳細解説（実用的な設計パターン）

// 1. テーマシステムの型安全な実装
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      bold: number;
    };
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// 2. コンポーネントのバリアント型システム
type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface BaseComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  'data-testid'?: string;
}

// 3. アクセシビリティを考慮した型定義
interface AccessibleComponentProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-disabled'?: boolean;
  role?: string;
  tabIndex?: number;
}

// 4. 実用的なコンポーネント設計例
interface ButtonProps extends BaseComponentProps, AccessibleComponentProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    startIcon,
    endIcon,
    fullWidth = false,
    className = '',
    'data-testid': dataTestId,
    ...accessibilityProps
  }, ref) => {
    const theme = useTheme();
    
    const buttonClassName = React.useMemo(() => {
      return [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        disabled && 'btn-disabled',
        loading && 'btn-loading',
        fullWidth && 'btn-full-width',
        className,
      ].filter(Boolean).join(' ');
    }, [variant, size, disabled, loading, fullWidth, className]);

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || loading) return;
        onClick?.(event);
      },
      [disabled, loading, onClick]
    );

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClassName}
        onClick={handleClick}
        disabled={disabled || loading}
        data-testid={dataTestId}
        {...accessibilityProps}
      >
        {loading && <Spinner size="sm" />}
        {!loading && startIcon && <span className="btn-start-icon">{startIcon}</span>}
        <span className="btn-content">{children}</span>
        {!loading && endIcon && <span className="btn-end-icon">{endIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ⚠️ よくある間違いと注意点
// 1. テーマシステムの型定義不備
// 2. アクセシビリティの考慮不足
// 3. パフォーマンス最適化の欠如
// 4. テスト可能性の軽視

// 🚀 TypeScriptでの改善点
// - 型安全なテーマシステムによる一貫性確保
// - アクセシビリティプロパティの型チェック
// - コンポーネントAPIの明確な定義
// - 開発時の型支援による生産性向上
```

### 1.4 実践演習の大幅拡充

#### 1.4.1 演習レベル体系化

```markdown
## 🎯 実践演習

### 演習体系について
各演習は以下の4つのレベルに分類され、段階的にスキルアップできるよう設計されています：

- **🔰 Level 1**: 基本的なGeneric Components実装
- **🔶 Level 2**: 型安全なProps設計とComposition
- **🔥 Level 3**: 実用的なコンポーネントライブラリ
- **⭐ Level 4**: プロダクションレベルの高度な実装

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
  className?: string;
}

// 要件:
// - 任意の型Tのデータを表示
// - ローディング・エラー状態の管理
// - 空状態の表示
// - 型安全なkeyExtractor

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

### 演習 2-4: Production-Ready Component Library ⭐

**学習目標**: プロダクションレベルの品質を持つコンポーネントライブラリの設計・実装

**課題内容**:
```typescript
// 以下の要件を満たすコンポーネントライブラリを作成せよ

//