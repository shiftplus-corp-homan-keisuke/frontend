# STEP01 補足資料：専門用語集

> 💡 **このファイルについて**: STEP01で学習するReact × TypeScript の重要な概念と用語を詳細に解説します。学習中に疑問が生じた際の参考資料としてご活用ください。

---

## 📚 目次

- [React基礎概念](#react基礎概念)
- [TypeScript関連用語](#typescript関連用語)
- [コンポーネント設計](#コンポーネント設計)
- [ステート管理](#ステート管理)
- [イベント処理](#イベント処理)
- [パフォーマンス最適化](#パフォーマンス最適化)
- [開発ツール](#開発ツール)

---

## React基礎概念

### 仮想DOM (Virtual DOM)

**定義**: ReactがUIの状態を効率的に管理するために使用する、実際のDOMの軽量なJavaScript表現。

**なぜ重要なのか**:
- 実際のDOM操作は重い処理だが、仮想DOMは軽量
- 差分計算（Diffing）により、必要最小限の更新のみを実行
- 宣言的なUIプログラミングを可能にする

**実例**:
```tsx
// 仮想DOMの概念
const virtualElement = {
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: { children: 'Hello React!' }
      }
    ]
  }
};

// 実際のJSX（仮想DOMを生成）
const element = (
  <div className="container">
    <h1>Hello React!</h1>
  </div>
);
```

### JSX (JavaScript XML)

**定義**: JavaScriptの中でHTMLライクな記法を使用できる構文拡張。

**TypeScriptとの統合**:
```tsx
// JSX.Element型
const element: JSX.Element = <h1>Hello</h1>;

// React.ReactNode型（より広範囲）
const content: React.ReactNode = "Hello World";

// 型安全なJSX
interface Props {
  title: string;
  count: number;
}

function Component({ title, count }: Props) (
  <div>
    <h1>{title}</h1>
    <p>Count: {count}</p>
  </div>
);
```

### コンポーネント (Component)

**定義**: UIの独立した再利用可能な部品。Reactアプリケーションの基本構成要素。

**種類**:
- **関数コンポーネント**: 現代的な推奨方式
- **クラスコンポーネント**: レガシーな方式（現在は非推奨）

**TypeScriptでの定義**:
```tsx
// 関数コンポーネント（推奨）
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, onClick, disabled = false }: ButtonProps) (
  <button onClick={onClick} disabled={disabled}>
    {label}
  </button>
);

// 関数宣言形式
function Button({ label, onClick, disabled = false }: ButtonProps): JSX.Element {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

---

## TypeScript関連用語

### 型注釈 (Type Annotation)

**定義**: 変数、関数、オブジェクトの型を明示的に指定すること。

**React での活用**:
```tsx
// Props型注釈
interface UserCardProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
  onEdit: (userId: number) => void;
}

// State型注釈
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// イベントハンドラー型注釈
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  console.log('Clicked!');
};
```

### 型推論 (Type Inference)

**定義**: TypeScriptが文脈から自動的に型を推測する機能。

**React での例**:
```tsx
// 型推論の例
const [name, setName] = useState(""); // string型として推論
const [count, setCount] = useState(0); // number型として推論

// 明示的な型注釈が必要な場合
const [user, setUser] = useState<User | null>(null);

// 関数の戻り値型推論
const createUser = (name: string, age: number) => ({ // 戻り値型が推論される
  id: Math.random(),
  name,
  age,
  createdAt: new Date()
});
```

### インターフェース (Interface)

**定義**: オブジェクトの構造を定義する型定義方式。

**React での活用**:
```tsx
// 基本的なインターフェース
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // オプショナルプロパティ
}

// 継承を使用したインターフェース
interface AdminUser extends User {
  permissions: string[];
  lastLogin: Date;
}

// 関数型プロパティを含むインターフェース
interface ComponentProps {
  title: string;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
  children?: React.ReactNode;
}
```

### ジェネリクス (Generics)

**定義**: 型を引数として受け取る、再利用可能な型定義。

**React での活用**:
```tsx
// ジェネリックコンポーネント
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// 使用例
const users: User[] = [/* ... */];
<List
  items={users}
  keyExtractor={user => user.id}
  renderItem={user => <span>{user.name}</span>}
/>
```

---

## コンポーネント設計

### Props

**定義**: 親コンポーネントから子コンポーネントに渡されるデータ。

**TypeScript での型安全なProps**:
```tsx
// 基本的なProps
interface GreetingProps {
  name: string;
  age?: number;
  isVip?: boolean;
}

// 関数型Props
interface FormProps {
  onSubmit: (data: FormData) => void;
  onValidate?: (field: string, value: string) => string | null;
}

// Children Props
interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

// 複雑なProps
interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    title: string;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
  }>;
  onRowClick?: (item: T) => void;
}
```

### コンポーネント再利用性

**定義**: 同じコンポーネントを異なる場所や用途で使用できる設計。

**設計原則**:
```tsx
// ❌ 再利用性の低い設計
const UserProfileCard: React.FC = () => {
  const user = useContext(UserContext); // 特定のコンテキストに依存
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

// ✅ 再利用性の高い設計
interface ProfileCardProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  showAvatar?: boolean;
  onEdit?: () => void;
}

function ProfileCard({ 
  user, 
  showAvatar = true, 
  onEdit 
}: ProfileCardProps) (
  <div className="profile-card">
    {showAvatar && user.avatar && (
      <img src={user.avatar} alt={`${user.name}のアバター`} />
    )}
    <h2>{user.name}</h2>
    <p>{user.email}</p>
    {onEdit && <button onClick={onEdit}>編集</button>}
  </div>
);
```

### Compound Components

**定義**: 複数の関連するコンポーネントを組み合わせて使用する設計パターン。

**実装例**:
```tsx
// Compound Components パターン
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

const Tabs: React.FC<{ children: React.ReactNode }> & {
  List: typeof TabList;
  Tab: typeof Tab;
  Panel: typeof TabPanel;
} = ({ children }) => {
  const [activeTab, setActiveTab] = useState('');
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

function TabList({ children }: { children: React.ReactNode }) (
  <div role="tablist">{children}</div>
);

function Tab({ value, children }: { value: string; children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useContext(TabsContext)!;
  return (
    <button
      role="tab"
      aria-selected={activeTab === value}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

// 使用例
<Tabs>
  <Tabs.List>
    <Tabs.Tab value="profile">プロフィール</Tabs.Tab>
    <Tabs.Tab value="settings">設定</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="profile">プロフィール内容</Tabs.Panel>
  <Tabs.Panel value="settings">設定内容</Tabs.Panel>
</Tabs>
```

---

## ステート管理

### useState

**定義**: 関数コンポーネントでローカル状態を管理するReact Hook。

**TypeScript での使用**:
```tsx
// 基本的な使用
const [count, setCount] = useState<number>(0);
const [name, setName] = useState<string>('');
const [isLoading, setIsLoading] = useState<boolean>(false);

// オブジェクト状態の管理
interface User {
  id: number;
  name: string;
  email: string;
}

const [user, setUser] = useState<User | null>(null);

// 配列状態の管理
const [items, setItems] = useState<string[]>([]);

// 複雑な状態の更新
const [profile, setProfile] = useState<UserProfile>({
  name: '',
  email: '',
  preferences: {
    theme: 'light',
    notifications: true
  }
});

// イミュータブルな更新
const updateProfile = (field: keyof UserProfile, value: any) => {
  setProfile(prev => ({
    ...prev,
    [field]: value
  }));
};

// ネストしたオブジェクトの更新
const updatePreferences = (key: string, value: any) => {
  setProfile(prev => ({
    ...prev,
    preferences: {
      ...prev.preferences,
      [key]: value
    }
  }));
};
```

### 状態のリフトアップ (Lifting State Up)

**定義**: 複数の子コンポーネントで共有する状態を、共通の親コンポーネントに移動すること。

**実装例**:
```tsx
// ❌ 状態が分散している例
const ComponentA: React.FC = () => {
  const [sharedData, setSharedData] = useState('');
  // ComponentAでのみ使用
};

const ComponentB: React.FC = () => {
  const [sharedData, setSharedData] = useState(''); // 重複
  // ComponentBでのみ使用
};

// ✅ 状態をリフトアップした例
interface SharedState {
  data: string;
  setData: (data: string) => void;
}

const ParentComponent: React.FC = () => {
  const [sharedData, setSharedData] = useState<string>('');
  
  return (
    <div>
      <ComponentA data={sharedData} setData={setSharedData} />
      <ComponentB data={sharedData} setData={setSharedData} />
    </div>
  );
};

function ComponentA({ data, setData }: SharedState) {
  // 共有状態を使用
};

function ComponentB({ data, setData }: SharedState) {
  // 共有状態を使用
};
```

---

## イベント処理

### イベントハンドラー

**定義**: ユーザーの操作（クリック、入力など）に応答する関数。

**TypeScript での型安全なイベントハンドリング**:
```tsx
// 各種イベントハンドラーの型定義
interface EventHandlers {
  // マウスイベント
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDoubleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  
  // キーボードイベント
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  
  // フォームイベント
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  
  // フォーカスイベント
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
}

// 実装例
const FormComponent: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      console.log('Enter pressed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <button type="submit">送信</button>
    </form>
  );
};
```

---

## パフォーマンス最適化

### Key属性

**定義**: Reactがリスト内の要素を一意に識別するための属性。

**重要性と使用法**:
```tsx
// ❌ 悪い例：インデックスをKeyとして使用
function BadList({ items }: { items: string[] }) (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li> // 順序が変わると問題が発生
    ))}
  </ul>
);

// ✅ 良い例：一意のIDをKeyとして使用
interface Item {
  id: string;
  name: string;
}

function GoodList({ items }: { items: Item[] }) (
  <ul>
    {items.map(item => (
      <li key={item.id}>{item.name}</li> // 安定したKey
    ))}
  </ul>
);

// 🔥 最適化された例：複雑なリストアイテム
function OptimizedList({ items }: { items: Item[] }) (
  <ul>
    {items.map(item => (
      <OptimizedListItem key={item.id} item={item} />
    ))}
  </ul>
);

const OptimizedListItem = React.memo<{ item: Item }>(({ item }) => (
  <li>{item.name}</li>
));
```

### React.memo

**定義**: コンポーネントの不要な再レンダリングを防ぐ高階コンポーネント。

**使用法**:
```tsx
// 基本的な使用
const ExpensiveComponent = React.memo<{ data: ComplexData }>(({ data }) => {
  // 重い処理
  const processedData = expensiveCalculation(data);
  
  return <div>{processedData}</div>;
});

// カスタム比較関数
const CustomMemoComponent = React.memo<{ user: User; settings: Settings }>(
  ({ user, settings }) => (
    <div>
      <h1>{user.name}</h1>
      <p>{settings.theme}</p>
    </div>
  ),
  (prevProps, nextProps) => {
    // カスタム比較ロジック
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.settings.theme === nextProps.settings.theme
    );
  }
);
```

---

## 開発ツール

### React Developer Tools

**定義**: Reactアプリケーションのデバッグとプロファイリングを行うブラウザ拡張機能。

**主な機能**:
- コンポーネントツリーの表示
- Props・Stateの確認
- パフォーマンスプロファイリング
- Hooksの状態確認

### TypeScript Language Server

**定義**: TypeScriptの型チェック、自動補完、リファクタリングを提供するサービス。

**VS Code での活用**:
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

---

**📌 重要**: この専門用語集は学習の参考資料です。実際の開発では、公式ドキュメントと合わせて活用してください。

**🔗 関連資料**: 
- [実践コード例](./STEP01_補足_実践コード例.md)
- [トラブルシューティング](./STEP01_補足_トラブルシューティング.md)
- [参考リソース](./STEP01_補足_参考リソース.md)