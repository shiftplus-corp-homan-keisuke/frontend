# Phase 2: Week 9-10 実践プロジェクト - TypeScript × React 総合アプリケーション開発

## 📅 学習期間・目標

**期間**: Week 9-10（2 週間）  
**総学習時間**: 40 時間（週 20 時間）

### 🎯 Week 9-10 到達目標

- [ ] 実践的なフルスタックアプリケーションの完成
- [ ] TypeScript × React の総合的な技術活用
- [ ] プロダクションレベルの品質確保
- [ ] CI/CD パイプラインの構築
- [ ] Phase 2 の学習成果の統合

## 📖 プロジェクト概要

### 🎯 プロジェクト: タスク管理・プロジェクト管理アプリケーション

#### 機能要件

```typescript
// 1. 認証・認可システム
interface AuthFeatures {
  userRegistration: boolean;
  emailVerification: boolean;
  passwordReset: boolean;
  roleBasedAccess: boolean;
  sessionManagement: boolean;
}

// 2. プロジェクト管理
interface ProjectManagement {
  projectCreation: boolean;
  memberInvitation: boolean;
  roleAssignment: boolean;
  projectSettings: boolean;
  projectArchive: boolean;
}

// 3. タスク管理
interface TaskManagement {
  taskCreation: boolean;
  taskAssignment: boolean;
  statusTracking: boolean;
  priorityManagement: boolean;
  dueDateManagement: boolean;
  subtasks: boolean;
  taskComments: boolean;
  fileAttachments: boolean;
}

// 4. リアルタイム機能
interface RealTimeFeatures {
  liveUpdates: boolean;
  notifications: boolean;
  activityFeed: boolean;
  onlineStatus: boolean;
}

// 5. データ可視化
interface DataVisualization {
  projectDashboard: boolean;
  progressCharts: boolean;
  timeTracking: boolean;
  reportGeneration: boolean;
}
```

#### 技術スタック

```typescript
interface TechStack {
  frontend: {
    framework: "React 18";
    language: "TypeScript 5.x";
    bundler: "Vite";
    stateManagement: "Zustand + TanStack Query";
    styling: "CSS Modules + Tailwind CSS";
    testing: "Vitest + Testing Library";
    e2e: "Playwright";
  };
  backend: {
    runtime: "Node.js";
    framework: "Express + TypeScript";
    database: "PostgreSQL";
    orm: "Prisma";
    authentication: "JWT + Refresh Tokens";
    realtime: "Socket.io";
  };
  infrastructure: {
    containerization: "Docker";
    cicd: "GitHub Actions";
    deployment: "Vercel + Railway";
    monitoring: "Sentry";
  };
}
```

## 📖 実装内容

### Day 57-60: プロジェクト設計・基盤構築

#### アーキテクチャ設計

```typescript
// 1. ドメインモデルの定義
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "member";
  createdAt: Date;
  updatedAt: Date;
}

interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: ProjectMember[];
  tasks: Task[];
  status: "active" | "archived" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
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

// 2. API 型定義
interface ApiEndpoints {
  // 認証
  "POST /auth/register": {
    request: { email: string; password: string; name: string };
    response: { user: User; accessToken: string; refreshToken: string };
  };
  "POST /auth/login": {
    request: { email: string; password: string };
    response: { user: User; accessToken: string; refreshToken: string };
  };
  "POST /auth/refresh": {
    request: { refreshToken: string };
    response: { accessToken: string };
  };
  "POST /auth/logout": {
    request: {};
    response: { success: boolean };
  };

  // プロジェクト
  "GET /projects": {
    request: {};
    response: { projects: Project[] };
  };
  "POST /projects": {
    request: { name: string; description: string };
    response: { project: Project };
  };
  "GET /projects/:id": {
    request: {};
    response: { project: Project };
  };
  "PUT /projects/:id": {
    request: Partial<Pick<Project, "name" | "description" | "status">>;
    response: { project: Project };
  };
  "DELETE /projects/:id": {
    request: {};
    response: { success: boolean };
  };

  // タスク
  "GET /projects/:projectId/tasks": {
    request: {};
    response: { tasks: Task[] };
  };
  "POST /projects/:projectId/tasks": {
    request: {
      title: string;
      description?: string;
      assigneeId?: string;
      priority: Task["priority"];
      dueDate?: string;
      parentTaskId?: string;
    };
    response: { task: Task };
  };
  "PUT /tasks/:id": {
    request: Partial<
      Pick<
        Task,
        | "title"
        | "description"
        | "status"
        | "priority"
        | "assigneeId"
        | "dueDate"
      >
    >;
    response: { task: Task };
  };
  "DELETE /tasks/:id": {
    request: {};
    response: { success: boolean };
  };
}
```

#### 状態管理の設計

```typescript
// 3. Zustand Store の設計
interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  createProject: (data: { name: string; description: string }) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
}

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;

  fetchTasks: (projectId: string) => Promise<void>;
  createTask: (projectId: string, data: CreateTaskData) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addComment: (taskId: string, content: string) => Promise<void>;
  uploadAttachment: (taskId: string, file: File) => Promise<void>;
}

// 4. TanStack Query の活用
const projectQueries = {
  all: ["projects"] as const,
  lists: () => [...projectQueries.all, "list"] as const,
  list: (filters: string) => [...projectQueries.lists(), { filters }] as const,
  details: () => [...projectQueries.all, "detail"] as const,
  detail: (id: string) => [...projectQueries.details(), id] as const,
};

function useProjects() {
  return useQuery({
    queryKey: projectQueries.lists(),
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
  });
}

function useProject(id: string) {
  return useQuery({
    queryKey: projectQueries.detail(id),
    queryFn: () => fetchProject(id),
    enabled: !!id,
  });
}

function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      queryClient.setQueryData<Project[]>(
        projectQueries.lists(),
        (oldProjects) =>
          oldProjects ? [...oldProjects, newProject] : [newProject]
      );
    },
  });
}
```

### Day 61-63: コンポーネント実装

#### 型安全なコンポーネント設計

```typescript
// 5. レイアウトコンポーネント
interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps): JSX.Element {
  const { user, logout } = useAuthStore();
  const { projects } = useProjectStore();

  return (
    <div className="app-layout">
      <Header user={user} onLogout={logout} />
      <div className="app-content">
        <Sidebar projects={projects} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

// 6. プロジェクトダッシュボード
interface ProjectDashboardProps {
  projectId: string;
}

function ProjectDashboard({ projectId }: ProjectDashboardProps): JSX.Element {
  const { data: project, isLoading, error } = useProject(projectId);
  const { data: tasks } = useTasks(projectId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!project) return <NotFound />;

  const taskStats = React.useMemo(() => {
    if (!tasks) return { total: 0, completed: 0, inProgress: 0, todo: 0 };

    return {
      total: tasks.length,
      completed: tasks.filter((task) => task.status === "done").length,
      inProgress: tasks.filter((task) => task.status === "in_progress").length,
      todo: tasks.filter((task) => task.status === "todo").length,
    };
  }, [tasks]);

  return (
    <div className="project-dashboard">
      <ProjectHeader project={project} />
      <ProjectStats stats={taskStats} />
      <div className="dashboard-grid">
        <TaskBoard projectId={projectId} />
        <ActivityFeed projectId={projectId} />
        <ProjectMembers members={project.members} />
      </div>
    </div>
  );
}

// 7. タスクボード（ドラッグ&ドロップ対応）
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

// 8. タスク詳細モーダル
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

  const handleSave = React.useCallback(
    async (data: Partial<Task>) => {
      await updateTaskMutation.mutateAsync({ id: taskId, data });
      setIsEditing(false);
    },
    [taskId, updateTaskMutation]
  );

  const handleAddComment = React.useCallback(async () => {
    if (comment.trim()) {
      await addCommentMutation.mutateAsync({ taskId, content: comment });
      setComment("");
    }
  }, [taskId, comment, addCommentMutation]);

  if (!isOpen || !task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="task-detail">
        <TaskDetailHeader
          task={task}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
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
            onSubmit={handleAddComment}
            loading={addCommentMutation.isPending}
          />
        </div>
      </div>
    </Modal>
  );
}
```

### Day 64-70: 高度な機能実装

#### リアルタイム機能の実装

```typescript
// 9. WebSocket 接続管理
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
      auth: {
        token: localStorage.getItem("accessToken"),
      },
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  const emit = React.useCallback(
    <K extends keyof SocketEvents>(event: K, data: SocketEvents[K]) => {
      socket?.emit(event, data);
    },
    [socket]
  );

  const on = React.useCallback(
    <K extends keyof SocketEvents>(
      event: K,
      handler: (data: SocketEvents[K]) => void
    ) => {
      socket?.on(event, handler);
      return () => socket?.off(event, handler);
    },
    [socket]
  );

  return { socket, isConnected, emit, on };
}

// 10. リアルタイム更新の統合
function useRealTimeUpdates(projectId: string) {
  const { on } = useSocket();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const unsubscribeTaskCreated = on("task:created", (task) => {
      if (task.projectId === projectId) {
        queryClient.setQueryData<Task[]>(
          taskQueries.list(projectId),
          (oldTasks) => (oldTasks ? [...oldTasks, task] : [task])
        );
      }
    });

    const unsubscribeTaskUpdated = on("task:updated", (task) => {
      if (task.projectId === projectId) {
        queryClient.setQueryData<Task[]>(
          taskQueries.list(projectId),
          (oldTasks) => oldTasks?.map((t) => (t.id === task.id ? task : t))
        );
      }
    });

    const unsubscribeTaskDeleted = on("task:deleted", ({ id }) => {
      queryClient.setQueryData<Task[]>(
        taskQueries.list(projectId),
        (oldTasks) => oldTasks?.filter((t) => t.id !== id)
      );
    });

    return () => {
      unsubscribeTaskCreated();
      unsubscribeTaskUpdated();
      unsubscribeTaskDeleted();
    };
  }, [projectId, on, queryClient]);
}

// 11. 通知システム
interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;

  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount:
          notification && !notification.read
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
      };
    });
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
```

## 🎯 実践演習

### 演習 9-1: フルスタックアプリケーション完成 💎

**目標**: 全機能を統合した完全なアプリケーション

```typescript
// 以下の要件を満たすアプリケーションを完成させよ

// 1. 認証システム
interface AuthRequirements {
  registration: boolean;
  login: boolean;
  passwordReset: boolean;
  emailVerification: boolean;
  roleBasedAccess: boolean;
  sessionManagement: boolean;
}

// 2. プロジェクト管理
interface ProjectRequirements {
  projectCRUD: boolean;
  memberManagement: boolean;
  roleAssignment: boolean;
  projectSettings: boolean;
  projectArchive: boolean;
}

// 3. タスク管理
interface TaskRequirements {
  taskCRUD: boolean;
  statusManagement: boolean;
  assignmentSystem: boolean;
  commentSystem: boolean;
  fileAttachment: boolean;
  subtaskSupport: boolean;
  dragAndDrop: boolean;
}

// 4. リアルタイム機能
interface RealTimeRequirements {
  liveUpdates: boolean;
  notifications: boolean;
  onlineStatus: boolean;
  activityFeed: boolean;
}

// 5. データ可視化
interface VisualizationRequirements {
  projectDashboard: boolean;
  taskStatistics: boolean;
  progressCharts: boolean;
  timeTracking: boolean;
}

// 実装要件:
// - 完全な型安全性
// - レスポンシブデザイン
// - アクセシビリティ対応
// - パフォーマンス最適化
// - エラーハンドリング
// - テストカバレッジ 80% 以上
```

### 演習 9-2: CI/CD パイプライン構築 🔥

**目標**: 自動化されたデプロイメントパイプライン

```yaml
# GitHub Actions ワークフロー
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Unit tests
        run: npm run test:unit

      - name: E2E tests
        run: npm run test:e2e

      - name: Build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: # デプロイスクリプト
```

## 📊 Week 9-10 評価基準

### 最終評価項目

#### 技術実装 (40%)

- [ ] 全機能が正常に動作する
- [ ] 型安全性が完全に確保されている
- [ ] パフォーマンスが最適化されている
- [ ] エラーハンドリングが適切に実装されている

#### 設計品質 (30%)

- [ ] アーキテクチャが適切に設計されている
- [ ] コンポーネントが再利用可能である
- [ ] 状態管理が効率的である
- [ ] API 設計が RESTful である

#### ユーザー体験 (20%)

- [ ] UI/UX が直感的である
- [ ] レスポンシブデザインが実装されている
- [ ] アクセシビリティが考慮されている
- [ ] パフォーマンスが良好である

#### 品質管理 (10%)

- [ ] テストカバレッジが十分である
- [ ] CI/CD が適切に設定されている
- [ ] ドキュメントが充実している
- [ ] セキュリティが考慮されている

### Phase 2 総合成果物

- [ ] **フルスタックアプリケーション**: 完全に動作するプロダクション品質のアプリ
- [ ] **コンポーネントライブラリ**: 再利用可能な UI コンポーネント集
- [ ] **カスタムフックライブラリ**: 状態管理・データフェッチ用フック
- [ ] **パフォーマンス最適化例**: 実測値による改善結果
- [ ] **CI/CD パイプライン**: 自動化されたデプロイメント環境

## 🎉 Phase 2 完了・Phase 3 準備

### Phase 2 達成確認

- [ ] 全ての週次目標達成
- [ ] 成果物の品質確認
- [ ] 自己評価の実施
- [ ] ポートフォリオ更新

### Phase 3 準備事項

- [ ] 設計手法の学習準備
- [ ] アーキテクチャパターンの調査
- [ ] 大規模開発手法の研究
- [ ] チーム開発ツールの準備

---

**🌟 Phase 2 完了おめでとうございます！**

TypeScript と React を組み合わせた実践的な開発スキルを完全に習得できました。Phase 3 では、より大規模で複雑なシステムの設計・開発手法を学んでいきます。

**📌 重要**: Phase 2 で習得した実践的な開発スキルは、Phase 3 以降の高度な設計手法学習の基盤となります。継続的な実践と改善を心がけてください。
