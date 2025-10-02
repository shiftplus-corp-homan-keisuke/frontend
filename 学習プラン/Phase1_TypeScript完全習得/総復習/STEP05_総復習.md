# STEP05 総復習：ジェネリクスによる型の再利用と高度な型機能

## 📋 概要

STEP05「ジェネリクスによる型の再利用と高度な型機能」の理論学習内容を総復習するためのドキュメントです。

## 🎯 学習目標

- [ ] ジェネリクスによる型の再利用の完全理解と実践的活用
- [ ] 制約（constraints）による型の制限の習得
- [ ] 高階関数とジェネリクスの組み合わせパターンの理解
- [ ] 条件付き型と型推論の高度な活用方法の習得

---

## 1. ジェネリクスによる型の再利用

### 1.1 基本的なジェネリクス

ジェネリクスは型安全性を保ちながらコードの再利用性を向上させるTypeScriptの核心機能です。

```typescript
// 基本的なジェネリック関数
function identity<T>(arg: T): T {
  return arg;
}

// ジェネリックインターフェース
interface Container<T> {
  value: T;
  getValue(): T;
}

// ジェネリッククラス
class Stack<T> {
  private items: T[] = [];
  
  push(item: T): void {
    this.items.push(item);
  }
  
  pop(): T | undefined {
    return this.items.pop();
  }
}
```

### 1.2 複数の型パラメータとデフォルト型

```typescript
// 複数の型パラメータ
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

// デフォルト型パラメータ
interface Result<T = string> {
  success: boolean;
  data: T;
}
```

---

## 2. 制約（constraints）による型の制限

### 2.1 extends による制約

```typescript
// 基本的な制約
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// keyof演算子との組み合わせ
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

---

## 3. 高階関数とジェネリクス

### 3.1 関数型プログラミングパターン

```typescript
// 高階関数とジェネリクス
function createMapper<T, U>(transform: (item: T) => U) {
  return function(array: T[]): U[] {
    return array.map(transform);
  };
}

// 関数合成
function compose<T, U, V>(
  f: (x: U) => V,
  g: (x: T) => U
): (x: T) => V {
  return (x: T) => f(g(x));
}
```

### 3.2 型安全な配列操作

```typescript
// 型安全なmap, filter
function safeMap<T, U>(
  array: T[],
  transform: (item: T) => U
): U[] {
  return array.map(transform);
}

// 型ガード付きfilter
function safeFilterWithTypeGuard<T, U extends T>(
  array: T[],
  predicate: (item: T) => item is U
): U[] {
  return array.filter(predicate);
}
```

---

## 4. ジェネリクスの実践パターン

### 4.1 Repository パターン

```typescript
// 基本的なエンティティ
interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// Repository インターフェース
interface IRepository<T extends BaseEntity> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: number, entity: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}
```

### 4.2 ファクトリーパターン

```typescript
// ファクトリーインターフェース
interface IFactory<T> {
  create(...args: any[]): T;
}

// 設定可能なファクトリー
interface FactoryConfig<T> {
  validator?: (data: any) => boolean;
  transformer?: (data: any) => T;
  defaultValues?: Partial<T>;
}

class ConfigurableFactory<T> implements IFactory<T> {
  constructor(
    private createFn: (...args: any[]) => T,
    private config: FactoryConfig<T> = {}
  ) {}

  create(...args: any[]): T {
    return this.createFn(...args);
  }
}
```

### 4.3 イベントシステム

```typescript
// 型安全なイベントシステム
interface EventMap {
  'user:created': { userId: number; name: string };
  'user:updated': { userId: number; changes: Partial<User> };
  'user:deleted': { userId: number };
}

class EventEmitter<T extends Record<string, any>> {
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
}
```

