# Step02_補足_トラブルシューティング.md

# Step 2: コンポーネント型設計 - トラブルシューティング

> 🐰 **このファイルについて**: コンポーネント型設計でよくあるエラーと解決方法を網羅的に解説します。実際の開発で遭遇する問題を事前に把握し、効率的に解決できるようになります。

## 📖 目次

- [TypeScript エラー](#typescript-エラー)
- [React エラー](#react-エラー)
- [Generic Components の問題](#generic-components-の問題)
- [Props型設計の問題](#props型設計の問題)
- [Component Composition の問題](#component-composition-の問題)
- [パフォーマンスの問題](#パフォーマンスの問題)
- [予防策とベストプラクティス](#予防策とベストプラクティス)

---

## TypeScript エラー

### エラー1: Type 'T' is not assignable to type 'never'

**症状**:
```
Type 'T' is not assignable to type 'never'.
  Type 'string' is not assignable to type 'never'.
```

**原因**:
Generic型の制約が不適切で、TypeScriptが型を推論できない

**問題のあるコード**:
```typescript
// ❌ 問題のあるコード
interface BadProps<T> {
  value: T;
  onChange: (value: T) => void;
}

function BadComponent<T>({ value, onChange }: BadProps<T>) {
  const handleChange = (newValue: string) => {
    onChange(newValue); // エラー: Type 'string' is not assignable to type 'T'
  };
  
  return <input value={String(value)} onChange={(e) => handleChange(e.target.value)} />;
}
```

**修正されたコード**:
```typescript
// ✅ 修正されたコード
interface GoodProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
}

function GoodComponent<T extends string | number>({ value, onChange }: GoodProps<T>) {
  const handleChange = (newValue: string) => {
    // 型アサーションまたは型ガードを使用
    if (typeof value === 'string') {
      (onChange as (value: string) => void)(newValue);
    } else {
      (onChange as (value: number) => void)(Number(newValue));
    }
  };
  
  return <input value={String(value)} onChange={(e) => handleChange(e.target.value)} />;
}
```

**解説**:
Generic型に適切な制約を設け、型アサーションまたは型ガードを使用して型安全性を確保

**予防策**:
- Generic型には適切な制約を設定する
- 型変換が必要な場合は明示的に行う
- 型ガードを活用して安全な型変換を実装する

---

### エラー2: Property 'key' does not exist on type 'T'

**症状**:
```
Property 'id' does not exist on type 'T'.
```

**原因**:
Generic型に必要なプロパティの制約が設定されていない

**問題のあるコード**:
```typescript
// ❌ 問題のあるコード
interface BadTableProps<T> {
  data: T[];
  onRowClick: (item: T) => void;
}

function BadTable<T>({ data, onRowClick }: BadTableProps<T>) {
  return (
    <table>
      {data.map((item) => (
        <tr key={item.id} onClick={() => onRowClick(item)}> {/* エラー */}
          <td>{JSON.stringify(item)}</td>
        </tr>
      ))}
    </table>
  );
}
```

**修正されたコード**:
```typescript
// ✅ 修正されたコード
interface HasId {
  id: string | number;
}

interface GoodTableProps<T extends HasId> {
  data: T[];
  onRowClick: (item: T) => void;
  keyExtractor?: (item: T) => string | number;
}

function GoodTable<T extends HasId>({ 
  data, 
  onRowClick, 
  keyExtractor = (item) => item.id 
}: GoodTableProps<T>) {
  return (
    <table>
      {data.map((item) => (
        <tr key={keyExtractor(item)} onClick={() => onRowClick(item)}>
          <td>{JSON.stringify(item)}</td>
        </tr>
      ))}
    </table>
  );
}
```

**解説**:
Generic型に必要なプロパティを持つインターフェースを制約として設定

**予防策**:
- 必要なプロパティを定義したインターフェースを作成
- Generic制約として適用
- keyExtractor関数を提供して柔軟性を確保

---

### エラー3: Argument of type 'unknown' is not assignable to parameter

**症状**:
```
Argument of type 'unknown' is not assignable to parameter of type 'string'.
```

**原因**:
型推論が不十分で、TypeScriptが型を特定できない

**問題のあるコード**:
```typescript
// ❌ 問題のあるコード
interface BadFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => void;
}

function BadForm<T>({ initialValues, onSubmit }: BadFormProps<T>) {
  const [values, setValues] = useState(initialValues);
  
  const handleFieldChange = (field: string, value: unknown) => {
    setValues(prev => ({
      ...prev,
      [field]: value // エラー: Type 'unknown' is not assignable
    }));
  };
  
  return <div>Form content</div>;
}
```

**修正されたコード**:
```typescript
// ✅ 修正されたコード
interface GoodFormProps<T extends Record<string, any>> {
  initialValues: T;
  onSubmit: (values: T) => void;
}

function GoodForm<T extends Record<string, any>>({ 
  initialValues, 
  onSubmit 
}: GoodFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  
  const handleFieldChange = <K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return <div>Form content</div>;
}
```

**解説**:
適切な型制約とMapped Typesを使用して型安全性を確保

**予防策**:
- Record<string, any>などの適切な制約を設定
- Mapped Typesを活用
- 型パラメータを明示的に指定

---

## React エラー

### エラー4: Warning: Each child in a list should have a unique "key" prop

**症状**:
```
Warning: Each child in a list should have a unique "key" prop.
```

**原因**:
リストレンダリング時にユニークなkeyが設定されていない

**問題のあるコード**:
```typescript
// ❌ 問題のあるコード
function BadList<T>({ items }: { items: T[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}> {/* 問題: indexをkeyに使用 */}
          {JSON.stringify(item)}
        </li>
      ))}
    </ul>
  );
}
```

**修正されたコード**:
```typescript
// ✅ 修正されたコード
interface GoodListProps<T> {
  items: T[];
  keyExtractor: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

function GoodList<T>({ items, keyExtractor, renderItem }: GoodListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => {
        const key = keyExtractor(item, index);
        return (
          <li key={key}>
            {renderItem(item, index)}
          </li>
        );
      })}
    </ul>
  );
}

// 使用例
interface User {
  id: number;
  name: string;
}

<GoodList<User>
  items={users}
  keyExtractor={(user) => user.id}
  renderItem={(user) => <span>{user.name}</span>}
/>
```

**解説**:
ユニークで安定したkeyを使用してReactの仮想DOM最適化を活用

**予防策**:
- 可能な限りユニークなIDをkeyとして使用
- indexの使用は最後の手段
- keyExtractor関数を提供して柔軟性を確保

---

### エラー5: Cannot read properties of undefined (reading 'current')

**症状**:
```
TypeError: Cannot read properties of undefined (reading 'current')
```

**原因**:
forwardRefの型定義が不適切、またはrefが正しく渡されていない

**問題のあるコード**:
```typescript
// ❌ 問題のあるコード
interface BadInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const BadInput = React.forwardRef((props: BadInputProps, ref: any) => {
  const { label, value, onChange } = props;
  
  React.useEffect(() => {
    if (ref.current) { // エラーの可能性
      ref.current.focus();
    }
  }, []);
  
  return (
    <div>
      <label>{label}</label>
      <input ref={ref} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
});
```

**修正されたコード**:
```typescript
// ✅ 修正されたコード
interface GoodInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const GoodInput = React.forwardRef<HTMLInputElement, GoodInputProps>(
  ({ label, value, onChange }, ref) => {
    React.useEffect(() => {
      // 型安全なref使用
      if (ref && typeof ref === 'object' && ref.current) {
        ref.current.focus();
      }
    }, [ref]);
    
    return (
      <div>
        <label>{label}</label>
        <input 
          ref={ref} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
        />
      </div>
    );
  }
);

GoodInput.displayName = 'GoodInput';
```

**解説**:
forwardRefの型を明示的に指定し、refの存在チェックを行う

**予防策**:
- forwardRefの型パラメータを明示的に指定
- refの存在と型をチェック
- displayNameを設定してデバッグを容易にする

---

## Generic Components の問題

### エラー6: Type instantiation is excessively deep and possibly infinite

**症状**:
```
Type instantiation is excessively deep and possibly infinite.
```

**原因**:
複雑すぎるGeneric型定義により、TypeScriptの型推論が無限ループに陥る

**問題のあるコード**:
```typescript
// ❌ 問題のあるコード
type DeepNested<T> = T extends Record<string, any>
  ? { [K in keyof T]: DeepNested<T[K]> }
  : T;

interface BadComplexProps<T> {
  data: DeepNested<T>;
  transform: <U>(value: DeepNested<T>) => DeepNested<U>;
}
```

**修正されたコード**:
```typescript
// ✅ 修正されたコード
// 深度制限を設けた型定義
type SafeNested<T, Depth extends number = 5> = Depth extends 0
  ? T
  : T extends Record<string, any>
  ? { [K in keyof T]: SafeNested<T[K], Prev<Depth>> }
  : T;

type Prev<T extends number> = T extends 5 ? 4
  : T extends 4 ? 3
  : T extends 3 ? 2
  : T extends 2 ? 1
  : T extends 1 ? 0
  : never;

// よりシンプルなアプローチ
interface GoodSimpleProps<T extends Record<string, any>> {
  data: T;
  transform?: (value: T) => T;
}
```

**解説**:
複雑な型定義を避け、実用的なレベルで型安全性を確保

**予防策**:
- 過度に複雑な型定義を避ける
- 必要に応じて深度制限を設ける
- シンプルで理解しやすい型設計を心がける

---

### エラー7: Generic type 'Component' requires 1 type argument(s)

**症状**:
```
Generic type 'Component' requires 1 type argument(s) but got 0.
```

**原因**:
Generic Componentの使用時に型パラメータが指定されていない

**問題のあるコード**:
```typescript
// ❌ 問題のあるコード
function BadUsage() {
  return (
    <GenericTable // エラー: 型パラメータが不足
      data={users}
      columns={columns}
    />
  );
}
```

**修正されたコード**:
```typescript
// ✅ 修正されたコード
interface User {
  id: number;
  name: string;
  email: string;
}

function GoodUsage() {
  const users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com' }
  ];
  
  const columns = [
    { key: 'name' as keyof User, title: 'Name' },
    { key: 'email' as keyof User, title: 'Email' }
  ];
  
  return (
    <GenericTable<User>
      data={users}
      columns={columns}
    />
  );
}

// または型推論を活用
function BetterUsage() {
  return (
    <GenericTable
      data={users} // 型推論により User[] と推論される
      columns={columns}
    />
  );
}
```

**解説**:
明示的な型指定または型推論を活用してGeneric Componentを使用

**予防策**:
- 型パラメータを明示的に指定
- 型推論が働くようにpropsを設計
- デフォルト型パラメータの使用を検討

---

## Props型設計の問題

### エラー8: Types of property 'onClick' are incompatible

**症状**:
```
Types of property 'onClick' are incompatible.
  Type '() => void' is not assignable to type 'never'.
```

**原因**:
排他的Props型でnever型の使用が不適切

**問題のあるコード**:
```typescript
// ❌ 問題のあるコード
type BadButtonProps = {
  variant: 'link';
  href: string;
  onClick: () => void; // 問題: linkの場合はonClickは不要
} | {
  variant: 'button';
  onClick: () => void;
  href: string; // 問題: buttonの場合はhrefは不要
};
```

**修正されたコード**:
```typescript
// ✅ 修正されたコード
type GoodButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
} & (
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
    }
);

function GoodButton(props: GoodButtonProps) {
  if (props.variant === 'link') {
    return (
      <a 
        href={props.href} 
        target={props.target}
        className={props.disabled ? 'disabled' : ''}
      >
        {props.children}
      </a>
    );
  }
  
  return (
    <button 
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
```

**解説**:
never型を使用して不要なプロパティを完全に排除

**予防策**:
- 排他的な関係にあるプロパティにはnever型を使用
- Union型で明確に分離
- 型ガードを使用して安全にアクセス

---

### エラー9: Excessive stack depth comparing types

**症状**:
```
Excessive stack depth comparing types 'ComplexProps' and 'ComplexProps'.
```

**原因**:
循環参照や過度に複雑な型定義

**問題のあるコード**:
```typescript
// ❌ 問題のあるコード
interface BadNode {
  id: string;
  children: BadNode[];
  parent: BadNode;
  data: {
    [key: string]: BadNode;
  };
}
```

**修正されたコード**:
```typescript
// ✅ 修正されたコード
interface GoodNode {
  id: string;
  children: GoodNode[];
  parentId?: string; // 直接参照ではなくIDで関連付け
  data: Record<string, any>; // シンプルな型定義
}

// または、より安全なアプローチ
interface SafeNode {
  id: string;
  children?: SafeNode[];
  parentId?: string;
  data?: unknown;
}
```

**解説**:
循環参照を避け、シンプルな型定義を使用

**予防策**:
- 直接的な循環参照を避ける
- IDによる間接参照を使用
- 型定義をシンプルに保つ

---

## Component Composition の問題

### エラー10: Context value is undefined

**症状**:
```
TypeError: Cannot read properties of undefined (reading 'someProperty')
```

**原因**:
Context Providerの外でContextを使用している

**問題のあるコード**:
```typescript
// ❌ 問題のあるコード
const BadContext = React.createContext<{ value: string } | undefined>(undefined);

function BadComponent() {
  const context = React.useContext(BadContext);
  return <div>{context.value}</div>; // エラー: contextがundefinedの可能性
}
```

**修正されたコード**:
```typescript
// ✅ 修正されたコード
interface ContextType {
  value: string;
  setValue: (value: string) => void;
}

const GoodContext = React.createContext<ContextType | null>(null);

function useGoodContext(): ContextType {
  const context = React.useContext(GoodContext);
  if (!context) {
    throw new Error('useGoodContext must be used within a GoodProvider');
  }
  return context;
}

function GoodProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = React.useState('');
  
  const contextValue: ContextType = {
    value,
    setValue,
  };
  
  return (
    <GoodContext.Provider value={contextValue}>
      {children}
    </GoodContext.Provider>
  );
}

function GoodComponent() {
  const { value } = useGoodContext(); // 型安全で確実にcontextが存在
  return <div>{value}</div>;
}
```

**解説**:
カスタムフックでContext使用時の型安全性を確保

**予防策**:
- カスタムフックでContextアクセスを抽象化
- 適切なエラーメッセージを提供
- Provider外での使用を防ぐ仕組みを実装

---

## パフォーマンスの問題

### 問題11: 不要な再レンダリング

**症状**:
コンポーネントが頻繁に再レンダリングされ、パフォーマンスが低下

**原因**:
適切なメモ化が行われていない

**問題のあるコード**:
```typescript
// ❌ 問題のあるコード
function BadParent() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => { // 毎回新しい関数が作成される
    console.log('clicked');
  };
  
  const expensiveData = { // 毎回新しいオブジェクトが作成される
    items: Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }))
  };
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveComponent data={expensiveData} onClick={handleClick} />
    </div>
  );
}
```

**修正されたコード**:
```typescript
// ✅ 修正されたコード
function GoodParent() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  
  const expensiveData = useMemo(() => ({
    items: Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }))
  }), []);
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveComponent data={expensiveData} onClick={handleClick} />
    </div>
  );
}

const ExpensiveComponent = React.memo<{
  data: { items: Array<{ id: number; name: string }> };
  onClick: () => void;
}>(({ data, onClick }) => {
  console.log('ExpensiveComponent rendered');
  
  return (
    <div>
      <button onClick={onClick}>Click me</button>
      <ul>
        {data.items.slice(0, 10).map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
});

ExpensiveComponent.displayName = 'ExpensiveComponent';
```

**解説**:
useCallback、useMemo、React.memoを適切に使用してパフォーマンスを最適化

**予防策**:
- 関数はuseCallbackでメモ化
- 重い計算はuseMemoでメモ化
- コンポーネントはReact.memoでメモ化
- 依存配列を適切に設定

---

## 予防策とベストプラクティス

### 開発時のチェックリスト

**型安全性**:
- [ ] Generic型に適切な制約を設定している
- [ ] never型を使用して排他的Props型を実装している
- [ ] forwardRefの型を明示的に指定している
- [ ] Contextの型安全性を確保している

**パフォーマンス**:
- [ ] 重い計算をuseMemoでメモ化している
- [ ] 関数をuseCallbackでメモ化している
- [ ] コンポーネントをReact.memoでメモ化している
- [ ] ユニークで安定したkeyを使用している

**保守性**:
- [ ] 複雑すぎる型定義を避けている
- [ ] 適切なエラーメッセージを提供している
- [ ] displayNameを設定している
- [ ] 型定義とコンポーネントを分離している

### 推奨ツール

**開発時**:
- TypeScript strict mode の有効化
- ESLint + @typescript-eslint の使用
- React DevTools でのパフォーマンス監視

**型チェック**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noImplicitThis": true
  }
}
```

**ESLint設定**:
```json
// .eslintrc.json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "react/prop-types": "off",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### デバッグのコツ

**型エラーの解決**:
1. エラーメッセージを注意深く読む
2. 型定義を段階的に簡素化する
3. 型アサーションは最後の手段として使用
4. TypeScript Playgroundで型の動作を確認

**パフォーマンス問題の特定**:
1. React DevTools Profilerを使用
2. console.logで再レンダリングを追跡
3. useMemo/useCallbackの依存配列を確認
4. 不要なpropsの変更を特定

**実行時エラーの対処**:
1. エラーバウンダリーの実装
2. 適切なfallback UIの提供
3. 型ガードによる安全なアクセス
4. デフォルト値の設定

---

**📌 重要**: これらの問題と解決方法を理解することで、開発効率が大幅に向上し、より堅牢なコンポーネントを作成できるようになります。エラーが発生した際は、まず型定義を確認し、段階的に問題を切り分けることが重要です。