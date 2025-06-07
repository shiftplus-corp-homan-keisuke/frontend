# Session3: プロジェクト完成（60分）

> 💡 **対象**: Session1-2完了者（ジェネリクス基礎習得済み）
> 🎯 **形式**: 講師サポート付きプロジェクト完成・発表
> ⏰ **時間**: 60分

## 📚 関連補足資料

プロジェクト完成をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step05_補足_実践コード例.md)** - 完全なシステム実装例とベストプラクティス
- 🚨 **[トラブルシューティング](./Step05_補足_トラブルシューティング.md)** - デバッグとエラー解決の完全ガイド
- 📖 **[専門用語集](./Step05_補足_専門用語集.md)** - 高度な概念と用語の詳細解説
- 🌐 **[参考リソース](./Step05_補足_参考リソース.md)** - 継続学習のためのリソース集
- 🔧 **[開発環境ガイド](./Step05_補足_開発環境ガイド.md)** - 効率的な開発環境の活用

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] 型安全なキャッシュシステムの完成
- [ ] ジェネリクスコードのデバッグ・最適化
- [ ] 学習成果の発表・共有
- [ ] Step05全体の振り返りと次ステップの確認

**前提知識**:

- Session1-2の内容（ジェネリクス基礎・実践演習）
- ジェネリック関数ライブラリの部分実装
- 基本的なクラス設計とデータ構造の理解

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                           | 講師の役割                 | 学習者の活動   | 成果物       |
| ------------ | ------------------------------ | -------------------------- | -------------- | ------------ |
| **0-10分**   | 最終課題説明・目標設定         | 課題説明・期待値設定       | 理解・質問     | 実装計画     |
| **10-45分**  | キャッシュシステム完成・デバッグ | 個別サポート・デバッグ支援 | 開発・完成     | 完成システム |
| **45-60分**  | 成果発表・総括・次ステップ     | 評価・フィードバック       | 発表・振り返り | 学習成果     |

---

## 🎯 最終課題：型安全なキャッシュシステム完成

> 📚 **実装サポート**: [実践コード例 - 型安全なキャッシュシステム完全版](./Step05_補足_実践コード例.md#型安全なキャッシュシステム完全版) | [トラブルシューティング - デバッグガイド](./Step05_補足_トラブルシューティング.md#デバッグのコツ)

### 課題概要

Session2で学習したジェネリクスの知識を活用して、型安全で高機能なキャッシュシステムを完成させてください。このシステムは、実際のWebアプリケーションで使用できるレベルの機能を持つ実用的なライブラリです。

### 必須実装機能

#### 1. 基本キャッシュ機能（Session2からの継続）

```typescript
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  accessCount: number;
  createdAt: number;
  lastAccessed: number;
}

class TypeSafeCache<TSchema extends Record<string, unknown>> {
  private cache = new Map<keyof TSchema, CacheEntry<TSchema[keyof TSchema]>>();
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
  };

  constructor(
    private defaultTtl: number = 60000, // デフォルト1分
    private maxSize: number = 1000 // 最大エントリ数
  ) {}

  // 基本的なget/set操作
  set<K extends keyof TSchema>(
    key: K,
    value: TSchema[K],
    ttl: number = this.defaultTtl
  ): void {
    // 実装済み（Session2から継続）
  }

  get<K extends keyof TSchema>(key: K): TSchema[K] | null {
    // 実装済み（Session2から継続）
  }

  has<K extends keyof TSchema>(key: K): boolean {
    // 実装済み（Session2から継続）
  }

  delete<K extends keyof TSchema>(key: K): boolean {
    // 実装済み（Session2から継続）
  }

  clear(): void {
    // 実装済み（Session2から継続）
  }
}
```

#### 2. 新規追加機能

以下の高度な機能を追加実装してください：

```typescript
class TypeSafeCache<TSchema extends Record<string, unknown>> {
  // ... 既存のコード ...

  // 1. LRU（Least Recently Used）エビクション
  private evictLRU(): void {
    if (this.cache.size <= this.maxSize) return;

    let oldestKey: keyof TSchema | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey !== null) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  // 2. バッチ操作
  setMany<K extends keyof TSchema>(
    entries: Array<{ key: K; value: TSchema[K]; ttl?: number }>
  ): void {
    for (const entry of entries) {
      this.set(entry.key, entry.value, entry.ttl);
    }
  }

  getMany<K extends keyof TSchema>(keys: K[]): Record<K, TSchema[K] | null> {
    const result = {} as Record<K, TSchema[K] | null>;
    for (const key of keys) {
      result[key] = this.get(key);
    }
    return result;
  }

  // 3. 条件付き操作
  getOrSet<K extends keyof TSchema>(
    key: K,
    factory: () => TSchema[K] | Promise<TSchema[K]>,
    ttl?: number
  ): TSchema[K] | Promise<TSchema[K]> {
    const existing = this.get(key);
    if (existing !== null) {
      return existing;
    }

    const value = factory();
    if (value instanceof Promise) {
      return value.then(resolvedValue => {
        this.set(key, resolvedValue, ttl);
        return resolvedValue;
      });
    } else {
      this.set(key, value, ttl);
      return value;
    }
  }

  // 4. 統計情報とメトリクス
  getStats(): {
    size: number;
    hits: number;
    misses: number;
    evictions: number;
    hitRate: number;
    memoryUsage: number;
  } {
    const total = this.stats.hits + this.stats.misses;
    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      evictions: this.stats.evictions,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      memoryUsage: this.estimateMemoryUsage(),
    };
  }

  private estimateMemoryUsage(): number {
    // 簡易的なメモリ使用量推定
    let size = 0;
    for (const [key, entry] of this.cache.entries()) {
      size += JSON.stringify(key).length;
      size += JSON.stringify(entry.value).length;
      size += 64; // メタデータのオーバーヘッド
    }
    return size;
  }

  // 5. 期限切れエントリの自動クリーンアップ
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  // 6. キーのパターンマッチング
  getKeysMatching(pattern: RegExp): Array<keyof TSchema> {
    const matchingKeys: Array<keyof TSchema> = [];
    for (const key of this.cache.keys()) {
      if (pattern.test(String(key))) {
        matchingKeys.push(key);
      }
    }
    return matchingKeys;
  }

  // 7. エントリの詳細情報取得
  getEntryInfo<K extends keyof TSchema>(key: K): {
    exists: boolean;
    value?: TSchema[K];
    expiresAt?: number;
    accessCount?: number;
    createdAt?: number;
    lastAccessed?: number;
    ttl?: number;
  } {
    const entry = this.cache.get(key);
    if (!entry) {
      return { exists: false };
    }

    const now = Date.now();
    return {
      exists: true,
      value: entry.value as TSchema[K],
      expiresAt: entry.expiresAt,
      accessCount: entry.accessCount,
      createdAt: entry.createdAt,
      lastAccessed: entry.lastAccessed,
      ttl: entry.expiresAt - now,
    };
  }

  // 8. イベントリスナー（オプション）
  private listeners: {
    set?: Array<(key: keyof TSchema, value: any) => void>;
    get?: Array<(key: keyof TSchema, hit: boolean) => void>;
    delete?: Array<(key: keyof TSchema) => void>;
    evict?: Array<(key: keyof TSchema) => void>;
  } = {};

  on<E extends keyof typeof this.listeners>(
    event: E,
    listener: NonNullable<typeof this.listeners[E]>[0]
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  private emit<E extends keyof typeof this.listeners>(
    event: E,
    ...args: Parameters<NonNullable<typeof this.listeners[E]>[0]>
  ): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      for (const listener of eventListeners) {
        listener(...args);
      }
    }
  }
}
```

#### 3. ジェネリクス活用の強化

以下の型安全性を強化する機能を実装してください：

```typescript
// 1. 型安全なキー生成ヘルパー
class CacheKeyBuilder<TSchema extends Record<string, unknown>> {
  static user<T>(id: number): `user:${number}` {
    return `user:${id}`;
  }

  static userProfile<T>(id: number): `user:${number}:profile` {
    return `user:${id}:profile`;
  }

  static apiResponse<T>(endpoint: string, params?: Record<string, any>): string {
    const paramString = params ? `:${JSON.stringify(params)}` : '';
    return `api:${endpoint}${paramString}`;
  }
}

// 2. 型安全なキャッシュファクトリー
class CacheFactory {
  static createUserCache() {
    interface UserCacheSchema {
      [key: `user:${number}`]: { id: number; name: string; email: string };
      [key: `user:${number}:profile`]: { bio: string; avatar: string };
      [key: `user:${number}:preferences`]: { theme: 'light' | 'dark'; language: string };
    }

    return new TypeSafeCache<UserCacheSchema>(300000, 500); // 5分TTL, 500エントリ
  }

  static createApiCache() {
    interface ApiCacheSchema {
      [key: `api:users`]: Array<{ id: number; name: string }>;
      [key: `api:posts:${number}`]: { id: number; title: string; content: string };
      [key: string]: any; // その他のAPIレスポンス
    }

    return new TypeSafeCache<ApiCacheSchema>(60000, 1000); // 1分TTL, 1000エントリ
  }
}

// 3. キャッシュデコレーター（高度）
function Cached<T extends Record<string, unknown>>(
  cache: TypeSafeCache<T>,
  keyGenerator: (...args: any[]) => keyof T,
  ttl?: number
) {
  return function <TTarget, TKey extends string | symbol, TDescriptor extends TypedPropertyDescriptor<(...args: any[]) => any>>(
    target: TTarget,
    propertyKey: TKey,
    descriptor: TDescriptor
  ) {
    const originalMethod = descriptor.value!;

    descriptor.value = function (...args: any[]) {
      const cacheKey = keyGenerator(...args);
      const cached = cache.get(cacheKey);
      
      if (cached !== null) {
        return cached;
      }

      const result = originalMethod.apply(this, args);
      cache.set(cacheKey, result, ttl);
      return result;
    } as TDescriptor['value'];

    return descriptor;
  };
}
```

### 実装のヒント

1. **段階的実装**: 一つずつ機能を追加し、動作確認を行う
2. **型安全性**: すべての関数に適切な型注釈を付ける
3. **エラーハンドリング**: 想定される例外ケースを考慮する
4. **テストデータ**: 実装した機能をテストするためのサンプルデータを用意
5. **パフォーマンス**: メモリ使用量とアクセス速度を意識した実装

### 使用例とテストケース

```typescript
// 使用例
interface AppCacheSchema {
  "user:profile": { id: number; name: string; email: string };
  "user:preferences": { theme: "light" | "dark"; language: string };
  "api:users": Array<{ id: number; name: string }>;
  [key: `post:${number}`]: { id: number; title: string; content: string };
}

const cache = new TypeSafeCache<AppCacheSchema>(300000, 100); // 5分TTL, 100エントリ

// 基本操作のテスト
cache.set("user:profile", { id: 1, name: "Alice", email: "alice@example.com" });
const profile = cache.get("user:profile");
console.log(profile); // { id: 1, name: "Alice", email: "alice@example.com" }

// バッチ操作のテスト
cache.setMany([
  { key: "user:preferences", value: { theme: "dark", language: "ja" } },
  { key: "api:users", value: [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }] }
]);

const batchResult = cache.getMany(["user:profile", "user:preferences"]);
console.log(batchResult);

// 統計情報の確認
console.log(cache.getStats());

// getOrSetのテスト
const users = cache.getOrSet("api:users", () => {
  console.log("Fetching users from API...");
  return [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
});

// イベントリスナーのテスト
cache.on("set", (key, value) => {
  console.log(`Cache set: ${String(key)} = ${JSON.stringify(value)}`);
});

cache.on("get", (key, hit) => {
  console.log(`Cache ${hit ? 'hit' : 'miss'}: ${String(key)}`);
});
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある実装上の問題と解決法

**Q: 型安全性を保ちながら動的なキーを扱うにはどうすればよいですか？**
A: テンプレートリテラル型を使用して、動的でありながら型安全なキーを定義できます。例：`user:${number}:profile`

**Q: メモリリークを防ぐにはどうすればよいですか？**
A: 適切なTTL設定、最大サイズ制限、定期的なクリーンアップ処理を実装することが重要です。

**Q: 非同期処理との組み合わせで注意すべき点は？**
A: Promise の結果をキャッシュする場合は、エラーハンドリングと適切な型定義に注意が必要です。

**Q: パフォーマンスを最適化するには？**
A: アクセス頻度の高いデータの優先度を上げ、LRU エビクションを適切に実装することが効果的です。

---

## 成果物

- [ ] **型安全なキャッシュシステム**: ジェネリクス練習に特化した学習者向けプロジェクト → [Step05成果物](./Step05_成果物.md)で詳細確認

---

## 📊 Step05総合評価

### 最終評価基準

#### 技術習得度（60%）

- [ ] **ジェネリクス基礎**: 基本的なジェネリック関数・クラスの実装
- [ ] **ジェネリクス実践**: 制約・複数型パラメータの活用
- [ ] **ジェネリクス応用**: 実用的なライブラリ・システムの設計
- [ ] **エラーハンドリング**: 適切な例外処理の実装

#### 実装品質（25%）

- [ ] **コードの可読性**: 変数名・関数名の適切性
- [ ] **型安全性**: ジェネリクスの恩恵を活用
- [ ] **保守性**: 拡張しやすい設計
- [ ] **動作確認**: 実装した機能の正常動作

#### 学習姿勢（15%）

- [ ] **積極性**: 質問・議論への参加
- [ ] **問題解決**: 自力でのデバッグ・調査
- [ ] **協調性**: 他の学習者との協力
- [ ] **振り返り**: 学習内容の整理・次ステップの計画

### 学習成果の発表

各学習者は以下の内容で5分間の発表を行ってください：

1. **実装したキャッシュシステムの概要**（2分）
   - 主要機能の紹介
   - 技術的な工夫点

2. **ジェネリクスの活用ポイント**（2分）
   - 型安全性の確保方法
   - 再利用性の向上事例

3. **学習の振り返りと今後の展望**（1分）
   - 理解できた点・困難だった点
   - 次のステップでの活用予定

### Step05で身につけた技術スキル

- ✅ **ジェネリクスの基本概念**: 型パラメータ・型推論・制約
- ✅ **実践的な設計パターン**: ジェネリッククラス・ライブラリ設計
- ✅ **型安全なシステム構築**: キャッシュ・API クライアント
- ✅ **高度な型操作**: keyof・条件付き型・テンプレートリテラル型

---

**🎉 お疲れ様でした！** Step05を通じてジェネリクスの基礎をしっかりと身につけることができました。

**🚀 次のStep06では、より高度なユーティリティ型と実践的な開発手法を学習します！**

### 次週への準備

1. **復習**: 今回実装したキャッシュシステムのコードを再確認
2. **予習**: ユーティリティ型（Partial、Pick、Omit等）の基本概念
3. **環境準備**: TypeScript Playground での型操作実験
4. **実践**: 今回学んだジェネリクスを他のプロジェクトで活用

**📌 重要**: ジェネリクスは TypeScript の再利用性と型安全性を両立させる重要な技術です。今回の学習を基盤として、より高度な型システムの理解を深めていきましょう。