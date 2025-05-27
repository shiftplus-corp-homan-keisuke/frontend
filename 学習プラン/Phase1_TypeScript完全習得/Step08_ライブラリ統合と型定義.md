# Step 8: ライブラリ統合と型定義

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step08_補足_専門用語集.md) - 型定義・ライブラリ統合・モジュール解決・宣言ファイルの重要な概念と用語の詳細解説
> - 💻 [実践コード例](./Step08_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step08_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step08_補足_参考リソース.md) - 学習に役立つリンク集
> - 📋 [補足資料](./Step08_補足資料.md) - その他の重要な補足情報

## 📅 学習期間・目標

**期間**: Step 8  
**総学習時間**: 3 時間  
**学習スタイル**: 理論 30% + 実践コード 50% + 演習 20%

### 🎯 Step 8 到達目標

- [ ] 外部ライブラリの型定義の理解と活用
- [ ] d.ts ファイルの作成と管理
- [ ] DefinitelyTyped の活用方法
- [ ] 型定義の自作とカスタマイズ
- [ ] ライブラリ統合の実践的パターン

## 📚 理論学習内容

### Section 1: 型定義ファイルの基礎

#### 🔍 型定義ファイルの実践的価値

**💡 なぜ型定義・ライブラリ統合が重要なのか**

型定義ファイルは、JavaScript ライブラリとの型安全な連携を実現する TypeScript の核心機能です。型安全性による開発効率向上、実際のプロジェクトでの統合価値、チーム開発での効果を最大化します。特に外部ライブラリ、API 連携、レガシーコードとの統合において、型定義は開発者体験を大幅に改善し、ランタイムエラーを予防します。

**🎯 どういう場面で使うのか**

- **外部ライブラリ統合**: JavaScript ライブラリの型安全な使用
- **API 連携**: 外部 API との型安全な通信
- **レガシーコード統合**: 既存 JavaScript コードの段階的 TypeScript 化
- **グローバル変数管理**: window オブジェクトや環境変数の型安全な管理
- **アセット管理**: CSS モジュール、画像ファイルの型定義
- **チーム開発**: 型定義による契約の明確化と共有

##### 1. 基本的な型定義ファイル

> 💡 **詳細解説**: 型定義ファイルと declare 文について [Step08\_補足\_専門用語集.md#型定義ファイル](./Step08_補足_専門用語集.md#型定義ファイルtype-definition-files) を見てね 🐰

```typescript
// types/global.d.ts - グローバル型定義
declare global {
  interface Window {
    customAPI: {
      version: string;
      init(): void;
      getData<T>(key: string): Promise<T>;
    };

    // 実際のプロジェクトでよく使用される拡張
    gtag?: (...args: any[]) => void; // Google Analytics
    dataLayer?: any[]; // Google Tag Manager
    fbq?: (...args: any[]) => void; // Facebook Pixel

    // 環境固有のAPI
    electron?: {
      ipcRenderer: {
        invoke(channel: string, ...args: any[]): Promise<any>;
        on(channel: string, listener: (...args: any[]) => void): void;
      };
    };
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      API_URL: string;
      API_KEY: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      REDIS_URL?: string;
      SENTRY_DSN?: string;

      // 機能フラグ
      FEATURE_NEW_UI?: "true" | "false";
      FEATURE_ANALYTICS?: "true" | "false";
    }
  }

  // カスタムイベント型定義
  interface CustomEventMap {
    "user:login": CustomEvent<{ userId: string; email: string }>;
    "user:logout": CustomEvent<{}>;
    "cart:update": CustomEvent<{ itemCount: number; total: number }>;
    "notification:show": CustomEvent<{
      type: "success" | "error" | "warning" | "info";
      message: string;
      duration?: number;
    }>;
  }

  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ): void;

    dispatchEvent<K extends keyof CustomEventMap>(
      event: CustomEventMap[K]
    ): boolean;
  }
}

// 実際のプロジェクトでの型定義戦略
// types/api.d.ts - API関連の型定義
declare namespace API {
  interface BaseResponse {
    success: boolean;
    message: string;
    timestamp: string;
  }

  interface ErrorResponse extends BaseResponse {
    success: false;
    error: {
      code: string;
      details?: Record<string, any>;
    };
  }

  interface SuccessResponse<T = any> extends BaseResponse {
    success: true;
    data: T;
  }

  type Response<T = any> = SuccessResponse<T> | ErrorResponse;

  // 認証関連
  namespace Auth {
    interface LoginRequest {
      email: string;
      password: string;
      rememberMe?: boolean;
    }

    interface LoginResponse {
      user: User;
      token: string;
      refreshToken: string;
      expiresIn: number;
    }

    interface User {
      id: string;
      email: string;
      name: string;
      role: "admin" | "user" | "moderator";
      avatar?: string;
      preferences: UserPreferences;
    }

    interface UserPreferences {
      theme: "light" | "dark" | "auto";
      language: "en" | "ja" | "es";
      notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
      };
    }
  }

  // 商品関連
  namespace Product {
    interface Item {
      id: string;
      name: string;
      description: string;
      price: number;
      currency: string;
      category: Category;
      images: Image[];
      inventory: Inventory;
      metadata: Record<string, any>;
    }

    interface Category {
      id: string;
      name: string;
      slug: string;
      parent?: Category;
    }

    interface Image {
      id: string;
      url: string;
      alt: string;
      width: number;
      height: number;
      format: "jpg" | "png" | "webp";
    }

    interface Inventory {
      stock: number;
      reserved: number;
      available: number;
      lowStockThreshold: number;
    }
  }
}

// types/utils.d.ts - ユーティリティ型定義
declare namespace Utils {
  // 深い部分更新用の型
  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
  };

  // 必須フィールドを指定する型
  type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

  // 特定の型のキーのみを抽出
  type KeysOfType<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never;
  }[keyof T];

  // 関数の型を抽出
  type FunctionKeys<T> = KeysOfType<T, Function>;

  // イベントハンドラーの型
  type EventHandler<T = Event> = (event: T) => void;

  // 非同期関数の戻り値型を抽出
  type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
}

export {};
```

**📝 統合の詳細解説**

- **グローバル拡張**: Window、NodeJS.ProcessEnv の拡張により、実際のプロジェクトで使用される API や環境変数を型安全に管理
- **名前空間活用**: API、Utils 名前空間により、関連する型定義を論理的にグループ化
- **カスタムイベント**: 型安全なカスタムイベントシステムの実現
- **実用的な型**: 実際のプロジェクトで頻繁に使用される型パターンの定義

**⚠️ よくある統合ミスと注意点**

```typescript
// ❌ 間違い: グローバル汚染
declare const myGlobalVar: string; // グローバルスコープを汚染

// ❌ 間違い: 型定義の重複
interface Window {
  customAPI: any; // 既に定義済みの場合、競合する
}

// ❌ 間違い: 不適切な any の使用
declare global {
  interface Window {
    someAPI: any; // 型安全性を失う
  }
}

// ✅ 正解: 適切なグローバル拡張
declare global {
  interface Window {
    customAPI: {
      version: string;
      init(): void;
      getData<T>(key: string): Promise<T>;
    };
  }
}

// ✅ 正解: 名前空間による整理
declare namespace MyLibrary {
  interface Config {
    apiUrl: string;
    timeout: number;
  }
}
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// React プロジェクトでの活用
// types/react-extensions.d.ts
import "react";

declare module "react" {
  interface CSSProperties {
    "--custom-property"?: string;
    "--theme-color"?: string;
  }
}

// Next.js プロジェクトでの活用
// types/next-env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_ANALYTICS_ID: string;
    DATABASE_URL: string;
    NEXTAUTH_SECRET: string;
  }
}

// Express.js プロジェクトでの活用
// types/express.d.ts
import { API } from "./api";

declare global {
  namespace Express {
    interface Request {
      user?: API.Auth.User;
      requestId: string;
      startTime: number;
    }

    interface Response {
      success<T>(data: T, message?: string): Response;
      error(message: string, code?: string): Response;
    }
  }
}

// 実際の使用例
app.use((req, res, next) => {
  req.requestId = crypto.randomUUID();
  req.startTime = Date.now();

  res.success = function <T>(data: T, message = "Success") {
    return this.json({
      success: true,
      message,
      data,
      requestId: req.requestId,
    });
  };

  res.error = function (message: string, code = "UNKNOWN_ERROR") {
    return this.status(400).json({
      success: false,
      message,
      error: { code },
      requestId: req.requestId,
    });
  };

  next();
});
```

##### 2. モジュール宣言

> 💡 **詳細解説**: モジュール宣言について [Step08\_補足\_専門用語集.md#モジュール宣言](./Step08_補足_専門用語集.md#モジュール宣言module-declaration) を見てね 🐰

```typescript
// types/external-lib.d.ts
declare module "some-external-library" {
  export interface Config {
    apiUrl: string;
    timeout: number;
  }

  export class ApiClient {
    constructor(config: Config);
    get<T>(path: string): Promise<T>;
    post<T, U>(path: string, data: T): Promise<U>;
  }

  export function createClient(config: Config): ApiClient;
}
```

##### 3. 既存モジュールの拡張

> 💡 **詳細解説**: モジュール拡張について [Step08\_補足\_専門用語集.md#モジュール拡張](./Step08_補足_専門用語集.md#モジュール拡張module-augmentation) を見てね 🐰

```typescript
// types/lodash-extensions.d.ts
import "lodash";

declare module "lodash" {
  interface LoDashStatic {
    customMethod<T>(array: T[]): T[];
  }
}
```

##### 4. CSS モジュールの型定義

> 💡 **詳細解説**: ワイルドカードモジュールについて [Step08\_補足\_専門用語集.md#ワイルドカードモジュール](./Step08_補足_専門用語集.md#ワイルドカードモジュールwildcard-modules) を見てね 🐰

```typescript
// types/css-modules.d.ts
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
```

##### 5. 画像ファイルの型定義

> 💡 **詳細解説**: アセット型定義について [Step08\_補足\_専門用語集.md#アセット型定義](./Step08_補足_専門用語集.md#アセット型定義asset-type-definitions) を見てね 🐰

```typescript
// types/assets.d.ts
declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}
```

#### 🎯 DefinitelyTyped の活用

##### 1. 人気ライブラリの型定義インストール

```bash
# 人気ライブラリの型定義インストール
npm install @types/lodash
npm install @types/express
npm install @types/node
npm install @types/jest
```

##### 2. Lodash の型安全な使用

```typescript
import _ from "lodash";

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", active: true },
  { id: 2, name: "Bob", email: "bob@example.com", active: false },
  { id: 3, name: "Charlie", email: "charlie@example.com", active: true },
];

// 型安全なLodash操作
const activeUsers = _.filter(users, { active: true }); // User[]
const userNames = _.map(users, "name"); // string[]
const userById = _.keyBy(users, "id"); // Record<string, User>
const groupedByActive = _.groupBy(users, "active"); // Record<string, User[]>
```

##### 3. Express の型安全な使用

```typescript
import express, { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

const app = express();

// 型安全なミドルウェア
const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  // トークン検証ロジック
  req.user = { id: 1, email: "user@example.com", role: "user" };
  next();
};

// 型安全なルートハンドラ
app.get(
  "/api/users",
  authMiddleware,
  (req: AuthenticatedRequest, res: Response) => {
    // req.user は型安全にアクセス可能
    console.log(`Request from user: ${req.user?.email}`);
    res.json({ users: [] });
  }
);
```

##### 4. Jest の型安全なテスト

```typescript
import { describe, it, expect, beforeEach, jest } from "@jest/globals";

describe("UserService", () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;

    userService = new UserService(mockRepository);
  });

  it("should return user by id", async () => {
    const mockUser: User = {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      active: true,
    };
    mockRepository.findById.mockResolvedValue(mockUser);

    const result = await userService.getUserById(1);

    expect(result).toEqual(mockUser);
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
  });
});
```

### Section 2: カスタム型定義の作成

#### 🔧 実用的な型定義パターン

##### 1. API レスポンスの型定義

```typescript
// types/api.d.ts
export namespace API {
  interface BaseResponse {
    success: boolean;
    message?: string;
    timestamp: string;
  }

  interface SuccessResponse<T> extends BaseResponse {
    success: true;
    data: T;
  }

  interface ErrorResponse extends BaseResponse {
    success: false;
    error: {
      code: string;
      details?: Record<string, unknown>;
    };
  }

  type Response<T> = SuccessResponse<T> | ErrorResponse;

  interface PaginatedResponse<T> extends SuccessResponse<T[]> {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }

  // エンドポイント別の型定義
  namespace Users {
    interface User {
      id: number;
      email: string;
      name: string;
      avatar?: string;
      createdAt: string;
      updatedAt: string;
    }

    interface CreateRequest {
      email: string;
      name: string;
      password: string;
    }

    interface UpdateRequest {
      name?: string;
      avatar?: string;
    }

    type GetResponse = Response<User>;
    type ListResponse = PaginatedResponse<User>;
    type CreateResponse = Response<{ id: number }>;
    type UpdateResponse = Response<User>;
    type DeleteResponse = Response<{}>;
  }

  namespace Auth {
    interface LoginRequest {
      email: string;
      password: string;
    }

    interface LoginResponse {
      token: string;
      refreshToken: string;
      user: Users.User;
    }

    interface RefreshRequest {
      refreshToken: string;
    }

    type LoginResult = Response<LoginResponse>;
    type RefreshResult = Response<{ token: string }>;
  }
}
```

##### 2. 設定ファイルの型定義

```typescript
// types/config.d.ts
export interface AppConfig {
  app: {
    name: string;
    version: string;
    port: number;
    env: "development" | "staging" | "production";
  };

  database: {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
    ssl: boolean;
  };

  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };

  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
    refreshTokenExpiresIn: string;
  };

  external: {
    emailService: {
      apiKey: string;
      fromEmail: string;
    };

    storage: {
      provider: "aws" | "gcp" | "local";
      bucket?: string;
      region?: string;
      accessKey?: string;
      secretKey?: string;
    };
  };

  features: {
    [featureName: string]: boolean;
  };
}
```

##### 3. イベントシステムの型定義

```typescript
// types/events.d.ts
export namespace Events {
  interface BaseEvent {
    type: string;
    timestamp: Date;
    source: string;
  }

  interface UserEvent extends BaseEvent {
    userId: number;
  }

  interface UserCreatedEvent extends UserEvent {
    type: "user.created";
    data: {
      user: API.Users.User;
    };
  }

  interface UserUpdatedEvent extends UserEvent {
    type: "user.updated";
    data: {
      user: API.Users.User;
      changes: Partial<API.Users.User>;
    };
  }

  interface UserDeletedEvent extends UserEvent {
    type: "user.deleted";
    data: {
      userId: number;
    };
  }

  type AppEvent = UserCreatedEvent | UserUpdatedEvent | UserDeletedEvent;

  interface EventHandler<T extends AppEvent> {
    handle(event: T): Promise<void> | void;
  }

  interface EventBus {
    emit<T extends AppEvent>(event: T): void;
    on<T extends AppEvent>(
      eventType: T["type"],
      handler: EventHandler<T>
    ): () => void;
  }
}
```

##### 4. フォームバリデーションの型定義

```typescript
// types/validation.d.ts
export namespace Validation {
  interface ValidationRule<T = any> {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: T) => string | null;
  }

  interface FieldValidation<T = any> extends ValidationRule<T> {
    message?: Partial<Record<keyof ValidationRule, string>>;
  }

  type ValidationSchema<T> = {
    [K in keyof T]?: FieldValidation<T[K]>;
  };

  interface ValidationError {
    field: string;
    message: string;
    value: any;
  }

  interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
  }

  interface Validator<T> {
    validate(data: T): ValidationResult;
    validateField<K extends keyof T>(field: K, value: T[K]): ValidationError[];
  }
}
```

> 💡 **詳細解説**: より実践的なコード例は [Step08\_補足\_実践コード例.md](./Step08_補足_実践コード例.md) で確認できるよ 🐰

### Section 3: ライブラリ統合の実践

#### 🔧 型安全なライブラリラッパー

##### 1. HTTP クライアントライブラリのラッパー

```typescript
// lib/http-client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API } from "../types/api";

export class TypeSafeHttpClient {
  private client: AxiosInstance;

  constructor(baseURL: string, defaultHeaders: Record<string, string> = {}) {
    this.client = axios.create({
      baseURL,
      headers: defaultHeaders,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // リクエストインターセプター
    this.client.interceptors.request.use(
      (config) => {
        console.log(
          `Making ${config.method?.toUpperCase()} request to ${config.url}`
        );
        return config;
      },
      (error) => Promise.reject(error)
    );

    // レスポンスインターセプター
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("HTTP Error:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<API.Response<T>> {
    try {
      const response: AxiosResponse<API.Response<T>> = await this.client.get(
        url,
        config
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<TRequest, TResponse>(
    url: string,
    data: TRequest,
    config?: AxiosRequestConfig
  ): Promise<API.Response<TResponse>> {
    try {
      const response: AxiosResponse<API.Response<TResponse>> =
        await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<TRequest, TResponse>(
    url: string,
    data: TRequest,
    config?: AxiosRequestConfig
  ): Promise<API.Response<TResponse>> {
    try {
      const response: AxiosResponse<API.Response<TResponse>> =
        await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<API.Response<T>> {
    try {
      const response: AxiosResponse<API.Response<T>> = await this.client.delete(
        url,
        config
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): API.ErrorResponse {
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Server error",
        timestamp: new Date().toISOString(),
        error: {
          code: error.response.status.toString(),
          details: error.response.data,
        },
      };
    } else if (error.request) {
      return {
        success: false,
        message: "Network error",
        timestamp: new Date().toISOString(),
        error: {
          code: "NETWORK_ERROR",
        },
      };
    } else {
      return {
        success: false,
        message: error.message || "Unknown error",
        timestamp: new Date().toISOString(),
        error: {
          code: "UNKNOWN_ERROR",
        },
      };
    }
  }

  setAuthToken(token: string): void {
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.client.defaults.headers.common["Authorization"];
  }
}
```

##### 2. ユーザー API サービス

```typescript
// services/user-api.ts
export class UserApiService {
  constructor(private httpClient: TypeSafeHttpClient) {}

  async getUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<API.Users.ListResponse> {
    return this.httpClient.get<API.Users.User[]>(
      `/users?page=${page}&limit=${limit}`
    );
  }

  async getUserById(id: number): Promise<API.Users.GetResponse> {
    return this.httpClient.get<API.Users.User>(`/users/${id}`);
  }

  async createUser(
    userData: API.Users.CreateRequest
  ): Promise<API.Users.CreateResponse> {
    return this.httpClient.post<API.Users.CreateRequest, { id: number }>(
      "/users",
      userData
    );
  }

  async updateUser(
    id: number,
    userData: API.Users.UpdateRequest
  ): Promise<API.Users.UpdateResponse> {
    return this.httpClient.put<API.Users.UpdateRequest, API.Users.User>(
      `/users/${id}`,
      userData
    );
  }

  async deleteUser(id: number): Promise<API.Users.DeleteResponse> {
    return this.httpClient.delete<{}>(`/users/${id}`);
  }
}
```

##### 3. 認証 API サービス

```typescript
// services/auth-api.ts
export class AuthApiService {
  constructor(private httpClient: TypeSafeHttpClient) {}

  async login(
    credentials: API.Auth.LoginRequest
  ): Promise<API.Auth.LoginResult> {
    const response = await this.httpClient.post<
      API.Auth.LoginRequest,
      API.Auth.LoginResponse
    >("/auth/login", credentials);

    if (response.success) {
      this.httpClient.setAuthToken(response.data.token);
    }

    return response;
  }

  async refreshToken(refreshToken: string): Promise<API.Auth.RefreshResult> {
    return this.httpClient.post<API.Auth.RefreshRequest, { token: string }>(
      "/auth/refresh",
      { refreshToken }
    );
  }

  async logout(): Promise<void> {
    this.httpClient.removeAuthToken();
    await this.httpClient.post("/auth/logout", {});
  }
}
```

##### 4. サービスファクトリと使用例

```typescript
// services/index.ts
export class ApiServiceFactory {
  private httpClient: TypeSafeHttpClient;
  private userService: UserApiService;
  private authService: AuthApiService;

  constructor(baseURL: string) {
    this.httpClient = new TypeSafeHttpClient(baseURL, {
      "Content-Type": "application/json",
    });

    this.userService = new UserApiService(this.httpClient);
    this.authService = new AuthApiService(this.httpClient);
  }

  getUserService(): UserApiService {
    return this.userService;
  }

  getAuthService(): AuthApiService {
    return this.authService;
  }

  getHttpClient(): TypeSafeHttpClient {
    return this.httpClient;
  }
}

// 使用例
const apiServices = new ApiServiceFactory(process.env.API_URL!);
const userService = apiServices.getUserService();
const authService = apiServices.getAuthService();

// 型安全な使用
async function example() {
  // ログイン
  const loginResult = await authService.login({
    email: "user@example.com",
    password: "password123",
  });

  if (loginResult.success) {
    console.log("Logged in as:", loginResult.data.user.name);

    // ユーザー一覧取得
    const usersResult = await userService.getUsers(1, 10);
    if (usersResult.success) {
      console.log("Users:", usersResult.data);
    }
  }
}
```

> 💡 **詳細解説**: 実装中に問題が発生した場合は [Step08\_補足\_トラブルシューティング.md](./Step08_補足_トラブルシューティング.md) を参考にしてね 🐰

## 📊 Step 8 評価基準

> 💡 **詳細解説**: 学習の進め方とトラブルシューティングは [Step08\_補足\_参考リソース.md](./Step08_補足_参考リソース.md) にもまとめてあるよ 🐰

### 理解度チェックリスト

#### 型定義ファイル (30%)

- [ ] d.ts ファイルの構造を理解している
- [ ] モジュール宣言を適切に書ける
- [ ] グローバル型の拡張ができる
- [ ] 既存ライブラリの型拡張ができる

#### DefinitelyTyped 活用 (25%)

- [ ] 適切な@types パッケージを選択できる
- [ ] 型定義を効果的に活用できる
- [ ] 型定義の不足を補完できる
- [ ] バージョン互換性を理解している

#### カスタム型定義 (25%)

- [ ] 実用的な型定義を作成できる
- [ ] 名前空間を適切に使用できる
- [ ] 複雑な型関係を定義できる
- [ ] 保守性の高い型定義を設計できる

#### ライブラリ統合 (20%)

- [ ] 型安全なライブラリラッパーを作成できる
- [ ] エラーハンドリングを型安全に実装できる
- [ ] 実用的なサービス層を設計できる
- [ ] パフォーマンスを考慮した実装ができる

### 成果物チェックリスト

- [ ] **型定義ファイル集**: 包括的な型定義
- [ ] **HTTP クライアントライブラリ**: 型安全な API クライアント
- [ ] **サービス層**: 型安全なビジネスロジック層
- [ ] **統合テスト**: ライブラリ統合の動作確認

## 🔄 Step 9 への準備

> 💡 **詳細解説**: 次のステップでの学習内容について [Step09\_エラーハンドリングとデバッグ.md](./Step09_エラーハンドリングとデバッグ.md) の概要を先に確認しておくとスムーズに学習を進められるよ 🐰

### 次週学習内容の予習

```typescript
// Step 9で学習するエラーハンドリングの基礎概念
// 以下のコードを読んで理解しておくこと

// 1. Result型パターン
type Result<T, E> = { success: true; data: T } | { success: false; error: E };

// 2. カスタムエラークラス
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// 3. エラーバウンダリ
interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}
```

---

**📌 重要**: Step 8 は外部ライブラリとの型安全な統合を学ぶ重要な週です。実際のプロジェクトでよく使用されるライブラリとの統合パターンを身につけることで、実用的な TypeScript アプリケーション開発ができるようになります。

**🌟 次週は、エラーハンドリングとデバッグ技術について学習します！**
