# Step 4: API Routes・リアルタイム

## 📅 学習期間・目標

**期間**: Step 4
**総学習時間**: 6 時間
**学習スタイル**: API Routes 50% + リアルタイム機能 30% + Edge Functions 20%

### 🎯 Step 4 到達目標

- [ ] Next.js API Routes の完全理解と実装
- [ ] Supabase Realtime の統合
- [ ] ファイルアップロード・ストレージ機能
- [ ] Edge Functions の活用
- [ ] WebSocket と Server-Sent Events の実装

## 📚 理論学習内容

### Day 22-24: Next.js API Routes

#### 🎯 API Routes 基礎と実装

```typescript
// 1. 基本的なAPI Routes
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import type { Database } from "@/types/database";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["admin", "user", "moderator"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // 認証チェック
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // クエリパラメータの取得
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // データ取得
    let query = supabase
      .from("users")
      .select("*", { count: "exact" })
      .range((page - 1) * limit, page * limit - 1);

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: users, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // 認証チェック
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // リクエストボディの検証
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // ユーザー作成
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        ...validatedData,
        id: session.user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 2. 動的ルート
// app/api/users/[id]/route.ts
interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // 認証チェック
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createUserSchema.partial().parse(body);

    const { data: user, error } = await supabase
      .from("users")
      .update(validatedData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 3. ファイルアップロード
// app/api/upload/route.ts
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // 認証チェック
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ファイル検証
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // ファイル名生成
    const fileExt = file.name.split(".").pop();
    const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

    // Supabase Storageにアップロード
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 公開URLの取得
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    return NextResponse.json({
      url: publicUrl,
      path: data.path,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

### Day 25-26: Supabase Realtime 統合

#### 🎯 リアルタイム機能の実装

```typescript
// 4. Realtimeフック
// hooks/use-realtime.ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Tables = Database["public"]["Tables"];
type TaskRow = Tables["tasks"]["Row"];

export function useRealtimeTasks(projectId: string) {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // 初期データの取得
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        setTasks(data || []);
      }
      setLoading(false);
    };

    fetchTasks();

    // リアルタイム購読
    const channel = supabase
      .channel(`tasks:project_id=eq.${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tasks",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log("Task inserted:", payload);
          setTasks((current) => [payload.new as TaskRow, ...current]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tasks",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log("Task updated:", payload);
          setTasks((current) =>
            current.map((task) =>
              task.id === payload.new.id ? (payload.new as TaskRow) : task
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "tasks",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log("Task deleted:", payload);
          setTasks((current) =>
            current.filter((task) => task.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  return { tasks, loading };
}

// 5. リアルタイム通知システム
// hooks/use-notifications.ts
interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function useRealtimeNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // 初期通知の取得
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) {
        setNotifications(data.map(mapNotification));
      }
    };

    fetchNotifications();

    // リアルタイム通知の購読
    const channel = supabase
      .channel(`notifications:user_id=eq.${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const notification = mapNotification(payload.new);
          setNotifications((current) => [notification, ...current]);

          // ブラウザ通知
          if (Notification.permission === "granted") {
            new Notification(notification.title, {
              body: notification.message,
              icon: "/icon-192x192.png",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    setNotifications((current) =>
      current.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  return { notifications, markAsRead };
}

function mapNotification(data: any): Notification {
  return {
    id: data.id,
    type: data.type,
    title: data.title,
    message: data.message,
    timestamp: new Date(data.created_at),
    read: data.read,
  };
}

// 6. プレゼンス機能（オンライン状態）
// hooks/use-presence.ts
interface PresenceState {
  user_id: string;
  username: string;
  online_at: string;
}

export function usePresence(
  roomId: string,
  user: { id: string; name: string }
) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceState[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel(`room:${roomId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState();
        const users = Object.values(presenceState).flat() as PresenceState[];
        setOnlineUsers(users);
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        console.log("New users joined:", newPresences);
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        console.log("Users left:", leftPresences);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: user.id,
            username: user.name,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, user.id, user.name]);

  return { onlineUsers };
}
```

### Day 27-28: Edge Functions 活用

#### 🎯 Supabase Edge Functions

```typescript
// 7. Edge Function例
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  template?: string;
  data?: Record<string, any>;
}

serve(async (req) => {
  try {
    // CORS対応
    if (req.method === "OPTIONS") {
      return new Response("ok", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
        },
      });
    }

    // 認証チェック
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401 }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
      });
    }

    // リクエストボディの取得
    const emailRequest: EmailRequest = await req.json();

    // メール送信処理（例：Resend API使用）
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DataFlow <noreply@dataflow.com>",
        to: emailRequest.to,
        subject: emailRequest.subject,
        html: emailRequest.html,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error("Failed to send email");
    }

    const result = await emailResponse.json();

    // ログ記録
    await supabase.from("email_logs").insert({
      user_id: user.id,
      to: emailRequest.to,
      subject: emailRequest.subject,
      status: "sent",
      external_id: result.id,
    });

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
```

## 🎯 実践演習

### 演習 4-1: API Routes 完全実装 🔶

**目標**: RESTful API の完全実装

```typescript
// 実装するAPI
interface APIEndpoints {
  "GET /api/projects": "プロジェクト一覧取得";
  "POST /api/projects": "プロジェクト作成";
  "GET /api/projects/[id]": "プロジェクト詳細取得";
  "PUT /api/projects/[id]": "プロジェクト更新";
  "DELETE /api/projects/[id]": "プロジェクト削除";
  "POST /api/upload": "ファイルアップロード";
  "GET /api/analytics": "アナリティクスデータ";
}

// 要件
interface APIRequirements {
  authentication: "認証・認可";
  validation: "入力値検証";
  errorHandling: "エラーハンドリング";
  pagination: "ページネーション";
  filtering: "フィルタリング・検索";
  rateLimit: "レート制限";
}
```

### 演習 4-2: リアルタイム機能実装 🔥

**目標**: 包括的なリアルタイム機能

```typescript
// 実装する機能
interface RealtimeFeatures {
  taskUpdates: "タスクのリアルタイム更新";
  notifications: "リアルタイム通知";
  presence: "オンライン状態表示";
  collaboration: "リアルタイム協調編集";
  chat: "リアルタイムチャット";
}

// 技術要件
interface RealtimeTech {
  supabaseRealtime: "Supabase Realtime活用";
  websockets: "WebSocket通信";
  serverSentEvents: "Server-Sent Events";
  optimisticUpdates: "楽観的更新";
}
```

## 📊 Step 4 評価基準

### 理解度チェックリスト

#### API Routes (40%)

- [ ] RESTful API を設計・実装できる
- [ ] 認証・認可を適切に実装できる
- [ ] エラーハンドリングを包括的に行える
- [ ] ファイルアップロードを実装できる

#### リアルタイム機能 (35%)

- [ ] Supabase Realtime を活用できる
- [ ] リアルタイム通知を実装できる
- [ ] プレゼンス機能を実装できる
- [ ] 楽観的更新を実装できる

#### Edge Functions (15%)

- [ ] Edge Functions を作成できる
- [ ] サーバーレス関数を設計できる
- [ ] 外部 API 統合を実装できる
- [ ] セキュリティを考慮できる

#### 実践応用 (10%)

- [ ] パフォーマンスを最適化できる
- [ ] スケーラビリティを考慮できる
- [ ] 監視・ログを実装できる
- [ ] ユーザー体験を向上できる

### 成果物チェックリスト

- [ ] **RESTful API**: 完全な CRUD API 実装
- [ ] **リアルタイム機能**: 通知・プレゼンス・協調機能
- [ ] **ファイル管理**: アップロード・ストレージシステム
- [ ] **Edge Functions**: サーバーレス関数実装

## 🔄 Step 5 への準備

### 次週学習内容の予習

```typescript
// Step 5で学習するレンダリング戦略・SEOの基礎概念

// 1. Static Site Generation
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// 2. Server-Side Rendering
export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return <PostContent post={post} />;
}

// 3. Metadata API
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
  };
}
```

---

**📌 重要**: Step 4 では Next.js のフルスタック機能を活用し、API Routes・リアルタイム機能・Edge Functions を実装します。これにより、完全なフルスタックアプリケーションの基盤が完成します。
