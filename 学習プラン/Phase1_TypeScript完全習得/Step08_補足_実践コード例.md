# Step08 実践コード例

> 💡 **このファイルについて**: ライブラリ統合と型定義の段階的な学習のためのコード例集です。

## 📋 目次
1. [外部ライブラリの型安全な統合](#外部ライブラリの型安全な統合)
2. [カスタム型定義の作成](#カスタム型定義の作成)
3. [型安全なAPIクライアント](#型安全なAPIクライアント)

---

## 外部ライブラリの型安全な統合

### ステップ1: Lodashの統合
```typescript
// types/lodash-extensions.d.ts
import * as _ from 'lodash';

declare module 'lodash' {
  interface LoDashStatic {
    customMethod<T>(array: T[], predicate: (item: T) => boolean): T[];
  }
}

// utils/lodash-wrapper.ts
import _ from 'lodash';

// カスタムメソッドの実装
_.mixin({
  customMethod: function<T>(array: T[], predicate: (item: T) => boolean): T[] {
    return array.filter(predicate);
  }
});

// 型安全な使用
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = _.customMethod(numbers, n => n % 2 === 0);
```

### ステップ2: Axiosの型安全なラッパー
```typescript
// types/api.d.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

// services/api-client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse, User, CreateUserRequest } from '../types/api';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      response => response,
      error => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  async getUsers(): Promise<User[]> {
    const response = await this.client.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await this.client.post<ApiResponse<User>>('/users', userData);
    return response.data.data;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await this.client.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.client.delete(`/users/${id}`);
  }
}

export { ApiClient };
```

---

## カスタム型定義の作成

### ステップ3: 環境変数の型定義
```typescript
// types/environment.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      API_URL: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      PORT: string;
    }
  }
}

export {};

// config/environment.ts
interface Config {
  nodeEnv: string;
  apiUrl: string;
  databaseUrl: string;
  jwtSecret: string;
  port: number;
}

function validateEnv(): Config {
  const requiredEnvVars = ['API_URL', 'DATABASE_URL', 'JWT_SECRET'];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable ${envVar} is required`);
    }
  }

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    apiUrl: process.env.API_URL,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    port: parseInt(process.env.PORT || '3000', 10),
  };
}

export const config = validateEnv();
```

### ステップ4: DOM拡張の型定義
```typescript
// types/dom-extensions.d.ts
declare global {
  interface HTMLElement {
    fadeIn(duration?: number): Promise<void>;
    fadeOut(duration?: number): Promise<void>;
  }

  interface Window {
    myApp: {
      version: string;
      config: Record<string, any>;
    };
  }
}

// utils/dom-extensions.ts
HTMLElement.prototype.fadeIn = function(duration: number = 300): Promise<void> {
  return new Promise((resolve) => {
    this.style.opacity = '0';
    this.style.display = 'block';
    
    const start = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      this.style.opacity = progress.toString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };
    
    requestAnimationFrame(animate);
  });
};

HTMLElement.prototype.fadeOut = function(duration: number = 300): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const initialOpacity = parseFloat(this.style.opacity) || 1;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      this.style.opacity = (initialOpacity * (1 - progress)).toString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.style.display = 'none';
        resolve();
      }
    };
    
    requestAnimationFrame(animate);
  });
};

export {};
```

---

## 型安全なAPIクライアント

### ステップ5: ジェネリックAPIクライアント
```typescript
// types/api-client.d.ts
export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  params?: Record<string, any>;
  body?: any;
  response: any;
}

export interface ApiDefinition {
  [key: string]: ApiEndpoint;
}

// services/typed-api-client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiDefinition, ApiEndpoint } from '../types/api-client';

class TypedApiClient<TApiDef extends ApiDefinition> {
  private client: AxiosInstance;
  private endpoints: TApiDef;

  constructor(baseURL: string, endpoints: TApiDef) {
    this.client = axios.create({ baseURL });
    this.endpoints = endpoints;
  }

  async request<K extends keyof TApiDef>(
    endpointKey: K,
    options: TApiDef[K] extends { params: infer P }
      ? TApiDef[K] extends { body: infer B }
        ? { params: P; body: B }
        : { params: P }
      : TApiDef[K] extends { body: infer B }
      ? { body: B }
      : {}
  ): Promise<TApiDef[K]['response']> {
    const endpoint = this.endpoints[endpointKey];
    let url = endpoint.path;

    // パラメータの置換
    if ('params' in options) {
      Object.entries(options.params as Record<string, any>).forEach(([key, value]) => {
        url = url.replace(`:${key}`, String(value));
      });
    }

    const config: AxiosRequestConfig = {
      method: endpoint.method,
      url,
    };

    if ('body' in options) {
      config.data = options.body;
    }

    const response = await this.client.request(config);
    return response.data;
  }
}

// 使用例
interface MyApiDefinition extends ApiDefinition {
  'users.list': {
    method: 'GET';
    path: '/users';
    response: User[];
  };
  'users.get': {
    method: 'GET';
    path: '/users/:id';
    params: { id: number };
    response: User;
  };
  'users.create': {
    method: 'POST';
    path: '/users';
    body: CreateUserRequest;
    response: User;
  };
}

const apiDefinition: MyApiDefinition = {
  'users.list': {
    method: 'GET',
    path: '/users',
    response: {} as User[],
  },
  'users.get': {
    method: 'GET',
    path: '/users/:id',
    params: {} as { id: number },
    response: {} as User,
  },
  'users.create': {
    method: 'POST',
    path: '/users',
    body: {} as CreateUserRequest,
    response: {} as User,
  },
};

const apiClient = new TypedApiClient('https://api.example.com', apiDefinition);

// 型安全な使用
async function example() {
  const users = await apiClient.request('users.list', {});
  const user = await apiClient.request('users.get', { params: { id: 1 } });
  const newUser = await apiClient.request('users.create', {
    body: { name: 'Alice', email: 'alice@example.com' }
  });
}
```

### ステップ6: 型安全なイベントシステム
```typescript
// types/events.d.ts
export interface EventMap {
  'user:login': { userId: string; timestamp: Date };
  'user:logout': { userId: string };
  'data:update': { id: string; data: any };
  'error:occurred': { message: string; stack?: string };
}

// utils/typed-event-emitter.ts
import { EventMap } from '../types/events';

class TypedEventEmitter<T extends Record<string, any> = EventMap> {
  private listeners: { [K in keyof T]?: Array<(data: T[K]) => void> } = {};

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);

    // アンサブスクライブ関数を返す
    return () => this.off(event, listener);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${String(event)}:`, error);
        }
      });
    }
  }

  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  once<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    const onceListener = (data: T[K]) => {
      listener(data);
      this.off(event, onceListener);
    };
    this.on(event, onceListener);
  }

  removeAllListeners<K extends keyof T>(event?: K): void {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }
}

// 使用例
const eventEmitter = new TypedEventEmitter<EventMap>();

// 型安全なイベントリスナー
const unsubscribe = eventEmitter.on('user:login', (data) => {
  // dataは{ userId: string; timestamp: Date }型
  console.log(`User ${data.userId} logged in at ${data.timestamp}`);
});

// 型安全なイベント発火
eventEmitter.emit('user:login', {
  userId: 'user123',
  timestamp: new Date()
});

// アンサブスクライブ
unsubscribe();

export { TypedEventEmitter };
```

---

## 🎯 実行とテストの方法

### 基本的な実行方法
```bash
# 型定義ファイルの生成
npx tsc --declaration

# 型チェックのみ実行
npx tsc --noEmit

# 外部ライブラリの型定義インストール
npm install -D @types/lodash @types/node
```

---

**📌 重要**: ライブラリ統合では、型安全性を保ちながら外部ライブラリを効果的に活用することが重要です。適切な型定義により、開発効率と品質を向上させることができます。