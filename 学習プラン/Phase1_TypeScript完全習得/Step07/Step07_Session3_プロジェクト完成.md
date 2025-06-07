# Session3: プロジェクト完成（60分）

> 💡 **対象**: Session1-2完了者（プロジェクト設計・実装基礎習得済み）
> 🎯 **形式**: 講師サポート付きプロジェクト完成・発表
> ⏰ **時間**: 60分

## 📚 関連補足資料

プロジェクト完成をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step07_補足_実践コード例.md)** - 完全なシステム実装例とベストプラクティス
- 🚨 **[トラブルシューティング](./Step07_補足_トラブルシューティング.md)** - デバッグとエラー解決の完全ガイド
- 📖 **[専門用語集](./Step07_補足_専門用語集.md)** - 高度な概念と用語の詳細解説
- 🌐 **[参考リソース](./Step07_補足_参考リソース.md)** - 継続学習のためのリソース集
- 🔧 **[開発環境ガイド](./Step07_補足_開発環境ガイド.md)** - 効率的な開発環境の活用

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] Todoアプリケーションの完成
- [ ] UIコンポーネントの統合とデバッグ・最適化
- [ ] 学習成果の発表・共有
- [ ] Step07全体の振り返りと次ステップの確認

**前提知識**:

- Session1-2の内容（プロジェクト設計・状態管理・ビジネスロジック実装）
- Todoアプリケーションの部分実装
- TypeScriptの実践的な活用経験

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                       | 講師の役割                 | 学習者の活動   | 成果物       |
| ------------ | -------------------------- | -------------------------- | -------------- | ------------ |
| **0-10分**   | 最終課題説明・目標設定     | 課題説明・期待値設定       | 理解・質問     | 実装計画     |
| **10-45分**  | プロジェクト完成・デバッグ | 個別サポート・デバッグ支援 | 開発・完成     | 完成システム |
| **45-60分**  | 成果発表・総括・次ステップ | 評価・フィードバック       | 発表・振り返り | 学習成果     |

---

## 🎯 最終課題：Todoアプリケーション完成

> 📚 **実装サポート**: [実践コード例 - Todoアプリ完全版](./Step07_補足_実践コード例.md#Todoアプリ完全版) | [トラブルシューティング - デバッグガイド](./Step07_補足_トラブルシューティング.md#デバッグのコツ)

### 課題概要

Session2で作成したTodoアプリケーションを完成させ、以下の機能を追加実装してください。

### 必須実装機能

#### 1. 基本機能の完成（Session2からの継続）

- [ ] Todo項目の追加・編集・削除・完了切り替え
- [ ] カテゴリ別の分類と表示
- [ ] 優先度設定と視覚的表示
- [ ] 期限設定と期限切れ表示

#### 2. 新規追加機能

**UIコンポーネントの統合**

```typescript
// app.ts - メインアプリケーション
export class TodoApp {
  private container: HTMLElement;
  private todoService: TodoService;
  private components: Map<string, BaseComponent> = new Map();

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
    this.todoService = todoService;
    this.init();
  }

  private init(): void {
    this.setupHTML();
    this.setupEventListeners();
    this.subscribeToStore();
    this.render();
  }

  private setupHTML(): void {
    this.container.innerHTML = `
      <div class="todo-app">
        <header class="app-header">
          <h1>TypeScript Todo App</h1>
          <div class="stats" id="stats"></div>
        </header>

        <div class="app-controls">
          <input type="text" id="search" placeholder="検索..." />
          <select id="filter">
            <option value="all">すべて</option>
            <option value="active">未完了</option>
            <option value="completed">完了済み</option>
          </select>
          <select id="sort">
            <option value="created">作成日順</option>
            <option value="updated">更新日順</option>
            <option value="priority">優先度順</option>
            <option value="dueDate">期限順</option>
            <option value="title">タイトル順</option>
          </select>
        </div>

        <div class="add-todo-form">
          <input type="text" id="new-todo-title" placeholder="新しいタスク..." />
          <select id="new-todo-priority">
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
          <select id="new-todo-category">
            <!-- カテゴリは動的に生成 -->
          </select>
          <input type="date" id="new-todo-due" />
          <button id="add-todo-btn">追加</button>
        </div>

        <div class="todo-list" id="todo-list"></div>
      </div>
    `;
  }

  private setupEventListeners(): void {
    // 検索
    const searchInput = document.getElementById("search") as HTMLInputElement;
    searchInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      this.todoService.setSearch(target.value);
    });

    // フィルタ
    const filterSelect = document.getElementById("filter") as HTMLSelectElement;
    filterSelect.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      this.todoService.setFilter(target.value as TodoFilter);
    });

    // ソート
    const sortSelect = document.getElementById("sort") as HTMLSelectElement;
    sortSelect.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      this.todoService.setSort(target.value as TodoSortBy);
    });

    // 新しいTodo追加
    const addButton = document.getElementById("add-todo-btn") as HTMLButtonElement;
    addButton.addEventListener("click", () => this.handleAddTodo());

    // Enterキーでの追加
    const titleInput = document.getElementById("new-todo-title") as HTMLInputElement;
    titleInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleAddTodo();
      }
    });
  }

  private handleAddTodo(): void {
    const titleInput = document.getElementById("new-todo-title") as HTMLInputElement;
    const prioritySelect = document.getElementById("new-todo-priority") as HTMLSelectElement;
    const categorySelect = document.getElementById("new-todo-category") as HTMLSelectElement;
    const dueInput = document.getElementById("new-todo-due") as HTMLInputElement;

    const title = titleInput.value.trim();
    if (!title) return;

    const todoData: Omit<TodoItem, "id" | "createdAt" | "updatedAt"> = {
      title,
      completed: false,
      priority: prioritySelect.value as "low" | "medium" | "high",
      category: categorySelect.value,
      dueDate: dueInput.value ? new Date(dueInput.value) : undefined,
    };

    this.todoService.addTodo(todoData);

    // フォームリセット
    titleInput.value = "";
    dueInput.value = "";
  }

  private subscribeToStore(): void {
    todoStore.subscribe(() => {
      this.render();
    });
  }

  private render(): void {
    this.renderStats();
    this.renderCategories();
    this.renderTodoList();
  }

  private renderStats(): void {
    const stats = this.todoService.getStats();
    const statsElement = document.getElementById("stats");
    if (statsElement) {
      statsElement.innerHTML = `
        <span>総数: ${stats.total}</span>
        <span>完了: ${stats.completed}</span>
        <span>未完了: ${stats.active}</span>
        <span class="overdue">期限切れ: ${stats.overdue}</span>
      `;
    }
  }

  private renderCategories(): void {
    const categorySelect = document.getElementById("new-todo-category") as HTMLSelectElement;
    const categories = todoStore.getState().categories;

    categorySelect.innerHTML = categories
      .map((cat) => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`)
      .join("");
  }

  private renderTodoList(): void {
    const todoListElement = document.getElementById("todo-list");
    if (!todoListElement) return;

    // 既存のコンポーネントをクリア
    this.components.forEach((component) => component.unmount());
    this.components.clear();
    todoListElement.innerHTML = "";

    const todos = this.todoService.getFilteredTodos();

    todos.forEach((todo) => {
      const todoComponent = new TodoItemComponent({
        todo,
        onToggle: (id) => this.todoService.toggleTodo(id),
        onEdit: (id) => this.handleEditTodo(id),
        onDelete: (id) => this.todoService.deleteTodo(id),
      });

      todoComponent.mount(todoListElement);
      this.components.set(todo.id, todoComponent);
    });
  }

  private handleEditTodo(id: string): void {
    // 編集機能の実装（簡略化）
    const newTitle = prompt("新しいタイトルを入力してください:");
    if (newTitle && newTitle.trim()) {
      this.todoService.updateTodo(id, { title: newTitle.trim() });
    }
  }
}

// アプリケーション起動
document.addEventListener("DOMContentLoaded", () => {
  new TodoApp("app");
});
```

#### 3. プロジェクト設計の強化

**型安全性の向上**

```typescript
// 型ガードの実装
function isTodoItem(value: unknown): value is TodoItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as TodoItem).id === "string" &&
    typeof (value as TodoItem).title === "string" &&
    typeof (value as TodoItem).completed === "boolean" &&
    ["low", "medium", "high"].includes((value as TodoItem).priority) &&
    typeof (value as TodoItem).category === "string" &&
    (value as TodoItem).createdAt instanceof Date &&
    (value as TodoItem).updatedAt instanceof Date
  );
}

// エラーハンドリングの強化
interface TodoError {
  code: string;
  message: string;
  field?: keyof TodoItem;
  details?: Record<string, unknown>;
}

class TodoValidationError extends Error {
  constructor(public todoError: TodoError) {
    super(todoError.message);
    this.name = "TodoValidationError";
  }
}

// バリデーション機能
function validateTodoData(data: Partial<TodoItem>): TodoError[] {
  const errors: TodoError[] = [];

  if (data.title !== undefined) {
    if (!data.title.trim()) {
      errors.push({
        code: "TITLE_REQUIRED",
        message: "タイトルは必須です",
        field: "title",
      });
    } else if (data.title.length > 100) {
      errors.push({
        code: "TITLE_TOO_LONG",
        message: "タイトルは100文字以内で入力してください",
        field: "title",
      });
    }
  }

  if (data.description && data.description.length > 500) {
    errors.push({
      code: "DESCRIPTION_TOO_LONG",
      message: "説明は500文字以内で入力してください",
      field: "description",
    });
  }

  return errors;
}
```

### 実装のヒント

1. **段階的実装**: 一つずつ機能を追加し、動作確認を行う
2. **型安全性**: すべての関数に適切な型注釈を付ける
3. **エラーハンドリング**: 想定される例外ケースを考慮する
4. **テストデータ**: 実装した機能をテストするためのサンプルデータを用意

### 追加チャレンジ課題（時間に余裕がある場合）

- [ ] ローカルストレージへの永続化
- [ ] ドラッグ&ドロップによる並び替え
- [ ] キーボードショートカット対応
- [ ] ダークモード切り替え

---

## 👨‍🏫 学習ポイント

### 🤔 よくある実装上の問題と解決法

**Q: コンポーネントの再レンダリングが頻繁に発生してパフォーマンスが悪いです**
A: 状態の変更を最小限に抑え、必要な部分のみを更新するようにしましょう。また、イベントリスナーの適切な削除も重要です。

**Q: 型エラーが多発して実装が進みません**
A: 段階的に型を追加し、まずは動作するコードを作成してから型安全性を向上させるアプローチを取りましょう。

**Q: デバッグが困難です**
A: console.logを活用し、状態の変化を追跡しましょう。また、ブラウザの開発者ツールを使って、DOM操作やイベントの動作を確認することが重要です。

---

## 成果物

- [ ] **Todoアプリケーション**: プロジェクト設計練習に特化した学習者向けプロジェクト → [Step07成果物](./Step07_成果物.md)で詳細確認

---

## 📊 Step07総合評価

### 最終評価基準

#### 技術習得度（60%）

- [ ] **プロジェクト設計**: データモデル設計、アーキテクチャパターンの理解
- [ ] **状態管理実装**: 型安全な状態管理システムの構築
- [ ] **コンポーネント設計**: 再利用可能なコンポーネントの実装
- [ ] **エラーハンドリング**: 適切な例外処理の実装

#### 実装品質（25%）

- [ ] **コードの可読性**: 変数名・関数名の適切性
- [ ] **型安全性**: TypeScriptの恩恵を活用
- [ ] **保守性**: 拡張しやすい設計
- [ ] **動作確認**: 実装した機能の正常動作

#### 学習姿勢（15%）

- [ ] **積極性**: 質問・議論への参加
- [ ] **問題解決**: 自力でのデバッグ・調査
- [ ] **協調性**: 他の学習者との協力
- [ ] **振り返り**: 学習内容の整理・次ステップの計画

---

## 🔄 Step08への準備

### 次週学習内容の予習

```typescript
// Step08で学習するライブラリ統合の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. 外部ライブラリの型定義
declare module "some-library" {
  export function someFunction(param: string): number;
}

// 2. d.tsファイルの基本
interface Window {
  customProperty: string;
}

// 3. DefinitelyTypedの活用
// npm install @types/lodash
import _ from "lodash";
```

### 学習の振り返り

**今回学んだこと**:
- プロジェクト設計の基本概念
- 型安全な状態管理システムの実装
- コンポーネント設計パターン
- 実践的なTypeScriptアプリケーション開発

**次のステップ**:
- 外部ライブラリとの統合
- 型定義ファイルの作成と活用
- より大規模なプロジェクトでの設計パターン

---

**🎉 お疲れ様でした！** Step07を通じてプロジェクト設計の基礎をしっかりと身につけることができました。

**🚀 次のStep08では、より高度なライブラリ統合と型定義について学習します！**