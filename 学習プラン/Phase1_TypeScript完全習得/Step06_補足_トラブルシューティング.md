# Step06 トラブルシューティング

> 💡 **このファイルについて**: ユーティリティ型でよくあるエラーと解決方法をまとめたガイドです。

## 📋 目次
1. [ユーティリティ型基本エラー](#ユーティリティ型基本エラー)
2. [カスタムユーティリティ型エラー](#カスタムユーティリティ型エラー)
3. [型レベルプログラミングエラー](#型レベルプログラミングエラー)
4. [パフォーマンス関連問題](#パフォーマンス関連問題)

---

## ユーティリティ型基本エラー

### "Type 'X' does not satisfy the constraint 'keyof T'"
**原因**: Pick/Omitで存在しないキーを指定

**エラー例**:
```typescript
interface User {
  id: number;
  name: string;
}

type InvalidPick = Pick<User, 'id' | 'email'>; // Error: 'email' doesn't exist
```

**解決方法**:
```typescript
// 解決方法1: 正しいキーを指定
type ValidPick = Pick<User, 'id' | 'name'>;

// 解決方法2: 安全なPick型を作成
type SafePick<T, K extends string> = Pick<T, K & keyof T>;
type SafeUserPick = SafePick<User, 'id' | 'email'>; // 'id'のみ
```

### "Type instantiation is excessively deep"
**原因**: 再帰的なユーティリティ型が深すぎる

**解決方法**:
```typescript
// 問題のあるコード
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 解決方法: 深度制限
type DeepPartial<T, Depth extends number = 5> = Depth extends 0
  ? T
  : {
      [P in keyof T]?: T[P] extends object 
        ? DeepPartial<T[P], Prev<Depth>>
        : T[P];
    };

type Prev<T extends number> = T extends 5 ? 4
  : T extends 4 ? 3
  : T extends 3 ? 2
  : T extends 2 ? 1
  : T extends 1 ? 0
  : never;
```

---

## カスタムユーティリティ型エラー

### "Cannot find name 'infer'"
**原因**: inferキーワードの誤用

**解決方法**:
```typescript
// 正しいinferの使用
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 条件型内でのみ使用可能
type ExtractArrayType<T> = T extends (infer U)[] ? U : never;
```

### "Circular reference in type alias"
**原因**: 型エイリアスの循環参照

**解決方法**:
```typescript
// 問題のあるコード
type BadRecursive<T> = {
  value: T;
  next: BadRecursive<T>; // 循環参照
};

// 解決方法: インターフェースを使用
interface GoodRecursive<T> {
  value: T;
  next?: GoodRecursive<T>;
}
```

---

## 型レベルプログラミングエラー

### "Expression produces a union type that is too complex"
**原因**: 複雑すぎるユニオン型

**解決方法**:
```typescript
// 問題を回避する設計
type SimpleUnion = 'a' | 'b' | 'c';
type ComplexType<T extends SimpleUnion> = T extends 'a' 
  ? TypeA 
  : T extends 'b' 
  ? TypeB 
  : TypeC;
```

---

## パフォーマンス関連問題

### コンパイル時間の最適化
```typescript
// 効率的なユーティリティ型の設計
type OptimizedPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// キャッシュ可能な型定義
type CachedUtility<T> = T extends string ? string : T extends number ? number : T;
```

---

## 🚨 緊急時の対処法

### 型エラーが大量発生した場合
```typescript
// 一時的にany型を使用
type TemporaryAny<T> = any;

// 段階的に型を修正
type PartialFix<T> = Partial<T>;
```

---

**📌 重要**: ユーティリティ型は強力ですが、複雑になりすぎないよう注意が必要です。段階的に学習し、実際のプロジェクトで経験を積むことが重要です。