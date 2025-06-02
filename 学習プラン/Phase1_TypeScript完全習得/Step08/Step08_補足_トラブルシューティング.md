# Step08 トラブルシューティング

> 💡 **このファイルについて**: ライブラリ統合と型定義でよくあるエラーと解決方法をまとめたガイドです。

## 📋 目次
1. [型定義関連エラー](#型定義関連エラー)
2. [ライブラリ統合エラー](#ライブラリ統合エラー)
3. [モジュール解決エラー](#モジュール解決エラー)
4. [宣言ファイルエラー](#宣言ファイルエラー)

---

## 型定義関連エラー

### "Cannot find module" エラー
**原因**: 型定義ファイルが見つからない

**解決方法**:
```bash
# @typesパッケージをインストール
npm install -D @types/lodash
npm install -D @types/express

# または、カスタム型定義を作成
# types/custom-module.d.ts
declare module 'my-custom-module' {
  export function doSomething(): void;
}
```

### "Module has no exported member" エラー
**解決方法**:
```typescript
// 正しいインポート方法を確認
import * as _ from 'lodash'; // 名前空間インポート
import { debounce } from 'lodash'; // 名前付きインポート
import _ from 'lodash'; // デフォルトインポート
```

---

## ライブラリ統合エラー

### 型の不一致エラー
**解決方法**:
```typescript
// 型アサーションを使用
const data = response.data as MyType;

// 型ガードを作成
function isMyType(obj: any): obj is MyType {
  return obj && typeof obj.property === 'string';
}
```

### "Property does not exist on type" エラー
**解決方法**:
```typescript
// モジュール拡張を使用
declare module 'existing-module' {
  interface ExistingInterface {
    newProperty: string;
  }
}
```

---

## モジュール解決エラー

### パス解決の問題
**解決方法**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/types/*": ["types/*"]
    }
  }
}
```

---

## 宣言ファイルエラー

### "Duplicate identifier" エラー
**解決方法**:
```typescript
// 名前空間を使用して衝突を回避
declare namespace MyLibrary {
  interface Config {
    timeout: number;
  }
}
```

---

**📌 重要**: ライブラリ統合では、型定義の正確性と互換性を確保することが重要です。エラーが発生した場合は、公式ドキュメントを確認し、適切な型定義を使用しましょう。