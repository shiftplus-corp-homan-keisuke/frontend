# Week 8: ライブラリ統合と型定義

## 📅 学習期間・目標

**期間**: Week 8（7日間）  
**総学習時間**: 12時間（平日1.5時間、週末3時間）  
**学習スタイル**: 理論30% + 実践コード50% + 演習20%

### 🎯 Week 8 到達目標

- [ ] 外部ライブラリの型定義の理解と活用
- [ ] d.ts ファイルの作成と管理
- [ ] DefinitelyTyped の活用方法
- [ ] 型定義の自作とカスタマイズ
- [ ] ライブラリ統合の実践的パターン

## 📚 理論学習内容

### Day 1-2: 型定義ファイルの基礎

#### 🔍 d.ts ファイルの理解

```typescript
// 1. 基本的な型定義ファイル
// types/global.d.ts
declare global {
  interface Window {
    customAPI: {
      version: string;
      init(): void;
      getData<T>(key: string): Promise<T>;
    };
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      API_URL: string;
      API_KEY: string;
    }
  }
}

export {};

// 2. モジュール宣言
// types/external-lib.d.ts
declare module 'some-external-library' {
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

// 3. 既存モジュールの拡張
// types/lodash-extensions.d.ts
import 'lodash';

declare module 'lodash' {
  interface LoDashStatic {
    customMethod<T>(array: T[]): T[];
  }
}

// 4. CSS モジュールの型定義
// types/css-modules.d.ts
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// 5. 画像ファイルの型定義
// types/assets.d.ts
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}
```

#### 🎯 DefinitelyTyped の活用

```typescript
// 1. 人気ライブラリの型定義インストール
// npm install @types/lodash
// npm install @types/express
// npm install @types/node
// npm install @types/jest

// 2. Lodash の型安全な使用
import _ from 'lodash';

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', active: true },
  { id: 2, name: 'Bob', email: 'bob@example.com', active: false },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', active: true },
];

// 型安全なLodash操作
const activeUsers = _.filter(users, { active: true });           // User[]
const userNames = _.map(users, 'name');                         // string[]
const userById = _.keyBy(users, 'id');                          // Record<string, User>
const groupedByActive = _.groupBy(users, 'active');             // Record<string, User[]>

// 3. Express の型安全な使用
import express, { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

const app = express();

// 型安全なミドルウェア
const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization;
  
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  // トークン検証ロジック
  req.user = { id: 1, email: 'user@example.com', role: 'user' };
  next();
};

// 型安全なルートハンドラ
app.get('/api/users', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  // req.user は型安全にアクセス可能
  console.log(`Request from user: ${req.user?.email}`);
  res.json({ users: [] });
});

// 4. Jest の型安全なテスト
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('UserService', () => {
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

  it('should return user by id', async () => {
    const mockUser: User = { id: 1, name: 'Alice', email: 'alice@example.com', active: true };
    mockRepository.findById.mockResolvedValue(mockUser);

    const result = await userService.getUserById(1);

    expect(result).toEqual(mockUser);
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
  });
});
```

### Day 3-4: カスタム型定義の作成

#### 🔧 実用的な型定義パターン

```typescript
// 1. API レスポンスの型定義
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

// 2. 設定ファイルの型定義
// types/config.d.ts
export interface AppConfig {
  app: {
    name: string;
    version: string;
    port: number;
    env: 'development' | 'staging' | 'production';
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
      provider: 'aws' | 'gcp' | 'local';
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

// 3. イベントシステムの型定義
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
    type: 'user.created';
    data: {
      user: API.Users.User;
    };
  }

  interface UserUpdatedEvent extends UserEvent {
    type: 'user.updated';
    data: {
      user: API.Users.User;
      changes: Partial<API.Users.User>;
    };
  }

  interface UserDeletedEvent extends UserEvent {
    type: 'user.deleted';
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
      eventType: T['type'],
      handler: EventHandler<T>
    ): () => void;
  }
}

// 4. フォームバリデーションの型定義
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

### Day 5-7: ライブラリ統合の実践

#### 🔧 型安全なライブラリラッパー

```typescript
// 1. HTTP クライアントライブラリのラッパー
// lib/http-client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API } from '../types/api';

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
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // レスポンスインターセプター
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('HTTP Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<API.Response<T>> {
    try {
      const response: AxiosResponse<API.Response<T>> = await this.client.get(url, config);
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
      const response: AxiosResponse<API.Response<TResponse>> = await this.client.post(url, data, config);
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
      const response: AxiosResponse<API.Response<TResponse>> = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<API.Response<T>> {
    try {
      const response: AxiosResponse<API.Response<T>> = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): API.ErrorResponse {
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'Server error',
        timestamp: new Date().toISOString(),
        error: {
          code: error.response.status.toString(),
          details: error.response.data,
        },
      };
    } else if (error.request) {
      return {
        success: false,
        message: 'Network error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'NETWORK_ERROR',
        },
      };
    } else {
      return {
        success: false,
        message: error.message || 'Unknown error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'UNKNOWN_ERROR',
        },
      };
    }
  }

  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
  }
}

// 2. ユーザーAPI サービス
// services/user-api.ts
export class UserApiService {
  constructor(private httpClient: TypeSafeHttpClient) {}

  async getUsers(page: number = 1, limit: number = 10): Promise<API.Users.ListResponse> {
    return this.httpClient.get<API.Users.User[]>(`/users?page=${page}&limit=${limit}`);
  }

  async getUserById(id: number): Promise<API.Users.GetResponse> {
    return this.httpClient.get<API.Users.User>(`/users/${id}`);
  }

  async createUser(userData: API.Users.CreateRequest): Promise<API.Users.CreateResponse> {
    return this.httpClient.post<API.Users.CreateRequest, { id: number }>('/users', userData);
  }

  async updateUser(id: number, userData: API.Users.UpdateRequest): Promise<API.Users.UpdateResponse> {
    return this.httpClient.put<API.Users.UpdateRequest, API.Users.User>(`/users/${id}`, userData);
  }

  async deleteUser(id: number): Promise<API.Users.DeleteResponse> {
    return this.httpClient.delete<{}>(`/users/${id}`);
  }
}

// 3. 認証API サービス
// services/auth-api.ts
export class AuthApiService {
  constructor(private httpClient: TypeSafeHttpClient) {}

  async login(credentials: API.Auth.LoginRequest): Promise<API.Auth.LoginResult> {
    const response = await this.httpClient.post<API.Auth.LoginRequest, API.Auth.LoginResponse>(
      '/auth/login',
      credentials
    );

    if (response.success) {
      this.httpClient.setAuthToken(response.data.token);
    }

    return response;
  }

  async refreshToken(refreshToken: string): Promise<API.Auth.RefreshResult> {
    return this.httpClient.post<API.Auth.RefreshRequest, { token: string }>(
      '/auth/refresh',
      { refreshToken }
    );
  }

  async logout(): Promise<void> {
    this.httpClient.removeAuthToken();
    await this.httpClient.post('/auth/logout', {});
  }
}

// 4. サービスファクトリ
// services/index.ts
export class ApiServiceFactory {
  private httpClient: TypeSafeHttpClient;
  private userService: UserApiService;
  private authService: AuthApiService;

  constructor(baseURL: string) {
    this.httpClient = new TypeSafeHttpClient(baseURL, {
      'Content-Type': 'application/json',
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
    email: 'user@example.com',
    password: 'password123',
  });

  if (loginResult.success) {
    console.log('Logged in as:', loginResult.data.user.name);

    // ユーザー一覧取得
    const usersResult = await userService.getUsers(1, 10);
    if (usersResult.success) {
      console.log('Users:', usersResult.data);
    }
  }
}
```

## 📊 Week 8 評価基準

### 理解度チェックリスト

#### 型定義ファイル (30%)
- [ ] d.ts ファイルの構造を理解している
- [ ] モジュール宣言を適切に書ける
- [ ] グローバル型の拡張ができる
- [ ] 既存ライブラリの型拡張ができる

#### DefinitelyTyped活用 (25%)
- [ ] 適切な@typesパッケージを選択できる
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
- [ ] **HTTP クライアントライブラリ**: 型安全なAPIクライアント
- [ ] **サービス層**: 型安全なビジネスロジック層
- [ ] **統合テスト**: ライブラリ統合の動作確認

## 🔄 Week 9 への準備

### 次週学習内容の予習

```typescript
// Week 9で学習するエラーハンドリングの基礎概念
// 以下のコードを読んで理解しておくこと

// 1. Result型パターン
type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E };

// 2. カスタムエラークラス
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// 3. エラーバウンダリ
interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}
```

---

**📌 重要**: Week 8は外部ライブラリとの型安全な統合を学ぶ重要な週です。実際のプロジェクトでよく使用されるライブラリとの統合パターンを身につけることで、実用的なTypeScriptアプリケーション開発ができるようになります。

**🌟 次週は、エラーハンドリングとデバッグ技術について学習します！**