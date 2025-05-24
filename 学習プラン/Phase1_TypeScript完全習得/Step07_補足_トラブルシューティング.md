# Step07 トラブルシューティング

> 💡 **このファイルについて**: 実践プロジェクト開発でよくあるエラーと解決方法をまとめたガイドです。

## 📋 目次
1. [プロジェクト構造エラー](#プロジェクト構造エラー)
2. [状態管理エラー](#状態管理エラー)
3. [DOM操作エラー](#dom操作エラー)
4. [型安全性エラー](#型安全性エラー)

---

## プロジェクト構造エラー

### "Cannot find module" エラー
**原因**: モジュールパスの設定ミス

**解決方法**:
```typescript
// tsconfig.json で baseUrl を設定
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}

// 相対パスを使用
import { Todo } from './types/todo';
import { TodoService } from '../services/TodoService';
```

### "Property does not exist on type" エラー
**原因**: 型定義の不一致

**解決方法**:
```typescript
// 正しい型定義
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

// 型ガードを使用
function isTodo(obj: any): obj is Todo {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string';
}
```

---

## 状態管理エラー

### 状態の直接変更エラー
**原因**: イミュータブル更新の違反

**解決方法**:
```typescript
// 間違い
state.todos.push(newTodo);

// 正しい
return {
  ...state,
  todos: [...state.todos, newTodo]
};
```

### アクションタイプの型エラー
**解決方法**:
```typescript
// 判別可能なユニオン型を使用
type TodoAction = 
  | { type: 'ADD_TODO'; payload: { title: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } };

// switch文で型安全に処理
function reducer(state: AppState, action: TodoAction): AppState {
  switch (action.type) {
    case 'ADD_TODO':
      // action.payloadは{ title: string }型
      return addTodo(state, action.payload.title);
    default:
      return state;
  }
}
```

---

## DOM操作エラー

### "Cannot read property of null" エラー
**解決方法**:
```typescript
// null チェックを追加
const element = document.getElementById('todo-input');
if (element) {
  element.addEventListener('click', handleClick);
}

// 型アサーションと組み合わせ
const input = document.getElementById('todo-input') as HTMLInputElement | null;
if (input) {
  input.value = '';
}
```

### イベントハンドラーの型エラー
**解決方法**:
```typescript
// 正しい型注釈
function handleClick(event: MouseEvent): void {
  event.preventDefault();
  // 処理
}

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    // 処理
  }
}
```

---

## 型安全性エラー

### ジェネリック型の推論エラー
**解決方法**:
```typescript
// 明示的な型指定
const store = new Store<AppState>(initialState);

// 型パラメータの制約
interface Repository<T extends { id: string }> {
  save(item: T): void;
  findById(id: string): T | null;
}
```

---

## 🚨 緊急時の対処法

### 大量の型エラーが発生した場合
```typescript
// 一時的にany型を使用
const data: any = response.data;

// 段階的に型を追加
interface PartialTodo {
  id: string;
  title: string;
  // 他のプロパティは後で追加
}
```

---

**📌 重要**: 実践プロジェクトでは、エラーが発生した時に慌てずに、エラーメッセージをよく読んで原因を特定することが重要です。型安全性を保ちながら段階的に問題を解決しましょう。