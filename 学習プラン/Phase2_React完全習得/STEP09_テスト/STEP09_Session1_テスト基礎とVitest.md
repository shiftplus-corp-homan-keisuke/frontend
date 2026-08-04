# Session 1: テスト基礎とVitest

## はじめに：なぜテストが必要なのか？

STEP01〜08でReactアプリケーションの実装スキルを学んできました。ここまでのコードは、ブラウザで動かして「目で見て確認」していたはずです。しかし、実務では**「動作するコードを書く」だけでは不十分**です。

なぜでしょうか？ 1つの具体例で考えてみましょう。

### テストがない世界で起こること

あなたがECサイトを作っています。「カートに商品を追加する」ボタンを実装しました。手動でクリックして、商品が追加されることを確認しました。完璧です。

しかし翌日、別の機能を追加したとき、**うっかりカート機能を壊してしまいました**。あなたは気づきません。なぜなら、カート機能を手動で再確認していないからです。本番環境にデプロイ後、ユーザーから「カートに追加できない」と報告が来て初めて気づきます。

これが**テストがないことのリスク**です：

```
リファクタリング時: "この変更で壊れていないか不安..."
バグ修正時:          "この修正で他に影響が出ていないか不安..."
リリース前:          "全機能を手動で確認する必要がある..."
チーム開発時:         "他人のコード変更で自分の機能が壊れないか..."
```

### テストがある世界

テストコードは**「あなたの代わりに確認してくれる automat化された検査員」**です。

上記のECサイトの例で言えば、以下のようなコードを書いておきます：

```ts
it("カートに商品を追加すると、カート内の商品数が1になる", () => {
  // カートは空
  // 「追加」ボタンをクリック
  // カート内の商品数が 1 であることを確認
});
```

このテストを `npm test` で実行すると、**1秒以内に**「カート機能が正常に動くか」を自動で確認してくれます。何百回クリックする必要はありません。コマンド1つで全機能がチェックできます。

| メリット | 説明 |
|----------|------|
| **自信を持ってリファクタリング** | 壊したらテストが「赤」になって教えてくれる |
| **バグの早期発見** | 開発時に発見 → 修正コストが低い（本番発見の10倍のコスト） |
| **仕様の文書化** | テストコードが「どう動作すべきか」のドキュメントになる |
| **手動テストの削減** | 何百回もクリックする確認を自動化 |
| **設計の改善** | 「テストしやすいコード」は自然と良い設計になる |

> **初心者のよくある誤解**: 「テストを書く時間がない」
> **現実**: テストがあることで手動確認の時間とバグ修正の時間が削減され、結果的に早く完成する

---

## 1. テストの種類 — 3つのレベル

テストには「何をテストするか」によって3つのレベルがあります。料理に例えて説明しましょう。

### 料理の例えで理解するテストピラミッド

| レベル | 料理の例え | ソフトウェアの例 |
|--------|-----------|-----------------|
| **単体テスト** | 塩の量、砂糖の量を1つずつ確認 | 1つの関数が正しく計算するか |
| **統合テスト** | 材料を混ぜて、味が合うか確認 | 複数のコンポーネントが連携して動くか |
| **E2Eテスト** | 完成した料理を実際に食べて確認 | ユーザーが最初から最後まで操作できるか |

```
        /\
       /  \     E2Eテスト（少数）
      /____\    - ブラウザを自動操作して全フローを確認
     /      \   - 高コスト・遅い・一番確実
    /        \  
   /          \ 統合テスト（中程度）
  /            \ - 複数のパーツが連携するか確認
 /              \ - サーバー/APIとの連携含む
/________________\ 単体テスト（多数）
                   - 1つの関数・1つのコンポーネントだけ
                   - 低コスト・高速・基本
```

**なぜピラミッド型なのか？** 下のレベル（単体）ほど数が多く、上のレベル（E2E）ほど数が少ないのが理想です。理由はシンプル：

- 単体テストは **速い・安い** → たくさん書ける
- E2Eテストは **遅い・高い** → 重要なところだけ

### このSTEPで学ぶ範囲

- **Session 1**: 単体テストの基礎（Vitestの使い方）← 今ここ
- **Session 2**: コンポーネントテスト（React Testing Library）
- **Session 3**: 統合テスト（MSWでAPIをモック）
- **Session 4**: テスト戦略（全体の方針）
- **E2Eテスト**: Playwright（STEP10で別途学習）

---

## 2. 環境構築 — テストを始める準備

### 必要なパッケージのインストール

まず、テストを書くために必要なツールをインストールします。

```bash
# テスト関連のパッケージをインストール（-D は開発用という意味）
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# TypeScriptの型定義もインストール
npm install -D @types/testing-library__jest-dom
```

ここで何を入れているのか整理しましょう：

| パッケージ | 役割 | 初心者の理解 |
|-----------|------|-------------|
| `vitest` | テスト実行ツール（テストランナー） | テストを走らせるエンジン |
| `@vitejs/plugin-react` | ReactのJSXを変換 | テスト内でReactが動くようにする |
| `jsdom` | ブラウザ環境のシミュレート | テスト実行時に「仮想ブラウザ」を用意 |
| `@testing-library/react` | Reactコンポーネントをテスト | コンポーネントをレンダリングして確認 |
| `@testing-library/jest-dom` | 追加の検証機能 | 「要素が画面にあるか」等のチェック機能 |
| `@testing-library/user-event` | ユーザー操作のシミュレート | クリックやキー入力を再現 |

### 設定ファイルの作成

プロジェクトのルートに `vitest.config.ts` を作成します：

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom = テスト用の「仮想ブラウザ」環境
    // 実際のブラウザがなくてもDOM操作ができる
    environment: "jsdom",

    // globals: true にすると describe, it, expect を
    // import しなくても使える（毎回 import する手間を省く）
    globals: true,

    // セットアップファイル: テストが始まる前に自動で読み込まれる
    // ここで「テスト用の便利機能」を有効にする
    setupFiles: "./src/test/setup.ts",
  },
});
```

> **初心者の疑問**: `environment: "jsdom"` って何？
>
> テストは本来、Node.js（サーバー側の環境）で動きます。しかし、Reactコンポーネントはブラウザ環境（DOM）を必要とします。`jsdom` は「Node.js上で動くブラウザのシミュレーター」です。これにより、テストコード内で `document.querySelector` などのブラウザ機能が使えるようになります。

次に、`src/test/setup.ts` を作成します：

```ts
// src/test/setup.ts

// この1行で、@testing-library/jest-dom が提供する
// 追加の検証機能（toBeInTheDocument など）が有効になる
// 全テストファイルが実行される前に、このファイルが自動で読み込まれる
import "@testing-library/jest-dom";
```

### package.jsonにスクリプトを追加

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

| スクリプト | 何が起きるか | いつ使うか |
|-----------|-------------|-----------|
| `npm test` | テストを監視モードで起動（ファイル変更で自動再実行） | 開発中の日常的な使用 |
| `npm run test:ui` | ブラウザUIでテスト結果を表示 | 視覚的に結果を見たい時 |
| `npm run test:run` | テストを1回だけ実行して終了 | CI/CDや一発勝負 |
| `npm run test:coverage` | カバレッジ（テスト網羅率）を計測 | 品質チェック時 |

### tsconfig.jsonに型を追加

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

これにより、`describe`、`it`、`expect` などにTypeScriptの型チェックが効くようになります。

> **初心者の疑問**: `globals: true` と `types` の両方設定するの？
>
> はい。`globals: true`（vitest.config.ts）は「実行時に import なしで使えるようにする」設定です。`types`（tsconfig.json）は「TypeScriptが型エラーを出さないようにする」設定です。両方必要です。

---

## 3. 最初のテスト — 1行ずつ理解する

### いちばんシンプルなテスト

まずは、理解しやすい純粋関数から始めましょう。引数を2つ受け取って足し算をする `add` 関数のテストです：

```ts
import { describe, it, expect } from "vitest";

// ↑ テストに必要な3つの基本関数を import
//   describe: テストをグループ化する箱
//   it:       1つのテストケース（「〇〇であるべき」という確認）
//   expect:   「期待値」を判定する関数

// テスト対象の関数
function add(a: number, b: number): number {
  return a + b;
}

// describe = 「テストスイート」（関連するテストのグループ）
// 複数のテストケースを1つのグループにまとめる
describe("計算関数", () => {

  // it = 1つのテストケース
  // 「〜すべき」という文で、何を確認するかを表現する
  it("2つの数値を足し合わせる", () => {
    // --- ここからテスト本体 ---

    // Arrange（準備）: テストに使うデータを用意
    const a = 1;
    const b = 2;

    // Act（実行）: テスト対象の関数を呼び出す
    const result = add(a, b);

    // Assert（検証）: 期待通りの結果かチェック
    // expect(結果).toBe(期待値) = 「result が 3 であるべき」
    // もし result が 3 でなければ、テストは赤（失敗）になる
    expect(result).toBe(3);

    // --- ここまでテスト本体 ---
  });

  // 別のテストケースも追加できる
  it("負の数値でも正しく動作する", () => {
    // 今回は簡潔に1行で書く（慣れてくればこう書いてOK）
    expect(add(-1, -2)).toBe(-3);
  });
});
```

### このコードを実行するとどうなるか

```bash
npm run test:run
```

```
 ✓ 計算関数 > 2つの数値を足し合わせる
 ✓ 計算関数 > 負の数値でも正しく動作する

 Test Files  1 passed (1)
      Tests  2 passed (2)
```

緑の `✓` が「テスト成功」のサインです。`add(1, 2)` の結果が `3` だったので、`expect(result).toBe(3)` の判定が通りました。

もし `add` 関数の実装が間違っていれば：

```ts
// 間違えた実装（引き算になってしまった）
function add(a: number, b: number): number {
  return a - b;  // ← バグ！
}
```

```
 ❯ 計算関数 > 2つの数値を足し合わせる
   × expected 3 to be 3  // 期待: 3, 実際: -1
```

赤い `×` が出て、**どこで** **何が** 間違っているかが一目でわかります。

### AAAパターン — テストの黄金パターン

上で使った「Arrange（準備）→ Act（実行）→ Assert（検証）」の3ステップを **AAAパターン** と呼びます。すべてのテストはこのパターンで書くのが基本です。

なぜこのパターンが重要なのでしょうか？

```ts
// ❌ 混乱的なテスト（何をしているかわからない）
it("ユーザー名をフォーマットする", () => {
  const result = formatUserName({ firstName: "太郎", lastName: "田中" });
  expect(result).toBe("田中 太郎");
});

// ✅ AAAパターン（準備・実行・検証が明確）
it("ユーザー名をフォーマットする", () => {
  // Arrange: 準備 — 入力データを用意する
  const user = { firstName: "太郎", lastName: "田中" };

  // Act: 実行 — テスト対象を呼び出す
  const result = formatUserName(user);

  // Assert: 検証 — 期待値と実際の値を比較する
  expect(result).toBe("田中 太郎");
});
```

コメントを見なくてもわかるように、** привычным（慣習的）に 3ステップで書く** ように心がけましょう。初心者は必ずこの3行を意識してください。慣れてくれば簡略化しても大丈夫です。

---

## 4. よく使うMatcher（検証関数） — 「期待値」の書き方

`expect(結果).toMatch(期待値)` の `toMatch` の部分を **Matcher（マッチャー）** と呼びます。テストで一番よく使うMatcherを整理しておきましょう。

> **Matcherとは何か？**
> 「この値が、こうであるべき」という判断をする関数。日常でいう「これ、大丈夫？」「これ、期待通り？」と同じ役割です。

### 4.1 等価性 — 「同じ値か？」

```ts
// toBe = 厳密等価（===）と同じ判定
// プリミティブ値（数値、文字列、真偽値）の比較に使う
expect(3).toBe(3);           // ✅ 3 === 3
expect("hello").toBe("hello"); // ✅ "hello" === "hello"

// toEqual = オブジェクトの中身を深く比較
// { a: 1 } === { a: 1 } は false（参照が違う）だが、
// toEqual は中身が同じなら true と判定する
expect({ a: 1 }).toEqual({ a: 1 }); // ✅ 中身が同じ

// toStrictEqual = toEqual より厳密（型も含めて比較）
// undefined プロパティの有無なども厳密に見る
expect({ a: 1 }).toStrictEqual({ a: 1 }); // ✅
```

> **初心者のつまずきポイント**: `toBe` と `toEqual` の違い
>
> ```ts
> expect({ a: 1 }).toBe({ a: 1 });   // ❌ 失敗！ 異なるオブジェクトだから
> expect({ a: 1 }).toEqual({ a: 1 }); // ✅ 成功！ 中身が同じだから
> ```
>
> **覚え方**: プリミティブ（数・文字・真偽）は `toBe`、オブジェクト・配列は `toEqual`

### 4.2 真偽値 — 「trueか？ falseか？」

```ts
// 直接 true/false を判定
expect(true).toBe(true);
expect(false).toBe(false);

// truthy / falsy の判定
// truthy = true以外で「真とみなされる値」(1, "text", [], {} 等)
// falsy  = false以外で「偽とみなされる値」(0, "", null, undefined, NaN)
expect(1).toBeTruthy();       // ✅ 1はtruthy
expect("hello").toBeTruthy(); // ✅ 空でない文字列はtruthy
expect(0).toBeFalsy();        // ✅ 0はfalsy
expect("").toBeFalsy();       // ✅ 空文字はfalsy
expect(null).toBeFalsy();     // ✅ nullはfalsy

// 特定の null / undefined を判定
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect(null).not.toBeUndefined(); // not = 否定（「〜ではない」）
expect(undefined).not.toBeNull();
```

### 4.3 数値 — 「大小関係は？」

```ts
expect(10).toBeGreaterThan(5);      // 10 > 5
expect(10).toBeGreaterThanOrEqual(10); // 10 >= 10
expect(3).toBeLessThan(10);         // 3 < 10
expect(3).toBeLessThanOrEqual(3);   // 3 <= 3

// 浮動小数点の比較（0.1 + 0.2 = 0.30000000000000004 になる問題対応）
expect(0.1 + 0.2).toBeCloseTo(0.3); // ✅ 誤差を許容して比較
// expect(0.1 + 0.2).toBe(0.3); // ❌ 浮動小数点誤差で失敗
```

### 4.4 文字列 — 「含んでいるか？」

```ts
// 部分一致
expect("Hello World").toContain("World"); // ✅ "World"を含む
expect("Hello World").toContain("hello"); // ❌ 大文字小文字が違う

// 正規表現マッチ
expect("Hello World").toMatch(/Hello/);       // ✅ 正規表現に一致
expect("Hello World").toMatch(/hello/i);      // ✅ iフラグで大文字小文字無視

// 文字数
expect("Hello").toHaveLength(5); // ✅ 文字列の長さが5
```

### 4.5 配列・オブジェクト — 「要素があるか？」

```ts
// 配列が要素を含むか
expect([1, 2, 3]).toContain(2);       // ✅ 2を含む
expect([1, 2, 3]).toHaveLength(3);     // ✅ 長さ3

// オブジェクトがプロパティを持つか
expect({ name: "太郎", age: 20 }).toHaveProperty("name"); // ✅
expect({ name: "太郎", age: 20 }).toHaveProperty("name", "太郎"); // ✅ 値も確認

// 部分マッチ（配列の中に特定の要素が含まれるか）
expect([1, 2, 3]).toEqual(expect.arrayContaining([1, 2])); // ✅ [1,2]を含む

// 部分マッチ（オブジェクトの一部のプロパティだけ確認）
expect({ id: 1, name: "太郎", createdAt: "2024-01-01" })
  .toMatchObject({ id: 1, name: "太郎" }); // ✅ この2つだけ確認
```

### 4.6 例外 — 「エラーを投げるか？」

```ts
// 割り算で0で割ろうとしたらエラーを投げる関数
function divide(a: number, b: number): number {
  if (b === 0) throw new Error("0で割ることはできません");
  return a / b;
}

// 例外が投げられることを確認
// expect(() => 関数呼び出し) と書くのがポイント
// 関数を渡さないと、その場で実行されてテストが制御できない
expect(() => divide(1, 0)).toThrow();                        // 何かのエラーを投げる
expect(() => divide(1, 0)).toThrow("0で割ることはできません"); // エラーメッセージも確認
expect(() => divide(1, 0)).toThrow(Error);                   // エラーの種類も確認
```

> **初心者のつまずきポイント**: なぜ `expect(() => func())` と関数で囲むのか？
>
> ```ts
> expect(divide(1, 0)).toThrow(); // ❌ これはエラー！
> ```
>
> これだと、`divide(1, 0)` が**即座に実行**され、その場で例外が投げられてテスト自体がクラッシュしてしまいます。関数で囲むことで、「実行をの実行を Matcher に任せる」ことができ、Matcher が例外を「受け止めて」判定できます。`expect(divide(1, 0)).toBe(5)` なら囲まなくて OK（例外を投げないから）。

---

## 5. グループ化とスキップ — テストの整理

### describeのネスト（入れ子）

テストケースが増えてきたら、`describe` を入れ子にして整理します：

```ts
describe("数学関数", () => {
  // 「数学関数」という大グループ

  describe("加算", () => {
    // その中に「加算」グループ
    it("正の数を足す", () => { /* ... */ });
    it("負の数を足す", () => { /* ... */ });
    it("ゼロを足す", () => { /* ... */ });
  });

  describe("減算", () => {
    // 「減算」グループ
    it("正の数を引く", () => { /* ... */ });
    it("負の数を引く", () => { /* ... */ });
  });
});
```

実行結果も階層表示されます：

```
 ✓ 数学関数 > 加算 > 正の数を足す
 ✓ 数学関数 > 加算 > 負の数を足す
 ✓ 数学関数 > 加算 > ゼロを足す
 ✓ 数学関数 > 減算 > 正の数を引く
 ✓ 数学関数 > 減算 > 負の数を引く
```

### 一時的にテストをスキップする

```ts
describe("数学関数", () => {
  describe("加算", () => {
    it("正の数を足す", () => { /* ... */ });
  });

  // .skip を付けると、このグループのテストは実行されない
  // 後で直す時などに一時的に無視したい場合に使う
  describe.skip("減算", () => {
    it("正の数を引く", () => { /* ... */ });
  });

  // .only を付けると、このテストだけ実行される
  // 1つのテストだけ集中してデバッグしたい時に使う
  it.only("このテストだけ実行", () => {
    /* ... */
  });
});
```

> **初心者の疑問**: `.skip` と `.only` はいつ使うの？
>
> - **`.skip`**: そのテストが一時的に失敗しているが、今は直せない時。他のテストの邪魔をしないようにスキップする。
> - **`.only`**: 1つのテストだけを修正・デバッグしたい時、それだけを実行して infiltrating の時間を節約する。**本番に commit する前に必ず消す** こと（消し忘れると他のテストが一切走りません！）。

---

## 6. 非同期テスト — Promiseとasync/await

ここまでのテストはすべて同期的（すぐに結果が返る）でした。しかし、実際の開発では「データ取得」や「API呼び出し」などの**非同期処理**がたくさん出てきます。非同期のテストは少しだけ書き方が変わります。

### async/awaitを使う方法（一番おすすめ）

```ts
// 非同期関数: 1秒後に { id: 1, name: "Test" } を返す
async function fetchData(): Promise<{ id: number; name: string }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: 1, name: "Test" }), 1000);
  });
}

// async を付けることで、テスト内で await が使える
it("データを取得する", async () => {
  // await で非同期処理の完了を待つ
  const data = await fetchData();

  // その後、通常通り検証
  expect(data).toEqual({ id: 1, name: "Test" });
});
```

**なぜ `async` が必要か？** 非同期処理は「すぐに終わらない」からです。`await` なしで書くと、データが返ってくる前に `expect` が実行されてしまい、`data` は `undefined` になり、テストが失敗します。`async/await` は「結果が戻ってくるまで待つ」という意味です。

###resolves / rejectsを使う方法

```ts
// resolves = Promise が成功(resolve)する場合のテスト
// expect(fetchData()) のように Promise をそのまま渡し、
// .resolves を付けることで「成功後の値」を検証する
it("正常に解決する", () => {
  expect(fetchData()).resolves.toEqual({ id: 1, name: "Test" });
});

// rejects = Promise が失敗(reject)する場合のテスト
it("エラーを投げる", () => {
  expect(failingFetchData()).rejects.toThrow("Network error");
});

// async/await + rejects（推奨: エラーメッセージも確認しやすい）
it("エラーを投げる", async () => {
  await expect(failingFetchData()).rejects.toThrow("Network error");
});
```

> **初心者の疑問**: async/await と resolves/rejects どっちを使えばいい？
>
> **基本は async/await** を使いましょう。可読性が高く、他の処理と組み合わせやすいです。`resolves/rejects` は「1つの非同期処理の結果だけをサクッと確認したい」時に補助的に使います。

---

## 7. テストの前後処理 — 準備と後片付け

テストケースが複数あるとき、各テストごとに「準備」と「後片付け」が必要になることがあります。

### 例え話

ケーキを5回作るとします。毎回：
1. **準備**: ボウルを洗う、材料を用意する
2. **ケーキを作る**（← これがテスト本体）
3. **後片付け**: 使った道具を洗う

この「準備」と「後片付け」を自動化するのが `beforeEach` / `afterEach` などです。

```ts
describe("データベース操作のテスト", () => {

  // beforeEach: 各テストケースの「前」に毎回実行される
  // テストごとに「クリーンな状態」を用意するために使う
  beforeEach(() => {
    db.clear();          // データをクリア
    db.seed({ users: [] }); // 初期データをセット
  });

  // afterEach: 各テストケースの「後」に毎回実行される
  // クリーンアップに使う
  afterEach(() => {
    db.clear();          // 次のテストに影響しないようクリア
  });

  // beforeAll: describe全体のテストの「前」に1回だけ実行
  // 重い準備（DB接続など）に使う
  beforeAll(() => {
    db.connect();        // データベース接続
  });

  // afterAll: describe全体のテストの「後」に1回だけ実行
  // 軽い後片付け（DB切断など）に使う
  afterAll(() => {
    db.disconnect();     // データベース切断
  });

  // このテストの前には beforeEach が走り、users は空(& クリア)
  it("ユーザーを追加", () => {
    db.addUser({ name: "太郎" });
    expect(db.getUsers()).toHaveLength(1); // ✅ 1人いる
  });

  // このテストも beforeEach が走って users は空にリセットされている
  // （前のテストで追加した太郎はいない）
  it("ユーザーが空", () => {
    expect(db.getUsers()).toHaveLength(0); // ✅ 空です
  });
});
```

### 4つの関数の違いまとめ

| 関数 | いつ実行 | 回数 | 主な用途 |
|------|---------|------|----------|
| `beforeAll` | 全テストの前 | 1回 | 重い準備（DB接続・サーバー起動） |
| `beforeEach` | 各テストの前 | 毎回 | 状態リセット・初期データ準備 |
| `afterEach` | 各テストの後 | 毎回 | クリーンアップ・状態リセット |
| `afterAll` | 全テストの後 | 1回 | リソース解放（DB切断・サーバー停止） |

```
beforeAll (1回)
  ├── beforeEach → it("テスト1") → afterEach
  ├── beforeEach → it("テスト2") → afterEach
  └── beforeEach → it("テスト3") → afterEach
afterAll (1回)
```

> **初心者の疑問**: なぜ `beforeEach` が必要？毎回書けばいいのでは？
>
> 各テストは **独立しているべき** です。テストAで追加したデータがテストBに影響してはいけません。`beforeEach` で毎回クリーンな状態を作ることで、テストの順番に依存しなくなり、どこで失敗しても原因が特定しやすくなります。

---

## 8. モック（Mock） — 「偽物」でテストを安定させる

### モックとは何か？ — 例え話で理解

あなたは「合計金額を計算する」関数をテストしたいとします。しかし、その関数は**外部APIから商品価格を取得**しています。

ここで問題が起きます：
1. APIサーバーが止まっていたらテストが失敗する
2. APIのレスポンスが変わったらテストが壊れる
3. テストが遅い（API通信の待ち時間が入る）

解決策は **「APIのフリをする偽物」を使う** ことです。これがモック（mock = 模造品）です。

```
本番:    あなたのコード → fetch("api") → 実際のサーバー → 価格データ
テスト:  あなたのコード → fetch("api") → 偽の関数（即座に1000を返す）
```

モックを使うことで：
- **速い**: 実際の通信をしないので瞬時に終わる
- **安定**: ネットワーク状況に左右されない
- **制御可能**: 「成功する場合」「失敗する場合」を自由に作れる

### vi.fn() — 関数のモック

`vi.fn()` は「偽の関数」を作ります。本物の関数の代わりに使います。

```ts
import { vi } from "vitest";

// テスト対象: コールバックを受け取って実行する関数
function executeCallback(callback: (msg: string) => void, message: string) {
  callback(message);
}

it("コールバックが正しく呼ばれる", () => {
  // vi.fn() = 何もしない「偽の関数」を作る
  // ただし「何回呼ばれたか」「何の引数で呼ばれたか」を記録する
  const callback = vi.fn();

  // 偽の関数を渡して実行
  executeCallback(callback, "hello");

  // 「呼ばれたか」を確認
  expect(callback).toHaveBeenCalled();             // ✅ 1回以上呼ばれた
  expect(callback).toHaveBeenCalledTimes(1);       // ✅ ちょうど1回
  expect(callback).toHaveBeenCalledWith("hello"); // ✅ 引数"hello"で呼ばれた
});
```

> **ここで何が起きているの？**
>
> `vi.fn()` は「何もしない空の関数」ですが、**呼ばれた回数や引数を記録する**能力があります。これにより、「本物のコールバック」を用意しなくても「コールバックが正しく呼ばれたか」を確認できます。

### 依存先の戻り値を制御して、テスト対象の分岐を検証する

`mockReturnValue` は、**テスト対象が依存している関数の結果を固定する**ために使います。

たとえば、商品価格を取得する処理は本番では API やデータベースを呼び出すかもしれません。テストではその処理をモックに置き換え、「価格が取得できた場合」と「取得できなかった場合」を自由に作れます。

```ts
// テスト対象: 価格の取得結果に応じて表示を変える
function formatPrice(
  productId: string,
  getPrice: (id: string) => number | null,
) {
  const price = getPrice(productId);

  if (price === null) {
    return "在庫なし";
  }

  return `¥${price}`;
}

it("取得した価格を表示する", () => {
  // getPrice は外部 API や DB に相当する依存先
  // 常に 1200 を返す偽物に差し替える
  const getPrice = vi.fn().mockReturnValue(1200);

  expect(formatPrice("p1", getPrice)).toBe("¥1200");
  expect(getPrice).toHaveBeenCalledWith("p1");
});

it("価格を取得できない場合は在庫なしと表示する", () => {
  // 戻り値を変えるだけで、別の分岐をテストできる
  const getPrice = vi.fn().mockReturnValue(null);

  expect(formatPrice("p1", getPrice)).toBe("在庫なし");
});
```

このように、モックの戻り値を指定すると、ネットワークやデータベースに接続せずに、テスト対象のロジックだけを速く・安定して検証できます。

### 連続した結果を使って再試行処理をテストする

`mockReturnValueOnce` や `mockResolvedValueOnce` は、依存先を複数回呼び出す処理をテストするときに使います。代表例は、通信に失敗したときの再試行です。

```ts
// テスト対象: 最初の通信に失敗したら 1 回だけ再試行する
async function loadProducts(
  fetchProducts: () => Promise<string[]>,
): Promise<string[]> {
  try {
    return await fetchProducts();
  } catch {
    return await fetchProducts();
  }
}

it("最初の取得に失敗した場合、再試行して商品を返す", async () => {
  const fetchProducts = vi.fn()
    // 1回目の API 呼び出しは失敗したことにする
    .mockRejectedValueOnce(new Error("通信エラー"))
    // 2回目の API 呼び出しは成功したことにする
    .mockResolvedValueOnce(["ペン", "ノート"]);

  // 検証したいのは、loadProducts が再試行して結果を返せること
  await expect(loadProducts(fetchProducts)).resolves.toEqual([
    "ペン",
    "ノート",
  ]);
  expect(fetchProducts).toHaveBeenCalledTimes(2);
});
```

この例では、モックは「1回目は通信エラー、2回目は成功」という状況を作るための道具です。テストしているのはモックの動作ではなく、`loadProducts` が失敗後に再試行するというアプリケーションのロジックです。

### vi.mock() — モジュール全体のモック

`vi.mock` は、import されるモジュール全体を偽物に置き換えます。

```ts
// 元のモジュール（utils/api.ts）
// export async function fetchUser() {
//   const res = await fetch("/api/users/1");
//   return res.json();
// }

// テストファイル内で:
vi.mock("../utils/api", () => ({
  // fetchUser を偽物に置き換え
  // 実際にAPIを呼ばず、即座に固定データを返す
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: "Test" }),
  updateUser: vi.fn().mockResolvedValue(true),
}));

// これ以降、テストファイル内で import した fetchUser は
// 本物ではなく「モック版」になる
import { fetchUser } from "../utils/api";

it("ユーザーを取得", async () => {
  const user = await fetchUser(); // 実際のAPIは呼ばれない
  expect(user).toEqual({ id: 1, name: "Test" });
});
```

### 部分的なモック — 本物の一部だけ偽物にする

モジュールの中で、一部の関数だけ偽物にしたい場合：

```ts
vi.mock("../utils/api", async () => {
  // vi.importActual = 本物のモジュールを取得
  const actual = await vi.importActual("../utils/api");

  return {
    ...actual,                          // 本物を全部保持
    fetchUser: vi.fn().mockResolvedValue({ id: 1 }), // これだけ偽物
    // updateUser など他の関数は本物が使われる
  };
});
```

> **初心者の疑問**: `vi.mock` と `vi.fn` の違いは？
>
> - **`vi.fn()`**: 「1つの関数」の偽物を作る
> - **`vi.mock()`**: 「モジュール全体」の偽物を作る（import を乗っ取る）
>
> 単体の関数をモックしたいなら `vi.fn()`、外部モジュール（API呼び出しなど）をモックしたいなら `vi.mock()`。

### タイマーのモック — 時間を操る

`setTimeout` や `setInterval` を使ったコードのテストは、実際に待つと遅くなります。`vi.useFakeTimers()` を使うと「時間を一気に進める」ことができます。

```ts
it("1秒後にコールバックが呼ばれる", () => {
  // 「偽のタイマー」を使う（実際には待たない）
  vi.useFakeTimers();

  const callback = vi.fn();
  setTimeout(callback, 1000); // 本来なら1秒待つ必要がある

  // まだ1秒経っていないので、呼ばれていない
  expect(callback).not.toHaveBeenCalled();

  // 時間を1秒進める（実際の1秒は経過しない！瞬時に進む）
  vi.advanceTimersByTime(1000);

  // 1秒経過したことになり、コールバックが呼ばれる
  expect(callback).toHaveBeenCalled();

  // テスト終わったら本物のタイマーに戻す
  vi.useRealTimers();
});
```

> **なぜこれが嬉しいのか？** 実際に1秒待つとテストが遅くなります。偽タイマーなら、1000秒後の処理も瞬時にテストできます。数十のテストがそれぞれ数秒待つと、全体で分単位の時間がかかってしまいます。

---

## 9. カスタムMatcher — 自分専用の検証を作る

組み込みのMatcherで足りない時、自分で Matcher を作れます。これは初学者向けというより応用編なので、雰囲気だけ掴んでください。

```ts
// test/setup.ts
import { expect } from "vitest";

// expect.extend で新しいMatcherを追加
expect.extend({
  // toBeWithinRange: 受け取った値が floor〜ceiling の範囲内かを判定
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass, // true なら テスト成功
      message: () =>
        pass
          ? `expected ${received} not to be within range ${floor} - ${ceiling}`
          : `expected ${received} to be within range ${floor} - ${ceiling}`,
      // ↑ 失敗した時のエラーメッセージ（人間が読める）
    };
  },
});

// TypeScriptに新しいMatcherの型を教える
declare module "vitest" {
  interface Assertion<T = any> {
    toBeWithinRange(floor: number, ceiling: number): T;
  }
}
```

```ts
// 使い方
expect(5).toBeWithinRange(1, 10);  // ✅ 5は1〜10の範囲内
expect(15).toBeWithinRange(1, 10); // ❌ 15は範囲外
```

> **初心者の疑問**: いつカスタムMatcherを作るべき？
>
> 「同じ検証を何度も書いている」「プロジェクト特有の概念を検証したい」ときです。例えば「金額が正の整数か」という検証が何十回も出てくるなら、`toBePositiveAmount` を作ると便利です。最初は無理に作らず、繰り返し現れた時に作りましょう。

---

## 10. 実践演習 — 実際に手を動かす

### 演習1: 純粋関数のテスト

以下の関数のテストを書いてみましょう。まず自分で書いてから、回答例を見てください。

```ts
// utils/calculator.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error("0で割ることはできません");
  return a / b;
}

export function calculateTotal(items: { price: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

**考えてみよう**:
1. `add` はどんなテストケースが必要？ → 正の数、負の数、0、小数
2. `divide` は？ → 正常系＋0で割った時の例外
3. `calculateTotal` は？ → 空配列、1つ、複数

<details>
<summary>回答例を表示</summary>

```ts
// tests/calculator.test.ts
import { describe, it, expect } from "vitest";
import { add, divide, calculateTotal } from "../utils/calculator";

describe("add", () => {
  it("正の数を足す", () => {
    expect(add(1, 2)).toBe(3);
  });

  it("負の数を足す", () => {
    expect(add(-1, -2)).toBe(-3);
  });

  it("0を足す", () => {
    expect(add(5, 0)).toBe(5);
  });
});

describe("divide", () => {
  it("正の数を割る", () => {
    expect(divide(10, 2)).toBe(5);
  });

  it("0で割ると例外を投げる", () => {
    expect(() => divide(10, 0)).toThrow("0で割ることはできません");
  });
});

describe("calculateTotal", () => {
  it("空の配列は0", () => {
    expect(calculateTotal([])).toBe(0);
  });

  it("1つの商品", () => {
    expect(calculateTotal([{ price: 100, quantity: 2 }])).toBe(200);
  });

  it("複数の商品", () => {
    const items = [
      { price: 100, quantity: 2 }, // 200
      { price: 500, quantity: 1 }, // 500
    ];
    expect(calculateTotal(items)).toBe(700);
  });
});
```
</details>

### 演習2: バリデーション関数のテスト

```ts
// utils/validation.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (password.length < 8) errors.push("8文字以上");
  if (!/[A-Z]/.test(password)) errors.push("大文字を含む");
  if (!/[a-z]/.test(password)) errors.push("小文字を含む");
  if (!/[0-9]/.test(password)) errors.push("数字を含む");

  return { valid: errors.length === 0, errors };
}
```

<details>
<summary>回答例を表示</summary>

```ts
// tests/validation.test.ts
import { describe, it, expect } from "vitest";
import { isValidEmail, isValidPassword } from "../utils/validation";

describe("isValidEmail", () => {
  it("有効なメールアドレス", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
  });

  it("@がない場合は無効", () => {
    expect(isValidEmail("invalid")).toBe(false);
  });

  it("ドメインがない場合は無効", () => {
    expect(isValidEmail("test@")).toBe(false);
  });
});

describe("isValidPassword", () => {
  it("全条件を満たす場合はvalid", () => {
    const result = isValidPassword("Password1");
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("短すぎる場合はエラーに8文字以上を含む", () => {
    const result = isValidPassword("Ab1");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("8文字以上");
  });

  it("大文字がない場合はエラー", () => {
    const result = isValidPassword("password1");
    expect(result.errors).toContain("大文字を含む");
  });
});
```
</details>

---


## まとめ

### このセッションで学んだこと

| 概念 | 説明 | 初心者の理解 |
|------|------|-------------|
| **テストがなぜ必要か** | 手動確認を自動化し、安心してコードを書ける | 自動検査員 |
| **テストピラミッド** | 単体 > 統合 > E2E | 小さい検査をたくさん、大掛かりは少数 |
| **Vitest** | 高速なテスト実行ツール（テストランナー） | テストのエンジン |
| **AAAパターン** | Arrange-Act-Assert | 準備・実行・検証の3ステップ |
| **Matcher** | `toBe`, `toEqual`, `toContain` など | 「期待値」を判定する |
| **非同期テスト** | `async/await`, `resolves/rejects` | 非同期処理の完了を待つ |
| **ライフサイクル** | `beforeEach`, `afterAll` など | テスト前後の準備と片付け |
| **モック** | `vi.fn()`, `vi.mock()` | 外部依存を偽物に置き換える |


### 初心者が次に進む前に確認すること

- [ ] `npm run test:run` でテストが緑で通る
- [ ] 演習1〜2のテストを自分で書いてみた
- [ ] Matcherの `toBe` と `toEqual` の違いを理解した
- [ ] `async/await` で非同期テストを書けるようになった
- [ ] `vi.fn()` でモックが作れることを理解した

### 次のセッション

Session 2では、**React Testing Library**を使って実際のReactコンポーネントをテストする方法を学びます。「コンポーネントを画面に表示して、ボタンをクリックして、表示が変わるか」を自動で確認する方法です。