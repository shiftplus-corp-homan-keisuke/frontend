# STEP03 Session 3: ステート管理の高度なテクニック

> ⏰ **セッション時間**: 90 分
> 🎯 **目標**: 配列・オブジェクトのステート管理、派生ステート、現在の状態に基づく更新手法を習得する
> 📋 **前提**: Session1-2 でのステート基礎とイベント処理の理解

## 📅 セッション構成

| 時間     | 内容                                 | 形式 | 成果物                       |
| -------- | ------------------------------------ | ---- | ---------------------------- |
| 0-20 分  | 派生ステートとパフォーマンス最適化   | 講義 | 概念理解                     |
| 20-50 分 | 配列・オブジェクトのステート管理実践 | 実践 | タスク管理アプリ作成         |
| 50-75 分 | 現在の状態に基づくステート更新       | 実践 | 複雑なカウンター実装         |
| 75-90 分 | まとめ・振り返り                     | 討論 | 学習記録とベストプラクティス |

## 🎯 学習目標の詳細

### 💡 このセッションで身につけること

- [ ] 派生ステートの概念と計算されたプロパティの実装方法を理解する
- [ ] 配列・オブジェクトのステートを不変性を保って更新する方法をマスターする
- [ ] 前の状態に基づくステート更新の正しい手法を習得する
- [ ] パフォーマンス最適化のためのステート設計パターンを理解する

### 📝 成果物

- 派生ステートを使った計算機能付きショッピングカート
- 配列ステートを管理するタスク管理アプリ
- 複雑な状態更新ロジックを持つインタラクティブコンポーネント

## 🔗 セッション ナビゲーション

### 📚 STEP03 全体の学習フロー

**[メイン ページ](STEP03_ステート、イベント、フォーム_基礎とTypeScript統合.md)**に戻る

| 前のセッション                                                                            | 現在のセッション                                 | 次のセッション                                                                                                |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| 📄 [Session 2: イベント処理とフォーム管理](STEP03_Session2_イベント処理とフォーム管理.md) | 📍 **Session 3: ステート管理の高度なテクニック** | 📄 [Session 4: インタラクティブなコンポーネント設計](STEP03_Session4_インタラクティブなコンポーネント設計.md) |

### 🎯 Session 2 からの継続学習ポイント

- Session 2 で学んだ制御されたコンポーネントを基盤に、より複雑なステート操作を学習します
- フォーム管理で習得したイベント処理スキルを、配列・オブジェクトの更新に応用します

### 🎯 Session 4 への準備

このセッションで学ぶ高度なステート管理技術は、Session 4 での再利用可能コンポーネント設計の基礎となります。

---

## 📚 レクチャー 3-1: 派生ステート（Derived State）の理解と実装

### 🔍 派生ステートとは何か

💡 **派生ステートの概念**:
派生ステートとは、既存のステートから計算によって導かれる値のことです。直接ステートとして保存するのではなく、必要な時に計算することで、データの整合性を保ち、メモリ使用量を最適化できます。

#### Level 1: 基本的な派生ステートの実装

```typescript
// 💡 派生ステートの基本実装
import { useState, useMemo } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

function ShoppingCart() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "商品A", price: 1000, quantity: 2 },
    { id: 2, name: "商品B", price: 1500, quantity: 1 },
    { id: 3, name: "商品C", price: 800, quantity: 3 },
  ]);

  // 派生ステート: 合計金額（計算によって求める）
  const totalPrice = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  // 派生ステート: 商品の総数量
  const totalQuantity = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  // 派生ステート: 平均単価
  const averagePrice = totalQuantity > 0 ? totalPrice / totalQuantity : 0;

  return (
    <div>
      <h2>ショッピングカート</h2>

      {products.map((product) => (
        <div key={product.id}>
          <span>
            {product.name}: {product.price}円 × {product.quantity}
          </span>
        </div>
      ))}

      <hr />
      <div>
        <p>商品総数: {totalQuantity}個</p>
        <p>合計金額: {totalPrice.toLocaleString()}円</p>
        <p>平均単価: {Math.round(averagePrice)}円</p>
      </div>
    </div>
  );
}
```

**📝 派生ステートの利点**:

- データの一貫性が保たれる
- メモリ使用量の最適化
- 計算ロジックの集中管理

#### Level 2: useMemo を使ったパフォーマンス最適化

```typescript
// 🚀 useMemo を使った高パフォーマンスな派生ステート
function OptimizedShoppingCart() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "商品A", price: 1000, quantity: 2 },
    { id: 2, name: "商品B", price: 1500, quantity: 1 },
    { id: 3, name: "商品C", price: 800, quantity: 3 },
  ]);

  // 重い計算をメモ化して最適化
  const cartSummary = useMemo(() => {
    console.log("カート集計を計算中..."); // 計算回数を確認するためのログ

    const totalPrice = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    const totalQuantity = products.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    const averagePrice = totalQuantity > 0 ? totalPrice / totalQuantity : 0;

    return {
      totalPrice,
      totalQuantity,
      averagePrice,
      hasItems: products.length > 0,
      isEmpty: products.length === 0,
    };
  }, [products]); // products が変更された時のみ再計算

  const updateQuantity = (id: number, newQuantity: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(0, newQuantity) }
          : product
      )
    );
  };

  return (
    <div>
      <h2>最適化されたショッピングカート</h2>

      {products.map((product) => (
        <div key={product.id} style={{ marginBottom: "10px" }}>
          <span>
            {product.name}: {product.price}円
          </span>
          <input
            type="number"
            value={product.quantity}
            onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
            min="0"
            style={{ marginLeft: "10px", width: "60px" }}
          />
        </div>
      ))}

      <hr />
      <div>
        <p>商品総数: {cartSummary.totalQuantity}個</p>
        <p>合計金額: {cartSummary.totalPrice.toLocaleString()}円</p>
        <p>平均単価: {Math.round(cartSummary.averagePrice)}円</p>
        <p>状態: {cartSummary.isEmpty ? "カートは空です" : "商品があります"}</p>
      </div>
    </div>
  );
}
```

**⚡ パフォーマンスのポイント**:

- useMemo により不要な再計算を防ぐ
- 依存配列により適切なタイミングでのみ再計算
- 複雑な計算ロジックのメモ化

## 📚 レクチャー 3-2: 配列とオブジェクトのステート管理

### 🔍 不変性を保ったステート更新

💡 **重要な原則**:
React のステート更新では、既存のオブジェクトや配列を直接変更（mutation）せず、新しいオブジェクト・配列を作成する必要があります。これを「不変性（immutability）」と呼びます。

#### Level 1: 配列ステートの基本操作

```typescript
// 💡 配列ステートの CRUD 操作
interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");

  // CREATE: 新しいタスクの追加
  const addTask = () => {
    if (newTaskTitle.trim() === "") return;

    const newTask: Task = {
      id: Date.now(), // 簡易的な ID 生成
      title: newTaskTitle.trim(),
      completed: false,
      createdAt: new Date(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setNewTaskTitle("");
  };

  // UPDATE: タスクの完了状態をトグル
  const toggleTask = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // UPDATE: タスクのタイトル編集
  const updateTaskTitle = (id: number, newTitle: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  };

  // DELETE: タスクの削除
  const deleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // 派生ステート: 完了済みタスクの数
  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div>
      <h2>タスク管理アプリ</h2>

      {/* タスク追加フォーム */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="新しいタスクを入力"
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>追加</button>
      </div>

      {/* 進捗表示 */}
      <div style={{ marginBottom: "20px" }}>
        <p>
          進捗: {completedCount} / {totalCount} 完了
        </p>
      </div>

      {/* タスクリスト */}
      <div>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => toggleTask(task.id)}
            onUpdate={(newTitle) => updateTaskTitle(task.id, newTitle)}
            onDelete={() => deleteTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
}

// タスクアイテムコンポーネント
interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onUpdate: (newTitle: string) => void;
  onDelete: () => void;
}

function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleSave = () => {
    onUpdate(editTitle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "4px",
      }}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        style={{ marginRight: "10px" }}
      />

      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            style={{ flex: 1, marginRight: "10px" }}
            autoFocus
          />
          <button onClick={handleSave}>保存</button>
          <button onClick={handleCancel}>キャンセル</button>
        </>
      ) : (
        <>
          <span
            style={{
              flex: 1,
              textDecoration: task.completed ? "line-through" : "none",
              color: task.completed ? "#888" : "#000",
            }}
            onDoubleClick={() => setIsEditing(true)}
          >
            {task.title}
          </span>
          <button onClick={() => setIsEditing(true)}>編集</button>
          <button onClick={onDelete}>削除</button>
        </>
      )}
    </div>
  );
}
```

**📝 配列操作のベストプラクティス**:

- 追加: `[...prevArray, newItem]`
- 更新: `prevArray.map()` を使用
- 削除: `prevArray.filter()` を使用
- 絶対に `push()`, `pop()`, `splice()` などの破壊的メソッドは使わない

#### Level 2: 複雑なオブジェクトステートの管理

```typescript
// 🚀 ネストしたオブジェクトのステート管理
interface UserProfile {
  personal: {
    name: string;
    age: number;
    email: string;
  };
  preferences: {
    theme: "light" | "dark";
    language: "ja" | "en";
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  stats: {
    loginCount: number;
    lastLogin: Date | null;
  };
}

function UserProfileManager() {
  const [profile, setProfile] = useState<UserProfile>({
    personal: {
      name: "",
      age: 0,
      email: "",
    },
    preferences: {
      theme: "light",
      language: "ja",
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
    stats: {
      loginCount: 0,
      lastLogin: null,
    },
  });

  // 個人情報の更新
  const updatePersonalInfo = (
    field: keyof UserProfile["personal"],
    value: string | number
  ) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      personal: {
        ...prevProfile.personal,
        [field]: value,
      },
    }));
  };

  // 設定の更新
  const updatePreference = (
    field: keyof UserProfile["preferences"],
    value: any
  ) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      preferences: {
        ...prevProfile.preferences,
        [field]: value,
      },
    }));
  };

  // 通知設定の更新
  const updateNotificationSetting = (
    type: keyof UserProfile["preferences"]["notifications"],
    enabled: boolean
  ) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      preferences: {
        ...prevProfile.preferences,
        notifications: {
          ...prevProfile.preferences.notifications,
          [type]: enabled,
        },
      },
    }));
  };

  // ログイン処理のシミュレーション
  const simulateLogin = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      stats: {
        ...prevProfile.stats,
        loginCount: prevProfile.stats.loginCount + 1,
        lastLogin: new Date(),
      },
    }));
  };

  return (
    <div>
      <h2>ユーザープロフィール管理</h2>

      {/* 個人情報セクション */}
      <section style={{ marginBottom: "20px" }}>
        <h3>個人情報</h3>
        <div>
          <label>
            名前:
            <input
              type="text"
              value={profile.personal.name}
              onChange={(e) => updatePersonalInfo("name", e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            年齢:
            <input
              type="number"
              value={profile.personal.age}
              onChange={(e) =>
                updatePersonalInfo("age", Number(e.target.value))
              }
            />
          </label>
        </div>
        <div>
          <label>
            メール:
            <input
              type="email"
              value={profile.personal.email}
              onChange={(e) => updatePersonalInfo("email", e.target.value)}
            />
          </label>
        </div>
      </section>

      {/* 設定セクション */}
      <section style={{ marginBottom: "20px" }}>
        <h3>設定</h3>
        <div>
          <label>
            テーマ:
            <select
              value={profile.preferences.theme}
              onChange={(e) => updatePreference("theme", e.target.value)}
            >
              <option value="light">ライト</option>
              <option value="dark">ダーク</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            言語:
            <select
              value={profile.preferences.language}
              onChange={(e) => updatePreference("language", e.target.value)}
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>
      </section>

      {/* 通知設定セクション */}
      <section style={{ marginBottom: "20px" }}>
        <h3>通知設定</h3>
        <div>
          <label>
            <input
              type="checkbox"
              checked={profile.preferences.notifications.email}
              onChange={(e) =>
                updateNotificationSetting("email", e.target.checked)
              }
            />
            メール通知
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={profile.preferences.notifications.push}
              onChange={(e) =>
                updateNotificationSetting("push", e.target.checked)
              }
            />
            プッシュ通知
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={profile.preferences.notifications.sms}
              onChange={(e) =>
                updateNotificationSetting("sms", e.target.checked)
              }
            />
            SMS通知
          </label>
        </div>
      </section>

      {/* 統計セクション */}
      <section style={{ marginBottom: "20px" }}>
        <h3>統計</h3>
        <p>ログイン回数: {profile.stats.loginCount}</p>
        <p>
          最終ログイン:{" "}
          {profile.stats.lastLogin
            ? profile.stats.lastLogin.toLocaleString()
            : "未ログイン"}
        </p>
        <button onClick={simulateLogin}>ログインをシミュレート</button>
      </section>

      {/* デバッグ用: プロフィール全体を表示 */}
      <details>
        <summary>プロフィール詳細（デバッグ用）</summary>
        <pre style={{ fontSize: "12px", overflow: "auto" }}>
          {JSON.stringify(profile, null, 2)}
        </pre>
      </details>
    </div>
  );
}
```

**📝 ネストしたオブジェクトのポイント**:

- スプレッド演算子を階層ごとに適用
- 更新したい階層だけを新しいオブジェクトで作成
- TypeScript の型定義で構造を明確化

## 📚 レクチャー 3-3: 現在の状態に基づくステート更新

### 🔍 関数型ステート更新の重要性

💡 **なぜ関数型更新が必要なのか**:
React のステート更新は非同期であり、連続して更新が発生する場合、期待しない結果になることがあります。前の状態に基づいて更新する場合は、関数型の更新を使用する必要があります。

#### Level 1: 問題のあるステート更新

```typescript
// ⚠️ 問題のあるステート更新の例
function ProblematicCounter() {
  const [count, setCount] = useState(0);

  const handleMultipleIncrements = () => {
    // これは期待通りに動作しない！
    setCount(count + 1); // count が 0 の場合、0 + 1 = 1
    setCount(count + 1); // count はまだ 0 なので、0 + 1 = 1
    setCount(count + 1); // count はまだ 0 なので、0 + 1 = 1
    // 結果: 3 ではなく 1 になる
  };

  return (
    <div>
      <h3>問題のあるカウンター</h3>
      <p>カウント: {count}</p>
      <button onClick={handleMultipleIncrements}>
        3回増加（うまく動かない）
      </button>
    </div>
  );
}
```

#### Level 2: 正しい関数型ステート更新

```typescript
// ✅ 正しい関数型ステート更新の実装
function CorrectCounter() {
  const [count, setCount] = useState(0);

  const handleMultipleIncrements = () => {
    // 関数型の更新を使用して正しく動作させる
    setCount((prevCount) => prevCount + 1); // 前の値に基づいて更新
    setCount((prevCount) => prevCount + 1); // 前の値に基づいて更新
    setCount((prevCount) => prevCount + 1); // 前の値に基づいて更新
    // 結果: 正しく 3 増加する
  };

  const handleComplexUpdate = () => {
    // 複雑な計算も可能
    setCount((prevCount) => {
      const doubled = prevCount * 2;
      const withBonus = doubled + 10;
      return Math.min(withBonus, 100); // 最大値を100に制限
    });
  };

  const handleConditionalUpdate = () => {
    setCount((prevCount) => {
      // 条件に基づく更新
      if (prevCount < 50) {
        return prevCount + 5;
      } else if (prevCount < 80) {
        return prevCount + 2;
      } else {
        return prevCount + 1;
      }
    });
  };

  return (
    <div>
      <h3>正しいカウンター</h3>
      <p>カウント: {count}</p>
      <button onClick={handleMultipleIncrements}>3回増加</button>
      <button onClick={handleComplexUpdate}>複雑な更新</button>
      <button onClick={handleConditionalUpdate}>条件付き更新</button>
      <button onClick={() => setCount(0)}>リセット</button>
    </div>
  );
}
```

#### Level 3: 複雑な状態更新パターンの実装

```typescript
// 🚀 実践的な複雑ステート更新の例
interface BankAccount {
  balance: number;
  transactions: Transaction[];
  isLocked: boolean;
}

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  timestamp: Date;
  description: string;
}

function BankAccountManager() {
  const [account, setAccount] = useState<BankAccount>({
    balance: 1000,
    transactions: [],
    isLocked: false,
  });

  const addTransaction = (
    type: Transaction["type"],
    amount: number,
    description: string
  ) => {
    if (account.isLocked) {
      alert("アカウントがロックされています");
      return;
    }

    setAccount((prevAccount) => {
      const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        type,
        amount,
        timestamp: new Date(),
        description,
      };

      const balanceChange = type === "deposit" ? amount : -amount;
      const newBalance = prevAccount.balance + balanceChange;

      // 残高が負になる場合は取引を拒否
      if (newBalance < 0) {
        alert("残高不足です");
        return prevAccount; // 変更なし
      }

      return {
        ...prevAccount,
        balance: newBalance,
        transactions: [newTransaction, ...prevAccount.transactions], // 最新を先頭に
      };
    });
  };

  const toggleAccountLock = () => {
    setAccount((prevAccount) => ({
      ...prevAccount,
      isLocked: !prevAccount.isLocked,
    }));
  };

  const clearOldTransactions = () => {
    setAccount((prevAccount) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const recentTransactions = prevAccount.transactions.filter(
        (txn) => txn.timestamp > oneWeekAgo
      );

      return {
        ...prevAccount,
        transactions: recentTransactions,
      };
    });
  };

  // 派生ステート: 今月の入金・出金合計
  const monthlyStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthTransactions = account.transactions.filter((txn) => {
      const txnDate = new Date(txn.timestamp);
      return (
        txnDate.getMonth() === currentMonth &&
        txnDate.getFullYear() === currentYear
      );
    });

    const totalDeposits = thisMonthTransactions
      .filter((txn) => txn.type === "deposit")
      .reduce((sum, txn) => sum + txn.amount, 0);

    const totalWithdrawals = thisMonthTransactions
      .filter((txn) => txn.type === "withdrawal")
      .reduce((sum, txn) => sum + txn.amount, 0);

    return {
      totalDeposits,
      totalWithdrawals,
      netChange: totalDeposits - totalWithdrawals,
      transactionCount: thisMonthTransactions.length,
    };
  }, [account.transactions]);

  return (
    <div>
      <h2>銀行口座管理</h2>

      {/* アカウント情報 */}
      <div
        style={{
          padding: "15px",
          border: "2px solid #ddd",
          borderRadius: "8px",
          marginBottom: "20px",
          backgroundColor: account.isLocked ? "#ffe6e6" : "#e6f3ff",
        }}
      >
        <h3>アカウント情報</h3>
        <p>残高: ¥{account.balance.toLocaleString()}</p>
        <p>状態: {account.isLocked ? "🔒 ロック中" : "🔓 利用可能"}</p>
        <button onClick={toggleAccountLock}>
          {account.isLocked ? "ロック解除" : "ロック"}
        </button>
      </div>

      {/* 今月の統計 */}
      <div
        style={{
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>今月の統計</h3>
        <p>入金合計: ¥{monthlyStats.totalDeposits.toLocaleString()}</p>
        <p>出金合計: ¥{monthlyStats.totalWithdrawals.toLocaleString()}</p>
        <p>純変動: ¥{monthlyStats.netChange.toLocaleString()}</p>
        <p>取引回数: {monthlyStats.transactionCount}回</p>
      </div>

      {/* 取引フォーム */}
      <TransactionForm onAddTransaction={addTransaction} />

      {/* 取引履歴 */}
      <div style={{ marginTop: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>取引履歴</h3>
          <button onClick={clearOldTransactions}>
            古い取引を削除（1週間以上前）
          </button>
        </div>

        {account.transactions.length === 0 ? (
          <p>取引履歴がありません</p>
        ) : (
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {account.transactions.map((txn) => (
              <div
                key={txn.id}
                style={{
                  padding: "10px",
                  border: "1px solid #eee",
                  borderRadius: "4px",
                  marginBottom: "5px",
                  backgroundColor:
                    txn.type === "deposit" ? "#e8f5e8" : "#ffe8e8",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{txn.description}</span>
                  <span
                    style={{
                      fontWeight: "bold",
                      color: txn.type === "deposit" ? "green" : "red",
                    }}
                  >
                    {txn.type === "deposit" ? "+" : "-"}¥
                    {txn.amount.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}
                >
                  {txn.timestamp.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 取引フォームコンポーネント
interface TransactionFormProps {
  onAddTransaction: (
    type: "deposit" | "withdrawal",
    amount: number,
    description: string
  ) => void;
}

function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<"deposit" | "withdrawal">("deposit");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("有効な金額を入力してください");
      return;
    }

    if (description.trim() === "") {
      alert("取引の説明を入力してください");
      return;
    }

    onAddTransaction(type, numAmount, description.trim());
    setAmount("");
    setDescription("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h3>新しい取引</h3>

      <div style={{ marginBottom: "10px" }}>
        <label>
          取引種別:
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as "deposit" | "withdrawal")
            }
            style={{ marginLeft: "10px" }}
          >
            <option value="deposit">入金</option>
            <option value="withdrawal">出金</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          金額:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="金額を入力"
            min="1"
            style={{ marginLeft: "10px", width: "150px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          説明:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="取引の説明"
            style={{ marginLeft: "10px", width: "200px" }}
          />
        </label>
      </div>

      <button type="submit">取引を追加</button>
    </form>
  );
}
```

**📝 関数型更新の重要ポイント**:

- 前の状態に基づく更新では必ず関数型を使用
- 複雑な計算やバリデーションも関数内で実行可能
- 条件に基づいて更新を制御できる
- 不変性を保ちながら効率的な更新が可能

### 💻 実践演習

#### 演習 3-1: ショッピングカート実装

**🎯 演習目的**: 派生ステートと配列操作を組み合わせたコンポーネントを作成する

**📋 要件**:

- 商品の追加・削除・数量変更機能
- 合計金額、商品数、平均単価の表示（派生ステート）
- useMemo を使った計算の最適化
- 消費税込み価格の表示

**💡 ヒント**:

- 商品データは `{id, name, price, quantity}` の形式
- 派生ステートは useMemo でメモ化
- 配列操作には map, filter を使用

#### 演習 3-2: 複雑なフォーム状態管理

**🎯 演習目的**: ネストしたオブジェクトのステート管理を実践する

**📋 要件**:

- ユーザー登録フォーム（個人情報、設定、連絡先）
- リアルタイムバリデーション
- 入力内容の保存・復元機能
- 変更検知とダーティ状態の管理

**💡 ヒント**:

- オブジェクトのネストは 2-3 階層
- バリデーション結果も派生ステートとして管理
- useEffect を使った自動保存機能

#### 演習 3-3: ゲームスコア管理システム

**🎯 演習目的**: 関数型ステート更新と複雑なビジネスロジックを実装する

**📋 要件**:

- プレイヤーのスコア管理
- ボーナスポイント計算（連続得点など）
- ランキング表示（派生ステート）
- スコアのリセット・履歴機能

**💡 ヒント**:

- スコア更新は前の状態に基づいて計算
- ボーナス条件は複雑なロジックで実装
- パフォーマンス最適化に useMemo を活用

### 🔍 理解度チェック

以下の質問に答えられるかチェックしてみましょう：

1. **派生ステート**: useMemo を使う場面と使わない場面の判断基準は？
2. **不変性**: なぜ配列・オブジェクトのステートを直接変更してはいけないのか？
3. **関数型更新**: どのような場合に関数型のステート更新が必要か？

## 🗒️ セッションまとめ

### ✅ 今回学んだこと

- **派生ステート**: 既存ステートから計算で導かれる値の管理方法
- **useMemo**: 重い計算のメモ化によるパフォーマンス最適化
- **配列・オブジェクトのステート**: 不変性を保った CRUD 操作
- **関数型ステート更新**: 前の状態に基づく正しい更新方法

### 📝 次回への準備

- コンポーネント間でのステート共有の課題について考える
- ステートリフトアップの概念について予習
- children プロップの使い方を復習

### 🔄 復習推奨項目

- useMemo の依存配列の設定方法
- スプレッド演算子を使った不変性の維持
- 関数型ステート更新のパターン
- 派生ステートの識別方法

---

**次のセッション**: [Session4: インタラクティブなコンポーネント設計](STEP03_Session4_インタラクティブなコンポーネント設計.md) - ステートのリフトアップとコンポーネント間の状態共有について学習します。
