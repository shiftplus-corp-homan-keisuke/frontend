# Session3: Angular 統合実践（90 分）

> 💡 **対象**: Session1-2 完了者（Zod 基本概念・高度なスキーマ構築習得済み）
> 🎯 **形式**: 講師サポート付きシステム統合・完成
> ⏰ **時間**: 90 分

## 📚 関連補足資料

システム完成をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step07_補足_実践コード例.md)** - Angular 統合の完全なシステム実装例とベストプラクティス
- 🚨 **[トラブルシューティング](./Step07_補足_トラブルシューティング.md)** - Angular 統合でのデバッグとエラー解決の完全ガイド
- 📖 **[専門用語集](./Step07_補足_専門用語集.md)** - Angular・Reactive Forms・HTTP 通信の詳細解説
- 🌐 **[参考リソース](./Step07_補足_参考リソース.md)** - 継続学習のためのリソース集
- 🔧 **[開発環境ガイド](./Step07_補足_開発環境ガイド.md)** - 効率的な開発環境の活用

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] Angular Reactive Forms と Zod の統合
- [ ] 型安全な HTTP 通信の実装
- [ ] 動的フォーム生成の実践
- [ ] 実践的な CRUD アプリケーションの完成
- [ ] Zod の利点の実感と振り返り

**前提知識**:

- Session1-2 の内容（Zod 基本概念、高度なバリデーション技法、スキーマ合成）
- Angular 基礎（コンポーネント、サービス、Reactive Forms）
- HTTP 通信と RxJS の基本理解

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                        | 講師の役割                 | 学習者の活動   | 成果物       |
| ------------ | --------------------------- | -------------------------- | -------------- | ------------ |
| **0-10 分**  | 最終課題説明・目標設定      | 課題説明・期待値設定       | 理解・質問     | 実装計画     |
| **10-40 分** | Angular Reactive Forms 統合 | 個別サポート・デバッグ支援 | 開発・実装     | フォーム統合 |
| **40-70 分** | HTTP 通信と CRUD アプリ完成 | 巡回サポート・ヒント       | システム開発   | 完成アプリ   |
| **70-90 分** | 成果発表・総括・次ステップ  | 評価・フィードバック       | 発表・振り返り | 学習成果     |

---

## 🎯 最終課題：Angular × Zod 統合アプリケーション完成

> 📚 **実装サポート**: [実践コード例 - Angular 統合完全版](./Step07_補足_実践コード例.md#Angular統合完全版) | [トラブルシューティング - デバッグガイド](./Step07_補足_トラブルシューティング.md#デバッグのコツ)

### 課題概要

Session1-2 で学習した Zod の技法を使い、Angular と統合した完全に動作するタスク管理アプリケーションを完成させてください。

### 必須実装機能

#### 1. Zod バリデータとの統合

**🎓 学習のポイント**: Angular の Reactive Forms と Zod を統合することで、フォームバリデーションを統一的に管理できます。まず統合の仕組みを理解しましょう

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { z } from "zod";

// === STEP 1: 基本的な Zod バリデータの理解 ===
console.log("=== Zod バリデータ統合の理解 ===");

/**
 * ZodスキーマからAngularバリデータを生成する関数
 * 🔍 重要：Angular の ValidatorFn インターフェースに準拠
 */
export function zodValidator(schema: z.ZodSchema<any>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    console.log(`バリデーション実行中: 値 = ${control.value}`);

    // 🎯 重要：空の値は他のバリデータ（required等）に任せる
    if (!control.value) {
      console.log("空の値のため、バリデーションをスキップ");
      return null;
    }

    // Zod でバリデーション実行
    const result = schema.safeParse(control.value);

    if (result.success) {
      console.log("✅ バリデーション成功");
      return null; // バリデーション成功
    } else {
      console.log("❌ バリデーション失敗:", result.error.errors);

      // 🔍 重要：Zodのエラーを Angular の ValidationErrors 形式に変換
      const errors: ValidationErrors = {};
      result.error.errors.forEach((err) => {
        const key = err.path.length > 0 ? err.path.join(".") : "zodError";
        errors[key] = {
          message: err.message,
          actualValue: control.value,
          expectedType: err.code,
        };
      });

      console.log("変換されたエラー:", errors);
      return errors;
    }
  };
}

// === STEP 2: 非同期バリデータの実装 ===
console.log("=== 非同期バリデータの理解 ===");

/**
 * 非同期バリデーション（サーバーチェックなど）用
 * 🔍 重要：Promise を返すことで非同期処理に対応
 */
export function zodAsyncValidator(schema: z.ZodSchema<any>): ValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    console.log(`非同期バリデーション実行中: 値 = ${control.value}`);

    if (!control.value) {
      console.log("空の値のため、非同期バリデーションをスキップ");
      return Promise.resolve(null);
    }

    // 🎯 非同期でバリデーション実行
    return schema
      .parseAsync(control.value)
      .then(() => {
        console.log("✅ 非同期バリデーション成功");
        return null;
      })
      .catch((error: z.ZodError) => {
        console.log("❌ 非同期バリデーション失敗:", error.errors);

        const errors: ValidationErrors = {};
        error.errors.forEach((err) => {
          const key = err.path.length > 0 ? err.path.join(".") : "zodError";
          errors[key] = {
            message: err.message,
            async: true, // 非同期エラーであることを示す
          };
        });

        return errors;
      });
  };
}

// === STEP 3: 実際の使用例を理解しよう ===
console.log("=== バリデータの実用例 ===");

// メールアドレス用のスキーマ
const EmailSchema = z
  .string()
  .email("正しいメールアドレス形式で入力してください");

// Angular フォームコントロールでの使用例（疑似コード）
/*
const emailControl = new FormControl('', [
  Validators.required,           // Angular 標準バリデータ
  zodValidator(EmailSchema)      // Zod バリデータ
]);

// フォームコントロールのテスト
emailControl.setValue('invalid-email');
console.log('バリデーションエラー:', emailControl.errors);
// 結果: { zodError: { message: "正しいメールアドレス形式で入力してください" } }
*/

// === STEP 4: カスタムエラーメッセージハンドラ ===
console.log("=== エラーメッセージ処理 ===");

/**
 * Zodエラーを日本語のユーザーフレンドリーなメッセージに変換
 */
export function formatZodErrors(errors: ValidationErrors): string[] {
  const messages: string[] = [];

  for (const [key, error] of Object.entries(errors)) {
    if (error?.message) {
      console.log(`エラー処理: ${key} -> ${error.message}`);
      messages.push(error.message);
    }
  }

  return messages;
}

/**
 * フォームコントロールからエラーメッセージを取得するヘルパー
 */
export function getControlErrorMessage(
  control: AbstractControl
): string | null {
  if (!control.errors || !control.touched) {
    return null;
  }

  // Zodエラーを優先して表示
  for (const [key, error] of Object.entries(control.errors)) {
    if (error?.message) {
      return error.message;
    }
  }

  // Angularの標準エラーメッセージ
  if (control.errors["required"]) {
    return "この項目は必須です";
  }

  if (control.errors["email"]) {
    return "メールアドレス形式で入力してください";
  }

  return "入力内容に誤りがあります";
}
```

**🎓 理解度チェック**

- `ValidatorFn` インターフェースの役割は理解できましたか？
- Zod のエラーを Angular の `ValidationErrors` に変換する仕組みは分かりますか？
- 同期バリデータと非同期バリデータの使い分けは理解できましたか？
- エラーメッセージのカスタマイズ方法は身につきましたか？

#### 2. タスクスキーマの定義

```typescript
import { z } from "zod";

// タスクスキーマの定義
const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(100, "タイトルは100文字以内で入力してください"),
  description: z
    .string()
    .max(500, "説明は500文字以内で入力してください")
    .optional(),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z
    .string()
    .datetime()
    .transform((str) => new Date(str))
    .optional(),
  tags: z.array(z.string()).max(5, "タグは5個まで設定できます"),
  assigneeId: z.string().uuid().optional(),
  createdAt: z
    .string()
    .datetime()
    .transform((str) => new Date(str)),
  updatedAt: z
    .string()
    .datetime()
    .transform((str) => new Date(str)),
});

const CreateTaskSchema = TaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  status: z.enum(["todo", "in-progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  tags: z.array(z.string()).default([]),
});

const UpdateTaskSchema = TaskSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

type Task = z.infer<typeof TaskSchema>;
type CreateTask = z.infer<typeof CreateTaskSchema>;
type UpdateTask = z.infer<typeof UpdateTaskSchema>;
```

#### 3. 型安全な HTTP サービス

```typescript
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { z } from "zod";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private baseUrl = "/api/tasks";

  constructor(private http: HttpClient) {}

  // ジェネリックなAPI呼び出しメソッド
  private apiCall<T>(
    url: string,
    schema: z.ZodSchema<T>,
    options?: any
  ): Observable<T> {
    return this.http.get(`${this.baseUrl}${url}`, options).pipe(
      map((response) => {
        const result = schema.safeParse(response);
        if (result.success) {
          return result.data;
        } else {
          throw new Error(
            `API response validation failed: ${result.error.message}`
          );
        }
      }),
      catchError(this.handleError)
    );
  }

  // タスク一覧取得
  getTasks(filters?: {
    status?: Task["status"];
    priority?: Task["priority"];
    assigneeId?: string;
  }): Observable<Task[]> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params = params.append(key, value);
        }
      });
    }

    const TasksResponseSchema = z.object({
      success: z.boolean(),
      data: z.array(TaskSchema),
    });

    return this.apiCall("", TasksResponseSchema, { params }).pipe(
      map((response) => response.data)
    );
  }

  // タスク作成
  createTask(taskData: CreateTask): Observable<Task> {
    const validatedData = CreateTaskSchema.parse(taskData);

    const TaskResponseSchema = z.object({
      success: z.boolean(),
      data: TaskSchema,
    });

    return this.http.post(this.baseUrl, validatedData).pipe(
      map((response) => {
        const result = TaskResponseSchema.safeParse(response);
        if (result.success) {
          return result.data.data;
        } else {
          throw new Error(
            `Task creation response validation failed: ${result.error.message}`
          );
        }
      }),
      catchError(this.handleError)
    );
  }

  // タスク更新
  updateTask(id: string, taskData: UpdateTask): Observable<Task> {
    const validatedData = UpdateTaskSchema.parse(taskData);

    const TaskResponseSchema = z.object({
      success: z.boolean(),
      data: TaskSchema,
    });

    return this.http.put(`${this.baseUrl}/${id}`, validatedData).pipe(
      map((response) => {
        const result = TaskResponseSchema.safeParse(response);
        if (result.success) {
          return result.data.data;
        } else {
          throw new Error(
            `Task update response validation failed: ${result.error.message}`
          );
        }
      }),
      catchError(this.handleError)
    );
  }

  // タスク削除
  deleteTask(id: string): Observable<void> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "Unknown error occurred";

    if (error.error instanceof ErrorEvent) {
      // クライアントサイドエラー
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // サーバーサイドエラー
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

#### 4. タスク管理コンポーネント

```typescript
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { zodValidator } from "./validators/zod-validator";

@Component({
  selector: "app-task-manager",
  template: `
    <div class="task-manager">
      <header class="header">
        <h1>タスク管理</h1>
        <button class="create-button" (click)="openCreateDialog()">
          新しいタスクを作成
        </button>
      </header>

      <div class="filters">
        <select [(ngModel)]="statusFilter" (change)="applyFilters()">
          <option value="">すべてのステータス</option>
          <option value="todo">未着手</option>
          <option value="in-progress">進行中</option>
          <option value="done">完了</option>
        </select>

        <select [(ngModel)]="priorityFilter" (change)="applyFilters()">
          <option value="">すべての優先度</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>

      <div class="task-board">
        <div class="column" *ngFor="let status of statuses">
          <h3 class="column-header">{{ getStatusLabel(status) }}</h3>
          <div class="task-list">
            <div
              *ngFor="let task of getTasksByStatus(status)"
              class="task-card"
              [class.high-priority]="task.priority === 'high'"
              [class.medium-priority]="task.priority === 'medium'"
              [class.low-priority]="task.priority === 'low'"
            >
              <h4>{{ task.title }}</h4>
              <p *ngIf="task.description">{{ task.description }}</p>

              <div class="task-meta">
                <span class="priority" [class]="task.priority">
                  {{ getPriorityLabel(task.priority) }}
                </span>
                <span *ngIf="task.dueDate" class="due-date">
                  期限: {{ task.dueDate | date : "short" }}
                </span>
              </div>

              <div class="tags" *ngIf="task.tags.length > 0">
                <span *ngFor="let tag of task.tags" class="tag">{{ tag }}</span>
              </div>

              <div class="task-actions">
                <button (click)="editTask(task)">編集</button>
                <button (click)="deleteTask(task.id)">削除</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- タスクフォームモーダル -->
      <div *ngIf="showTaskForm" class="modal-overlay" (click)="closeTaskForm()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h3>{{ editingTask ? "タスクを編集" : "新しいタスクを作成" }}</h3>

          <form [formGroup]="taskForm" (ngSubmit)="submitTask()">
            <div class="form-group">
              <label for="title">タイトル *</label>
              <input id="title" formControlName="title" type="text" />
              <div *ngIf="getFieldError('title')" class="error">
                {{ getFieldError("title") }}
              </div>
            </div>

            <div class="form-group">
              <label for="description">説明</label>
              <textarea
                id="description"
                formControlName="description"
                rows="3"
              ></textarea>
              <div *ngIf="getFieldError('description')" class="error">
                {{ getFieldError("description") }}
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="status">ステータス</label>
                <select id="status" formControlName="status">
                  <option value="todo">未着手</option>
                  <option value="in-progress">進行中</option>
                  <option value="done">完了</option>
                </select>
              </div>

              <div class="form-group">
                <label for="priority">優先度</label>
                <select id="priority" formControlName="priority">
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="dueDate">期限</label>
              <input
                id="dueDate"
                formControlName="dueDate"
                type="datetime-local"
              />
              <div *ngIf="getFieldError('dueDate')" class="error">
                {{ getFieldError("dueDate") }}
              </div>
            </div>

            <div class="form-group">
              <label for="tags">タグ (カンマ区切り)</label>
              <input
                id="tags"
                formControlName="tagsInput"
                type="text"
                placeholder="例: 重要, 緊急, レビュー"
              />
              <div *ngIf="getFieldError('tags')" class="error">
                {{ getFieldError("tags") }}
              </div>
            </div>

            <div class="form-actions">
              <button type="button" (click)="closeTaskForm()">
                キャンセル
              </button>
              <button type="submit" [disabled]="taskForm.invalid">
                {{ editingTask ? "更新" : "作成" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .task-manager {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .create-button {
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
      }

      .filters {
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
      }

      .filters select {
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      .task-board {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }

      .column {
        background-color: #f5f5f5;
        border-radius: 8px;
        padding: 16px;
        min-height: 500px;
      }

      .column-header {
        text-align: center;
        margin: 0 0 16px 0;
        padding: 8px;
        background-color: white;
        border-radius: 4px;
      }

      .task-card {
        background-color: white;
        border-radius: 6px;
        padding: 16px;
        margin-bottom: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #e0e0e0;
      }

      .task-card.high-priority {
        border-left-color: #f44336;
      }

      .task-card.medium-priority {
        border-left-color: #ff9800;
      }

      .task-card.low-priority {
        border-left-color: #4caf50;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal-content {
        background-color: white;
        border-radius: 8px;
        padding: 24px;
        width: 500px;
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .form-group label {
        display: block;
        margin-bottom: 4px;
        font-weight: bold;
      }

      .form-group input,
      .form-group select,
      .form-group textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      .error {
        color: red;
        font-size: 12px;
        margin-top: 4px;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
      }

      .form-actions button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      .form-actions button[type="button"] {
        background-color: #ccc;
        color: black;
      }

      .form-actions button[type="submit"] {
        background-color: #4caf50;
        color: white;
      }

      .form-actions button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
    `,
  ],
})
export class TaskManagerComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  statusFilter = "";
  priorityFilter = "";
  showTaskForm = false;
  editingTask: Task | null = null;
  taskForm: FormGroup;

  readonly statuses: Task["status"][] = ["todo", "in-progress", "done"];

  constructor(private taskService: TaskService, private fb: FormBuilder) {
    this.taskForm = this.createTaskForm();
  }

  ngOnInit() {
    this.loadTasks();
  }

  private createTaskForm(): FormGroup {
    return this.fb.group({
      title: [
        "",
        [Validators.required, zodValidator(CreateTaskSchema.shape.title)],
      ],
      description: ["", [zodValidator(CreateTaskSchema.shape.description)]],
      status: ["todo"],
      priority: ["medium"],
      dueDate: [""],
      tagsInput: [""], // カンマ区切りの文字列入力用
    });
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
      },
      error: (error) => {
        console.error("Failed to load tasks:", error);
      },
    });
  }

  applyFilters() {
    this.filteredTasks = this.tasks.filter((task) => {
      const statusMatch =
        !this.statusFilter || task.status === this.statusFilter;
      const priorityMatch =
        !this.priorityFilter || task.priority === this.priorityFilter;
      return statusMatch && priorityMatch;
    });
  }

  getTasksByStatus(status: Task["status"]): Task[] {
    return this.filteredTasks.filter((task) => task.status === status);
  }

  getStatusLabel(status: Task["status"]): string {
    const labels = {
      todo: "未着手",
      "in-progress": "進行中",
      done: "完了",
    };
    return labels[status];
  }

  getPriorityLabel(priority: Task["priority"]): string {
    const labels = {
      high: "高",
      medium: "中",
      low: "低",
    };
    return labels[priority];
  }

  openCreateDialog() {
    this.editingTask = null;
    this.taskForm.reset({
      status: "todo",
      priority: "medium",
    });
    this.showTaskForm = true;
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 16) : "",
      tagsInput: task.tags.join(", "),
    });
    this.showTaskForm = true;
  }

  closeTaskForm() {
    this.showTaskForm = false;
    this.editingTask = null;
    this.taskForm.reset();
  }

  submitTask() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;

      // タグを文字列から配列に変換
      const tags = formValue.tagsInput
        ? formValue.tagsInput
            .split(",")
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag)
        : [];

      const taskData = {
        title: formValue.title,
        description: formValue.description || undefined,
        status: formValue.status,
        priority: formValue.priority,
        dueDate: formValue.dueDate
          ? new Date(formValue.dueDate).toISOString()
          : undefined,
        tags: tags,
      };

      if (this.editingTask) {
        // 更新
        this.taskService.updateTask(this.editingTask.id, taskData).subscribe({
          next: () => {
            this.loadTasks();
            this.closeTaskForm();
          },
          error: (error) => {
            console.error("Failed to update task:", error);
          },
        });
      } else {
        // 作成
        this.taskService.createTask(taskData as CreateTask).subscribe({
          next: () => {
            this.loadTasks();
            this.closeTaskForm();
          },
          error: (error) => {
            console.error("Failed to create task:", error);
          },
        });
      }
    }
  }

  deleteTask(taskId: string) {
    if (confirm("このタスクを削除しますか？")) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error("Failed to delete task:", error);
        },
      });
    }
  }

  getFieldError(fieldName: string): string | null {
    const field = this.taskForm.get(fieldName);
    if (field && field.errors && field.touched) {
      for (const errorKey in field.errors) {
        if (field.errors[errorKey]?.message) {
          return field.errors[errorKey].message;
        }
      }
      if (field.errors["required"]) {
        return `この項目は必須です`;
      }
    }
    return null;
  }
}
```

### 実装のヒント

1. **段階的統合**: 一つずつ機能を統合し、動作確認を行う
2. **エラーハンドリング**: Zod のバリデーションエラーを適切に Angular の形式に変換
3. **型安全性**: z.infer を活用して TypeScript の型と統合
4. **ユーザビリティ**: 分かりやすいエラーメッセージと UI 設計

### 追加チャレンジ課題（時間に余裕がある場合）

- [ ] ドラッグ&ドロップによるタスクのステータス変更
- [ ] タスクの検索機能（タイトル・説明での部分一致検索）
- [ ] タスクのアーカイブ機能
- [ ] 担当者管理機能

---

## 📊 Step07 総合評価

### 最終評価基準

#### Zod 基礎理解（35%）

- [ ] **スキーマ定義**: 基本的なスキーマとバリデーションルールの作成
- [ ] **型推論**: z.infer を使った型の自動生成と活用
- [ ] **エラーハンドリング**: safeParse()と parse()の適切な使い分け

#### 高度なバリデーション（25%）

- [ ] **カスタムバリデーション**: refine()と superRefine()の実装
- [ ] **複雑なスキーマ**: ネストしたオブジェクトと配列の処理
- [ ] **データ変換**: transform()を使ったデータ正規化

#### Angular 統合（20%）

- [ ] **Reactive Forms**: zodValidator の実装と使用
- [ ] **HTTP 通信**: 型安全な API 通信の実装
- [ ] **動的フォーム**: 設定ベースのフォーム生成

#### 実装品質（20%）

- [ ] **TypeScript 活用**: 型安全性が確保されている
- [ ] **エラーハンドリング**: 適切な例外処理が実装されている
- [ ] **コード品質**: 可読性・保守性の高いコードが書かれている

---

## 成果物

学習の集大成として、実際に動作する Zod を活用した Angular アプリケーションを構築することで実践的なスキルを身につけます。

---

## 🔄 Step08 への準備

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

- Zod の基本概念と実行時型安全性
- スキーマ定義とバリデーション実行
- カスタムバリデーションルールの作成
- Angular Reactive Forms との統合
- 型安全な API 通信の実装

**Zod の利点を実感できたポイント**:

- **実行時型安全性**: API レスポンスやフォーム入力の安全な処理
- **型推論**: スキーマから型の自動生成により開発効率向上
- **バリデーション**: 複雑なビジネスルールの実装が容易
- **統合性**: Angular など既存フレームワークとの親和性

**次のステップ**:

- 外部ライブラリとの統合
- 型定義ファイルの作成と活用
- より大規模なプロジェクトでの設計パターン

---

**🎉 お疲れ様でした！** Step07 を通じて Zod の活用方法をしっかりと身につけることができました。

**🚀 次の Step08 では、外部ライブラリとの統合と型定義について学習します！**

---

## 📋 Session3 & Step07 完了チェックリスト

学習を完了する前に、以下の項目をすべてチェックしてください：

### 💡 統合概念理解

- [ ] Angular Reactive Forms と Zod の統合原理を理解している
- [ ] `ValidatorFn` インターフェースと Zod の関係を説明できる
- [ ] 型安全な HTTP 通信の仕組みを理解している
- [ ] フロントエンドでの実行時型安全性の価値を実感できている

### 💻 実装スキル

- [ ] `zodValidator()` 関数を実装し、Angular フォームで使用できる
- [ ] 型安全な API サービスクラスを設計・実装できる
- [ ] エラーメッセージの適切な表示とハンドリングができる
- [ ] 複雑なフォームバリデーションを Zod で統一管理できる

### 🔧 アプリケーション開発能力

- [ ] CRUD 操作を含む完全なアプリケーションを構築できる
- [ ] ユーザーフレンドリーな UI とバリデーションを実装できる
- [ ] 動的フォーム生成の仕組みを理解し活用できる
- [ ] エラーハンドリングとユーザビリティを両立できる

### 🧪 実践確認

- [ ] タスク管理アプリケーションを完成させた
- [ ] すべての機能が期待通りに動作することを確認した
- [ ] エラーケースでの動作を詳細にテストした
- [ ] コードの品質と保守性を検証した

### 📚 総合的な理解

- [ ] Zod を使用する利点を具体的に説明できる
- [ ] 実際のプロジェクトでの導入方法を理解している
- [ ] 他のバリデーションライブラリとの比較ができる
- [ ] 次のステップ（外部ライブラリ統合）への準備ができている

### 🎯 実務応用力

- [ ] 既存プロジェクトへの Zod 導入計画を立てられる
- [ ] チーム開発での Zod 活用方法を提案できる
- [ ] パフォーマンスとユーザビリティのバランスを考慮できる
- [ ] 継続的な学習と改善の方向性を理解している

**🎉 すべてチェックできましたか？**

**✅ 完了した方へ**: おめでとうございます！Zod を活用した型安全な開発スキルを身につけました。次の Step08 でさらなる成長を目指しましょう。

**⚠️ チェックできない項目がある方へ**: 該当する学習内容を再度確認し、補足資料や実際のコーディングを通じて理解を深めてください。完全に理解できてから次に進むことが重要です。

---

## 🔄 継続学習のヒント

**今後の学習方向性**:

1. **実プロジェクトでの活用**: 学んだスキルを実際のプロジェクトで活用してみましょう
2. **他のライブラリとの組み合わせ**: React Hook Form、Formik 等との統合も学習価値があります
3. **パフォーマンス最適化**: 大規模なスキーマでのパフォーマンス考慮事項を学びましょう
4. **コミュニティ参加**: Zod の最新動向やベストプラクティスを追跡しましょう
