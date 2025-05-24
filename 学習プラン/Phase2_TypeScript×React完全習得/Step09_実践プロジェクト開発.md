# Step 9: 実践プロジェクト開発

## 📅 学習期間・目標

**期間**: Step 9
**総学習時間**: 7 時間
**学習スタイル**: プロジェクト開発 80% + 理論補完 20%

### 🎯 Step 9 到達目標

- [ ] タスク管理アプリケーションの設計・実装
- [ ] 学習した技術の統合活用
- [ ] プロダクションレベルの品質確保
- [ ] テスト実装と CI/CD 構築
- [ ] ユーザビリティとアクセシビリティの実装

## 📚 プロジェクト概要

### 🎯 プロジェクト: 高機能タスク管理アプリ「TaskFlow」

#### 技術スタック

```typescript
interface TechStack {
  frontend: {
    framework: "React 19";
    language: "TypeScript 5.x";
    bundler: "Vite";
    stateManagement: "Zustand + TanStack Query";
    styling: "Tailwind CSS + CSS Modules";
    testing: "Vitest + Testing Library";
    e2e: "Playwright";
  };
  features: {
    authentication: "JWT + Refresh Tokens";
    realtime: "WebSocket";
    storage: "IndexedDB + LocalStorage";
    fileUpload: "Drag & Drop + Progress";
    notifications: "Push Notifications";
    accessibility: "WCAG 2.1 AA";
  };
}
```

#### 機能要件

```typescript
// 1. 認証・ユーザー管理
interface AuthFeatures {
  userRegistration: boolean;
  emailVerification: boolean;
  passwordReset: boolean;
  profileManagement: boolean;
  sessionManagement: boolean;
}

// 2. タスク管理
interface TaskFeatures {
  taskCreation: boolean;
  taskEditing: boolean;
  statusManagement: boolean;
  priorityManagement: boolean;
  dueDateManagement: boolean;
  subtasks: boolean;
  taskComments: boolean;
  fileAttachments: boolean;
  taskSearch: boolean;
  taskFiltering: boolean;
}

// 3. プロジェクト管理
interface ProjectFeatures {
  projectCreation: boolean;
  memberInvitation: boolean;
  roleManagement: boolean;
  projectDashboard: boolean;
  progressTracking: boolean;
}

// 4. リアルタイム機能
interface RealTimeFeatures {
  liveUpdates: boolean;
  notifications: boolean;
  activityFeed: boolean;
  onlineStatus: boolean;
  collaborativeEditing: boolean;
}
```

## 📖 実装内容

### Day 59-61: プロジェクト設計・基盤構築

#### 🎯 アーキテクチャ設計

```typescript
// 1. ドメインモデルの定義
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "member";
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  notifications: NotificationSettings;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  taskAssigned: boolean;
  taskCompleted: boolean;
  projectUpdates: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  ownerId: string;
  members: ProjectMember[];
  tasks: Task[];
  status: "active" | "archived" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectMember {
  userId: string;
  role: "owner" | "admin" | "member" | "viewer";
  joinedAt: Date;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  creatorId: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
  parentTaskId?: string;
  subtasks: Task[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskAttachment {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
}

// 2. 状態管理アーキテクチャ
interface AppStore {
  // UI状態
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  currentProject: string | null;

  // UI Actions
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleSidebar: () => void;
  setCurrentProject: (projectId: string | null) => void;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;

  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}
```

#### 🔧 コンポーネント設計

```typescript
// 3. レイアウトコンポーネント
interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps): JSX.Element {
  const { user } = useAuthStore();
  const { theme, sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <div className={`app-layout theme-${theme}`}>
      <Header user={user} onToggleSidebar={toggleSidebar} />
      <div className="app-content">
        <Sidebar isOpen={sidebarOpen} />
        <main className="main-content">{children}</main>
      </div>
      <NotificationCenter />
    </div>
  );
}

// 4. タスクボード（ドラッグ&ドロップ対応）
interface TaskBoardProps {
  projectId: string;
}

function TaskBoard({ projectId }: TaskBoardProps): JSX.Element {
  const { data: tasks = [] } = useTasks(projectId);
  const updateTaskMutation = useUpdateTask();

  const tasksByStatus = React.useMemo(() => {
    return {
      todo: tasks.filter((task) => task.status === "todo"),
      in_progress: tasks.filter((task) => task.status === "in_progress"),
      review: tasks.filter((task) => task.status === "review"),
      done: tasks.filter((task) => task.status === "done"),
    };
  }, [tasks]);

  const handleTaskMove = React.useCallback(
    async (taskId: string, newStatus: Task["status"]) => {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        data: { status: newStatus },
      });
    },
    [updateTaskMutation]
  );

  return (
    <div className="task-board">
      {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
        <TaskColumn
          key={status}
          status={status as Task["status"]}
          tasks={statusTasks}
          onTaskMove={handleTaskMove}
        />
      ))}
    </div>
  );
}

// 5. タスク詳細モーダル
interface TaskDetailModalProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

function TaskDetailModal({
  taskId,
  isOpen,
  onClose,
}: TaskDetailModalProps): JSX.Element {
  const { data: task } = useTask(taskId);
  const updateTaskMutation = useUpdateTask();
  const addCommentMutation = useAddComment();

  const [isEditing, setIsEditing] = React.useState(false);
  const [comment, setComment] = React.useState("");

  if (!isOpen || !task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="task-detail">
        <TaskDetailHeader
          task={task}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={(data) =>
            updateTaskMutation.mutateAsync({ id: taskId, data })
          }
          onCancel={() => setIsEditing(false)}
        />

        <div className="task-detail-content">
          <div className="task-main">
            <TaskDescription task={task} isEditing={isEditing} />
            <TaskSubtasks task={task} />
            <TaskAttachments task={task} />
          </div>

          <div className="task-sidebar">
            <TaskAssignment task={task} />
            <TaskPriority task={task} />
            <TaskDueDate task={task} />
            <TaskStatus task={task} />
          </div>
        </div>

        <div className="task-comments">
          <TaskComments comments={task.comments} />
          <CommentInput
            value={comment}
            onChange={setComment}
            onSubmit={() =>
              addCommentMutation.mutateAsync({ taskId, content: comment })
            }
          />
        </div>
      </div>
    </Modal>
  );
}
```

### Day 62-64: 高度な機能実装

#### 🎯 リアルタイム機能とファイル管理

```typescript
// 6. WebSocket統合
interface SocketEvents {
  "task:created": Task;
  "task:updated": Task;
  "task:deleted": { id: string };
  "comment:added": TaskComment;
  "user:online": { userId: string };
  "user:offline": { userId: string };
  "project:updated": Project;
}

function useSocket() {
  const { user } = useAuthStore();
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;

    const newSocket = io(process.env.VITE_SOCKET_URL!, {
      auth: { token: localStorage.getItem("accessToken") },
    });

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));

    setSocket(newSocket);

    return () => newSocket.close();
  }, [user]);

  return { socket, isConnected };
}

// 7. ファイルアップロード
interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

function FileUpload({
  onUpload,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024,
}: FileUploadProps): JSX.Element {
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<
    Record<string, number>
  >({});
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrop = React.useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter((file) => {
        if (maxSize && file.size > maxSize) {
          console.error(`File ${file.name} is too large`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        await onUpload(validFiles);
      }
    },
    [onUpload, maxSize]
  );

  const handleFileSelect = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        await onUpload(files);
      }
    },
    [onUpload]
  );

  return (
    <div
      className={`file-upload ${isDragging ? "dragging" : ""}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      <div className="upload-content">
        <div className="upload-icon">📁</div>
        <p>ファイルをドラッグ&ドロップまたはクリックして選択</p>
        <p className="upload-hint">
          最大サイズ: {Math.round(maxSize / 1024 / 1024)}MB
        </p>
      </div>
    </div>
  );
}

// 8. 通知システム
interface NotificationCenterProps {}

function NotificationCenter(): JSX.Element {
  const { notifications, markAsRead, removeNotification } =
    useNotificationStore();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="notification-center">
      <button
        className="notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔
        {notifications.filter((n) => !n.read).length > 0 && (
          <span className="notification-badge">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>通知</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="notification-list">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => markAsRead(notification.id)}
                onRemove={() => removeNotification(notification.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Day 65: テスト実装と CI/CD

#### 🎯 テスト戦略と CI/CD 構築

```typescript
// 9. コンポーネントテスト
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaskBoard } from "../TaskBoard";

describe("TaskBoard", () => {
  it("should render tasks by status", async () => {
    const mockTasks = [
      { id: "1", title: "Task 1", status: "todo" },
      { id: "2", title: "Task 2", status: "in_progress" },
    ];

    render(<TaskBoard projectId="project-1" />);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });
  });

  it("should handle task status update", async () => {
    const mockUpdateTask = vi.fn();

    render(<TaskBoard projectId="project-1" />);

    // ドラッグ&ドロップのテスト
    const taskElement = screen.getByText("Task 1");
    fireEvent.dragStart(taskElement);

    const inProgressColumn = screen.getByTestId("column-in_progress");
    fireEvent.drop(inProgressColumn);

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith({
        id: "1",
        data: { status: "in_progress" },
      });
    });
  });
});

// 10. E2Eテスト
import { test, expect } from "@playwright/test";

test.describe("TaskFlow App", () => {
  test("should complete task workflow", async ({ page }) => {
    // ログイン
    await page.goto("/login");
    await page.fill('[data-testid="email"]', "test@example.com");
    await page.fill('[data-testid="password"]', "password");
    await page.click('[data-testid="login-button"]');

    // プロジェクト選択
    await page.waitForSelector('[data-testid="project-list"]');
    await page.click('[data-testid="project-1"]');

    // タスク作成
    await page.click('[data-testid="add-task-button"]');
    await page.fill('[data-testid="task-title"]', "New Task");
    await page.fill('[data-testid="task-description"]', "Task description");
    await page.click('[data-testid="save-task-button"]');

    // タスクが作成されたことを確認
    await expect(page.locator('[data-testid="task-item"]')).toContainText(
      "New Task"
    );

    // タスクステータス更新
    await page.dragAndDrop(
      '[data-testid="task-item"]',
      '[data-testid="column-in_progress"]'
    );

    // ステータスが更新されたことを確認
    await expect(
      page.locator(
        '[data-testid="column-in_progress"] [data-testid="task-item"]'
      )
    ).toContainText("New Task");
  });
});
```

## 🎯 実践演習

### 演習 9-1: 機能拡張実装 🔰

```typescript
// 以下の要件を満たす機能拡張を実装せよ

// 1. タイムトラッキング機能
interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  description?: string;
}

// 要件:
// - タスクの作業時間記録
// - 自動・手動タイマー
// - 時間レポート生成
// - 工数見積もりとの比較

// 2. カンバンボードカスタマイズ
interface BoardCustomization {
  columns: BoardColumn[];
  swimlanes?: Swimlane[];
  filters: BoardFilter[];
  grouping: "none" | "assignee" | "priority" | "tag";
}

// 要件:
// - カスタムステータス列
// - スイムレーン表示
// - 高度なフィルタリング
// - グループ化機能
```

### 演習 9-2: パフォーマンス最適化 🔶

```typescript
// 以下の要件を満たすパフォーマンス最適化を実装せよ

// 1. 大量タスクの効率的表示
// 要件:
// - 仮想化リスト
// - 無限スクロール
// - 検索・フィルタリングの最適化
// - メモ化戦略

// 2. リアルタイム更新の最適化
// 要件:
// - WebSocket接続管理
// - 差分更新
// - バッチ処理
// - オフライン対応
```

## 📊 Step 9 評価基準

### 実装品質 (40%)

- [ ] 全機能が正常に動作する
- [ ] 型安全性が完全に確保されている
- [ ] エラーハンドリングが適切に実装されている
- [ ] パフォーマンスが最適化されている

### 設計品質 (30%)

- [ ] アーキテクチャが適切に設計されている
- [ ] コンポーネントが再利用可能である
- [ ] 状態管理が効率的である
- [ ] コードが保守性を考慮している

### ユーザー体験 (20%)

- [ ] UI/UX が直感的である
- [ ] レスポンシブデザインが実装されている
- [ ] アクセシビリティが考慮されている
- [ ] パフォーマンスが良好である

### 品質管理 (10%)

- [ ] テストが適切に実装されている
- [ ] CI/CD が設定されている
- [ ] ドキュメントが充実している
- [ ] セキュリティが考慮されている

### 成果物チェックリスト

- [ ] **タスク管理アプリ**: 完全に動作するプロダクション品質のアプリ
- [ ] **テストスイート**: 単体・統合・E2E テスト
- [ ] **CI/CD パイプライン**: 自動化されたビルド・テスト・デプロイ
- [ ] **ドキュメント**: 設計書・API 仕様・ユーザーガイド

## 🔄 Step 10 への準備

### 次週学習内容の予習

```typescript
// Step 10で学習するプロジェクト完成・デプロイの基礎概念

// 1. デプロイメント戦略
interface DeploymentStrategy {
  hosting: "Vercel" | "Netlify" | "AWS";
  cicd: "GitHub Actions" | "GitLab CI";
  monitoring: "Sentry" | "LogRocket";
  analytics: "Google Analytics" | "Mixpanel";
}

// 2. ポートフォリオ準備
interface PortfolioContent {
  projectDescription: string;
  technicalHighlights: string[];
  challenges: string[];
  solutions: string[];
  results: string[];
}
```

---

**📌 重要**: Step 9 は学習した全ての技術を統合し、実用的なアプリケーションを完成させる重要な期間です。プロダクション品質を目指して丁寧に実装してください。
