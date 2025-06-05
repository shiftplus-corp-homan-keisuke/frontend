# STEP01 補足資料：実践コード例

> 💡 **このファイルについて**: STEP01で学習するReact × TypeScript の実践的なコード例を段階的に提供します。学習の進度に合わせて参照してください。

---

## 📚 目次

- [Hello World から始める段階的学習](#hello-world-から始める段階的学習)
- [型注釈の練習](#型注釈の練習)
- [コンポーネント設計パターン](#コンポーネント設計パターン)
- [ステート管理実践](#ステート管理実践)
- [イベントハンドリング](#イベントハンドリング)
- [リストレンダリング](#リストレンダリング)
- [高度なパターン](#高度なパターン)
- [プロフィールカード完全版](#プロフィールカード完全版)

---

## Hello World から始める段階的学習

### ステップ1: 最初のコンポーネント

```tsx
// HelloWorld.tsx - 最もシンプルなコンポーネント
import React from 'react';

// 方法1: React.FCを使用（型定義の学習用）
const HelloWorld: React.FC = () => {
  return <h1>Hello, React with TypeScript!</h1>;
};

// 方法2: function宣言を使用（推奨）
function HelloWorldFunction() {
  return <h1>Hello, React with TypeScript!</h1>;
}

export default HelloWorld;
```

### ステップ2: Props を受け取るコンポーネント

```tsx
// Greeting.tsx - Props を使用
import React from 'react';

interface GreetingProps {
  name: string;
  age?: number;
}

function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <h1>こんにちは、{name}さん！</h1>
      {age && <p>年齢: {age}歳</p>}
    </div>
  );
};

export default Greeting;

// 使用例
const App: React.FC = () => {
  return (
    <div>
      <Greeting name="太郎" age={25} />
      <Greeting name="花子" />
    </div>
  );
};
```

### ステップ3: 複数のProps型

```tsx
// UserCard.tsx - より複雑なProps
import React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

interface UserCardProps {
  user: User;
  showEmail?: boolean;
  onEdit?: (userId: number) => void;
}

function UserCard({ 
  user, 
  showEmail = true, 
  onEdit 
}: UserCardProps) {
  return (
    <div className={`user-card ${user.isActive ? 'active' : 'inactive'}`}>
      <h3>{user.name}</h3>
      {showEmail && <p>{user.email}</p>}
      <span className="status">
        {user.isActive ? '🟢 アクティブ' : '⚫ 非アクティブ'}
      </span>
      {onEdit && (
        <button onClick={() => onEdit(user.id)}>
          編集
        </button>
      )}
    </div>
  );
};

export default UserCard;
```

---

## 型注釈の練習

### 基本型の練習

```tsx
// BasicTypes.tsx - 基本的な型注釈の練習
import React, { useState } from 'react';

const BasicTypesExample: React.FC = () => {
  // プリミティブ型
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // 配列型
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  
  // オブジェクト型
  const [user, setUser] = useState<{
    name: string;
    email: string;
    age: number;
  } | null>(null);

  // 関数型
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log('Form submitted');
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setName(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={handleInputChange}
        placeholder="名前を入力"
      />
      <button type="submit">送信</button>
    </form>
  );
};

export default BasicTypesExample;
```

### 高度な型の練習

```tsx
// AdvancedTypes.tsx - 高度な型注釈
import React, { useState } from 'react';

// 型エイリアス
type Status = 'loading' | 'success' | 'error';
type Theme = 'light' | 'dark';

// インターフェース
interface ApiResponse<T> {
  data: T;
  status: Status;
  message?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: {
    theme: Theme;
    notifications: boolean;
  };
}

// ジェネリクスを使用したコンポーネント
interface DataDisplayProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  loading?: boolean;
  error?: string;
}

function DataDisplay<T>({ 
  data, 
  renderItem, 
  loading = false, 
  error 
}: DataDisplayProps<T>): JSX.Element {
  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラー: {error}</div>;
  }

  if (data.length === 0) {
    return <div>データがありません</div>;
  }

  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </div>
  );
}

// 使用例
const AdvancedTypesExample: React.FC = () => {
  const [users] = useState<UserProfile[]>([
    {
      id: '1',
      name: '太郎',
      email: 'taro@example.com',
      preferences: {
        theme: 'light',
        notifications: true
      }
    }
  ]);

  return (
    <DataDisplay
      data={users}
      renderItem={(user) => (
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      )}
    />
  );
};

export default AdvancedTypesExample;
```

---

## コンポーネント設計パターン

### 再利用可能なButtonコンポーネント

```tsx
// Button.tsx - 再利用可能なボタンコンポーネント
import React from 'react';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

function Button({
  variant,
  size,
  disabled = false,
  loading = false,
  onClick,
  children,
  type = 'button'
}: ButtonProps) {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  const className = `${baseClasses} ${variantClasses} ${sizeClasses}`;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (!disabled && !loading) {
      onClick(event);
    }
  };

  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? (
        <span>
          <span className="spinner" />
          読み込み中...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

// 使用例
const ButtonExample: React.FC = () => {
  const handleSave = (): void => {
    console.log('保存処理');
  };

  const handleDelete = (): void => {
    console.log('削除処理');
  };

  return (
    <div>
      <Button variant="primary" size="medium" onClick={handleSave}>
        保存
      </Button>
      <Button variant="danger" size="small" onClick={handleDelete}>
        削除
      </Button>
    </div>
  );
};
```

### 入力コンポーネント

```tsx
// Input.tsx - 再利用可能な入力コンポーネント
import React, { useState } from 'react';

interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false
}: InputProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  const handleFocus = (): void => {
    setIsFocused(true);
  };

  const handleBlur = (): void => {
    setIsFocused(false);
  };

  const inputClasses = [
    'input',
    isFocused && 'input-focused',
    error && 'input-error',
    disabled && 'input-disabled'
  ].filter(Boolean).join(' ');

  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
```

---

## ステート管理実践

### フォーム状態管理

```tsx
// FormExample.tsx - フォーム状態管理の実践
import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  age: number;
  bio: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  age?: string;
  bio?: string;
  agreeToTerms?: string;
}

const FormExample: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    age: 0,
    bio: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 個別フィールドの更新
  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // バリデーション
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '名前は必須です';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (formData.age < 0 || formData.age > 150) {
      newErrors.age = '年齢は0-150の範囲で入力してください';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '利用規約に同意してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信
  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 模擬的な送信処理
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('フォーム送信:', formData);
      alert('送信完了！');
    } catch (error) {
      console.error('送信エラー:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label>名前 *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label>メールアドレス *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>年齢</label>
        <input
          type="number"
          value={formData.age}
          onChange={(e) => updateField('age', Number(e.target.value))}
          className={errors.age ? 'error' : ''}
        />
        {errors.age && <span className="error-message">{errors.age}</span>}
      </div>

      <div className="form-group">
        <label>自己紹介</label>
        <textarea
          value={formData.bio}
          onChange={(e) => updateField('bio', e.target.value)}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => updateField('agreeToTerms', e.target.checked)}
          />
          利用規約に同意する *
        </label>
        {errors.agreeToTerms && (
          <span className="error-message">{errors.agreeToTerms}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '送信中...' : '送信'}
      </button>
    </form>
  );
};

export default FormExample;
```

---

## イベントハンドリング

### 包括的なイベント処理例

```tsx
// EventHandling.tsx - 各種イベントハンドリングの実践
import React, { useState, useRef } from 'react';

const EventHandlingExample: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [keyPressed, setKeyPressed] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // マウスイベント
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    console.log('ボタンがクリックされました', event.currentTarget);
    setMessage(`ボタンがクリックされました: ${new Date().toLocaleTimeString()}`);
  };

  // キーボードイベント
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    setKeyPressed(event.key);
    
    if (event.key === 'Enter') {
      console.log('Enterキーが押されました');
    }
    
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      console.log('Ctrl+S が押されました');
    }
  };

  // フォームイベント
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log('フォームが送信されました');
  };

  // フォーカスイベント
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
    console.log('入力フィールドにフォーカスしました');
    event.target.style.backgroundColor = '#f0f8ff';
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    console.log('入力フィールドからフォーカスが外れました');
    event.target.style.backgroundColor = '';
  };

  // 変更イベント
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    console.log('選択が変更されました:', event.target.value);
  };

  // プログラム的なフォーカス
  const focusInput = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div className="event-handling-example">
      <h2>イベントハンドリングの例</h2>

      {/* マウスイベント */}
      <div
        className="mouse-area"
        onMouseMove={handleMouseMove}
        style={{
          width: '300px',
          height: '200px',
          border: '1px solid #ccc',
          padding: '10px',
          marginBottom: '20px'
        }}
      >
        <p>マウスを動かしてください</p>
        <p>位置: ({position.x}, {position.y})</p>
        <button onClick={handleClick}>クリック</button>
      </div>

      {/* キーボードイベント */}
      <div className="keyboard-section">
        <input
          ref={inputRef}
          type="text"
          placeholder="キーを押してください"
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleInputChange}
        />
        <p>押されたキー: {keyPressed}</p>
        <button onClick={focusInput}>入力フィールドにフォーカス</button>
      </div>

      {/* フォームイベント */}
      <form onSubmit={handleSubmit}>
        <select onChange={handleSelectChange}>
          <option value="">選択してください</option>
          <option value="option1">オプション1</option>
          <option value="option2">オプション2</option>
        </select>
        <button type="submit">送信</button>
      </form>

      {/* メッセージ表示 */}
      <div className="message">
        <p>メッセージ: {message}</p>
      </div>
    </div>
  );
};

export default EventHandlingExample;
```

---

## リストレンダリング

### 動的リスト管理

```tsx
// ListManagement.tsx - 動的リスト管理の実践
import React, { useState } from 'react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

const ListManagementExample: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

  // Todoの追加
  const addTodo = (): void => {
    if (!newTodoText.trim()) return;

    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      text: newTodoText.trim(),
      completed: false,
      priority: 'medium',
      createdAt: new Date()
    };

    setTodos(prev => [...prev, newTodo]);
    setNewTodoText('');
  };

  // Todoの完了状態切り替え
  const toggleTodo = (id: string): void => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  // Todoの削除
  const deleteTodo = (id: string): void => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // 優先度の変更
  const changePriority = (id: string, priority: TodoItem['priority']): void => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, priority }
          : todo
      )
    );
  };

  // フィルタリング
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  // ソート
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    } else {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  // 優先度の色を取得
  const getPriorityColor = (priority: TodoItem['priority']): string => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  };

  return (
    <div className="todo-app">
      <h2>Todo管理アプリ</h2>

      {/* 新しいTodoの追加 */}
      <div className="add-todo">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="新しいTodoを入力..."
        />
        <button onClick={addTodo}>追加</button>
      </div>

      {/* フィルターとソート */}
      <div className="controls">
        <div className="filter-controls">
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'active' : ''}
          >
            すべて ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={filter === 'active' ? 'active' : ''}
          >
            未完了 ({todos.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? 'active' : ''}
          >
            完了済み ({todos.filter(t => t.completed).length})
          </button>
        </div>

        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
          >
            <option value="date">作成日順</option>
            <option value="priority">優先度順</option>
          </select>
        </div>
      </div>

      {/* Todoリスト */}
      <div className="todo-list">
        {sortedTodos.length === 0 ? (
          <p className="empty-message">
            {filter === 'all' ? 'Todoがありません' : `${filter}のTodoがありません`}
          </p>
        ) : (
          sortedTodos.map(todo => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              
              <span className="todo-text">{todo.text}</span>
              
              <select
                value={todo.priority}
                onChange={(e) => changePriority(todo.id, e.target.value as TodoItem['priority'])}
                style={{ color: getPriorityColor(todo.priority) }}
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
              
              <span className="created-date">
                {todo.createdAt.toLocaleDateString()}
              </span>
              
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-btn"
              >
                削除
              </button>
            </div>
          ))
        )}
      </div>

      {/* 統計情報 */}
      <div className="stats">
        <p>
          総数: {todos.length} | 
          完了: {todos.filter(t => t.completed).length} | 
          未完了: {todos.filter(t => !t.completed).length}
        </p>
      </div>
    </div>
  );
};

export default ListManagementExample;
```

---

## プロフィールカード完全版

### 最終的な実装例

```tsx
// ProfileCardComplete.tsx - プロフィールカード完全版
import React, { useState, useEffect } from 'react';

// 型定義
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate: Date;
  isVerified: boolean;
}

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'frontend' | 'backend' | 'design' | 'other';
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  url?: string;
  status: 'completed' | 'in-progress' | 'planned';
}

interface CompleteProfile extends UserProfile {
  skills: Skill[];
  projects: Project[];
}

// カスタムフック
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error('LocalStorage error:', error);
    }
  };

  return [value, setStoredValue] as const;
};

// メインコンポーネント
const ProfileCardComplete: React.FC = () => {
  const [profile, setProfile] = useLocalStorage<CompleteProfile>('userProfile', {
    id: '1',
    name: '山田太郎',
    email: 'yamada@example.com',
    bio: 'フロントエンド開発者として5年の経験があります。',
    location: '東京, 日本',
    website: 'https://yamada.dev',
    joinDate: new Date('2020-01-01'),
    isVerified: true,
    skills: [
      { id: '1', name: 'React', level: 'advanced', category: 'frontend' },
      { id: '2', name: 'TypeScript', level: 'expert', category: 'frontend' },
      { id: '3', name: 'Node.js', level: 'intermediate', category: 'backend' }
    ],
    projects: [
      {
        id: '1',
        title: 'Eコマースサイト',
        description: 'React + TypeScriptで構築したEコマースプラットフォーム',
        technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
        status: 'completed'
      }
    ]