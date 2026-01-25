# Session 3: shadcn/ui - 美しくアクセシブルなUIを構築しよう

## はじめに：このセッションで作るもの

このセッションでは、現在 React コミュニティで最も注目されている UI 構築手法である **shadcn/ui** の使い方を学びます。
お題として、架空の EC サイトの **「商品管理（Admin）ダッシュボード」** を作成します。

### 完成イメージ

```
┌──────────────────────────────────────────────────┐
│  📊 Admin Dashboard                              │
│  [検索...]                 [ + 商品を追加 ]      │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │  商品名        価格    在庫    ステータス      │  │
│  ├────────────────────────────────────────────┤  │
│  │  iPhone 15    $999    120     [販売中] ... │  │
│  │  MacBook Pro  $1999   45      [在庫少] ... │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### 学ぶこと

1.  **shadcn/ui の概念**: コンポーネントライブラリ（MUI や Chakra UI）との違い。
2.  **セットアップ**: CLI ツールを使った初期設定。
3.  **コンポーネントの追加**: 必要なパーツだけをプロジェクトに追加する手法。
4.  **実践**: Button, Input, Table, Badge, Dialog などを組み合わせた UI 構築。

---

## 1. shadcn/ui とは？

**"NOT a component library"**（コンポーネントライブラリではない）

これが shadcn/ui の最大の特徴です。npm install して `node_modules` から import するのではなく、**コンポーネントのソースコードそのものをあなたのプロジェクトにコピー＆ペースト**して使います（実際には CLI が自動でやってくれます）。

- **メリット**: コードが手元にあるため、デザインや挙動を自由にカスタマイズできる。
- **ベース**: ヘッドレス UI ライブラリ（Radix UI）と Tailwind CSS で構築されており、アクセシビリティ（使いやすさ）とスタイリングの自由度を両立しています。

---

## 2. プロジェクトの準備

### 2.1 Vite プロジェクトの作成

新しいプロジェクトを作成しましょう。

```bash
npm create vite@latest dashboard-app -- --template react-ts
cd dashboard-app
npm install
```

### 2.2 shadcn/ui の初期化

shadcn/ui を使うには、簡単なセットアップコマンドを実行するだけです。これにより、Tailwind CSS の設定なども自動的に行われます。

```bash
npx shadcn@latest init
```

実行すると、いくつか質問されます。基本的には以下のように回答して進めてください。

- **Which style would you like to use?**: `New York` (標準的で洗練されたスタイル)
- **Which color would you like to use as base color?**: `Zinc` (グレー系、無難でおしゃれ)
- **Do you want to use CSS variables for colors?**: `yes`
- **How would you like to proceed?**: Enter (デフォルトでOK)

セットアップが完了すると、`components.json` という設定ファイルが作成され、`src/lib/utils.ts` などのユーティリティも自動生成されます。

---

## 3. 基本的なコンポーネントを使ってみる

まずは、最も基本的な `Button` コンポーネントを追加して使ってみましょう。

### 3.1 Button の追加

以下のコマンドで Button コンポーネントのコードをプロジェクトに追加します。

```bash
npx shadcn@latest add button
```

すると、`src/components/ui/button.tsx` というファイルが生成されます。中身を見てみると、普通の React コンポーネントであることがわかります。

### 3.2 Button の表示

`src/App.tsx` を編集してボタンを表示してみましょう。

```tsx
// src/App.tsx
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Shadcn Dashboard</h1>
      <div className="flex gap-4">
        <Button>標準ボタン</Button>
        <Button variant="secondary">セカンダリ</Button>
        <Button variant="destructive">削除</Button>
        <Button variant="outline">アウトライン</Button>
        <Button variant="ghost">ゴースト</Button>
      </div>
    </div>
  );
}

export default App;
```

> **ポイント**: `variant` プロパティを変えるだけで、定義済みのスタイルを簡単に切り替えられます。

---

## 4. 管理画面（ダッシュボード）の構築

では、より実践的な UI を作っていきます。必要なコンポーネントをまとめて追加しましょう。

```bash
npx shadcn@latest add input table badge dialog label
```

### 4.1 データ構造の定義

まずは表示するダミーデータを定義します。`src/App.tsx` に追記します（実際の開発では別ファイルに分けますが、今回は学習用として同じファイルに書きます）。

```tsx
// src/App.tsx の上部に追加
type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "archived";
};

const products: Product[] = [
  { id: "1", name: "iPhone 15", price: 999, stock: 120, status: "active" },
  { id: "2", name: "MacBook Pro", price: 1999, stock: 45, status: "active" },
  { id: "3", name: "AirPods Max", price: 549, stock: 0, status: "archived" },
];
```

### 4.2 商品一覧テーブルの実装

`Table` コンポーネントを使ってデータを表示します。

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// ... (App関数の中)

return (
  <div className="p-10 max-w-4xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">商品管理</h1>
    </div>

    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>商品名</TableHead>
            <TableHead>価格</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead className="text-right">在庫</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    product.status === "active" ? "default" : "secondary"
                  }
                >
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{product.stock}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);
```

これで、綺麗にスタイリングされたテーブルが表示されました！

---

## 5. インタラクティブな機能：ダイアログ（モーダル）

商品を新規追加するためのモーダルウィンドウを `Dialog` コンポーネントで実装します。

### 5.1 ダイアログの実装

`src/App.tsx` をさらに拡張します。必要なコンポーネントを import してください。

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ...

// App コンポーネント内の "商品管理" ヘッダー部分を修正
<div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold">商品管理</h1>

  {/* ダイアログの実装 */}
  <Dialog>
    <DialogTrigger asChild>
      <Button>+ 商品を追加</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>商品を編集</DialogTitle>
        <DialogDescription>
          商品情報を入力して保存してください。
        </DialogDescription>
      </DialogHeader>

      {/* フォーム部分 */}
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            商品名
          </Label>
          <Input id="name" defaultValue="iPad Air" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            価格
          </Label>
          <Input id="price" defaultValue="599" className="col-span-3" />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">変更を保存</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>;
```

これで、「+ 商品を追加」ボタンを押すと、アクセシブルなモーダルウィンドウがアニメーション付きで開き、背景が暗くなる（オーバーレイ）機能が簡単に実装できました。

---

## 6. 実践演習：削除確認アラート

**課題：**
各行の右端に「削除」ボタンを追加し、クリックすると**警告ダイアログ**が表示されるようにしてください。

**ヒント:**

1.  `npx shadcn@latest add alert-dialog` を実行する。
2.  `Table` に新しい列（Actions列）を追加する。
3.  `AlertDialog` コンポーネントを使って、「本当に削除しますか？」という確認画面を作る。

<details>
<summary>回答例を表示</summary>

**1. 実装コード (抜粋)**

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// ... テーブルの列定義に追加 ...
<TableHead className="text-right">操作</TableHead>

// ... テーブルボディのセルに追加 ...
<TableCell className="text-right">
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="ghost" size="sm">削除</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
        <AlertDialogDescription>
          この操作は取り消せません。商品はデータベースから完全に削除されます。
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>キャンセル</AlertDialogCancel>
        <AlertDialogAction className="bg-red-600 hover:bg-red-700">
          削除する
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</TableCell>
```

</details>

---

## 7. まとめ

shadcn/ui を使うと、ゼロからスタイルを書いたり、重たいコンポーネントライブラリと格闘したりすることなく、**「必要なものを、必要な場所に、自由に」**組み込めることが体感できたと思います。

### 次のステップ

- **React Hook Form との連携**: 今回は Input を直接使いましたが、`Form` コンポーネントを使うと、バリデーション付きの堅牢なフォームが作れます（少しコード量は増えます）。
- **ダークモード**: `next-themes` などを入れるだけで、簡単にダークモード対応ができます。

これで Phase 2 のライブラリ学習は一通り完了です！お疲れ様でした。
Phase 3 では、これらを組み合わせて本格的なアプリケーション開発に挑戦しましょう。
