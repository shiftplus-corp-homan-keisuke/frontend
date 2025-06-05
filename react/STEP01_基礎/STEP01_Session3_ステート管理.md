# Session3: ステート管理（90分）

> 💡 **対象**: Session1-2完了者（React基礎・コンポーネント設計理解済み）
> 🎯 **形式**: 講師サポート付き実践学習
> ⏰ **時間**: 90分

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./STEP01_補足_実践コード例.md)** - useState実践パターンとイベントハンドリング
- 📖 **[専門用語集](./STEP01_補足_専門用語集.md)** - ステート管理、イベント処理の詳細解説
- 🚨 **[トラブルシューティング](./STEP01_補足_トラブルシューティング.md)** - ステート関連のよくあるエラー
- 🌐 **[参考リソース](./STEP01_補足_参考リソース.md)** - React Hooksのベストプラクティス
- 🔧 **[開発環境ガイド](./STEP01_補足_開発環境ガイド.md)** - デバッグツールの活用

> 💡 **活用方法**: ステート管理の実装中に疑問が生じた際や、パフォーマンス最適化を検討する場合にご参照ください。

## 📅 セッション概要

**学習目標**:
- [ ] useStateフックの理解と実践
- [ ] イベントハンドリングの型安全な実装
- [ ] 条件付きレンダリングの各種パターン習得
- [ ] ステートとPropsの適切な使い分け

**前提知識**:
- Session1-2の内容（React基礎・コンポーネント設計）
- TypeScript上級レベルの型システム理解
- JavaScript ES6+のイベント処理

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                     | 講師の役割                 | 学習者の活動   | 成果物             |
| ------------ | ------------------------ | -------------------------- | -------------- | ------------------ |
| **0-10分**   | 前回復習・今回目標       | 復習確認・目標設定         | 振り返り・質問 | 理解確認           |
| **10-40分**  | useState基礎と実践       | 実演・個別サポート         | ハンズオン     | ステートフルコンポーネント |
| **40-70分**  | イベント処理と条件分岐   | コードレビュー・デバッグ支援 | 個人開発       | インタラクティブUI |
| **70-90分**  | 成果発表・総括・次回予告 | 評価・フィードバック       | 発表・振り返り | 学習成果           |

---

## 📚 学習内容

### Section 1: ステート入門とuseStateフック（30分）

> 📚 **関連資料**: [実践コード例 - useState基礎](./STEP01_補足_実践コード例.md#usestate基礎) | [専門用語集 - ステート管理](./STEP01_補足_専門用語集.md#ステート管理)

#### 🔍 ステートとは何か

**💡 なぜステートが重要なのか**

ステート（状態）は、時間とともに変化するデータを管理するReactの核心概念です。TypeScript上級者にとって、型安全なステート管理は以下の利点をもたらします：

**1. 予測可能なデータフロー**
- 型定義によるステートの構造明確化
- 状態変更の型安全性保証
- デバッグとテストの容易性

**2. UI の自動更新**
- ステート変更に応じた自動的な再レンダリング
- 宣言的UIによる直感的な開発
- パフォーマンス最適化の基盤

**3. コンポーネント間の状態共有**
- Props経由での状態の受け渡し
- 状態のリフトアップによる共有
- 型安全な状態管理パターン

#### 🎯 useStateの基本的な使用法

```tsx
import React, { useState } from 'react';

// 基本的なuseStateの使用
const Counter: React.FC = () => {
  // 型推論により、countはnumber型、setCountは(value: number) => void型
  const [count, setCount] = useState<number>(0);

  const increment = (): void => {
    setCount(count + 1);
  };

  const decrement = (): void => {
    setCount(count - 1);
  };

  const reset = (): void => {
    setCount(0);
  };

  return (
    <div className="counter">
      <h2>カウンター: {count}</h2>
      <div className="counter-buttons">
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
        <button onClick={reset}>リセット</button>
      </div>
    </div>
  );
};
```

#### 🔧 複雑なステートの管理

```tsx
// オブジェクト型のステート管理
interface UserProfile {
  name: string;
  email: string;
  age: number;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

const UserProfileForm: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    age: 0,
    preferences: {
      theme: 'light',
      notifications: true
    }
  });

  // 個別フィールドの更新（イミュータブルな更新）
  const updateName = (name: string): void => {
    setProfile(prev => ({
      ...prev,
      name
    }));
  };

  const updateEmail = (email: string): void => {
    setProfile(prev => ({
      ...prev,
      email
    }));
  };

  const updateAge = (age: number): void => {
    setProfile(prev => ({
      ...prev,
      age
    }));
  };

  // ネストしたオブジェクトの更新
  const updateTheme = (theme: 'light' | 'dark'): void => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme
      }
    }));
  };

  const toggleNotifications = (): void => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notifications: !prev.preferences.notifications
      }
    }));
  };

  return (
    <form className="profile-form">
      <div>
        <label>名前:</label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => updateName(e.target.value)}
        />
      </div>

      <div>
        <label>メール:</label>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => updateEmail(e.target.value)}
        />
      </div>

      <div>
        <label>年齢:</label>
        <input
          type="number"
          value={profile.age}
          onChange={(e) => updateAge(Number(e.target.value))}
        />
      </div>

      <div>
        <label>テーマ:</label>
        <select
          value={profile.preferences.theme}
          onChange={(e) => updateTheme(e.target.value as 'light' | 'dark')}
        >
          <option value="light">ライト</option>
          <option value="dark">ダーク</option>
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={profile.preferences.notifications}
            onChange={toggleNotifications}
          />
          通知を受け取る
        </label>
      </div>
    </form>
  );
};
```

#### 🚀 ステートの仕組み：set関数の詳細

```tsx
const StateUpdateExample: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  // ❌ 直接的な値の設定（前の値に依存しない場合）
  const handleDirectUpdate = (): void => {
    setCount(10); // 常に10に設定
  };

  // ✅ 関数型更新（前の値に基づく更新）
  const handleFunctionalUpdate = (): void => {
    setCount(prev => prev + 1); // 前の値に基づいて更新
  };

  // ⚠️ 注意：複数回の更新
  const handleMultipleUpdates = (): void => {
    // これは期待通りに動作しない（バッチ処理される）
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // 結果：+1のみ（+3ではない）

    // 正しい方法
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    // 結果：+3
  };

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={handleDirectUpdate}>10に設定</button>
      <button onClick={handleFunctionalUpdate}>+1</button>
      <button onClick={handleMultipleUpdates}>+3</button>
    </div>
  );
};
```

---

### Section 2: イベント処理（30分）

> 📚 **関連資料**: [実践コード例 - イベントハンドリング](./STEP01_補足_実践コード例.md#イベントハンドリング)

#### 🎯 型安全なイベントハンドリング

```tsx
// 各種イベントハンドラーの型定義
interface EventHandlingExampleProps {
  onSubmit?: (data: FormData) => void;
}

interface FormData {
  username: string;
  email: string;
  message: string;
}

function EventHandlingExample({ onSubmit }: EventHandlingExampleProps) {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    message: ''
  });

  // テキスト入力のハンドリング
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // テキストエリアのハンドリング
  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setFormData(prev => ({
      ...prev,
      message: event.target.value
    }));
  };

  // フォーム送信のハンドリング
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ): void => {
    event.preventDefault(); // デフォルトの送信動作を防ぐ
    
    if (onSubmit) {
      onSubmit(formData);
    }
    
    // フォームリセット
    setFormData({
      username: '',
      email: '',
      message: ''
    });
  };

  // ボタンクリックのハンドリング
  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    console.log('ボタンがクリックされました', event.currentTarget);
  };

  // キーボードイベントのハンドリング
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === 'Enter') {
      console.log('Enterキーが押されました');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <div>
        <label htmlFor="username">ユーザー名:</label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div>
        <label htmlFor="email">メール:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="message">メッセージ:</label>
        <textarea
          id="message"
          value={formData.message}
          onChange={handleTextareaChange}
          rows={4}
        />
      </div>

      <div>
        <button type="submit">送信</button>
        <button type="button" onClick={handleButtonClick}>
          キャンセル
        </button>
      </div>
    </form>
  );
};
```

#### 🔧 カスタムイベントハンドラーの作成

```tsx
// 再利用可能なイベントハンドラーフック
const useFormInput = (initialValue: string) => {
  const [value, setValue] = useState<string>(initialValue);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setValue(event.target.value);
  };

  const reset = (): void => {
    setValue(initialValue);
  };

  return {
    value,
    onChange: handleChange,
    reset
  };
};

// 使用例
const LoginForm: React.FC = () => {
  const username = useFormInput('');
  const password = useFormInput('');

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    console.log('ログイン:', username.value, password.value);
    
    // フォームリセット
    username.reset();
    password.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="ユーザー名"
        {...username}
      />
      <input
        type="password"
        placeholder="パスワード"
        {...password}
      />
      <button type="submit">ログイン</button>
    </form>
  );
};
```

---

### Section 3: 条件付きレンダリング（30分）

> 📚 **関連資料**: [実践コード例 - 条件付きレンダリング](./STEP01_補足_実践コード例.md#条件付きレンダリング)

#### 🎯 条件付きレンダリングのパターン

**1. &&演算子を使用した条件付きレンダリング**

```tsx
interface NotificationProps {
  message?: string;
  type?: 'info' | 'warning' | 'error';
  showIcon?: boolean;
}

function Notification({
  message,
  type = 'info',
  showIcon = true
}: NotificationProps) {
  // メッセージがない場合は何も表示しない
  if (!message) {
    return null;
  }

  const getIcon = (type: string): string => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`notification notification-${type}`}>
      {showIcon && <span className="icon">{getIcon(type)}</span>}
      <span className="message">{message}</span>
    </div>
  );
};

// 使用例
const App: React.FC = () => {
  const [notifications, setNotifications] = useState<string[]>([
    'システムが正常に起動しました',
    '新しいメッセージがあります'
  ]);

  return (
    <div>
      {notifications.length > 0 && (
        <div className="notifications">
          <h3>通知 ({notifications.length}件)</h3>
          {notifications.map((notification, index) => (
            <Notification
              key={index}
              message={notification}
              type="info"
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

**2. 三項演算子を使用した条件付きレンダリング**

```tsx
interface UserStatusProps {
  user?: {
    id: number;
    name: string;
    isOnline: boolean;
    lastSeen?: Date;
  };
}

function UserStatus({ user }: UserStatusProps) {
  if (!user) {
    return <div className="user-status">ユーザーが見つかりません</div>;
  }

  const formatLastSeen = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'たった今';
    if (diffInMinutes < 60) return `${diffInMinutes}分前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}時間前`;
    return date.toLocaleDateString();
  };

  return (
    <div className="user-status">
      <div className="user-info">
        <h3>{user.name}</h3>
        <div className={`status ${user.isOnline ? 'online' : 'offline'}`}>
          {user.isOnline ? (
            <span>🟢 オンライン</span>
          ) : (
            <span>
              ⚫ オフライン
              {user.lastSeen && ` (最終ログイン: ${formatLastSeen(user.lastSeen)})`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
```

**3. if文を使用した複数のreturn**

```tsx
interface LoadingState {
  isLoading: boolean;
  error?: string;
  data?: any[];
}

interface DataDisplayProps {
  loadingState: LoadingState;
}

function DataDisplay({ loadingState }: DataDisplayProps) {
  const { isLoading, error, data } = loadingState;

  // ローディング中
  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>データを読み込み中...</p>
      </div>
    );
  }

  // エラー発生時
  if (error) {
    return (
      <div className="error">
        <h3>エラーが発生しました</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          再読み込み
        </button>
      </div>
    );
  }

  // データが空の場合
  if (!data || data.length === 0) {
    return (
      <div className="empty">
        <p>表示するデータがありません</p>
      </div>
    );
  }

  // 正常なデータ表示
  return (
    <div className="data-display">
      <h3>データ一覧 ({data.length}件)</h3>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
};
```

**4. nullによる条件付きレンダリング（レンダリングなし）**

```tsx
interface ConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: React.ReactNode) => JSX.Element;
  children: React.ReactNode;
}

function ConditionalWrapper({
  condition,
  wrapper,
  children
}: ConditionalWrapperProps) {
  return condition ? wrapper(children) : <>{children}</>;
};

// 使用例
const PermissionBasedComponent: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  return (
    <div>
      <ConditionalWrapper
        condition={hasPermission}
        wrapper={(children) => <div className="protected-content">{children}</div>}
      >
        <h2>保護されたコンテンツ</h2>
        <p>このコンテンツは権限が必要です</p>
        
        {isAdmin && (
          <div className="admin-panel">
            <h3>管理者パネル</h3>
            <button>ユーザー管理</button>
            <button>システム設定</button>
          </div>
        )}
      </ConditionalWrapper>

      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={hasPermission}
            onChange={(e) => setHasPermission(e.target.checked)}
          />
          権限を付与
        </label>
        <label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          管理者権限
        </label>
      </div>
    </div>
  );
};
```

---

## 🎯 実践演習

### 演習1: Todoアプリの基本機能（25分）

以下の要件を満たすTodoアプリを作成してください：

```tsx
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoAppProps {
  // 必要に応じてPropsを定義
}

function TodoApp(: TodoAppProps) {
  // ここに実装してください
  
  // 要件:
  // 1. Todoの追加機能
  // 2. Todoの完了/未完了切り替え
  // 3. Todoの削除機能
  // 4. 完了済みTodoの表示/非表示切り替え
  // 5. 適切な型定義とエラーハンドリング

  return (
    <div className="todo-app">
      {/* ここにUIを実装 */}
    </div>
  );
};
```

### 演習2: フォームバリデーション（15分）

```tsx
// 要件:
// 1. ユーザー登録フォーム（名前、メール、パスワード）
// 2. リアルタイムバリデーション
// 3. エラーメッセージの表示
// 4. 送信ボタンの有効/無効制御

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
}

const RegistrationForm: React.FC = () => {
  // ここに実装してください
};
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問と回答

**Q: ステートの更新が反映されないのはなぜですか？**
A: Reactのステート更新は非同期です。また、オブジェクトや配列を直接変更せず、新しいオブジェクト/配列を作成する必要があります。

**Q: イベントハンドラーでthisが使えないのはなぜですか？**
A: 関数コンポーネントではthisは使用しません。useStateやuseCallbackを使用してステートや関数を管理します。

**Q: 条件付きレンダリングでパフォーマンスの問題はありますか？**
A: 基本的には問題ありませんが、複雑な条件や大量のデータの場合は、React.memoやuseMemoを検討しましょう。

---

**📌 重要**: Session3ではReactの動的な機能を学習しました。ステート管理とイベント処理は、インタラクティブなUIを作成する基盤となります。

**🌟 次回（Session4）は、リストレンダリングとより高度なReactパターンについて学習します！**