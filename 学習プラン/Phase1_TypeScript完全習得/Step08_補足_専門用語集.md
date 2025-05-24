# Step08 専門用語集

> 💡 **このファイルについて**: Step08で出てくるライブラリ統合と型定義関連の重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [型定義関連用語](#型定義関連用語)
2. [ライブラリ統合用語](#ライブラリ統合用語)
3. [モジュール解決用語](#モジュール解決用語)
4. [宣言ファイル用語](#宣言ファイル用語)

---

## 型定義関連用語

### 型定義ファイル（Type Definition File）
**定義**: TypeScriptの型情報を提供する`.d.ts`ファイル

**実装例**:
```typescript
// types/api.d.ts
declare namespace API {
  interface User {
    id: number;
    name: string;
    email: string;
  }
  
  interface Response<T> {
    data: T;
    status: number;
    message: string;
  }
}

// 使用例
const user: API.User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};
```

### アンビエント宣言（Ambient Declaration）
**定義**: 実装を持たない型のみの宣言

**実装例**:
```typescript
// グローバル変数の宣言
declare const VERSION: string;
declare const API_URL: string;

// 外部ライブラリの宣言
declare module 'my-library' {
  export function doSomething(value: string): number;
  export interface Config {
    timeout: number;
    retries: number;
  }
}
```

---

## ライブラリ統合用語

### DefinitelyTyped
**定義**: TypeScript型定義の公式リポジトリ

**使用例**:
```bash
# @types パッケージのインストール
npm install -D @types/lodash
npm install -D @types/express
npm install -D @types/node
```

### 型互換性（Type Compatibility）
**定義**: 異なる型間での代入可能性

**実装例**:
```typescript
// 構造的型付け
interface Point2D {
  x: number;
  y: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

let point2D: Point2D = { x: 1, y: 2 };
let point3D: Point3D = { x: 1, y: 2, z: 3 };

// Point3DはPoint2Dと互換性がある
point2D = point3D; // OK
// point3D = point2D; // Error: zプロパティがない
```

---

## モジュール解決用語

### モジュール解決戦略（Module Resolution Strategy）
**定義**: TypeScriptがモジュールを見つける方法

**設定例**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/utils/*": ["utils/*"]
    }
  }
}
```

### トリプルスラッシュディレクティブ
**定義**: ファイルの依存関係を指定する特別なコメント

**実装例**:
```typescript
/// <reference types="node" />
/// <reference path="./custom-types.d.ts" />

// Node.jsの型定義を使用可能
const fs = require('fs');
```

---

## 宣言ファイル用語

### declare module
**定義**: モジュールの型定義を宣言

**実装例**:
```typescript
// types/custom-modules.d.ts
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'my-custom-library' {
  export interface Options {
    timeout: number;
    retries: number;
  }
  
  export function initialize(options: Options): void;
  export function process(data: string): Promise<string>;
}
```

### declare global
**定義**: グローバルスコープに型を追加

**実装例**:
```typescript
// types/global.d.ts
declare global {
  interface Window {
    myCustomProperty: string;
    myCustomFunction: (value: string) => void;
  }
  
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      API_URL: string;
      DATABASE_URL: string;
    }
  }
}

export {}; // モジュールとして扱うために必要
```

---

## 📚 実用的なパターン

### ライブラリラッパーの作成
```typescript
// wrappers/axios-wrapper.ts
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

class ApiClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await axios.get(
      `${this.baseURL}${url}`,
      config
    );
    return response.data;
  }
  
  async post<T, D>(
    url: string, 
    data: D, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await axios.post(
      `${this.baseURL}${url}`,
      data,
      config
    );
    return response.data;
  }
}

export { ApiClient };
export type { ApiResponse };
```

### 型安全なイベントエミッター
```typescript
// utils/typed-event-emitter.ts
interface EventMap {
  'user:login': { userId: string; timestamp: Date };
  'user:logout': { userId: string };
  'data:update': { id: string; data: any };
}

class TypedEventEmitter<T extends Record<string, any>> {
  private listeners: { [K in keyof T]?: Array<(data: T[K]) => void> } = {};
  
  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }
  
  emit<K extends keyof T>(event: K, data: T[K]): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
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
}

// 使用例
const emitter = new TypedEventEmitter<EventMap>();

emitter.on('user:login', (data) => {
  // dataは{ userId: string; timestamp: Date }型
  console.log(`User ${data.userId} logged in at ${data.timestamp}`);
});

emitter.emit('user:login', {
  userId: 'user123',
  timestamp: new Date()
});
```

---

## 📚 参考リンク

- [TypeScript Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
- [Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

---

**📌 重要**: ライブラリ統合では、型安全性を保ちながら外部ライブラリを効果的に活用することが重要です。適切な型定義により、開発効率と品質を向上させることができます。