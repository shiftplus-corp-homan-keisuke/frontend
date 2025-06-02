# Step11 補足トラブルシューティング - TypeScript + 状態管理ライブラリ

> 💡 **このファイルについて**: TypeScript + 状態管理ライブラリでよく遭遇するエラーと解決方法をまとめています。

## 📋 目次
1. [Zustand関連のエラー](#zustand関連のエラー)
2. [Redux Toolkit関連のエラー](#redux-toolkit関連のエラー)
3. [TypeScript型エラー](#typescript型エラー)
4. [パフォーマンス問題](#パフォーマンス問題)
5. [デバッグ手法](#デバッグ手法)

---

## Zustand関連のエラー

### エラー1: ミドルウェアの型エラー

**エラーメッセージ**:
```
Type 'StateCreator<CounterState, [], [], CounterState>' is not assignable to type 'StateCreator<CounterState, [["zustand/devtools", never]], [], CounterState>'
```

**原因**: ミドルウェアの型定義が正しくない

**解決方法**:
```typescript
// ❌ 間違った書き方
const useStore = create<State>(
  devtools((set) => ({
    // ストア定義
  }))
)

// ✅ 正しい書き方
const useStore = create<State>()(
  devtools((set) => ({
    // ストア定義
  }))
)
```

### エラー2: persist ミドルウェアでの型エラー

**エラーメッセージ**:
```
Property 'count' does not exist on type 'unknown'
```

**原因**: persist で復元されたデータの型が不明

**解決方法**:
```typescript
// ✅ 型安全な persist 設定
const useStore = create<State>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: 'storage-key',
      partialize: (state) => ({ count: state.count }), // 保存する部分を明示
    }
  )
)
```

### エラー3: セレクターでの再レンダリング問題

**問題**: 不要な再レンダリングが発生

**解決方法**:
```typescript
// ❌ 毎回新しいオブジェクトを作成
const { count, increment } = useStore((state) => ({
  count: state.count,
  increment: state.increment,
}))

// ✅ shallow 比較を使用
import { shallow } from 'zustand/shallow'

const { count, increment } = useStore(
  (state) => ({ count: state.count, increment: state.increment }),
  shallow
)

// ✅ または個別に取得
const count = useStore((state) => state.count)
const increment = useStore((state) => state.increment)
```

---

## Redux Toolkit関連のエラー

### エラー4: createAsyncThunk の型エラー

**エラーメッセージ**:
```
Argument of type 'string' is not assignable to parameter of type 'User'
```

**原因**: createAsyncThunk の型定義が不正確

**解決方法**:
```typescript
// ❌ 型定義が不正確
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId: string) => {
    // 実装
  }
)

// ✅ 正しい型定義
export const fetchUser = createAsyncThunk<
  User,        // 戻り値の型
  string,      // 引数の型
  {
    rejectValue: string // エラー時の型
  }
>('user/fetchUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await api.getUser(userId)
    return response.data
  } catch (error) {
    return rejectWithValue('Failed to fetch user')
  }
})
```

### エラー5: extraReducers での型エラー

**エラーメッセージ**:
```
Property 'pending' does not exist on type 'AsyncThunk<User, string, {}>'
```

**原因**: createAsyncThunk の型が正しく推論されていない

**解決方法**:
```typescript
// ✅ builder パターンを使用
extraReducers: (builder) => {
  builder
    .addCase(fetchUser.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload
    })
    .addCase(fetchUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || 'Unknown error'
    })
}
```

### エラー6: useSelector の型エラー

**エラーメッセージ**:
```
Property 'user' does not exist on type 'DefaultRootState'
```

**原因**: 型安全な useSelector を使用していない

**解決方法**:
```typescript
// ❌ 通常の useSelector
import { useSelector } from 'react-redux'
const user = useSelector((state) => state.user) // 型エラー

// ✅ 型安全な useSelector
import { useAppSelector } from './store'
const user = useAppSelector((state) => state.user) // 型安全
```

---

## TypeScript型エラー

### エラー7: 状態更新での型エラー

**エラーメッセージ**:
```
Type '{ name: string; }' is not assignable to type 'User'
```

**原因**: 部分的な更新で型が合わない

**解決方法**:
```typescript
// ❌ 部分更新で型エラー
updateUser: (state, action: PayloadAction<User>) => {
  state.user = action.payload // 部分的なデータでエラー
}

// ✅ Partial 型を使用
updateUser: (state, action: PayloadAction<Partial<User>>) => {
  if (state.user) {
    Object.assign(state.user, action.payload)
  }
}

// ✅ または専用の型を定義
interface UpdateUserPayload {
  id: string
  updates: Partial<Omit<User, 'id'>>
}

updateUser: (state, action: PayloadAction<UpdateUserPayload>) => {
  const { id, updates } = action.payload
  const user = state.users.find(u => u.id === id)
  if (user) {
    Object.assign(user, updates)
  }
}
```

### エラー8: セレクターの戻り値型エラー

**エラーメッセージ**:
```
Type 'User | undefined' is not assignable to type 'User'
```

**原因**: セレクターが undefined を返す可能性

**解決方法**:
```typescript
// ❌ undefined の可能性を考慮していない
const selectUserById = (state: RootState, id: string): User => {
  return state.users.byId[id] // undefined の可能性
}

// ✅ undefined を考慮した型
const selectUserById = (state: RootState, id: string): User | undefined => {
  return state.users.byId[id]
}

// ✅ デフォルト値を提供
const selectUserById = (state: RootState, id: string): User => {
  return state.users.byId[id] || defaultUser
}
```

---

## パフォーマンス問題

### 問題9: 不要な再レンダリング

**症状**: コンポーネントが頻繁に再レンダリングされる

**診断方法**:
```typescript
// React DevTools Profiler を使用
// または console.log で確認
const MyComponent = () => {
  console.log('MyComponent rendered')
  const data = useAppSelector(selectSomeData)
  return <div>{data}</div>
}
```

**解決方法**:
```typescript
// ✅ メモ化されたセレクターを使用
import { createSelector } from '@reduxjs/toolkit'

const selectExpensiveData = createSelector(
  [(state: RootState) => state.items, (state: RootState) => state.filter],
  (items, filter) => {
    // 重い計算
    return items.filter(item => item.category === filter)
  }
)

// ✅ React.memo を使用
const MyComponent = React.memo(() => {
  const data = useAppSelector(selectExpensiveData)
  return <div>{data.length}</div>
})
```

### 問題10: 大きな状態オブジェクトの更新

**症状**: 状態更新が遅い

**解決方法**:
```typescript
// ❌ 大きなオブジェクトを毎回コピー
const updateItems = (state, action) => {
  state.items = [...state.items, action.payload] // 大きな配列のコピー
}

// ✅ 正規化された状態を使用
interface NormalizedState {
  byId: Record<string, Item>
  allIds: string[]
}

const addItem = (state, action) => {
  const item = action.payload
  state.items.byId[item.id] = item
  state.items.allIds.push(item.id)
}
```

---

## デバッグ手法

### 手法1: Redux DevTools の活用

```typescript
// ストア設定でDevToolsを有効化
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
})

// アクションに詳細情報を追加
const addTodo = createAction<string, 'todo/add'>('todo/add', (text) => ({
  payload: text,
  meta: {
    timestamp: Date.now(),
    source: 'user-input',
  },
}))
```

### 手法2: ログミドルウェア

```typescript
const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  console.group(action.type)
  console.info('dispatching', action)
  console.log('prev state', store.getState())
  
  const result = next(action)
  
  console.log('next state', store.getState())
  console.groupEnd()
  
  return result
}
```

### 手法3: 型安全なテスト

```typescript
// テスト用のヘルパー
import { configureStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

export const renderWithStore = (
  component: React.ReactElement,
  initialState?: Partial<RootState>
) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  })
  
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  )
}

// 使用例
test('should display user name', () => {
  const { getByText } = renderWithStore(
    <UserProfile />,
    {
      user: {
        currentUser: { id: '1', name: 'John Doe', email: 'john@example.com' },
        loading: false,
        error: null,
      },
    }
  )
  
  expect(getByText('John Doe')).toBeInTheDocument()
})
```

### 手法4: 型エラーの段階的解決

```typescript
// 1. 基本的な型から始める
interface BasicState {
  count: number
}

// 2. 段階的に複雑にする
interface ExtendedState extends BasicState {
  user: User | null
  loading: boolean
}

// 3. 最終的な型を完成させる
interface FullState extends ExtendedState {
  items: NormalizedState<Item>
  filters: FilterState
}
```

**📌 重要**: エラーが発生した場合は、まず型定義を確認し、段階的に問題を特定することが重要です。Redux DevTools や console.log を活用して、状態の変化を追跡しましょう。