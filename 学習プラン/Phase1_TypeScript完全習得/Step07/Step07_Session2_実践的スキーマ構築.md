# Session2: 実践的スキーマ構築（90 分）

> 💡 **対象**: Session1 完了者（Zod 基本概念・スキーマ定義習得済み）
> 🎯 **形式**: 講師サポート付き実装演習
> ⏰ **時間**: 90 分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step07_補足_実践コード例.md)** - 高度なバリデーション・API 統合の完全ガイド
- 🚨 **[トラブルシューティング](./Step07_補足_トラブルシューティング.md)** - スキーマ構築でよくあるエラーと解決方法
- 📖 **[専門用語集](./Step07_補足_専門用語集.md)** - 高度な Zod 概念・パターンの詳細解説
- 🌐 **[参考リソース](./Step07_補足_参考リソース.md)** - 学習に役立つリンク集とリソース
- 🔧 **[開発環境ガイド](./Step07_補足_開発環境ガイド.md)** - 効率的な開発環境の活用

> 💡 **活用方法**: 実装中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] 高度なバリデーション技法の実装
- [ ] API レスポンス処理とデータ変換の実践
- [ ] スキーマの合成とマージテクニック
- [ ] transform()を使ったデータ正規化
- [ ] 実践的なスキーマ設計パターンの習得

**前提知識**:

- Session1 の内容（Zod 基本概念、基本スキーマ定義、エラーハンドリング）
- TypeScript の高度な型システム（ジェネリクス、ユーティリティ型）
- 非同期処理（Promise、async/await）の理解

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                     | 講師の役割           | 学習者の活動 | 成果物             |
| ------------ | ------------------------ | -------------------- | ------------ | ------------------ |
| **0-10 分**  | 前回復習・目標設定       | 復習・説明・質疑応答 | 理解・質問   | 理解確認           |
| **10-40 分** | 高度なバリデーション技法 | 実演・個別サポート   | ハンズオン   | バリデーション実装 |
| **40-70 分** | API レスポンス処理実践   | 巡回サポート・ヒント | 個人作業     | API 統合実装       |
| **70-90 分** | スキーマ合成・振り返り   | デバッグ支援・まとめ | テスト・確認 | 統合テスト         |

---

## 📚 学習内容

### Section 1: 高度なバリデーション技法

> 📚 **関連資料**: [専門用語集 - 高度なバリデーション](./Step07_補足_専門用語集.md#高度なバリデーション) | [実践コード例 - バリデーション実装](./Step07_補足_実践コード例.md#バリデーション実装)

#### 🔍 superRefine() を使った複雑なバリデーション

**💡 なぜ superRefine()が重要なのか**

superRefine()は、複雑なビジネスロジックを含むバリデーションを実装するための強力な機能です。単純な refine()では対応できない、複数フィールドの相互関係や条件分岐を含むバリデーションを効率的に実装できます。

**🎓 学習のポイント**: 段階的に superRefine()の概念を理解し、実際の業務でよくあるパターンを習得

```typescript
import { z } from "zod";

// === STEP 1: 基本的なsuperRefine()の理解 ===
console.log("=== superRefine()の基本動作 ===");

const UserProfileSchema = z
  .object({
    name: z.string(),
    birthDate: z.date(),
    email: z.string().email(),
    phone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // 🔍 重要：superRefine()内では複数のチェックが可能
    console.log("バリデーション実行中のデータ:", data);

    // 年齢計算のロジック
    const today = new Date();
    const age = today.getFullYear() - data.birthDate.getFullYear();

    // 🎯 条件1: 18歳未満の場合は電話番号が必須
    if (age < 18 && !data.phone) {
      console.log("未成年者に対する電話番号チェックが発動");
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "18歳未満の場合、電話番号は必須です",
        path: ["phone"], // エラーを特定のフィールドに関連付け
      });
    }

    // 🎯 条件2: 未来の生年月日は無効
    if (data.birthDate > today) {
      console.log("未来の生年月日チェックが発動");
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "生年月日は過去の日付である必要があります",
        path: ["birthDate"],
      });
    }

    // 🎯 条件3: 年齢が120歳を超える場合は警告
    if (age > 120) {
      console.log("高齢者チェックが発動");
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "年齢が120歳を超えています。正しい生年月日を入力してください",
        path: ["birthDate"],
      });
    }
  });

// 📝 実際にテストしてみよう
console.log("=== バリデーションテスト ===");

// テスト1: 未成年者の電話番号チェック
const minorData = {
  name: "田中花子",
  birthDate: new Date("2010-05-15"), // 未成年
  email: "hanako@example.com",
  // phone は未設定
};

console.log("未成年者データ:", UserProfileSchema.safeParse(minorData));

// テスト2: 未来の生年月日
const futureData = {
  name: "未来人",
  birthDate: new Date("2030-01-01"), // 未来の日付
  email: "future@example.com",
  phone: "090-1234-5678",
};

console.log("未来データ:", UserProfileSchema.safeParse(futureData));

// === STEP 2: ビジネスルールの実装 ===
console.log("=== ビジネスルール実装例 ===");

const InvoiceSchema = z
  .object({
    items: z.array(
      z.object({
        name: z.string(),
        quantity: z.number().positive(),
        price: z.number().positive(),
      })
    ),
    discount: z.number().min(0).max(1), // 0-100%の割引率
    taxRate: z.number().min(0).max(1),
  })
  .superRefine((data, ctx) => {
    // 🔍 重要：ビジネスロジックの計算をバリデーション内で実行
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const discountAmount = subtotal * data.discount;
    const taxableAmount = subtotal - discountAmount;
    const total = taxableAmount * (1 + data.taxRate);

    console.log(
      `計算結果 - 小計: ${subtotal}, 割引: ${discountAmount}, 合計: ${total}`
    );

    // 🎯 ビジネスルール1: 最低注文金額のチェック
    if (total < 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "最低注文金額は100円です",
        path: [], // ルートレベルのエラー
      });
    }

    // 🎯 ビジネスルール2: 割引率の制限
    if (data.discount > 0.5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "50%を超える割引は管理者の承認が必要です",
        path: ["discount"],
      });
    }

    // 🎯 ビジネスルール3: 商品数の制限
    if (data.items.length > 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "一度に注文できる商品は50個までです",
        path: ["items"],
      });
    }
  });

// 📝 請求書のテスト
const invoiceData = {
  items: [
    { name: "商品A", quantity: 2, price: 30 }, // 60円
    { name: "商品B", quantity: 1, price: 20 }, // 20円 → 合計80円
  ],
  discount: 0.1, // 10%割引
  taxRate: 0.1, // 10%税
};

console.log("請求書データ:", InvoiceSchema.safeParse(invoiceData));

// === STEP 3: 条件付きスキーマバリデーション ===
console.log("=== 条件付きバリデーション ===");

const ProductSchema = z
  .object({
    type: z.enum(["physical", "digital", "service"]),
    name: z.string(),
    price: z.number().positive(),
    weight: z.number().optional(),
    dimensions: z
      .object({
        width: z.number(),
        height: z.number(),
        depth: z.number(),
      })
      .optional(),
    downloadUrl: z.string().url().optional(),
    duration: z.number().optional(), // サービスの場合の提供時間（分）
  })
  .superRefine((data, ctx) => {
    // 🔍 重要：商品タイプによって必要な情報が変わる
    console.log(`商品タイプ: ${data.type} の検証を実行`);

    switch (data.type) {
      case "physical":
        console.log("物理商品の検証実行");
        // 物理商品の場合は重量と寸法が必須
        if (!data.weight) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "物理商品の場合、重量は必須です",
            path: ["weight"],
          });
        }
        if (!data.dimensions) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "物理商品の場合、寸法は必須です",
            path: ["dimensions"],
          });
        }
        break;

      case "digital":
        console.log("デジタル商品の検証実行");
        // デジタル商品の場合はダウンロードURLが必須
        if (!data.downloadUrl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "デジタル商品の場合、ダウンロードURLは必須です",
            path: ["downloadUrl"],
          });
        }
        break;

      case "service":
        console.log("サービス商品の検証実行");
        // サービスの場合は提供時間が必須
        if (!data.duration) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "サービスの場合、提供時間は必須です",
            path: ["duration"],
          });
        }
        break;
    }
  });

// 📝 各商品タイプをテスト
const physicalProduct = {
  type: "physical",
  name: "本",
  price: 1500,
  weight: 0.3,
  dimensions: { width: 15, height: 21, depth: 2 },
};

const digitalProduct = {
  type: "digital",
  name: "電子書籍",
  price: 1000,
  downloadUrl: "https://example.com/download/book.pdf",
};

const serviceProduct = {
  type: "service",
  name: "コンサルティング",
  price: 10000,
  duration: 60, // 60分
};

console.log("物理商品:", ProductSchema.safeParse(physicalProduct));
console.log("デジタル商品:", ProductSchema.safeParse(digitalProduct));
console.log("サービス商品:", ProductSchema.safeParse(serviceProduct));
```

**🎓 理解度チェック**

- `ctx.addIssue()` の `path` パラメータの役割は理解できましたか？
- 複数の条件を一つの `superRefine()` 内でチェックする利点は分かりますか？
- ビジネスロジックの計算とバリデーションを組み合わせる手法は理解できましたか？
- 条件分岐（switch 文）を使った動的バリデーションの仕組みは分かりますか？

// 2. ビジネスルールの実装
const InvoiceSchema = z
.object({
items: z.array(
z.object({
name: z.string(),
quantity: z.number().positive(),
price: z.number().positive(),
})
),
discount: z.number().min(0).max(1), // 0-100%の割引率
taxRate: z.number().min(0).max(1),
})
.superRefine((data, ctx) => {
const subtotal = data.items.reduce(
(sum, item) => sum + item.quantity _ item.price,
0
);
const discountAmount = subtotal _ data.discount;
const taxableAmount = subtotal - discountAmount;
const total = taxableAmount \* (1 + data.taxRate);

    // 最低注文金額のチェック
    if (total < 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "最低注文金額は100円です",
        path: [],
      });
    }

    // 割引が大きすぎる場合の警告
    if (data.discount > 0.5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "50%を超える割引は管理者の承認が必要です",
        path: ["discount"],
      });
    }

});

// 3. 条件付きスキーマバリデーション
const ProductSchema = z
.object({
type: z.enum(["physical", "digital", "service"]),
name: z.string(),
price: z.number().positive(),
weight: z.number().optional(),
dimensions: z
.object({
width: z.number(),
height: z.number(),
depth: z.number(),
})
.optional(),
downloadUrl: z.string().url().optional(),
duration: z.number().optional(), // サービスの場合の提供時間（分）
})
.superRefine((data, ctx) => {
switch (data.type) {
case "physical":
// 物理商品の場合は重量と寸法が必須
if (!data.weight) {
ctx.addIssue({
code: z.ZodIssueCode.custom,
message: "物理商品の場合、重量は必須です",
path: ["weight"],
});
}
if (!data.dimensions) {
ctx.addIssue({
code: z.ZodIssueCode.custom,
message: "物理商品の場合、寸法は必須です",
path: ["dimensions"],
});
}
break;

      case "digital":
        // デジタル商品の場合はダウンロードURLが必須
        if (!data.downloadUrl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "デジタル商品の場合、ダウンロードURLは必須です",
            path: ["downloadUrl"],
          });
        }
        break;

      case "service":
        // サービスの場合は提供時間が必須
        if (!data.duration) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "サービスの場合、提供時間は必須です",
            path: ["duration"],
          });
        }
        break;
    }

});

````

**📝 練習問題 2-1: 高度なバリデーション**

以下の要件に基づいて、イベント予約システムのバリデーションを実装してください：

```typescript
// 問題: イベント予約システムのバリデーション
// 要件:
// 1. イベント名: 必須、1-100文字
// 2. 開催日時: 必須、現在より未来の日時
// 3. 定員: 必須、1-1000人
// 4. 参加者リスト: 配列、各参加者は名前・メール・年齢を持つ
// 5. カスタムルール:
//    - 参加者数は定員以下である必要がある
//    - 18歳未満の参加者が含まれる場合、イベント名に「[未成年者含む]」を含める
//    - 参加者の中に同じメールアドレスを持つ人がいてはいけない

const EventReservationSchema = /* ここに実装 */;

// テストデータ
const testReservation = {
  eventName: "TypeScript勉強会",
  eventDate: new Date('2025-12-01T19:00:00'),
  capacity: 30,
  participants: [
    { name: "山田太郎", email: "yamada@example.com", age: 25 },
    { name: "佐藤花子", email: "sato@example.com", age: 17 },
    { name: "田中次郎", email: "tanaka@example.com", age: 30 }
  ]
};

console.log(EventReservationSchema.safeParse(testReservation));
````

#### 🔍 transform() を使ったデータ変換

**🎓 学習のポイント**: transform()は入力データを他の形式に変換する強力な機能です。バリデーション後のデータ変換と型の変更を理解しましょう

```typescript
// === STEP 1: 基本的なデータ変換の理解 ===
console.log("=== 基本的なデータ変換 ===");

// 🔍 重要：transform()はバリデーション成功後にデータを変換
const StringToNumberSchema = z.string().transform((val) => {
  console.log(`文字列 "${val}" を数値に変換中`);
  return parseInt(val, 10);
});

const DateStringSchema = z
  .string()
  .datetime() // まずISO8601形式をバリデーション
  .transform((str) => {
    console.log(`日時文字列 "${str}" をDateオブジェクトに変換中`);
    return new Date(str);
  });

const TrimmedStringSchema = z.string().transform((str) => {
  console.log(`文字列 "${str}" の前後空白を除去中`);
  return str.trim();
});

// 📝 基本的な変換をテスト
console.log("数値変換:", StringToNumberSchema.safeParse("123"));
console.log("日付変換:", DateStringSchema.safeParse("2024-01-01T10:00:00Z"));
console.log("空白除去:", TrimmedStringSchema.safeParse("  Hello World  "));

// === STEP 2: 複雑なデータ変換パターン ===
console.log("=== 複雑なデータ変換 ===");

const UserInputSchema = z.object({
  name: z.string().transform((name) => {
    console.log(`名前 "${name}" を正規化中`);
    return name.trim().toLowerCase(); // 前後空白除去 + 小文字化
  }),

  email: z
    .string()
    .email() // メール形式をバリデーション
    .transform((email) => {
      console.log(`メール "${email}" を正規化中`);
      return email.toLowerCase(); // 小文字化
    }),

  age: z
    .string()
    .transform((str) => {
      console.log(`年齢文字列 "${str}" を数値に変換中`);
      return parseInt(str, 10);
    })
    .pipe(z.number().min(0).max(120)), // 変換後に数値バリデーション

  tags: z.string().transform((str) => {
    console.log(`タグ文字列 "${str}" を配列に変換中`);
    return str
      .split(",") // カンマで分割
      .map((tag) => tag.trim()) // 各タグの空白除去
      .filter((tag) => tag.length > 0); // 空のタグを除去
  }),

  preferences: z.string().transform((str) => {
    console.log(`設定文字列 "${str}" をJSONパース中`);
    try {
      return JSON.parse(str);
    } catch (error) {
      console.log("JSONパースに失敗、空オブジェクトを返却");
      return {};
    }
  }),
});

// 📝 複雑な変換をテスト
const userData = {
  name: "  YAMADA Taro  ",
  email: "YAMADA@EXAMPLE.COM",
  age: "25",
  tags: "JavaScript, TypeScript, React, ",
  preferences: '{"theme": "dark", "language": "ja"}',
};

console.log("ユーザーデータ変換:", UserInputSchema.safeParse(userData));

// === STEP 3: ビジネスロジックを含む変換 ===
console.log("=== ビジネスロジック変換 ===");

const ProductSchema = z
  .object({
    name: z.string(),
    price: z.number(),
    category: z.string(),
    description: z.string(),
  })
  .transform((product) => {
    console.log(`商品 "${product.name}" のメタデータを生成中`);

    // 🎯 重要：元のデータに新しいプロパティを追加
    return {
      ...product,

      // SEO用のスラッグ生成
      slug: product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") // 英数字以外をハイフンに
        .replace(/^-+|-+$/g, ""), // 前後のハイフンを除去

      // 価格帯の分類
      priceRange:
        product.price < 1000
          ? "budget"
          : product.price < 10000
          ? "mid-range"
          : "premium",

      // 説明文の要約（最初の100文字）
      summary:
        product.description.length > 100
          ? product.description.substring(0, 100) + "..."
          : product.description,

      // 作成日時の追加
      createdAt: new Date(),
    };
  });

// 📝 商品データをテスト
const productData = {
  name: "TypeScript入門書",
  price: 2500,
  category: "書籍",
  description:
    "初心者から中級者まで対応したTypeScriptの入門書です。実際のプロジェクトで使える実践的な内容を網羅しています。",
};

console.log("商品データ変換:", ProductSchema.safeParse(productData));

// === STEP 4: 条件付き変換（高度） ===
console.log("=== 条件付き変換 ===");

const OrderSchema = z
  .object({
    items: z.array(
      z.object({
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
      })
    ),
    customerType: z.enum(["regular", "premium", "vip"]),
    couponCode: z.string().optional(),
  })
  .transform((order) => {
    console.log(`注文データの計算処理を実行中`);

    // 小計の計算
    const subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    console.log(`小計: ¥${subtotal}`);

    // 🔍 重要：顧客タイプ別の割引率テーブル
    const discountRate = {
      regular: 0, // 一般顧客: 割引なし
      premium: 0.05, // プレミアム: 5%割引
      vip: 0.1, // VIP: 10%割引
    }[order.customerType];

    // クーポン割引（簡易実装）
    const couponDiscount = order.couponCode === "SAVE10" ? 0.1 : 0;
    console.log(
      `顧客割引: ${discountRate * 100}%, クーポン割引: ${couponDiscount * 100}%`
    );

    // 合計割引率（最大50%まで）
    const totalDiscount = Math.min(discountRate + couponDiscount, 0.5);
    const discountAmount = subtotal * totalDiscount;
    const total = subtotal - discountAmount;

    // 🎯 配送料の条件付き計算
    const shippingFee = total >= 3000 ? 0 : 500;
    const finalTotal = total + shippingFee;

    console.log(
      `割引額: ¥${discountAmount}, 配送料: ¥${shippingFee}, 最終合計: ¥${finalTotal}`
    );

    return {
      ...order,
      calculations: {
        subtotal,
        discountRate: totalDiscount,
        discountAmount,
        total,
      },
      shippingFee,
      finalTotal,
    };
  });

// 📝 注文データをテスト
const orderData = {
  items: [
    { name: "商品A", price: 1000, quantity: 2 },
    { name: "商品B", price: 1500, quantity: 1 },
  ],
  customerType: "premium",
  couponCode: "SAVE10",
};

console.log("注文データ変換:", OrderSchema.safeParse(orderData));
```

**🎓 理解度チェック**

- `transform()` がバリデーション成功後に実行される仕組みは理解できましたか？
- `.pipe()` を使って変換後の値を再バリデーションする方法は分かりますか？
- `transform()` 内でのエラーハンドリング（try-catch）の重要性は理解できましたか？
- ビジネスロジックとデータ変換を組み合わせる実践的なパターンは身につきましたか？

  // クーポン割引（簡易実装）
  const couponDiscount = order.couponCode === "SAVE10" ? 0.1 : 0;

  const totalDiscount = Math.min(discountRate + couponDiscount, 0.5); // 最大 50%割引
  const discountAmount = subtotal \* totalDiscount;
  const total = subtotal - discountAmount;

  return {
  ...order,
  calculations: {
  subtotal,
  discountRate: totalDiscount,
  discountAmount,
  total,
  },
  // 配送料の計算
  shippingFee: total >= 3000 ? 0 : 500,
  // 最終金額
  finalTotal: total + (total >= 3000 ? 0 : 500),
  };
  });

````

### Section 2: API レスポンス処理とデータ変換

#### 🔍 API レスポンスの型安全な処理

```typescript
// 1. 基本的なAPIレスポンススキーマ
const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown(),
  error: z.string().optional(),
  meta: z
    .object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
    })
    .optional(),
});

// 2. ジェネリックなAPIレスポンス関数
function createApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema,
    error: z.string().optional(),
    meta: z
      .object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),
      })
      .optional(),
  });
}

// 3. 具体的なAPIエンドポイントのスキーマ
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url().optional(),
  createdAt: z
    .string()
    .datetime()
    .transform((str) => new Date(str)),
});

const UsersListResponseSchema = createApiResponseSchema(z.array(UserSchema));
const UserDetailResponseSchema = createApiResponseSchema(UserSchema);

// 4. APIクライアントの実装例
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetchUsers(): Promise<z.infer<typeof UsersListResponseSchema>> {
    const response = await fetch(`${this.baseUrl}/users`);
    const data = await response.json();

    // レスポンスをバリデーション
    return UsersListResponseSchema.parse(data);
  }

  async fetchUser(
    id: string
  ): Promise<z.infer<typeof UserDetailResponseSchema>> {
    const response = await fetch(`${this.baseUrl}/users/${id}`);
    const data = await response.json();

    return UserDetailResponseSchema.parse(data);
  }

  async createUser(
    userData: unknown
  ): Promise<z.infer<typeof UserDetailResponseSchema>> {
    // 入力データのバリデーション
    const CreateUserSchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      avatar: z.string().url().optional(),
    });

    const validatedData = CreateUserSchema.parse(userData);

    const response = await fetch(`${this.baseUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });

    const data = await response.json();
    return UserDetailResponseSchema.parse(data);
  }
}

// 5. エラーハンドリング付きのAPIクライアント
class SafeApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async safeRequest<T>(
    url: string,
    schema: z.ZodSchema<T>,
    options?: RequestInit
  ): Promise<{ success: true; data: T } | { success: false; error: string }> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, options);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const rawData = await response.json();
      const result = schema.safeParse(rawData);

      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return {
          success: false,
          error: `Validation error: ${result.error.message}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getUsers() {
    return this.safeRequest("/users", UsersListResponseSchema);
  }

  async getUser(id: string) {
    return this.safeRequest(`/users/${id}`, UserDetailResponseSchema);
  }
}
````

**📝 練習問題 2-2: API レスポンス処理**

EC サイトの注文データを処理するスキーマを実装してください：

```typescript
// 問題: ECサイト注文データのAPIレスポンス処理
// 要件:
// 1. 注文データの検証と変換
// 2. 金額計算の検証
// 3. 配送予定日の計算
// 4. 型安全なAPIクライアントの実装

const OrderResponseSchema = /* ここに実装 */;

class OrderApiClient {
  async getOrder(orderId: string) {
    // ここに実装
  }
}
```

### Section 3: スキーマの合成とマージ

#### 🔍 スキーマの合成技法

```typescript
// 1. extend() - スキーマの拡張
const BaseUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

const AdminUserSchema = BaseUserSchema.extend({
  role: z.literal("admin"),
  permissions: z.array(z.string()),
  lastLoginAt: z.date().optional(),
});

const RegularUserSchema = BaseUserSchema.extend({
  role: z.literal("user"),
  subscriptionType: z.enum(["free", "premium"]),
});

// 2. merge() - 複数スキーマの統合
const TimestampSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

const AuditSchema = z.object({
  createdBy: z.string(),
  updatedBy: z.string(),
});

const BlogPostBaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});

const BlogPostWithMetaSchema =
  BlogPostBaseSchema.merge(TimestampSchema).merge(AuditSchema);

// 3. pick() と omit() - 部分的な選択・除外
const CreateUserSchema = BaseUserSchema.omit({ id: true }); // IDを除外
const UserSummarySchema = BaseUserSchema.pick({ id: true, name: true }); // IDと名前のみ

// 4. partial() と required() - オプショナル化・必須化
const PartialUserSchema = BaseUserSchema.partial(); // すべてオプショナル
const RequiredUserSchema = BaseUserSchema.required(); // すべて必須

// 5. 実用的な例 - CRUDスキーマの生成
function createCrudSchemas<T extends z.ZodRawShape>(
  baseSchema: z.ZodObject<T>
) {
  return {
    // 作成用（IDなし）
    create: baseSchema.omit({ id: true }),

    // 更新用（IDあり、その他はオプショナル）
    update: baseSchema.partial().required({ id: true }),

    // 一覧表示用（必要な項目のみ）
    list: baseSchema.pick({ id: true, name: true }),

    // 詳細表示用（全項目）
    detail: baseSchema,
  };
}

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  categoryId: z.string(),
  inStock: z.boolean(),
});

const ProductSchemas = createCrudSchemas(ProductSchema);
```

#### 🔍 動的スキーマの生成

```typescript
// 1. 条件に基づくスキーマ生成
function createUserSchemaByRole(role: "admin" | "user" | "guest") {
  const baseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  });

  switch (role) {
    case "admin":
      return baseSchema.extend({
        role: z.literal("admin"),
        permissions: z.array(z.string()),
        canManageUsers: z.boolean(),
      });

    case "user":
      return baseSchema.extend({
        role: z.literal("user"),
        subscriptionType: z.enum(["free", "premium"]),
      });

    case "guest":
      return baseSchema.extend({
        role: z.literal("guest"),
      });
  }
}

// 2. 設定に基づくフォームスキーマ生成
interface FieldConfig {
  type: "string" | "number" | "boolean" | "email" | "date";
  required: boolean;
  min?: number;
  max?: number;
  options?: string[];
}

function createFormSchema(config: Record<string, FieldConfig>) {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  for (const [fieldName, fieldConfig] of Object.entries(config)) {
    let schema: z.ZodTypeAny;

    switch (fieldConfig.type) {
      case "string":
        schema = z.string();
        if (fieldConfig.min) schema = schema.min(fieldConfig.min);
        if (fieldConfig.max) schema = schema.max(fieldConfig.max);
        break;

      case "number":
        schema = z.number();
        if (fieldConfig.min !== undefined) schema = schema.min(fieldConfig.min);
        if (fieldConfig.max !== undefined) schema = schema.max(fieldConfig.max);
        break;

      case "boolean":
        schema = z.boolean();
        break;

      case "email":
        schema = z.string().email();
        break;

      case "date":
        schema = z.date();
        break;

      default:
        schema = z.string();
    }

    if (fieldConfig.options) {
      schema = z.enum(fieldConfig.options as [string, ...string[]]);
    }

    if (!fieldConfig.required) {
      schema = schema.optional();
    }

    schemaShape[fieldName] = schema;
  }

  return z.object(schemaShape);
}

// 使用例
const contactFormConfig = {
  name: { type: "string" as const, required: true, min: 1, max: 50 },
  email: { type: "email" as const, required: true },
  age: { type: "number" as const, required: false, min: 0, max: 120 },
  category: {
    type: "string" as const,
    required: true,
    options: ["general", "support", "sales"],
  },
  message: { type: "string" as const, required: true, min: 10, max: 1000 },
};

const ContactFormSchema = createFormSchema(contactFormConfig);
```

**📝 練習問題 2-3: スキーマ合成**

ブログ管理システムの記事管理スキーマを実装してください：

```typescript
// 問題: ブログ管理システムの記事管理スキーマ
// 要件:
// 1. 基本記事スキーマから各用途のスキーマを生成
// 2. CRUD操作用のスキーマ生成
// 3. 検索結果用のスキーマ拡張

const BaseArticleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  status: z.enum(['draft', 'published', 'archived']),
  authorId: z.string().uuid(),
  categoryId: z.string().uuid(),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// 実装すべきスキーマ:
// - CreateArticleSchema
// - UpdateArticleSchema
// - ArticleListItemSchema
// - ArticleSearchResultSchema

const CreateArticleSchema = /* ここに実装 */;
const UpdateArticleSchema = /* ここに実装 */;
// ... 他のスキーマも実装
```

---

## 🎯 練習問題

### 練習問題 1: 高度なバリデーション（20 分）

イベント予約システムの複雑なバリデーションを実装してください。

### 練習問題 2: API レスポンス処理（20 分）

EC サイトの注文データを処理する型安全な API クライアントを実装してください。

### 練習問題 3: スキーマ合成（20 分）

ブログ管理システムの記事管理に必要な各種スキーマを生成してください。

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: superRefine()と refine()の使い分けは？**
A: 単純な条件の場合は refine()、複数の条件や複雑なロジックの場合は superRefine()を使います。superRefine()では複数のエラーを一度に処理できます。

**Q: transform()でエラーが発生した場合は？**
A: transform()内でエラーが発生すると、Zod のバリデーションエラーとして扱われます。try-catch 文で適切にハンドリングしましょう。

**Q: スキーマの合成が複雑になった場合は？**
A: 機能ごとにスキーマを分割し、必要に応じて合成する設計にします。また、ファクトリ関数を使って動的にスキーマを生成することも検討しましょう。

---

**📌 重要**: Session2 は Zod の実践技術です。各技法の使い分けを理解し、実際の開発に活用できるレベルを目指しましょう。

**🌟 次回（Session3）は、Angular と Zod を統合して実践的な Web アプリケーションを構築します！**

---

## 📋 Session2 完了チェックリスト

学習を完了する前に、以下の項目をすべてチェックしてください：

### 💡 高度な概念理解

- [ ] `superRefine()` の動作原理と使用場面を理解している
- [ ] `transform()` によるデータ変換の仕組みを説明できる
- [ ] スキーマ合成（`extend()`, `merge()`, `pick()`, `omit()`）の使い分けができる
- [ ] 動的スキーマ生成の概念と実装方法を理解している

### 💻 実装スキル

- [ ] 複雑なビジネスルールを `superRefine()` で実装できる
- [ ] `transform()` を使ったデータ正規化・変換ができる
- [ ] API レスポンスの型安全な処理を実装できる
- [ ] CRUD 操作用のスキーマセットを生成できる

### 🔧 実践能力

- [ ] 条件分岐を含む複雑なバリデーションロジックを実装できる
- [ ] エラーの `path` 指定によるフィールド別エラー表示ができる
- [ ] 実際の業務要件をスキーマ設計に落とし込める
- [ ] パフォーマンスを考慮したスキーマ設計ができる

### 🧪 動作確認

- [ ] すべてのコード例を実行し、期待通りの結果を確認した
- [ ] 練習問題を完答し、要件を満たすスキーマを実装した
- [ ] エラーケースでの動作を詳しく検証した
- [ ] 複雑なデータ構造でのテストを実施した

### 📚 応用知識

- [ ] Zod を使った API クライアントの設計ができる
- [ ] フォームライブラリとの統合方法を理解している
- [ ] エラーハンドリングのベストプラクティスを知っている
- [ ] 次のステップ（Angular 統合）への準備ができている

**🎉 すべてチェックできましたか？** それでは Session3 で実際のアプリケーション開発に挑戦しましょう！

**⚠️ チェックできない項目がある場合**: 該当する学習内容を再度確認し、補足資料も活用してください。特に複雑な概念は時間をかけて理解を深めましょう。
