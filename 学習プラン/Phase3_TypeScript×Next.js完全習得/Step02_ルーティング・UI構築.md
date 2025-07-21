# Step 2: ルーティング・UI 構築

## 📅 学習期間・目標

**期間**: Step 2
**総学習時間**: 6 時間
**学習スタイル**: 高度ルーティング 40% + UI 構築 40% + フォーム処理 20%

### 🎯 Step 2 到達目標

- [ ] 高度なルーティングパターンの実装
- [ ] shadcn/ui 統合とモダン UI 構築
- [ ] 型安全なフォーム処理システム
- [ ] インタラクティブなコンポーネント設計
- [ ] レスポンシブデザインの完全実装

## 📚 理論学習内容

### Day 8-10: 高度なルーティングパターン

#### 🎯 動的ルーティングの応用

```tsx
// 1. Catch-all Routes（キャッチオールルート）
// app/docs/[...slug]/page.tsx
interface DocsPageProps {
  params: {
    slug: string[];
  };
}

export default async function DocsPage({
  params,
}: DocsPageProps): Promise<JSX.Element> {
  const { slug } = params;

  // slug配列から階層構造を構築
  const breadcrumbs = slug.map((segment, index) => ({
    name: segment.replace("-", " "),
    href: `/docs/${slug.slice(0, index + 1).join("/")}`,
    current: index === slug.length - 1,
  }));

  // ドキュメントデータの取得
  const docContent = await fetchDocContent(slug.join("/"));

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* パンくずナビゲーション */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
          <li>
            <Link href="/docs" className="text-gray-400 hover:text-gray-500">
              Docs
            </Link>
          </li>
          {breadcrumbs.map((crumb) => (
            <li key={crumb.href}>
              <div className="flex items-center">
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                <Link
                  href={crumb.href}
                  className={`ml-4 text-sm font-medium ${
                    crumb.current
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {crumb.name}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {/* ドキュメントコンテンツ */}
      <article className="prose prose-lg max-w-none">
        <h1>{docContent.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: docContent.content }} />
      </article>
    </div>
  );
}

// 2. Optional Catch-all Routes
// app/shop/[[...category]]/page.tsx
interface ShopPageProps {
  params: {
    category?: string[];
  };
  searchParams: {
    sort?: string;
    filter?: string;
    page?: string;
  };
}

export default async function ShopPage({
  params,
  searchParams,
}: ShopPageProps): Promise<JSX.Element> {
  const { category = [] } = params;
  const { sort = "name", filter, page = "1" } = searchParams;

  // カテゴリパスの構築
  const categoryPath = category.length > 0 ? category.join("/") : null;

  // 商品データの取得
  const products = await fetchProducts({
    category: categoryPath,
    sort,
    filter,
    page: parseInt(page),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* サイドバー（カテゴリフィルター） */}
        <aside className="w-full lg:w-64">
          <CategoryFilter currentCategory={categoryPath} />
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {categoryPath ? `Category: ${categoryPath}` : "All Products"}
            </h1>
            <SortDropdown currentSort={sort} />
          </div>

          <ProductGrid products={products} />

          <Pagination
            currentPage={parseInt(page)}
            totalPages={products.totalPages}
            baseUrl={`/shop${categoryPath ? `/${categoryPath}` : ""}`}
          />
        </main>
      </div>
    </div>
  );
}

// 3. Parallel Routes（並列ルート）
// app/dashboard/@analytics/page.tsx
export default async function AnalyticsSlot(): Promise<JSX.Element> {
  const analyticsData = await fetchAnalytics();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Analytics</h2>
      <AnalyticsChart data={analyticsData} />
    </div>
  );
}

// app/dashboard/@notifications/page.tsx
export default async function NotificationsSlot(): Promise<JSX.Element> {
  const notifications = await fetchNotifications();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      <NotificationList notifications={notifications} />
    </div>
  );
}

// app/dashboard/layout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
  analytics: React.ReactNode;
  notifications: React.ReactNode;
}

export default function DashboardLayout({
  children,
  analytics,
  notifications,
}: DashboardLayoutProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">{children}</div>
      <div className="space-y-6">
        {analytics}
        {notifications}
      </div>
    </div>
  );
}
```

#### 🎯 Intercepting Routes（インターセプトルート）

```typescript
// 4. Modal Intercepting Routes
// app/photos/[id]/page.tsx（通常のページ）
interface PhotoPageProps {
  params: { id: string };
}

export default async function PhotoPage({
  params,
}: PhotoPageProps): Promise<JSX.Element> {
  const photo = await fetchPhoto(params.id);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={photo.url}
          alt={photo.title}
          className="w-full h-96 object-cover"
        />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {photo.title}
          </h1>
          <p className="text-gray-600 mb-4">{photo.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              By {photo.author} •{" "}
              {new Date(photo.createdAt).toLocaleDateString()}
            </span>
            <div className="flex space-x-2">
              <Button variant="outline">Download</Button>
              <Button>Like</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// app/photos/(.)photo/[id]/page.tsx（モーダル版）
("use client");

import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";

interface PhotoModalProps {
  params: { id: string };
}

export default function PhotoModal({ params }: PhotoModalProps): JSX.Element {
  const router = useRouter();
  const [photo, setPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    fetchPhoto(params.id).then(setPhoto);
  }, [params.id]);

  if (!photo) {
    return <div>Loading...</div>;
  }

  return (
    <Modal isOpen={true} onClose={() => router.back()} size="large">
      <div className="relative">
        <img
          src={photo.url}
          alt={photo.title}
          className="w-full max-h-[80vh] object-contain"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <h2 className="text-xl font-bold text-white mb-2">{photo.title}</h2>
          <p className="text-gray-200">{photo.description}</p>
        </div>
      </div>
    </Modal>
  );
}
```

### Day 11-12: shadcn/ui 統合とモダン UI

#### 🎯 shadcn/ui セットアップと基本コンポーネント

```bash
# 1. shadcn/ui初期化
npx shadcn-ui@latest init

# 2. 基本コンポーネントのインストール
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
```

```typescript
// 3. カスタムコンポーネントの作成
// components/ui/data-table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], record: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  pagination?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = false,
  pagination = false,
}: DataTableProps<T>): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>(null);

  // フィルタリング
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // ソート
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key: keyof T) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.key)}
                      className="h-auto p-0 font-semibold"
                    >
                      {column.title}
                      {sortConfig?.key === column.key && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </Button>
                  ) : (
                    column.title
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// 4. ダッシュボードカードコンポーネント
// components/dashboard/stats-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: React.ReactNode;
  description?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  description,
}: StatsCardProps): JSX.Element {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Badge
              variant={change.type === "increase" ? "default" : "destructive"}
              className="text-xs"
            >
              {change.type === "increase" ? "+" : "-"}
              {Math.abs(change.value)}%
            </Badge>
            <span>from last month</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
```

### Day 13-14: 型安全なフォーム処理

#### 🎯 React Hook Form + Zod 統合

```typescript
// 5. フォームスキーマ定義
// lib/validations/user.ts
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z
    .number()
    .min(18, "Must be at least 18 years old")
    .max(120, "Invalid age"),
  role: z.enum(["admin", "user", "moderator"]),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  preferences: z.object({
    newsletter: z.boolean(),
    notifications: z.boolean(),
    theme: z.enum(["light", "dark", "system"]),
  }),
});

export type UserFormData = z.infer<typeof userSchema>;

// 6. 型安全なフォームコンポーネント
// components/forms/user-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading?: boolean;
}

export function UserForm({
  initialData,
  onSubmit,
  isLoading = false,
}: UserFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      age: 18,
      role: "user",
      bio: "",
      preferences: {
        newsletter: false,
        notifications: true,
        theme: "system",
      },
      ...initialData,
    },
  });

  const watchedPreferences = watch("preferences");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 基本情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              {...register("age", { valueAsNumber: true })}
              placeholder="Enter your age"
            />
            {errors.age && (
              <p className="text-sm text-red-600">{errors.age.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => setValue("role", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            {...register("bio")}
            placeholder="Tell us about yourself"
            rows={3}
          />
          {errors.bio && (
            <p className="text-sm text-red-600">{errors.bio.message}</p>
          )}
        </div>
      </div>

      {/* 設定 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Preferences</h3>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="newsletter"
              checked={watchedPreferences.newsletter}
              onCheckedChange={(checked) =>
                setValue("preferences.newsletter", checked as boolean)
              }
            />
            <Label htmlFor="newsletter">Subscribe to newsletter</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifications"
              checked={watchedPreferences.notifications}
              onCheckedChange={(checked) =>
                setValue("preferences.notifications", checked as boolean)
              }
            />
            <Label htmlFor="notifications">Enable notifications</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Theme</Label>
          <RadioGroup
            value={watchedPreferences.theme}
            onValueChange={(value) =>
              setValue("preferences.theme", value as any)
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
```

## 🎯 実践演習

### 演習 2-1: 高度ルーティング実装 🔶

**目標**: 複雑なルーティングパターンの実装

```typescript
// 実装するルーティング構造
interface RoutingStructure {
  "/blog/[...slug]": "ブログ記事（階層対応）";
  "/shop/[[...category]]": "ショップ（カテゴリ任意）";
  "/dashboard/@analytics": "並列ルート（アナリティクス）";
  "/dashboard/@notifications": "並列ルート（通知）";
  "/photos/(.)photo/[id]": "インターセプトルート（モーダル）";
}

// 要件
interface RoutingRequirements {
  breadcrumbs: "パンくずナビゲーション";
  searchParams: "URLパラメータ処理";
  metadata: "動的メタデータ生成";
  loading: "ローディング状態管理";
  error: "エラーハンドリング";
}
```

### 演習 2-2: shadcn/ui 統合 UI 構築 🔥

**目標**: モダン UI コンポーネントシステムの構築

```typescript
// 実装するコンポーネント
interface UIComponents {
  layout: {
    AppShell: "アプリケーション全体のシェル";
    Sidebar: "ナビゲーションサイドバー";
    Header: "ヘッダーコンポーネント";
  };

  data: {
    DataTable: "高機能データテーブル";
    StatsCard: "統計カードコンポーネント";
    Chart: "チャート表示コンポーネント";
  };

  forms: {
    UserForm: "ユーザー情報フォーム";
    SearchForm: "検索フォーム";
    FilterForm: "フィルターフォーム";
  };

  feedback: {
    Toast: "トースト通知";
    Modal: "モーダルダイアログ";
    ConfirmDialog: "確認ダイアログ";
  };
}
```

### 演習 2-3: 型安全フォームシステム 💎

**目標**: 完全に型安全なフォーム処理システム

```typescript
// 実装するフォーム
interface FormSystem {
  schemas: {
    userSchema: "ユーザー情報スキーマ";
    productSchema: "商品情報スキーマ";
    settingsSchema: "設定スキーマ";
  };

  components: {
    FormField: "汎用フォームフィールド";
    FormSection: "フォームセクション";
    FormActions: "フォームアクション";
  };

  features: {
    validation: "リアルタイムバリデーション";
    persistence: "フォーム状態の永続化";
    submission: "非同期送信処理";
    reset: "フォームリセット機能";
  };
}
```

## 📊 Step 2 評価基準

### 理解度チェックリスト

#### 高度ルーティング (35%)

- [ ] Catch-all Routes を実装できる
- [ ] Parallel Routes を活用できる
- [ ] Intercepting Routes を実装できる
- [ ] 動的メタデータを生成できる

#### UI 構築 (35%)

- [ ] shadcn/ui を効果的に活用できる
- [ ] カスタムコンポーネントを設計できる
- [ ] レスポンシブデザインを実装できる
- [ ] アクセシビリティを考慮できる

#### フォーム処理 (20%)

- [ ] React Hook Form + Zod を統合できる
- [ ] 型安全なバリデーションを実装できる
- [ ] 複雑なフォーム状態を管理できる
- [ ] ユーザビリティを考慮できる

#### 実践応用 (10%)

- [ ] パフォーマンスを考慮した実装ができる
- [ ] 保守性の高いコード設計ができる
- [ ] エラーハンドリングを適切に行える
- [ ] ユーザー体験を最適化できる

### 成果物チェックリスト

- [ ] **高度ルーティング**: 5 つ以上のルーティングパターン実装
- [ ] **UI コンポーネント**: shadcn/ui 統合コンポーネントライブラリ
- [ ] **フォームシステム**: 型安全なフォーム処理システム
- [ ] **レスポンシブ UI**: モバイル対応完全実装

## 🔄 Step 3 への準備

### 次週学習内容の予習

```typescript
// Step 3で学習するSupabase統合の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. Supabaseクライアント
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 2. 認証
const { data: user, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password",
});

// 3. データベース操作
const { data, error } = await supabase
  .from("users")
  .select("*")
  .eq("id", userId);
```

### 環境準備

- [ ] Supabase アカウント作成
- [ ] Prisma の基礎学習
- [ ] PostgreSQL の基本理解
- [ ] 認証システムの概念確認

---

**📌 重要**: Step 2 では高度なルーティングとモダン UI 構築を通じて、Next.js の強力な機能を実践的に学習します。shadcn/ui との統合により、プロダクションレベルの UI システムを構築できるようになります。
