# エンティティストアパターン - Jotai実装ガイド

## 概要

このドキュメントでは、Jotaiを使用したエンティティの共通操作と独自実装を両立させる設計パターンについて説明します。

## アーキテクチャ

### 設計原則

1. **DRY (Don't Repeat Yourself)**: 共通のCRUD操作を一度実装し、全エンティティで再利用
2. **型安全性**: TypeScriptのジェネリクスを活用した完全な型安全性
3. **拡張性**: エンティティ固有の操作を簡単に追加可能
4. **一貫性**: 全エンティティで統一されたAPIパターン

### コンポーネント構成

```
src/store/
├── entity-store.ts      # 共通のエンティティストアファクトリー
├── user-store.ts        # ユーザー固有の実装
├── product-store.ts     # 商品固有の実装
└── base-store.ts        # 旧実装（参考用）
```

## 基本的な使用方法

### 1. エンティティの定義

```typescript
import { WithId } from "./entity-store";

export interface User extends WithId {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  active?: boolean;
}
```

### 2. ストアの作成

```typescript
import { createEntityStore } from "./entity-store";

export const userStore = createEntityStore<User>();
```

### 3. 固有アクションの定義

```typescript
export type UserSpecificAction = 
  | { type: 'updateEmail'; payload: { id: string; email: string } }
  | { type: 'toggleActive'; payload: string };

export const userSpecificActionsAtom = atom(
  null,
  (get, set, action: UserSpecificAction) => {
    // 固有の操作を実装
  }
);
```

### 4. Hookの作成

```typescript
import { createEntityHook } from "./entity-store";

export const useUsers = createEntityHook(userStore, userSpecificActionsAtom);
```

### 5. コンポーネントでの使用

```typescript
function UserComponent() {
  const { entities: users, actions, dispatchSpecific } = useUsers();
  
  const addUser = () => {
    const newUser = createUser("John", "Doe", "john@example.com");
    actions.add(newUser);
  };
  
  const toggleActive = (id: string) => {
    dispatchSpecific?.({ type: 'toggleActive', payload: id });
  };
  
  return (
    // JSX
  );
}
```

## 提供される機能

### 共通操作

すべてのエンティティで以下の操作が利用可能：

- `add(entity)`: エンティティの追加
- `remove(id)`: IDによるエンティティの削除
- `update(id, data)`: エンティティの部分更新
- `clear()`: 全エンティティの削除

### 派生Atom

各ストアには以下の派生Atomが自動生成：

- `entitiesAtom`: エンティティ配列
- `countAtom`: エンティティ数
- `byIdAtom`: IDによるエンティティマップ

### カスタム派生Atom

エンティティ固有の派生Atomを簡単に作成可能：

```typescript
export const activeUsersAtom = atom(get => 
  get(userStore.entitiesAtom).filter(user => user.active !== false)
);
```

## 実装例

### ユーザーストア

```typescript
// ユーザー固有の派生Atom
export const usersByDomainAtom = atom(get => {
  const users = get(userStore.entitiesAtom);
  return users.reduce((acc, user) => {
    const domain = user.email.split('@')[1];
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(user);
    return acc;
  }, {} as Record<string, User[]>);
});

// ユーザー固有のアクション
export const userSpecificActionsAtom = atom(
  null,
  (get, set, action: UserSpecificAction) => {
    switch (action.type) {
      case 'updateEmail':
        set(userStore.actionsAtom, {
          type: 'update',
          payload: { id: action.payload.id, data: { email: action.payload.email } }
        });
        break;
      // その他のアクション...
    }
  }
);
```

### 商品ストア

```typescript
// 商品固有の派生Atom
export const productsByCategoryAtom = atom(get => {
  const products = get(productStore.entitiesAtom);
  return products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);
});

// 商品固有のアクション
export const productSpecificActionsAtom = atom(
  null,
  (get, set, action: ProductSpecificAction) => {
    switch (action.type) {
      case 'applyDiscount':
        const productsToUpdate = get(productStore.entitiesAtom)
          .filter(p => p.category === action.payload.categoryId);
        productsToUpdate.forEach(product => {
          const discountedPrice = product.price * (1 - action.payload.discount);
          set(productStore.actionsAtom, {
            type: 'update',
            payload: { id: product.id, data: { price: discountedPrice } }
          });
        });
        break;
      // その他のアクション...
    }
  }
);
```

## 利点

### 1. コードの再利用性
- 共通操作は一度実装すれば全エンティティで利用可能
- 新しいエンティティの追加が簡単

### 2. 型安全性
- TypeScriptのジェネリクスにより完全な型安全性を保持
- コンパイル時にエラーを検出

### 3. 拡張性
- エンティティ固有の操作を簡単に追加可能
- 既存コードを変更せずに機能拡張

### 4. 一貫性
- 全エンティティで統一されたAPIパターン
- 学習コストの削減

### 5. 保守性
- 共通ロジックの変更が全エンティティに自動適用
- バグ修正や改善の影響範囲が明確

## ベストプラクティス

### 1. エンティティの設計
- `WithId`インターフェースを必ず実装
- オプショナルプロパティは`?`を使用
- 計算プロパティは派生Atomで実装

### 2. アクションの設計
- 共通操作で対応できない場合のみ固有アクションを作成
- アクション名は動詞で開始（例：`updateEmail`, `toggleActive`）
- ペイロードは明確な型定義を提供

### 3. 派生Atomの活用
- 計算処理は派生Atomで実装
- パフォーマンスを考慮してメモ化を活用
- 複雑な計算は別ファイルに分離

### 4. エラーハンドリング
- 不正なIDでの操作に対する適切な処理
- 非同期操作のエラーハンドリング
- ユーザーフレンドリーなエラーメッセージ

## 今後の拡張可能性

### 1. 非同期操作のサポート
- API呼び出しの統合
- `jotai/utils`の`loadable`を活用

### 2. 永続化
- LocalStorageとの連携
- サーバーとの同期

### 3. バリデーション
- スキーマバリデーションの統合
- 入力値の検証

### 4. 最適化
- 大量データの処理最適化
- 仮想化の実装

## まとめ

このエンティティストアパターンにより、Jotaiの利点を活かしながら、エンティティの共通操作と独自実装を効率的に両立できます。型安全性、再利用性、拡張性を兼ね備えた設計により、保守性の高いアプリケーションの構築が可能です。