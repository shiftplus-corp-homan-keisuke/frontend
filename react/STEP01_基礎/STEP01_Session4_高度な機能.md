# Session4: 高度な機能（90分）

> 💡 **対象**: Session1-3完了者（React基礎・コンポーネント・ステート管理理解済み）
> 🎯 **形式**: 講師サポート付き高度機能学習
> ⏰ **時間**: 90分

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./STEP01_補足_実践コード例.md)** - リストレンダリングと高度なパターン実装例
- 📖 **[専門用語集](./STEP01_補足_専門用語集.md)** - Key属性、パフォーマンス最適化の詳細解説
- 🚨 **[トラブルシューティング](./STEP01_補足_トラブルシューティング.md)** - リスト関連のよくあるエラーと対処法
- 🌐 **[参考リソース](./STEP01_補足_参考リソース.md)** - React高度パターンのベストプラクティス
- 🔧 **[開発環境ガイド](./STEP01_補足_開発環境ガイド.md)** - パフォーマンス分析ツールの活用

> 💡 **活用方法**: 高度な機能の実装中や、パフォーマンス問題の解決時にご参照ください。

## 📅 セッション概要

**学習目標**:
- [ ] リストレンダリングとKey属性の理解
- [ ] Reactの高度なパターンの習得
- [ ] パフォーマンス最適化の基礎理解
- [ ] 開発者スキルとエディタ設定の最適化

**前提知識**:
- Session1-3の内容（React基礎・コンポーネント・ステート管理）
- TypeScript上級レベルの型システム理解
- JavaScript配列操作とイテレーション

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                       | 講師の役割                 | 学習者の活動   | 成果物           |
| ------------ | -------------------------- | -------------------------- | -------------- | ---------------- |
| **0-10分**   | 前回復習・今回目標         | 復習確認・目標設定         | 振り返り・質問 | 理解確認         |
| **10-40分**  | リストレンダリング・Key    | 実演・パフォーマンス解説   | ハンズオン     | 動的リストコンポーネント |
| **40-70分**  | 高度なReactパターン        | コードレビュー・最適化指導 | 個人開発       | 最適化されたコンポーネント |
| **70-90分**  | 開発環境最適化・総括       | 設定支援・フィードバック   | 環境設定・発表 | 開発環境完成     |

---

## 📚 学習内容

### Section 1: リストのレンダリング（30分）

> 📚 **関連資料**: [実践コード例 - リストレンダリング](./STEP01_補足_実践コード例.md#リストレンダリング) | [専門用語集 - Key属性](./STEP01_補足_専門用語集.md#key属性)

#### 🔍 リストレンダリングの基本

**💡 なぜリストレンダリングが重要なのか**

リストレンダリングは、動的なデータを効率的に表示するReactの核心機能です。TypeScript上級者にとって、型安全なリストレンダリングは以下の利点をもたらします：

**1. 型安全なデータ処理**
- 配列要素の型定義による安全なアクセス
- map、filter、reduceの型推論活用
- ジェネリクスによる再利用可能なリストコンポーネント

**2. パフォーマンス最適化**
- Key属性による効率的な差分更新
- 仮想DOMの最適化
- 不要な再レンダリングの防止

**3. 動的UI の実現**
- データ変更に応じた自動更新
- フィルタリング・ソート機能
- 無限スクロールやページネーション

#### 🎯 基本的なリストレンダリング

```tsx
// 基本的なリストレンダリング
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  isActive: boolean;
}

interface UserListProps {
  users: User[];
  onUserClick?: (user: User) => void;
  onUserDelete?: (userId: number) => void;
}

function UserList({ 
  users, 
  onUserClick, 
  onUserDelete 
}: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="empty-list">
        <p>ユーザーが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      <h3>ユーザー一覧 ({users.length}人)</h3>
      <ul className="user-items">
        {users.map((user) => (
          <li 
            key={user.id} 
            className={`user-item ${user.isActive ? 'active' : 'inactive'}`}
          >
            <div className="user-info" onClick={() => onUserClick?.(user)}>
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <span className={`role role-${user.role}`}>
                {user.role}
              </span>
            </div>
            
            {onUserDelete && (
              <button 
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onUserDelete(user.id);
                }}
              >
                削除
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

#### 🔧 Key属性の重要性

**Key属性とは何か**

Key属性は、Reactが配列内の要素を一意に識別するために使用する特別な属性です。適切なKey属性の設定により、パフォーマンスが大幅に向上します。

```tsx
// ❌ 悪い例：インデックスをKeyとして使用
function BadExample({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li> // インデックスは推奨されない
      ))}
    </ul>
  );
};

// ✅ 良い例：一意のIDをKeyとして使用
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

function GoodExample({ todos }: { todos: TodoItem[] }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
};

// 🔥 最適化された例：複雑なリストアイテム
interface ProductItem {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface ProductListProps {
  products: ProductItem[];
  onAddToCart: (productId: string) => void;
}

function ProductList({ products, onAddToCart }: ProductListProps) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

// 個別のProductCardコンポーネント
interface ProductCardProps {
  product: ProductItem;
  onAddToCart: (productId: string) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = (): void => {
    if (product.inStock) {
      onAddToCart(product.id);
    }
  };

  return (
    <div className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}>
      <h3>{product.name}</h3>
      <p className="price">¥{product.price.toLocaleString()}</p>
      <p className="category">{product.category}</p>
      
      <button 
        onClick={handleAddToCart}
        disabled={!product.inStock}
        className="add-to-cart-btn"
      >
        {product.inStock ? 'カートに追加' : '在庫切れ'}
      </button>
    </div>
  );
};
```

#### 🚀 動的リストの操作

```tsx
// 動的リストの操作例
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'date'>('date');

  // タスクの追加
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): void => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
  };

  // タスクの完了状態切り替え
  const toggleTask = (taskId: string): void => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // タスクの削除
  const deleteTask = (taskId: string): void => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // フィルタリング
  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active': return !task.completed;
      case 'completed': return task.completed;
      default: return true;
    }
  });

  // ソート
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    } else {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  return (
    <div className="task-manager">
      <div className="controls">
        <div className="filter-controls">
          <button 
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'active' : ''}
          >
            すべて ({tasks.length})
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={filter === 'active' ? 'active' : ''}
          >
            未完了 ({tasks.filter(t => !t.completed).length})
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? 'active' : ''}
          >
            完了済み ({tasks.filter(t => t.completed).length})
          </button>
        </div>

        <div className="sort-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'priority' | 'date')}
          >
            <option value="date">作成日順</option>
            <option value="priority">優先度順</option>
          </select>
        </div>
      </div>

      <div className="task-list">
        {sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </div>
  );
};
```

---

### Section 2: Reactの高度なパターン（30分）

> 📚 **関連資料**: [実践コード例 - 高度なパターン](./STEP01_補足_実践コード例.md#高度なパターン)

#### 🎯 コンポーネントコンポジション

**Compound Components パターン**

```tsx
// Compound Components パターンの実装
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

const useTabs = (): TabsContextType => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component');
  }
  return context;
};

// メインのTabsコンポーネント
interface TabsProps {
  defaultTab?: string;
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> & {
  List: typeof TabList;
  Tab: typeof Tab;
  Panels: typeof TabPanels;
  Panel: typeof TabPanel;
} = ({ defaultTab = '', children }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// タブリストコンポーネント
function TabList({ children }: { children: React.ReactNode }) {
  return (
    <div className="tab-list" role="tablist">
      {children}
    </div>
  );
};

// 個別タブコンポーネント
interface TabProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function Tab({ value, children, disabled = false }: TabProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      className={`tab ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      role="tab"
      aria-selected={isActive}
    >
      {children}
    </button>
  );
};

// タブパネルコンテナ
function TabPanels({ children }: { children: React.ReactNode }) {
  return <div className="tab-panels">{children}</div>;
};

// 個別パネルコンポーネント
interface TabPanelProps {
  value: string;
  children: React.ReactNode;
}

function TabPanel({ value, children }: TabPanelProps) {
  const { activeTab } = useTabs();
  
  if (activeTab !== value) {
    return null;
  }

  return (
    <div className="tab-panel" role="tabpanel">
      {children}
    </div>
  );
};

// Compound Componentsの組み立て
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;

// 使用例
const TabExample: React.FC = () => {
  return (
    <Tabs defaultTab="profile">
      <Tabs.List>
        <Tabs.Tab value="profile">プロフィール</Tabs.Tab>
        <Tabs.Tab value="settings">設定</Tabs.Tab>
        <Tabs.Tab value="notifications">通知</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panels>
        <Tabs.Panel value="profile">
          <h3>プロフィール情報</h3>
          <p>ユーザーのプロフィール情報を表示</p>
        </Tabs.Panel>
        
        <Tabs.Panel value="settings">
          <h3>設定</h3>
          <p>アプリケーションの設定</p>
        </Tabs.Panel>
        
        <Tabs.Panel value="notifications">
          <h3>通知設定</h3>
          <p>通知の設定を管理</p>
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
};
```

#### 🔧 Render Props パターン

```tsx
// Render Props パターンの実装
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  children: (position: MousePosition) => React.ReactNode;
}

function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent): void => {
      setPosition({
        x: event.clientX,
        y: event.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <>{children(position)}</>;
};

// 使用例
const MouseExample: React.FC = () => {
  return (
    <div>
      <h2>マウス位置トラッカー</h2>
      <MouseTracker>
        {({ x, y }) => (
          <div>
            <p>マウス位置: ({x}, {y})</p>
            <div 
              style={{
                position: 'absolute',
                left: x - 10,
                top: y - 10,
                width: 20,
                height: 20,
                backgroundColor: 'red',
                borderRadius: '50%',
                pointerEvents: 'none'
              }}
            />
          </div>
        )}
      </MouseTracker>
    </div>
  );
};
```

#### 🚀 カスタムフックパターン

```tsx
// カスタムフックの実装
interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
}

function useLocalStorage<T>(
  key: string, 
  initialValue: T
): UseLocalStorageReturn<T> {
  // 初期値の取得
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 値の設定
  const setStoredValue = (newValue: T): void => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 値の削除
  const removeStoredValue = (): void => {
    try {
      setValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return {
    value,
    setValue: setStoredValue,
    removeValue: removeStoredValue
  };
}

// 使用例
const SettingsComponent: React.FC = () => {
  const { value: theme, setValue: setTheme } = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const { value: language, setValue: setLanguage } = useLocalStorage<string>('language', 'ja');

  return (
    <div className={`settings theme-${theme}`}>
      <h2>設定</h2>
      
      <div>
        <label>テーマ:</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}>
          <option value="light">ライト</option>
          <option value="dark">ダーク</option>
        </select>
      </div>

      <div>
        <label>言語:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );
};
```

---

### Section 3: 開発者スキルとエディタ設定（30分）

> 📚 **関連資料**: [開発環境ガイド - エディタ設定](./STEP01_補足_開発環境ガイド.md#エディタ設定)

#### 🛠️ VS Code設定の最適化

**推奨拡張機能**

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-eslint"
  ]
}
```

**VS Code設定**

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.tsx": "typescriptreact"
  }
}
```

#### 🔧 デバッグ設定

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```

#### 🚀 開発効率化のテクニック

**スニペット設定**

```json
// .vscode/snippets/typescriptreact.json
{
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "import React from 'react';",
      "",
      "interface ${1:ComponentName}Props {",
      "  $2",
      "}",
      "",
      "const ${1:ComponentName}: React.FC<${1:ComponentName}Props> = ({ $3 }) => {",
      "  return (",
      "    <div>",
      "      $4",
      "    </div>",
      "  );",
      "};",
      "",
      "export default ${1:ComponentName};"
    ],
    "description": "Create a React functional component with TypeScript"
  },
  "useState Hook": {
    "prefix": "us",
    "body": [
      "const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState<${2:type}>(${3:initialValue});"
    ],
    "description": "useState hook with TypeScript"
  }
}
```

---

## 🎯 実践演習

### 演習1: 高度なTodoアプリ（30分）

以下の要件を満たす高度なTodoアプリを作成してください：

```tsx
// 要件:
// 1. カテゴリ別のタスク管理
// 2. 優先度設定とソート機能
// 3. 検索・フィルタリング機能
// 4. ドラッグ&ドロップによる並び替え（オプション）
// 5. LocalStorageでの永続化
// 6. 適切なKey属性とパフォーマンス最適化

interface Category {
  id: string;
  name: string;
  color: string;
}

interface AdvancedTodo {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
}

const AdvancedTodoApp: React.FC = () => {
  // ここに実装してください
};
```

### 演習2: データ可視化コンポーネント（15分）

```tsx
// 要件:
// 1. チャートデータの表示
// 2. 複数のチャートタイプ対応
// 3. インタラクティブな機能
// 4. レスポンシブ対応

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ChartProps {
  data: ChartData[];
  type: 'bar' | 'pie' | 'line';
  title?: string;
}

function Chart({ data, type, title }: ChartProps) {
  // ここに実装してください
};
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問と回答

**Q: Key属性にインデックスを使ってはいけないのはなぜですか？**
A: 配列の順序が変わった時に、Reactが要素を正しく識別できず、予期しない動作やパフォーマンス問題が発生する可能性があります。

**Q: カスタムフックはいつ作るべきですか？**
A: 複数のコンポーネントで同じロジックを使用する場合、または複雑な状態管理を分離したい場合に作成します。

**Q: パフォーマンス最適化はいつ行うべきですか？**
A: 実際にパフォーマンス問題が発生してから行うのが基本です。React DevToolsのProfilerを使用して測定してから最適化しましょう。

---

**📌 重要**: Session4では、Reactの高度な機能とパフォーマンス最適化について学習しました。これらの知識は、実際のアプリケーション開発で重要な役割を果たします。

**🌟 次回（Session5）は、これまでの学習内容を統合した実践プロジェクトに挑戦します！**