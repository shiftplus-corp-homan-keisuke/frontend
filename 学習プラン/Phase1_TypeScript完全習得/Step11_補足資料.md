# Step11 補足資料 - TypeScript + 状態管理ライブラリ

> 💡 **このファイルについて**: Step11の学習を補完する追加情報と実践的なガイドです。

## 📋 目次
1. [環境構築ガイド](#環境構築ガイド)
2. [プロジェクト構成例](#プロジェクト構成例)
3. [ベストプラクティス](#ベストプラクティス)
4. [パフォーマンス最適化](#パフォーマンス最適化)
5. [テスト戦略](#テスト戦略)

---

## 環境構築ガイド

### 基本的なプロジェクトセットアップ

#### 1. React + TypeScript + Zustand プロジェクト

```bash
# プロジェクト作成
npx create-react-app my-zustand-app --template typescript
cd my-zustand-app

# Zustand インストール
npm install zustand

# 開発用依存関係
npm install --save-dev @types/react @types/react-dom
```

#### 2. React + TypeScript + Redux Toolkit プロジェクト

```bash
# プロジェクト作成
npx create-react-app my-redux-app --template redux-typescript
cd my-redux-app

# 追加パッケージ（必要に応じて）
npm install @reduxjs/toolkit react-redux
npm install --save-dev @types/react-redux
```

### 推奨設定ファイル

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/stores/*": ["stores/*"],
      "@/types/*": ["types/*"]
    }
  },
  "include": ["src"]
}
```

#### .eslintrc.js
```javascript
module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    '@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
  },
}
```

---

## プロジェクト構成例

### Zustand プロジェクト構成

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── features/
│   │   ├── counter/
│   │   │   ├── Counter.tsx
│   │   │   └── CounterControls.tsx
│   │   └── todo/
│   │       ├── TodoList.tsx
│   │       ├── TodoItem.tsx
│   │       └── TodoForm.tsx
├── stores/
│   ├── counterStore.ts
│   ├── todoStore.ts
│   └── userStore.ts
├── types/
│   ├── counter.ts
│   ├── todo.ts
│   └── user.ts
├── hooks/
│   ├── useCounter.ts
│   └── useTodos.ts
├── utils/
│   ├── storage.ts
│   └── api.ts
└── App.tsx
```

### Redux Toolkit プロジェクト構成

```
src/
├── components/
│   └── (同上)
├── store/
│   ├── index.ts
│   ├── slices/
│   │   ├── counterSlice.ts
│   │   ├── todoSlice.ts
│   │   └── userSlice.ts
│   └── middleware/
│       ├── logger.ts
│       └── errorHandler.ts
├── types/
│   └── (同上)
├── hooks/
│   ├── redux.ts
│   └── (カスタムフック)
└── App.tsx
```

---

## ベストプラクティス

### 1. 型安全性の確保

#### 厳密な型定義
```typescript
// ❌ 緩い型定義
interface User {
  id: string
  name: string
  data?: any // any は避ける
}

// ✅ 厳密な型定義
interface User {
  id: string
  name: string
  email: string
  profile: {
    avatar?: string
    bio?: string
    preferences: UserPreferences
  }
  createdAt: Date
  updatedAt: Date
}

interface UserPreferences {
  theme: 'light' | 'dark'
  language: 'ja' | 'en'
  notifications: {
    email: boolean
    push: boolean
  }
}
```

#### 型ガードの活用
```typescript
// 型ガード関数
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj
  )
}

// 使用例
const handleUserData = (data: unknown) => {
  if (isUser(data)) {
    // data は User 型として扱える
    console.log(data.name)
  }
}
```

### 2. 状態設計のパターン

#### ドメイン駆動設計
```typescript
// ドメイン別の状態分割
interface AppState {
  // 認証ドメイン
  auth: {
    user: User | null
    isAuthenticated: boolean
    permissions: Permission[]
  }
  
  // ブログドメイン
  blog: {
    posts: NormalizedState<Post>
    categories: Category[]
    currentPost: string | null
  }
  
  // UI状態
  ui: {
    theme: Theme
    sidebar: {
      isOpen: boolean
      activeTab: string
    }
    modals: {
      [key: string]: boolean
    }
  }
}
```

#### 正規化パターン
```typescript
// 正規化されたデータ構造
interface NormalizedState<T> {
  byId: Record<string, T>
  allIds: string[]
}

// ヘルパー関数
const createNormalizedState = <T extends { id: string }>(): NormalizedState<T> => ({
  byId: {},
  allIds: [],
})

const addToNormalized = <T extends { id: string }>(
  state: NormalizedState<T>,
  item: T
): NormalizedState<T> => ({
  byId: { ...state.byId, [item.id]: item },
  allIds: state.allIds.includes(item.id) ? state.allIds : [...state.allIds, item.id],
})
```

### 3. エラーハンドリング

#### 統一されたエラー処理
```typescript
// エラー型の定義
interface AppError {
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp: Date
}

// エラーハンドリングミドルウェア
const errorHandlingMiddleware: Middleware = (store) => (next) => (action) => {
  try {
    return next(action)
  } catch (error) {
    const appError: AppError = {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date(),
    }
    
    // エラーログ送信
    console.error('Redux Error:', appError)
    
    // エラー状態の更新
    store.dispatch(setGlobalError(appError))
    
    throw error
  }
}
```

---

## パフォーマンス最適化

### 1. メモ化の活用

#### React.memo の適切な使用
```typescript
// ✅ 適切なメモ化
const TodoItem = React.memo<{ todo: Todo; onToggle: (id: string) => void }>(
  ({ todo, onToggle }) => {
    const handleToggle = useCallback(() => {
      onToggle(todo.id)
    }, [todo.id, onToggle])

    return (
      <div onClick={handleToggle}>
        {todo.text}
      </div>
    )
  }
)

// カスタム比較関数
const areEqual = (prevProps: Props, nextProps: Props) => {
  return prevProps.todo.id === nextProps.todo.id &&
         prevProps.todo.completed === nextProps.todo.completed
}

const OptimizedTodoItem = React.memo(TodoItem, areEqual)
```

#### セレクターの最適化
```typescript
// ✅ メモ化されたセレクター
const selectTodosByStatus = createSelector(
  [(state: RootState) => state.todos.items, (_: RootState, status: TodoStatus) => status],
  (todos, status) => todos.filter(todo => todo.status === status)
)

// ✅ 複合セレクター
const selectTodoStats = createSelector(
  [selectAllTodos],
  (todos) => ({
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
  })
)
```

### 2. バンドルサイズの最適化

#### 動的インポート
```typescript
// 遅延読み込み
const LazyDashboard = lazy(() => import('./components/Dashboard'))
const LazySettings = lazy(() => import('./components/Settings'))

// ルーティングでの使用
const App = () => (
  <Router>
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<LazyDashboard />} />
        <Route path="/settings" element={<LazySettings />} />
      </Routes>
    </Suspense>
  </Router>
)
```

#### Tree Shaking の活用
```typescript
// ✅ 名前付きインポート
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ❌ デフォルトインポート（Tree Shaking が効かない場合）
import * as RTK from '@reduxjs/toolkit'
```

---

## テスト戦略

### 1. ストアのテスト

#### Zustand ストアのテスト
```typescript
// __tests__/stores/counterStore.test.ts
import { renderHook, act } from '@testing-library/react'
import { useCounterStore } from '../stores/counterStore'

describe('Counter Store', () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 })
  })

  it('should increment count', () => {
    const { result } = renderHook(() => useCounterStore())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })

  it('should reset count', () => {
    const { result } = renderHook(() => useCounterStore())
    
    act(() => {
      result.current.increment()
      result.current.reset()
    })
    
    expect(result.current.count).toBe(0)
  })
})
```

#### Redux Toolkit のテスト
```typescript
// __tests__/slices/todoSlice.test.ts
import todoReducer, { addTodo, toggleTodo } from '../slices/todoSlice'

describe('Todo Slice', () => {
  const initialState = {
    todos: [],
    filter: 'all' as const,
  }

  it('should add todo', () => {
    const action = addTodo('Test todo')
    const state = todoReducer(initialState, action)
    
    expect(state.todos).toHaveLength(1)
    expect(state.todos[0].text).toBe('Test todo')
  })

  it('should toggle todo', () => {
    const stateWithTodo = {
      ...initialState,
      todos: [{ id: '1', text: 'Test', completed: false }],
    }
    
    const action = toggleTodo('1')
    const state = todoReducer(stateWithTodo, action)
    
    expect(state.todos[0].completed).toBe(true)
  })
})
```

### 2. 統合テスト

#### コンポーネントとストアの統合テスト
```typescript
// __tests__/components/TodoApp.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import TodoApp from '../components/TodoApp'
import todoReducer from '../slices/todoSlice'

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: { todos: todoReducer },
    preloadedState: initialState,
  })
}

describe('TodoApp Integration', () => {
  it('should add and display todo', () => {
    const store = createTestStore()
    
    render(
      <Provider store={store}>
        <TodoApp />
      </Provider>
    )
    
    const input = screen.getByPlaceholderText('Add todo...')
    const button = screen.getByText('Add')
    
    fireEvent.change(input, { target: { value: 'New todo' } })
    fireEvent.click(button)
    
    expect(screen.getByText('New todo')).toBeInTheDocument()
  })
})
```

### 3. E2Eテスト

#### Cypress を使用したE2Eテスト
```typescript
// cypress/e2e/todo-app.cy.ts
describe('Todo App E2E', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should manage todos', () => {
    // Todo を追加
    cy.get('[data-testid="todo-input"]').type('Learn TypeScript')
    cy.get('[data-testid="add-button"]').click()
    
    // Todo が表示されることを確認
    cy.get('[data-testid="todo-item"]').should('contain', 'Learn TypeScript')
    
    // Todo を完了
    cy.get('[data-testid="todo-checkbox"]').click()
    cy.get('[data-testid="todo-item"]').should('have.class', 'completed')
    
    // Todo を削除
    cy.get('[data-testid="delete-button"]').click()
    cy.get('[data-testid="todo-item"]').should('not.exist')
  })
})
```

**📌 重要**: これらの補足資料を活用して、実践的で保守性の高いTypeScript + 状態管理アプリケーションを構築しましょう。テストは開発の初期段階から組み込むことで、長期的な品質を保証できます。