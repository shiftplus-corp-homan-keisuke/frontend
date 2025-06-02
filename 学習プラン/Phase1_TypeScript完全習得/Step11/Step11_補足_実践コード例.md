# Step11 実践コード例 - TypeScript + 状態管理ライブラリ

> 💡 **このファイルについて**: TypeScript + Zustand状態管理ライブラリの段階的な学習のためのコード例集です。

## 📋 目次

1. [Zustand基本実装](#zustand基本実装)
2. [複雑な状態管理パターン](#複雑な状態管理パターン)
3. [パフォーマンス最適化](#パフォーマンス最適化)
4. [テスト実装](#テスト実装)
5. [実践的なアプリケーション例](#実践的なアプリケーション例)

---

## Zustand基本実装

### ステップ 1: 基本的なカウンターストア

```typescript
// stores/counterStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// 状態の型定義
interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  setCount: (count: number) => void
}

// 基本的なZustandストア
export const useCounterStore = create<CounterState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初期状態
        count: 0,
        
        // アクション関数
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
        reset: () => set({ count: 0 }),
        setCount: (count: number) => set({ count }),
      }),
      {
        name: 'counter-storage', // ローカルストレージのキー
      }
    ),
    {
      name: 'counter-store', // DevToolsでの表示名
    }
  )
)

// TypeScriptアプリケーションでの使用例
class CounterApp {
  private unsubscribe: () => void

  constructor() {
    // ストアの変更を監視
    this.unsubscribe = useCounterStore.subscribe((state) => {
      this.updateDisplay(state.count)
    })
    
    // 初期表示
    this.updateDisplay(useCounterStore.getState().count)
  }

  // 表示を更新
  private updateDisplay(count: number): void {
    console.log(`現在のカウンター: ${count}`)
  }

  // アクションの実行
  public increment(): void {
    useCounterStore.getState().increment()
  }

  public decrement(): void {
    useCounterStore.getState().decrement()
  }

  public reset(): void {
    useCounterStore.getState().reset()
  }

  // クリーンアップ
  public destroy(): void {
    this.unsubscribe()
  }
}

// 使用例
const app = new CounterApp()
app.increment() // 現在のカウンター: 1
app.increment() // 現在のカウンター: 2
app.reset()     // 現在のカウンター: 0
app.destroy()   // 監視を停止
```

### ステップ 2: Todoアプリケーション

```typescript
// types/todo.ts
export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export type TodoFilter = 'all' | 'active' | 'completed'

// stores/todoStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Todo, TodoFilter } from '../types/todo'

interface TodoState {
  todos: Todo[]
  filter: TodoFilter
  
  // アクション
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  editTodo: (id: string, text: string) => void
  setFilter: (filter: TodoFilter) => void
  clearCompleted: () => void
  
  // セレクター
  getFilteredTodos: () => Todo[]
  getTodoStats: () => { total: number; active: number; completed: number }
}

export const useTodoStore = create<TodoState>()(
  devtools(
    persist(
      (set, get) => ({
        todos: [],
        filter: 'all',

        addTodo: (text: string) => {
          const newTodo: Todo = {
            id: Date.now().toString(),
            text: text.trim(),
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          set((state) => ({
            todos: [...state.todos, newTodo],
          }))
        },

        toggleTodo: (id: string) => {
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id
                ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
                : todo
            ),
          }))
        },

        deleteTodo: (id: string) => {
          set((state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
          }))
        },

        editTodo: (id: string, text: string) => {
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id
                ? { ...todo, text: text.trim(), updatedAt: new Date() }
                : todo
            ),
          }))
        },

        setFilter: (filter: TodoFilter) => {
          set({ filter })
        },

        clearCompleted: () => {
          set((state) => ({
            todos: state.todos.filter((todo) => !todo.completed),
          }))
        },

        // セレクター関数
        getFilteredTodos: () => {
          const { todos, filter } = get()
          switch (filter) {
            case 'active':
              return todos.filter((todo) => !todo.completed)
            case 'completed':
              return todos.filter((todo) => todo.completed)
            default:
              return todos
          }
        },

        getTodoStats: () => {
          const { todos } = get()
          return {
            total: todos.length,
            active: todos.filter((todo) => !todo.completed).length,
            completed: todos.filter((todo) => todo.completed).length,
          }
        },
      }),
      {
        name: 'todo-storage',
        partialize: (state) => ({ todos: state.todos }), // todosのみ永続化
      }
    ),
    {
      name: 'todo-store',
    }
  )
)

// TypeScriptアプリケーションでの使用例
class TodoApp {
  private unsubscribe: () => void
  private currentInputText: string = ''

  constructor() {
    // ストアの変更を監視
    this.unsubscribe = useTodoStore.subscribe((state) => {
      this.displayTodos()
    })
    
    // 初期表示
    this.displayTodos()
  }

  // Todoリストの表示
  private displayTodos(): void {
    const store = useTodoStore.getState()
    const filteredTodos = store.getFilteredTodos()
    const stats = store.getTodoStats()

    console.log('\n=== Todo アプリ ===')
    console.log(`統計: 全体: ${stats.total} | 未完了: ${stats.active} | 完了: ${stats.completed}`)
    console.log(`現在のフィルター: ${store.filter}`)
    console.log('\n--- Todoリスト ---')
    
    if (filteredTodos.length === 0) {
      console.log('Todoはありません')
    } else {
      filteredTodos.forEach((todo, index) => {
        const status = todo.completed ? '✓' : '○'
        const text = todo.completed ? `[完了] ${todo.text}` : todo.text
        console.log(`${index + 1}. ${status} ${text} (ID: ${todo.id})`)
      })
    }
    console.log('==================\n')
  }

  // 新しいTodoを追加
  public addTodo(text: string): void {
    if (text.trim()) {
      useTodoStore.getState().addTodo(text)
      console.log(`✅ 新しいTodo「${text}」を追加しました`)
    } else {
      console.log('❌ 空のTodoは追加できません')
    }
  }

  // Todoの完了状態をトグル
  public toggleTodo(id: string): void {
    const store = useTodoStore.getState()
    const todo = store.todos.find(t => t.id === id)
    if (todo) {
      store.toggleTodo(id)
      const status = !todo.completed ? '完了' : '未完了'
      console.log(`🔄 Todo「${todo.text}」を${status}にしました`)
    } else {
      console.log('❌ 指定されたTodoが見つかりません')
    }
  }

  // Todoを削除
  public deleteTodo(id: string): void {
    const store = useTodoStore.getState()
    const todo = store.todos.find(t => t.id === id)
    if (todo) {
      store.deleteTodo(id)
      console.log(`🗑️ Todo「${todo.text}」を削除しました`)
    } else {
      console.log('❌ 指定されたTodoが見つかりません')
    }
  }

  // フィルターを設定
  public setFilter(filter: TodoFilter): void {
    useTodoStore.getState().setFilter(filter)
    console.log(`🔍 フィルターを「${filter}」に設定しました`)
  }

  // 完了済みTodoをクリア
  public clearCompleted(): void {
    const store = useTodoStore.getState()
    const completedCount = store.todos.filter(t => t.completed).length
    if (completedCount > 0) {
      store.clearCompleted()
      console.log(`🧹 ${completedCount}個の完了済みTodoをクリアしました`)
    } else {
      console.log('❌ 完了済みのTodoはありません')
    }
  }

  // IDでTodoを検索
  public findTodoById(id: string): Todo | undefined {
    return useTodoStore.getState().todos.find(t => t.id === id)
  }

  // テキストでTodoを検索
  public findTodosByText(searchText: string): Todo[] {
    return useTodoStore.getState().todos.filter(t =>
      t.text.toLowerCase().includes(searchText.toLowerCase())
    )
  }

  // クリーンアップ
  public destroy(): void {
    this.unsubscribe()
    console.log('📱 TodoAppを終了しました')
  }
}

// 使用例
const todoApp = new TodoApp()

// Todoの追加
todoApp.addTodo('TypeScriptを学習する')
todoApp.addTodo('Zustandを理解する')
todoApp.addTodo('実践プロジェクトを作成する')

// 最初のTodoを完了にする
const firstTodo = useTodoStore.getState().todos[0]
if (firstTodo) {
  todoApp.toggleTodo(firstTodo.id)
}

// フィルターの変更
todoApp.setFilter('active') // 未完了のみ表示
todoApp.setFilter('completed') // 完了済みのみ表示
todoApp.setFilter('all') // すべて表示

// 検索機能のテスト
console.log('「TypeScript」を含むTodo:', todoApp.findTodosByText('TypeScript'))

// 完了済みをクリア
todoApp.clearCompleted()

// アプリの終了
// todoApp.destroy()
```

---

## テスト実装

---

## 複雑な状態管理パターン

### ステップ 3: ユーザー管理システム

```typescript
// types/user.ts
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  avatar?: string
  createdAt: Date
  lastLoginAt?: Date
}

export interface UserFilters {
  role?: User['role']
  searchTerm?: string
}

// stores/userStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { User, UserFilters } from '../types/user'

interface UserState {
  // 状態
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
  filters: UserFilters
  
  // 非同期アクション
  fetchUsers: () => Promise<void>
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>
  updateUser: (id: string, updates: Partial<User>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  loginUser: (email: string, password: string) => Promise<void>
  logoutUser: () => void
  
  // 同期アクション
  setCurrentUser: (user: User | null) => void
  setFilters: (filters: UserFilters) => void
  clearError: () => void
  
  // セレクター
  getFilteredUsers: () => User[]
  getUserById: (id: string) => User | undefined
}

// モックAPI関数
const userAPI = {
  async getUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return [
      {
        id: '1',
        name: '田中太郎',
        email: 'tanaka@example.com',
        role: 'admin' as const,
        createdAt: new Date('2024-01-01'),
        lastLoginAt: new Date(),
      },
      {
        id: '2',
        name: '佐藤花子',
        email: 'sato@example.com',
        role: 'user' as const,
        createdAt: new Date('2024-01-15'),
        lastLoginAt: new Date(),
      },
    ]
  },

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const users = await this.getUsers()
    const user = users.find(u => u.id === id)
    if (!user) throw new Error('User not found')
    return { ...user, ...updates }
  },

  async deleteUser(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
  },

  async login(email: string, password: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800))
    const users = await this.getUsers()
    const user = users.find(u => u.email === email)
    if (!user) throw new Error('Invalid credentials')
    return { ...user, lastLoginAt: new Date() }
  },
}

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      // 初期状態
      users: [],
      currentUser: null,
      loading: false,
      error: null,
      filters: {},

      // 非同期アクション
      fetchUsers: async () => {
        set({ loading: true, error: null })
        try {
          const users = await userAPI.getUsers()
          set({ users, loading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false,
          })
        }
      },

      addUser: async (userData) => {
        set({ loading: true, error: null })
        try {
          const newUser = await userAPI.createUser(userData)
          set((state) => ({
            users: [...state.users, newUser],
            loading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add user',
            loading: false,
          })
        }
      },

      updateUser: async (id, updates) => {
        set({ loading: true, error: null })
        try {
          const updatedUser = await userAPI.updateUser(id, updates)
          set((state) => ({
            users: state.users.map(user =>
              user.id === id ? updatedUser : user
            ),
            currentUser: state.currentUser?.id === id ? updatedUser : state.currentUser,
            loading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update user',
            loading: false,
          })
        }
      },

      deleteUser: async (id) => {
        set({ loading: true, error: null })
        try {
          await userAPI.deleteUser(id)
          set((state) => ({
            users: state.users.filter(user => user.id !== id),
            currentUser: state.currentUser?.id === id ? null : state.currentUser,
            loading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete user',
            loading: false,
          })
        }
      },

      loginUser: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const user = await userAPI.login(email, password)
          set({ currentUser: user, loading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            loading: false,
          })
        }
      },

      logoutUser: () => {
        set({ currentUser: null })
      },

      // 同期アクション
      setCurrentUser: (user) => set({ currentUser: user }),
      setFilters: (filters) => set({ filters }),
      clearError: () => set({ error: null }),

      // セレクター
      getFilteredUsers: () => {
        const { users, filters } = get()
        return users.filter(user => {
          if (filters.role && user.role !== filters.role) return false
          if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase()
            return (
              user.name.toLowerCase().includes(searchLower) ||
              user.email.toLowerCase().includes(searchLower)
            )
          }
          return true
        })
      },

      getUserById: (id) => {
        const { users } = get()
        return users.find(user => user.id === id)
      },
    }),
    {
      name: 'user-store',
    }
  )
)
```

---

## パフォーマンス最適化

### ステップ 4: セレクターの最適化とテスト

```typescript
// __tests__/stores/todoStore.test.ts
import { useTodoStore } from '../../stores/todoStore'

describe('Todo Store', () => {
  beforeEach(() => {
    // 各テスト前にストアをリセット
    useTodoStore.setState({
      todos: [],
      filter: 'all',
    })
  })

  describe('addTodo', () => {
    it('should add a new todo', () => {
      const store = useTodoStore.getState()
      
      store.addTodo('新しいタスク')
      
      const updatedStore = useTodoStore.getState()
      expect(updatedStore.todos).toHaveLength(1)
      expect(updatedStore.todos[0].text).toBe('新しいタスク')
      expect(updatedStore.todos[0].completed).toBe(false)
      expect(updatedStore.todos[0].id).toBeDefined()
      expect(updatedStore.todos[0].createdAt).toBeInstanceOf(Date)
    })

    it('should trim whitespace from todo text', () => {
      const store = useTodoStore.getState()
      
      store.addTodo('  タスク  ')
      
      const updatedStore = useTodoStore.getState()
      expect(updatedStore.todos[0].text).toBe('タスク')
    })

    it('should not add empty todo', () => {
      const store = useTodoStore.getState()
      
      store.addTodo('   ')
      
      const updatedStore = useTodoStore.getState()
      expect(updatedStore.todos).toHaveLength(1)
      expect(updatedStore.todos[0].text).toBe('')
    })
  })

  describe('toggleTodo', () => {
    it('should toggle todo completion status', () => {
      const store = useTodoStore.getState()
      
      // まずTodoを追加
      store.addTodo('テストタスク')
      const todoId = useTodoStore.getState().todos[0].id
      
      // 完了状態をトグル
      store.toggleTodo(todoId)
      
      let updatedStore = useTodoStore.getState()
      expect(updatedStore.todos[0].completed).toBe(true)
      expect(updatedStore.todos[0].updatedAt).toBeInstanceOf(Date)
      
      // 再度トグル
      store.toggleTodo(todoId)
      
      updatedStore = useTodoStore.getState()
      expect(updatedStore.todos[0].completed).toBe(false)
    })

    it('should not affect other todos', () => {
      const store = useTodoStore.getState()
      
      store.addTodo('タスク1')
      store.addTodo('タスク2')
      
      const todos = useTodoStore.getState().todos
      const firstTodoId = todos[0].id
      
      store.toggleTodo(firstTodoId)
      
      const updatedTodos = useTodoStore.getState().todos
      expect(updatedTodos[0].completed).toBe(true)
      expect(updatedTodos[1].completed).toBe(false)
    })
  })

  describe('deleteTodo', () => {
    it('should delete specified todo', () => {
      const store = useTodoStore.getState()
      
      store.addTodo('削除対象')
      store.addTodo('残すタスク')
      
      const todos = useTodoStore.getState().todos
      const deleteTargetId = todos[0].id
      
      store.deleteTodo(deleteTargetId)
      
      const updatedTodos = useTodoStore.getState().todos
      expect(updatedTodos).toHaveLength(1)
      expect(updatedTodos[0].text).toBe('残すタスク')
    })
  })

  describe('getFilteredTodos', () => {
    beforeEach(() => {
      const store = useTodoStore.getState()
      
      store.addTodo('タスク1')
      store.addTodo('タスク2')
      store.addTodo('タスク3')
      
      // タスク2を完了にする
      const todos = useTodoStore.getState().todos
      const todoId = todos[1].id
      store.toggleTodo(todoId)
    })

    it('should return all todos when filter is "all"', () => {
      const store = useTodoStore.getState()
      
      store.setFilter('all')
      
      const filtered = store.getFilteredTodos()
      expect(filtered).toHaveLength(3)
    })

    it('should return only active todos when filter is "active"', () => {
      const store = useTodoStore.getState()
      
      store.setFilter('active')
      
      const filtered = store.getFilteredTodos()
      expect(filtered).toHaveLength(2)
      expect(filtered.every(todo => !todo.completed)).toBe(true)
    })

    it('should return only completed todos when filter is "completed"', () => {
      const store = useTodoStore.getState()
      
      store.setFilter('completed')
      
      const filtered = store.getFilteredTodos()
      expect(filtered).toHaveLength(1)
      expect(filtered.every(todo => todo.completed)).toBe(true)
    })
  })

  describe('getTodoStats', () => {
    it('should return correct statistics', () => {
      const store = useTodoStore.getState()
      
      store.addTodo('タスク1')
      store.addTodo('タスク2')
      store.addTodo('タスク3')
      
      // 1つを完了にする
      const todos = useTodoStore.getState().todos
      store.toggleTodo(todos[0].id)
      
      const stats = store.getTodoStats()
      expect(stats.total).toBe(3)
      expect(stats.active).toBe(2)
      expect(stats.completed).toBe(1)
    })
  })

  describe('clearCompleted', () => {
    it('should remove all completed todos', () => {
      const store = useTodoStore.getState()
      
      store.addTodo('タスク1')
      store.addTodo('タスク2')
      store.addTodo('タスク3')
      
      // 2つを完了にする
      const todos = useTodoStore.getState().todos
      store.toggleTodo(todos[0].id)
      store.toggleTodo(todos[1].id)
      
      store.clearCompleted()
      
      const remainingTodos = useTodoStore.getState().todos
      expect(remainingTodos).toHaveLength(1)
      expect(remainingTodos[0].text).toBe('タスク3')
      expect(remainingTodos[0].completed).toBe(false)
    })
  })
})
```

**📌 重要**: この実践コード例では、Zustandを使った型安全な状態管理の基本から応用まで、段階的に学習できるように構成されています。各ステップで学んだ概念を次のステップで活用し、実用的なアプリケーション開発スキルを身につけることができます。

---

## 実践的なアプリケーション例

### ステップ 5: ショッピングカートアプリケーション

```typescript
// types/product.ts
export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  stock: number
}

export interface CartItem {
  product: Product
  quantity: number
}

// stores/cartStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Product, CartItem } from '../types/product'

interface CartState {
  items: CartItem[]
  total: number
  
  // アクション
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  
  // セレクター
  getItemCount: () => number
  getCartTotal: () => number
  isInCart: (productId: string) => boolean
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        total: 0,

        addToCart: (product, quantity = 1) => {
          set((state) => {
            const existingItem = state.items.find(item => item.product.id === product.id)
            
            if (existingItem) {
              // 既存アイテムの数量を更新
              const updatedItems = state.items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
              return {
                items: updatedItems,
                total: get().getCartTotal(),
              }
            } else {
              // 新しいアイテムを追加
              const newItems = [...state.items, { product, quantity }]
              return {
                items: newItems,
                total: get().getCartTotal(),
              }
            }
          })
        },

        removeFromCart: (productId) => {
          set((state) => ({
            items: state.items.filter(item => item.product.id !== productId),
            total: get().getCartTotal(),
          }))
        },

        updateQuantity: (productId, quantity) => {
          if (quantity <= 0) {
            get().removeFromCart(productId)
            return
          }
          
          set((state) => ({
            items: state.items.map(item =>
              item.product.id === productId
                ? { ...item, quantity }
                : item
            ),
            total: get().getCartTotal(),
          }))
        },

        clearCart: () => {
          set({ items: [], total: 0 })
        },

        // セレクター関数
        getItemCount: () => {
          const { items } = get()
          return items.reduce((total, item) => total + item.quantity, 0)
        },

        getCartTotal: () => {
          const { items } = get()
          return items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
        },

        isInCart: (productId) => {
          const { items } = get()
          return items.some(item => item.product.id === productId)
        },
      }),
      {
        name: 'cart-storage',
        partialize: (state) => ({ items: state.items }),
      }
    ),
    {
      name: 'cart-store',
    }
  )
)

// TypeScriptアプリケーションでの使用例
class ShoppingCartApp {
  private unsubscribe: () => void

  constructor() {
    // ストアの変更を監視
    this.unsubscribe = useCartStore.subscribe((state) => {
      this.displayCart()
    })
    
    // 初期表示
    this.displayCart()
  }

  // カートの表示
  private displayCart(): void {
    const store = useCartStore.getState()
    const itemCount = store.getItemCount()
    const total = store.getCartTotal()

    console.log('\n=== ショッピングカート ===')
    console.log(`アイテム数: ${itemCount}個`)
    console.log(`合計金額: ¥${total.toLocaleString()}`)
    console.log('\n--- カート内容 ---')
    
    if (store.items.length === 0) {
      console.log('カートは空です')
    } else {
      store.items.forEach((item, index) => {
        const subtotal = item.product.price * item.quantity
        console.log(`${index + 1}. ${item.product.name}`)
        console.log(`   価格: ¥${item.product.price.toLocaleString()} × ${item.quantity}個`)
        console.log(`   小計: ¥${subtotal.toLocaleString()}`)
        console.log(`   ID: ${item.product.id}`)
        console.log('')
      })
    }
    console.log('========================\n')
  }

  // 商品をカートに追加
  public addToCart(product: Product, quantity: number = 1): void {
    const store = useCartStore.getState()
    
    if (quantity <= 0) {
      console.log('❌ 数量は1以上である必要があります')
      return
    }
    
    if (product.stock < quantity) {
      console.log(`❌ 在庫不足です。在庫数: ${product.stock}`)
      return
    }
    
    store.addToCart(product, quantity)
    console.log(`✅ 「${product.name}」を${quantity}個カートに追加しました`)
  }

  // カートから商品を削除
  public removeFromCart(productId: string): void {
    const store = useCartStore.getState()
    const item = store.items.find(item => item.product.id === productId)
    
    if (item) {
      store.removeFromCart(productId)
      console.log(`🗑️ 「${item.product.name}」をカートから削除しました`)
    } else {
      console.log('❌ 指定された商品がカートに見つかりません')
    }
  }

  // 数量を更新
  public updateQuantity(productId: string, quantity: number): void {
    const store = useCartStore.getState()
    const item = store.items.find(item => item.product.id === productId)
    
    if (!item) {
      console.log('❌ 指定された商品がカートに見つかりません')
      return
    }
    
    if (quantity <= 0) {
      this.removeFromCart(productId)
      return
    }
    
    if (item.product.stock < quantity) {
      console.log(`❌ 在庫不足です。在庫数: ${item.product.stock}`)
      return
    }
    
    store.updateQuantity(productId, quantity)
    console.log(`🔄 「${item.product.name}」の数量を${quantity}個に変更しました`)
  }

  // カートをクリア
  public clearCart(): void {
    const store = useCartStore.getState()
    const itemCount = store.getItemCount()
    
    if (itemCount > 0) {
      store.clearCart()
      console.log(`🧹 カートをクリアしました（${itemCount}個のアイテムを削除）`)
    } else {
      console.log('❌ カートは既に空です')
    }
  }

  // 商品検索
  public findItemInCart(productId: string): CartItem | undefined {
    return useCartStore.getState().items.find(item => item.product.id === productId)
  }

  // カート統計の取得
  public getCartStats(): { itemCount: number; total: number; averagePrice: number } {
    const store = useCartStore.getState()
    const itemCount = store.getItemCount()
    const total = store.getCartTotal()
    const averagePrice = itemCount > 0 ? total / itemCount : 0
    
    return { itemCount, total, averagePrice }
  }

  // クリーンアップ
  public destroy(): void {
    this.unsubscribe()
    console.log('🛒 ショッピングカートアプリを終了しました')
  }
}

// サンプル商品データ
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'TypeScript入門書',
    price: 3000,
    image: 'typescript-book.jpg',
    category: '書籍',
    stock: 10,
  },
  {
    id: '2',
    name: 'プログラミングキーボード',
    price: 15000,
    image: 'keyboard.jpg',
    category: 'ハードウェア',
    stock: 5,
  },
  {
    id: '3',
    name: 'コーヒーマグ',
    price: 1200,
    image: 'mug.jpg',
    category: '雑貨',
    stock: 20,
  },
]

// 使用例
const cartApp = new ShoppingCartApp()

// 商品をカートに追加
cartApp.addToCart(sampleProducts[0], 2) // TypeScript入門書 × 2
cartApp.addToCart(sampleProducts[1], 1) // プログラミングキーボード × 1
cartApp.addToCart(sampleProducts[2], 3) // コーヒーマグ × 3

// 数量変更
cartApp.updateQuantity(sampleProducts[0].id, 1) // TypeScript入門書を1個に変更

// 統計情報の表示
const stats = cartApp.getCartStats()
console.log('📊 カート統計:')
console.log(`- アイテム数: ${stats.itemCount}個`)
console.log(`- 合計金額: ¥${stats.total.toLocaleString()}`)
console.log(`- 平均価格: ¥${Math.round(stats.averagePrice).toLocaleString()}`)

// 商品削除
cartApp.removeFromCart(sampleProducts[2].id) // コーヒーマグを削除

// カートクリア
// cartApp.clearCart()

// アプリ終了
// cartApp.destroy()
```

### パフォーマンス最適化のポイント

```typescript
// utils/cartOptimization.ts
// TypeScriptでのパフォーマンス最適化ユーティリティ

interface CartCalculationCache {
  items: CartItem[]
  itemCount: number
  total: number
  lastCalculated: number
}

class CartOptimizer {
  private cache: CartCalculationCache | null = null
  private readonly CACHE_DURATION = 1000 // 1秒間キャッシュを保持

  // キャッシュされた計算結果を取得
  public getOptimizedStats(items: CartItem[]): { itemCount: number; total: number } {
    const now = Date.now()
    
    // キャッシュが有効かチェック
    if (this.cache &&
        this.cache.lastCalculated + this.CACHE_DURATION > now &&
        this.areItemsEqual(this.cache.items, items)) {
      return {
        itemCount: this.cache.itemCount,
        total: this.cache.total,
      }
    }
    
    // 新しく計算
    const itemCount = items.reduce((total, item) => total + item.quantity, 0)
    const total = items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    
    // キャッシュを更新
    this.cache = {
      items: [...items], // 深いコピーを作成
      itemCount,
      total,
      lastCalculated: now,
    }
    
    return { itemCount, total }
  }

  // アイテム配列の比較
  private areItemsEqual(items1: CartItem[], items2: CartItem[]): boolean {
    if (items1.length !== items2.length) return false
    
    return items1.every((item1, index) => {
      const item2 = items2[index]
      return item1.product.id === item2.product.id &&
             item1.quantity === item2.quantity
    })
  }

  // キャッシュをクリア
  public clearCache(): void {
    this.cache = null
  }
}

// グローバルなオプティマイザーインスタンス
export const cartOptimizer = new CartOptimizer()
```

**🎯 学習のポイント**:
- 複雑な状態ロジックの型安全な実装
- パフォーマンスを考慮したセレクターの設計
- 実用的なeコマース機能の実装
- メモ化による最適化手法
