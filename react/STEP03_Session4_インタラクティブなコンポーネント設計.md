# STEP03 Session 4: インタラクティブなコンポーネント設計

> ⏰ **セッション時間**: 90 分
> 🎯 **目標**: ステートリフトアップ、children プロップ、リスト操作を活用したインタラクティブなコンポーネント設計を習得する
> 📋 **前提**: Session 1-3 でのステート管理、イベント処理、フォーム管理の理解

## 📅 セッション構成

| 時間     | 内容                                | 形式 | 成果物                     |
| -------- | ----------------------------------- | ---- | -------------------------- |
| 0-20 分  | ステートリフトアップとその必要性    | 講義 | 概念理解                   |
| 20-45 分 | children プロップを使った再利用設計 | 実践 | 汎用 Modal コンポーネント  |
| 45-75 分 | リスト操作とキー管理                | 実践 | タスク管理アプリケーション |
| 75-90 分 | まとめ・振り返り                    | 討論 | 学習記録                   |

## 🎯 学習目標の詳細

### 💡 このセッションで身につけること

- [ ] ステートリフトアップの概念と実装方法を理解する
- [ ] children プロップを活用した再利用可能なコンポーネント設計を習得する
- [ ] リスト操作における適切なキー管理を実装できる
- [ ] 複数のコンポーネント間でのステート共有方法を理解する

### 📝 成果物

- ステートリフトアップを実装した親子コンポーネント
- 再利用可能な Modal コンポーネント
- CRUD 操作を含むタスク管理アプリケーション

## 📚 レクチャー 4-1: ステートリフトアップ（State Lifting）

### 🔍 なぜステートリフトアップが必要なのか

💡 **実務での価値**:

- **兄弟コンポーネント間でのデータ共有**: 同階層のコンポーネント間でステートを共有
- **共通の親でのステート管理**: 複数の子コンポーネントが同じデータを使用する場合
- **単一の信頼できるソース**: データの整合性を保つための設計パターン

🎯 **解決する課題**:

- コンポーネント間でのデータの不整合
- 重複したステート管理の排除
- データフローの明確化

#### Level 1: 基本的なステートリフトアップ

```typescript
// ❌ 問題のある設計: 兄弟コンポーネント間でのステート共有ができない
import { useState } from "react";

function ProductCounter() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <h3>商品カウンター</h3>
      <p>数量: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}

function ProductSummary() {
  // ここで ProductCounter の count にアクセスできない
  return (
    <div>
      <h3>合計</h3>
      <p>合計数量: ??? {/* count の値を取得できない */}</p>
    </div>
  );
}

function BadExample() {
  return (
    <div>
      <ProductCounter />
      <ProductSummary />
    </div>
  );
}
```

```typescript
// ✅ 解決策: ステートリフトアップ
interface ProductCounterProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

function ProductCounter({
  count,
  onIncrement,
  onDecrement,
}: ProductCounterProps) {
  return (
    <div>
      <h3>商品カウンター</h3>
      <p>数量: {count}</p>
      <button onClick={onIncrement}>+</button>
      <button onClick={onDecrement}>-</button>
    </div>
  );
}

interface ProductSummaryProps {
  totalCount: number;
  unitPrice: number;
}

function ProductSummary({ totalCount, unitPrice }: ProductSummaryProps) {
  const totalPrice = totalCount * unitPrice;

  return (
    <div>
      <h3>合計</h3>
      <p>合計数量: {totalCount}</p>
      <p>単価: ¥{unitPrice}</p>
      <p>合計金額: ¥{totalPrice}</p>
    </div>
  );
}

function GoodExample() {
  // ステートを共通の親で管理
  const [count, setCount] = useState<number>(0);
  const unitPrice = 1200;

  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => setCount(Math.max(0, count - 1));

  return (
    <div>
      <ProductCounter
        count={count}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />
      <ProductSummary totalCount={count} unitPrice={unitPrice} />
    </div>
  );
}
```

#### Level 2: 複雑なステートリフトアップ

```typescript
// 🚀 複数のコンポーネントでステートを共有する高度な例
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="border p-4 rounded">
      <h4>{item.name}</h4>
      <p>価格: ¥{item.price}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span>数量: {item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
          +
        </button>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="bg-red-500 text-white px-2 py-1 rounded mt-2"
      >
        削除
      </button>
    </div>
  );
}

interface CartSummaryProps {
  items: CartItem[];
}

function CartSummary({ items }: CartSummaryProps) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="border p-4 rounded bg-gray-100">
      <h3>カート合計</h3>
      <p>商品数: {totalQuantity}点</p>
      <p>合計金額: ¥{totalPrice.toLocaleString()}</p>
    </div>
  );
}

function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: "1", name: "コーヒー", price: 500, quantity: 2 },
    { id: "2", name: "サンドイッチ", price: 800, quantity: 1 },
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <h2>ショッピングカート</h2>
      <div className="grid gap-4">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>
      <CartSummary items={cartItems} />
    </div>
  );
}
```

## 📚 レクチャー 4-2: children プロップを使った再利用可能なコンポーネント設計

### 🔍 children プロップの威力

💡 **実務での価値**:

- **コンポーネントの再利用性向上**: 様々なコンテンツに対応できる汎用コンポーネント
- **コンポジション パターン**: 継承ではなく組み合わせによる設計
- **柔軟なレイアウト構築**: 動的なコンテンツ配置

#### Level 1: 基本的な children プロップ

```typescript
// 💡 基本的な children プロップの使用
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div className="border rounded-lg p-4 shadow">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

// 使用例
function CardExample() {
  return (
    <div className="space-y-4">
      <Card title="ユーザー情報">
        <p>名前: 田中太郎</p>
        <p>メール: tanaka@example.com</p>
      </Card>

      <Card title="購入履歴">
        <ul>
          <li>コーヒー - ¥500</li>
          <li>サンドイッチ - ¥800</li>
        </ul>
      </Card>

      <Card title="アクションボタン">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          設定を変更
        </button>
      </Card>
    </div>
  );
}
```

#### Level 2: 高度な children プロップ活用

```typescript
// 🚀 複雑な children プロップの活用例：Modal コンポーネント
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

// Modal の具体的な使用例
function ModalExample() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="p-4">
      <button
        onClick={() => setIsConfirmOpen(true)}
        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
      >
        削除確認
      </button>

      <button
        onClick={() => setIsFormOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        フォームを開く
      </button>

      {/* 削除確認モーダル */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="削除確認"
      >
        <p className="mb-4">本当に削除しますか？この操作は取り消せません。</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsConfirmOpen(false)}
            className="px-4 py-2 border rounded"
          >
            キャンセル
          </button>
          <button
            onClick={() => {
              // 削除処理
              setIsConfirmOpen(false);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            削除
          </button>
        </div>
      </Modal>

      {/* フォームモーダル */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="新規アイテム追加"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block mb-2">名前</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="アイテム名を入力"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">説明</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="説明を入力"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border rounded"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              追加
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
```

#### Level 3: 複合コンポーネントパターン

```typescript
// 🚀 複合コンポーネントパターン：Accordion コンポーネント
interface AccordionContextType {
  openItems: Set<string>;
  toggleItem: (id: string) => void;
}

const AccordionContext = React.createContext<AccordionContextType | null>(null);

interface AccordionProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
}

function Accordion({ children, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className="border rounded">{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

function AccordionItem({ id, title, children }: AccordionItemProps) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionItem must be used within Accordion");

  const { openItems, toggleItem } = context;
  const isOpen = openItems.has(id);

  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => toggleItem(id)}
        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex justify-between items-center"
      >
        <span>{title}</span>
        <span>{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <div className="px-4 py-3 bg-gray-50">{children}</div>}
    </div>
  );
}

// 使用例
function AccordionExample() {
  return (
    <Accordion allowMultiple={true}>
      <AccordionItem id="faq1" title="Reactとは何ですか？">
        <p>
          ReactはFacebook（現Meta）が開発したJavaScriptライブラリで、ユーザーインターフェースの構築に使用されます。
        </p>
      </AccordionItem>

      <AccordionItem id="faq2" title="TypeScriptを使う利点は？">
        <p>
          TypeScriptは静的型付けにより、開発時にエラーを早期発見でき、コードの品質と保守性が向上します。
        </p>
      </AccordionItem>

      <AccordionItem id="faq3" title="Hooksとは何ですか？">
        <p>
          Hooksは関数コンポーネントでステートや副作用を扱うためのReactの機能です。useStateやuseEffectなどがあります。
        </p>
      </AccordionItem>
    </Accordion>
  );
}
```

## 📚 レクチャー 4-3: リスト操作とキー管理

### 🔍 リスト操作における重要なポイント

💡 **実務での価値**:

- **動的なリスト管理**: CRUD 操作を含むリストの効率的な管理
- **パフォーマンス最適化**: 適切なキー管理による再レンダリング最適化
- **ユーザーエクスペリエンス**: スムーズなリスト操作の実現

#### Level 1: 基本的なリスト操作

```typescript
// 💡 基本的なTODOリスト
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState("");

  const addTodo = () => {
    if (inputText.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(), // 実際のプロジェクトではuuidを使用
        text: inputText.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos((prev) => [...prev, newTodo]);
      setInputText("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">TODOリスト</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="新しいタスクを入力"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          追加
        </button>
      </div>

      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id} // 重要: 一意なキーを設定
            className={`flex items-center gap-3 p-3 border rounded ${
              todo.completed ? "bg-gray-100" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span
              className={`flex-1 ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              削除
            </button>
          </div>
        ))}
      </div>

      {todos.length === 0 && (
        <p className="text-gray-500 text-center mt-8">
          タスクがありません。新しいタスクを追加してください。
        </p>
      )}
    </div>
  );
}
```

#### Level 2: 高度なリスト操作とフィルタリング

```typescript
// 🚀 高度なタスク管理アプリケーション
type TaskStatus = "pending" | "in-progress" | "completed";
type TaskPriority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: Date;
}

interface TaskFilters {
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  searchTerm: string;
}

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "プロジェクト企画書作成",
      description: "新規プロジェクトの企画書を作成する",
      status: "pending",
      priority: "high",
      dueDate: "2025-06-15",
      createdAt: new Date("2025-06-01"),
    },
    {
      id: "2",
      title: "コードレビュー",
      description: "チームメンバーのプルリクエストをレビューする",
      status: "in-progress",
      priority: "medium",
      dueDate: "2025-06-10",
      createdAt: new Date("2025-06-05"),
    },
  ]);

  const [filters, setFilters] = useState<TaskFilters>({
    status: "all",
    priority: "all",
    searchTerm: "",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  // フィルタリングされたタスク
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        filters.status === "all" || task.status === filters.status;
      const matchesPriority =
        filters.priority === "all" || task.priority === filters.priority;
      const matchesSearch =
        filters.searchTerm === "" ||
        task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        task.description
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, filters]);

  const addTask = (newTask: Omit<Task, "id" | "createdAt">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, task]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "pending":
        return "text-gray-600 bg-gray-100";
      case "in-progress":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-green-600 bg-green-100";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">タスク管理</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          新しいタスク
        </button>
      </div>

      {/* フィルター */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="タスクを検索..."
          value={filters.searchTerm}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
          }
          className="border rounded px-3 py-2"
        />

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              status: e.target.value as TaskStatus | "all",
            }))
          }
          className="border rounded px-3 py-2"
        >
          <option value="all">すべてのステータス</option>
          <option value="pending">未着手</option>
          <option value="in-progress">進行中</option>
          <option value="completed">完了</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              priority: e.target.value as TaskPriority | "all",
            }))
          }
          className="border rounded px-3 py-2"
        >
          <option value="all">すべての優先度</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>

      {/* タスクリスト */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="border rounded-lg p-4 bg-white shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <div className="flex gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority === "high"
                    ? "高"
                    : task.priority === "medium"
                    ? "中"
                    : "低"}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status === "pending"
                    ? "未着手"
                    : task.status === "in-progress"
                    ? "進行中"
                    : "完了"}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-3">{task.description}</p>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                期限: {task.dueDate}
              </span>

              <div className="flex gap-2">
                <select
                  value={task.status}
                  onChange={(e) =>
                    updateTaskStatus(task.id, e.target.value as TaskStatus)
                  }
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="pending">未着手</option>
                  <option value="in-progress">進行中</option>
                  <option value="completed">完了</option>
                </select>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">条件に一致するタスクがありません。</p>
        </div>
      )}

      {/* タスク追加フォーム（Modal） */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="新しいタスクを追加"
      >
        <TaskForm
          onSubmit={(task) => {
            addTask(task);
            setIsFormOpen(false);
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void;
  onCancel: () => void;
}

function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending" as TaskStatus,
    priority: "medium" as TaskPriority,
    dueDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.dueDate) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">タイトル</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">説明</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">優先度</label>
          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                priority: e.target.value as TaskPriority,
              }))
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">期限</label>
          <input
            type="date"
            required
            value={formData.dueDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          追加
        </button>
      </div>
    </form>
  );
}
```

### 💻 実践演習

#### 演習 4-1: ステートリフトアップの実装

**🎯 演習目的**: 複数のコンポーネント間でステートを共有する方法を習得する

**📋 要件**:

- カウンターコンポーネントと表示コンポーネントを分離
- 親コンポーネントでステートを管理
- 兄弟コンポーネント間でのデータ共有を実現

**💡 ヒント**:

- useState を親コンポーネントで定義
- 更新関数をプロップとして子コンポーネントに渡す
- データも同様にプロップとして渡す

#### 演習 4-2: 再利用可能な Modal コンポーネント

**🎯 演習目的**: children プロップを活用した汎用コンポーネントの設計を習得する

**📋 要件**:

- 異なる内容を表示できる Modal コンポーネント
- オーバーレイクリックで閉じる機能
- ESC キーで閉じる機能（チャレンジ）

**💡 ヒント**:

- React.ReactNode 型を children プロップに使用
- イベントリスナーの追加・削除には useEffect を使用
- アクセシビリティを考慮したフォーカス管理

#### 演習 4-3: 動的なリスト管理

**🎯 演習目的**: CRUD 操作を含むリスト管理を実装する

**📋 要件**:

- アイテムの追加、編集、削除機能
- フィルタリング機能
- ソート機能（チャレンジ）

**💡 ヒント**:

- 配列の map、filter、sort メソッドを活用
- 不変性を保つための適切なステート更新
- パフォーマンス最適化のための useMemo 使用

### 🔍 理解度チェック

以下の質問に答えられるかチェックしてみましょう：

1. **基礎理解**: ステートリフトアップが必要になる具体的なケースを 3 つ挙げられますか？
2. **応用理解**: children プロップを使う利点と注意点を説明できますか？
3. **実践理解**: リスト操作で key 属性が重要な理由を説明できますか？

## 🗒️ セッションまとめ

### ✅ 今回学んだこと

- **ステートリフトアップ**: 兄弟コンポーネント間でのステート共有方法
- **children プロップ**: 再利用可能なコンポーネント設計パターン
- **リスト操作**: 動的なリスト管理とキーの重要性
- **複合コンポーネント**: Context API を使った高度なコンポーネント設計

### 📝 次回への準備

- 実践プロジェクト（チップ計算機）の要件確認
- CSS フレームワーク（TailwindCSS）の基本クラス確認
- コンポーネント設計の理論復習

### 🔄 復習推奨項目

- ステートリフトアップの実装パターン
- children プロップの活用方法
- 効率的なリスト操作とフィルタリング

---

## 🔗 セッション ナビゲーション

### 📚 STEP03 全体の学習フロー

**[メイン ページ](STEP03_ステート、イベント、フォーム_基礎とTypeScript統合.md)**に戻る

| 前のセッション                                                                                    | 現在のセッション                                       | 次のセッション                                                                                                |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| 📄 [Session 3: ステート管理の高度なテクニック](STEP03_Session3_ステート管理の高度なテクニック.md) | 📍 **Session 4: インタラクティブなコンポーネント設計** | 📄 [Session 5: 実践プロジェクト - チップ計算機アプリ](STEP03_Session5_実践プロジェクト_チップ計算機アプリ.md) |

### 🎯 Session 3 からの継続学習ポイント

- Session 3 で学んだ高度なステート管理技術を、コンポーネント間でのデータ共有に応用します
- 派生ステートと useMemo の知識を、再利用可能なコンポーネント設計に活用します

### 🎯 Session 5 への準備

このセッションで学ぶコンポーネント設計パターンは、Session 5 のチップ計算機アプリで統合的に活用されます。

---
