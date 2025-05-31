# Step11 補足専門用語集 - TypeScript + 状態管理ライブラリ

> 💡 **このファイルについて**: Step11で出てくる状態管理ライブラリ関連の重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [状態管理基本用語](#状態管理基本用語)
2. [Zustand関連用語](#zustand関連用語)
3. [Redux Toolkit関連用語](#redux-toolkit関連用語)
4. [型安全性関連用語](#型安全性関連用語)
5. [パフォーマンス関連用語](#パフォーマンス関連用語)

---

## 状態管理基本用語

### 状態管理（State Management）
**定義**: アプリケーションの状態を一元的に管理し、コンポーネント間で共有する仕組み

**なぜ重要なのか**: 複雑なアプリケーションでは、複数のコンポーネントが同じ状態を参照・更新する必要があります。状態管理により、データの整合性を保ち、予測可能な状態変更を実現できます。

```typescript
// 状態管理なしの問題例
const ComponentA = () => {
  const [user, setUser] = useState(null) // 重複した状態
}

const ComponentB = () => {
  const [user, setUser] = useState(null) // 同期が困難
}

// 状態管理ありの解決例
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

**実用場面**: ユーザー認証状態、ショッピングカート、テーマ設定、API データキャッシュ

### 単一責任の原則（Single Source of Truth）
**定義**: アプリケーション内の特定の状態に対して、唯一の信頼できるデータソースを持つ原則

```typescript
// ❌ 複数の真実の源
const Header = () => {
  const [user, setUser] = useState(null)
  // ...
}

const Sidebar = () => {
  const [currentUser, setCurrentUser] = useState(null)
  // ...
}

// ✅ 単一の真実の源
const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

### イミュータブル更新（Immutable Updates）
**定義**: 既存の状態を直接変更せず、新しい状態オブジェクトを作成して更新する手法

```typescript
// ❌ ミュータブル更新
const updateUser = (state, newName) => {
  state.user.name = newName // 直接変更（危険）
  return state
}

// ✅ イミュータブル更新
const updateUser = (state, newName) => ({
  ...state,
  user: {
    ...state.user,
    name: newName,
  },
})
```

---

## Zustand関連用語

### Zustand
**定義**: 軽量で型安全な React 状態管理ライブラリ

**特徴**:
- ボイラープレートが少ない
- TypeScript との親和性が高い
- ミドルウェアサポート
- React DevTools 対応

```typescript
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))
```

**実用場面**: 中小規模アプリケーション、プロトタイプ開発、シンプルな状態管理

### Zustand ミドルウェア
**定義**: Zustand ストアの機能を拡張するプラグイン

#### devtools ミドルウェア
```typescript
import { devtools } from 'zustand/middleware'

const useStore = create<State>()(
  devtools(
    (set) => ({
      // ストア定義
    }),
    {
      name: 'my-store', // DevTools での表示名
    }
  )
)
```

#### persist ミドルウェア
```typescript
import { persist } from 'zustand/middleware'

const useStore = create<State>()(
  persist(
    (set) => ({
      // ストア定義
    }),
    {
      name: 'storage-key',
      storage: localStorage, // または sessionStorage
    }
  )
)
```

### Zustand セレクター
**定義**: ストアから特定の状態を効率的に取得する仕組み

```typescript
// 基本的な使用
const count = useCounterStore((state) => state.count)

// 複数の値を取得
const { count, increment } = useCounterStore((state) => ({
  count: state.count,
  increment: state.increment,
}))

// 計算された値
const doubleCount = useCounterStore((state) => state.count * 2)
```

---

## Redux Toolkit関連用語

### Redux Toolkit (RTK)
**定義**: Redux の公式推奨ツールセット。Redux の複雑さを軽減し、ベストプラクティスを強制

**主要機能**:
- `configureStore`: ストア設定の簡素化
- `createSlice`: リデューサーとアクションの統合
- `createAsyncThunk`: 非同期処理の標準化

```typescript
import { configureStore, createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1 // Immer により安全
    },
  },
})

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
})
```

### createSlice
**定義**: リデューサー、アクション、アクションクリエーターを一括で生成する関数

```typescript
const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

// 自動生成されるアクション
export const { setUser, setLoading } = userSlice.actions
```

### createAsyncThunk
**定義**: 非同期処理を含むアクションを作成するための関数

```typescript
export const fetchUser = createAsyncThunk<
  User,        // 成功時の戻り値の型
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

### extraReducers
**定義**: createAsyncThunk で作成した非同期アクションを処理するリデューサー

```typescript
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 同期アクション
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})
```

---

## 型安全性関連用語

### 型安全な状態管理
**定義**: TypeScript の型システムを活用して、状態の型安全性を保証する手法

```typescript
// 型安全なストア定義
interface AppState {
  user: User | null
  posts: Post[]
  loading: boolean
}

// 型安全なアクション
interface SetUserAction {
  type: 'SET_USER'
  payload: User
}

// 型安全なセレクター
const selectUser = (state: RootState): User | null => state.user.data
```

### RootState 型
**定義**: Redux ストア全体の状態を表す型

```typescript
export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 型安全な hooks
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
```

### PayloadAction 型
**定義**: Redux Toolkit でアクションのペイロードに型を付ける型

```typescript
import { PayloadAction } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload // 型安全
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.name = action.payload
      }
    },
  },
})
```

---

## パフォーマンス関連用語

### 状態正規化（State Normalization）
**定義**: ネストした状態を平坦化し、効率的なアクセスを可能にする設計パターン

```typescript
// ❌ 非正規化状態
interface BadState {
  posts: {
    id: string
    title: string
    author: {
      id: string
      name: string
    }
    comments: {
      id: string
      text: string
      author: {
        id: string
        name: string
      }
    }[]
  }[]
}

// ✅ 正規化状態
interface NormalizedState {
  posts: {
    byId: Record<string, Post>
    allIds: string[]
  }
  authors: {
    byId: Record<string, Author>
    allIds: string[]
  }
  comments: {
    byId: Record<string, Comment>
    allIds: string[]
  }
}
```

### メモ化セレクター
**定義**: 計算コストの高いセレクターの結果をキャッシュする最適化手法

```typescript
import { createSelector } from '@reduxjs/toolkit'

// メモ化されたセレクター
const selectPostsWithAuthors = createSelector(
  [(state: RootState) => state.posts.byId, (state: RootState) => state.authors.byId],
  (posts, authors) => {
    return Object.values(posts).map(post => ({
      ...post,
      author: authors[post.authorId],
    }))
  }
)
```

### 浅い比較（Shallow Comparison）
**定義**: オブジェクトの第一階層のみを比較する効率的な比較手法

```typescript
// React.memo での浅い比較
const PostComponent = React.memo(({ post }: { post: Post }) => {
  return <div>{post.title}</div>
})

// useSelector での浅い比較
const { user, loading } = useAppSelector((state) => ({
  user: state.user.data,
  loading: state.user.loading,
}), shallowEqual)
```

### バッチ更新（Batch Updates）
**定義**: 複数の状態更新を一度にまとめて処理する最適化手法

```typescript
// Redux Toolkit では自動的にバッチ処理
dispatch(setLoading(true))
dispatch(setUser(userData))
dispatch(setError(null))
// 上記は一度のレンダリングで処理される
```

---

## 実践的な設計パターン

### ドメイン駆動設計（Domain-Driven Design）
**定義**: ビジネスドメインに基づいて状態を設計するアプローチ

```typescript
// ドメイン別の状態分割
interface AppState {
  auth: AuthState      // 認証ドメイン
  blog: BlogState      // ブログドメイン
  ecommerce: EcommerceState // EC ドメイン
}
```

### CQRS パターン（Command Query Responsibility Segregation）
**定義**: コマンド（更新）とクエリ（読み取り）を分離する設計パターン

```typescript
// コマンド（更新操作）
const commands = {
  createPost: (data: CreatePostData) => dispatch(createPost(data)),
  updatePost: (id: string, data: UpdatePostData) => dispatch(updatePost({ id, data })),
  deletePost: (id: string) => dispatch(deletePost(id)),
}

// クエリ（読み取り操作）
const queries = {
  selectAllPosts: (state: RootState) => state.posts.allIds.map(id => state.posts.byId[id]),
  selectPostById: (state: RootState, id: string) => state.posts.byId[id],
  selectPostsByAuthor: (state: RootState, authorId: string) => 
    state.posts.allIds
      .map(id => state.posts.byId[id])
      .filter(post => post.authorId === authorId),
}
```

**📌 重要**: これらの概念を理解することで、型安全で保守性の高い状態管理システムを構築できるようになります。実際のプロジェクトでは、アプリケーションの規模と複雑さに応じて適切な手法を選択することが重要です。