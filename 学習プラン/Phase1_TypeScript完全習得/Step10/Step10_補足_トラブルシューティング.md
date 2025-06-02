# Step10 トラブルシューティング

> 💡 **このファイルについて**: 高度な型機能でよくあるエラーと解決方法をまとめたガイドです。

## 📋 目次
1. [条件型関連エラー](#条件型関連エラー)
2. [テンプレートリテラル型エラー](#テンプレートリテラル型エラー)
3. [再帰型エラー](#再帰型エラー)
4. [パフォーマンス問題](#パフォーマンス問題)

---

## 条件型関連エラー

### "Type instantiation is excessively deep" エラー
**原因**: 条件型の再帰が深すぎる

**解決方法**:
```typescript
// 問題のあるコード
type BadDeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? BadDeepPartial<T[P]> : T[P];
};

// 解決方法：深度制限を追加
type GoodDeepPartial<T, Depth extends number = 5> = Depth extends 0
  ? T
  : {
      [P in keyof T]?: T[P] extends object 
        ? GoodDeepPartial<T[P], Prev<Depth>>
        : T[P];
    };

type Prev<T extends number> = T extends 1 ? 0 : T extends 2 ? 1 : T extends 3 ? 2 : T extends 4 ? 3 : T extends 5 ? 4 : never;
```

### 分散条件型の予期しない動作
**解決方法**:
```typescript
// 分散を防ぐ場合
type NonDistributive<T> = [T] extends [string] ? true : false;

// 分散を利用する場合
type Distributive<T> = T extends string ? true : false;

type Test1 = NonDistributive<string | number>; // false
type Test2 = Distributive<string | number>; // boolean
```

---

## テンプレートリテラル型エラー

### "Expression produces a union type that is too complex" エラー
**解決方法**:
```typescript
// 問題：複雑すぎるユニオン型
type BadCombination = `${string}-${string}-${string}`;

// 解決：より具体的な型を使用
type GoodCombination<T extends string, U extends string> = `${T}-${U}`;
```

---

## 再帰型エラー

### 無限再帰の防止
**解決方法**:
```typescript
// 安全な再帰型の実装
type SafeDeepReadonly<T, Visited = never> = T extends Visited
  ? T
  : T extends object
  ? {
      readonly [P in keyof T]: SafeDeepReadonly<T[P], Visited | T>;
    }
  : T;
```

---

## パフォーマンス問題

### 型チェックの最適化
**解決方法**:
```typescript
// 遅延評価を使用
type LazyType<T> = T extends any ? SomeComplexType<T> : never;

// キャッシュ機能付きの型
type CachedType<T> = T extends infer U ? U extends SomeType ? CachedResult<U> : never : never;
```

---

**📌 重要**: 高度な型機能を使用する際は、パフォーマンスと可読性のバランスを考慮しましょう。複雑すぎる型は避け、必要に応じて制限を設けることが重要です。