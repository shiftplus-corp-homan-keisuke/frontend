# Session C: Accordion Component（上級演習）

## 学習目標

このセッションでは、2 段階に分けて Accordion コンポーネントを構築し、React 開発における重要な概念と設計パターンを段階的に学習します：

### Part 1: 基本的な Accordion 実装

- **独立した状態管理による個別制御パターン**
- **条件付きレンダリングの実践的活用**
- **コンポーネント内状態による UI 制御**
- **動的スタイリングとクラス名制御**

### Part 2: 状態リフトアップと高度な設計

- **状態の一元管理とリフトアップパターン**
- **親子間通信による排他的動作制御**
- **children prop による再利用性向上**
- **複雑な状態ロジックの実装**

この Accordion 演習は、実際の Web アプリケーションで頻繁に使用される UI パターンを通じて、React 開発の核心概念である状態管理と親子間通信の深い理解を促進します。

## Part 1: 基本 Accordion - 独立状態による個別制御

### アプリケーション仕様（v1）

**機能要件**：

- **個別開閉**: 各アコーディオンアイテムが独立して開閉可能
- **複数同時展開**: 複数のアイテムを同時に開くことが可能
- **動的スタイリング**: 開いた状態で視覚的フィードバックを提供
- **アイコン切り替え**: 開閉状態に応じて「+」「-」アイコンが変化

### データ構造の設計

まず、FAQ（よくある質問）形式のデータを準備します：

```javascript
const faqs = [
  {
    title: "Where are these chairs assembled?",
    text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium, quaerat temporibus quas dolore provident nisi ut aliquid ratione beatae sequi aspernatur veniam repellendus.",
  },
  {
    title: "How long do I have to return my chair?",
    text: "Pariatur recusandae dignissimos fuga voluptas unde optio nesciunt commodi beatae, explicabo natus.",
  },
  {
    title: "Do you ship to countries outside the EU?",
    text: "Excepturi velit laborum, perspiciatis nemo perferendis reiciendis aliquam possimus dolor sed! Dolore laborum ducimus veritatis facere molestias!",
  },
];
```

### Step 1: 静的レイアウトの構築

#### Accordion コンポーネント（親）

```javascript
function Accordion({ data }) {
  return (
    <div className="accordion">
      {data.map((el, i) => (
        <AccordionItem title={el.title} text={el.text} num={i} key={el.title} />
      ))}
    </div>
  );
}
```

**設計ポイント**：

- **data prop**: 汎用的なデータを受け取る設計
- **key の使用**: `el.title` を使用した一意性の確保
- **index の活用**: `i` を番号として渡す

#### AccordionItem コンポーネント（子）

```javascript
function AccordionItem({ num, title, text }) {
  return (
    <div className="item">
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="title">{title}</p>
      <p className="icon">+</p>

      <div className="content-box">{text}</div>
    </div>
  );
}
```

**実装の詳細**：

1. **番号フォーマット**:

   ```javascript
   {
     num < 9 ? `0${num + 1}` : num + 1;
   }
   ```

   - 0 から始まるインデックスを 1 から始まる番号に変換
   - 9 以下の場合はゼロパディング（01, 02, 03...）

2. **静的要素**:
   - `number`: 順序番号の表示
   - `title`: 質問タイトル
   - `icon`: 固定の「+」アイコン
   - `content-box`: 回答テキスト（常に表示）

### Step 2: 動的状態管理の実装

#### 状態の追加

```javascript
import { useState } from "react";

function AccordionItem({ num, title, text }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen((current) => !current);
  }

  return (
    <div className="item" onClick={handleToggle}>
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="title">{title}</p>
      <p className="icon">{isOpen ? "-" : "+"}</p>

      {/* 条件付きレンダリング */}
      {isOpen && <div className="content-box">{text}</div>}
    </div>
  );
}
```

**状態管理の詳細解説**：

1. **状態の初期化**:

   ```javascript
   const [isOpen, setIsOpen] = useState(false);
   ```

   - デフォルトで全てのアイテムは閉じた状態

2. **状態更新関数**:

   ```javascript
   function handleToggle() {
     setIsOpen((current) => !current);
   }
   ```

   - 現在の状態の逆転（true ↔ false）
   - 関数型更新による確実な状態変更

3. **条件付きレンダリング**:
   ```javascript
   {
     isOpen && <div className="content-box">{text}</div>;
   }
   ```
   - `isOpen` が `true` の場合のみコンテンツを表示

### Step 3: 動的スタイリングの実装

#### クラス名の動的制御

```javascript
function AccordionItem({ num, title, text }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen((current) => !current);
  }

  return (
    <div className={`item ${isOpen ? "open" : ""}`} onClick={handleToggle}>
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="title">{title}</p>
      <p className="icon">{isOpen ? "-" : "+"}</p>

      {isOpen && <div className="content-box">{text}</div>}
    </div>
  );
}
```

**動的スタイリングの仕組み**：

1. **テンプレートリテラル**:

   ```javascript
   className={`item ${isOpen ? "open" : ""}`}
   ```

   - 基本クラス `item` は常に適用
   - `isOpen` が `true` の場合は `open` クラスも追加

2. **CSS との連携**:

   ```css
   .item.open {
     border-top: 4px solid #087f5b;
   }

   .item.open .number,
   .item.open .title {
     color: #087f5b;
   }
   ```

### Part 1 完成版コード

```javascript
import React, { useState } from "react";
import "./Accordion.css";

const faqs = [
  {
    title: "Where are these chairs assembled?",
    text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium, quaerat temporibus quas dolore provident nisi ut aliquid ratione beatae sequi aspernatur veniam repellendus.",
  },
  {
    title: "How long do I have to return my chair?",
    text: "Pariatur recusandae dignissimos fuga voluptas unde optio nesciunt commodi beatae, explicabo natus.",
  },
  {
    title: "Do you ship to countries outside the EU?",
    text: "Excepturi velit laborum, perspiciatis nemo perferendis reiciendis aliquam possimus dolor sed! Dolore laborum ducimus veritatis facere molestias!",
  },
];

function Accordion({ data }) {
  return (
    <div className="accordion">
      {data.map((el, i) => (
        <AccordionItem title={el.title} text={el.text} num={i} key={el.title} />
      ))}
    </div>
  );
}

function AccordionItem({ num, title, text }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen((current) => !current);
  }

  return (
    <div className={`item ${isOpen ? "open" : ""}`} onClick={handleToggle}>
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="title">{title}</p>
      <p className="icon">{isOpen ? "-" : "+"}</p>

      {isOpen && <div className="content-box">{text}</div>}
    </div>
  );
}

function App() {
  return (
    <div>
      <Accordion data={faqs} />
    </div>
  );
}

export default App;
```

## Part 2: 状態リフトアップと高度な制御

### アプリケーション仕様（v2）

**機能要件の変更**：

- **排他制御**: 一度に一つのアイテムのみ開くことが可能
- **開閉切り替え**: 開いているアイテムを再クリックで閉じる
- **状態の一元管理**: 親コンポーネントが開閉状態を管理
- **children prop**: より柔軟なコンテンツ表示

### 設計思想の転換

**Part 1 の設計**：各アイテムが独自の状態を管理

```
AccordionItem1: [isOpen: false]
AccordionItem2: [isOpen: false]
AccordionItem3: [isOpen: false]
```

**Part 2 の設計**：親コンポーネントが全体の状態を管理

```
Accordion: [currentOpen: null | number]
  ├─ AccordionItem1: isOpen = (0 === currentOpen)
  ├─ AccordionItem2: isOpen = (1 === currentOpen)
  └─ AccordionItem3: isOpen = (2 === currentOpen)
```

### Step 1: 状態のリフトアップ

#### 親コンポーネントでの状態管理

```javascript
function Accordion({ data }) {
  // 状態を親コンポーネントにリフトアップ
  const [curOpen, setCurOpen] = useState(null);

  return (
    <div className="accordion">
      {data.map((el, i) => (
        <AccordionItem
          curOpen={curOpen} // 現在開いているアイテム番号
          onOpen={setCurOpen} // 状態更新関数
          title={el.title}
          text={el.text}
          num={i}
          key={el.title}
        />
      ))}
    </div>
  );
}
```

**リフトアップの理由**：

1. **排他制御**: 一つだけ開く制御には全体状態が必要
2. **データの一元化**: 単一の真実のソースを確立
3. **状態の共有**: 全てのアイテムが現在の状態を知る必要

#### 子コンポーネントでの状態計算

```javascript
function AccordionItem({ num, title, text, curOpen, onOpen }) {
  // 自身の番号と現在開いている番号を比較
  const isOpen = num === curOpen;

  function handleToggle() {
    onOpen(isOpen ? null : num);
  }

  return (
    <div className={`item ${isOpen ? "open" : ""}`} onClick={handleToggle}>
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="title">{title}</p>
      <p className="icon">{isOpen ? "-" : "+"}</p>

      {isOpen && <div className="content-box">{text}</div>}
    </div>
  );
}
```

**状態計算ロジック**：

1. **開閉状態の判定**:

   ```javascript
   const isOpen = num === curOpen;
   ```

   - 自身の番号が現在開いている番号と一致するかチェック

2. **状態更新ロジック**:
   ```javascript
   function handleToggle() {
     onOpen(isOpen ? null : num);
   }
   ```
   - **既に開いている場合**: `null` を設定（閉じる）
   - **閉じている場合**: 自身の番号を設定（開く）

### Step 2: children prop による柔軟性向上

#### データ構造の変更不要でコンテンツ多様化

```javascript
function Accordion({ data }) {
  const [curOpen, setCurOpen] = useState(null);

  return (
    <div className="accordion">
      {data.map((el, i) => (
        <AccordionItem
          curOpen={curOpen}
          onOpen={setCurOpen}
          title={el.title}
          num={i}
          key={el.title}
        >
          {/* children prop として渡す */}
          {el.text}
        </AccordionItem>
      ))}

      {/* カスタムコンテンツの例 */}
      <AccordionItem
        curOpen={curOpen}
        onOpen={setCurOpen}
        title="Advanced Features"
        num={22}
        key="advanced"
      >
        <p>React allows developers to:</p>
        <ul>
          <li>Break up UI into components</li>
          <li>Make components reusable</li>
          <li>Place state efficiently</li>
        </ul>
      </AccordionItem>
    </div>
  );
}
```

#### children prop を受け取る実装

```javascript
function AccordionItem({ num, title, curOpen, onOpen, children }) {
  const isOpen = num === curOpen;

  function handleToggle() {
    onOpen(isOpen ? null : num);
  }

  return (
    <div className={`item ${isOpen ? "open" : ""}`} onClick={handleToggle}>
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="title">{title}</p>
      <p className="icon">{isOpen ? "-" : "+"}</p>

      {isOpen && (
        <div className="content-box">
          {children} {/* 柔軟なコンテンツ表示 */}
        </div>
      )}
    </div>
  );
}
```

**children prop の利点**：

1. **コンテンツの多様性**:

   ```javascript
   // テキストのみ
   <AccordionItem>{text}</AccordionItem>

   // 複雑なJSX
   <AccordionItem>
     <p>説明文</p>
     <ul><li>項目1</li><li>項目2</li></ul>
   </AccordionItem>
   ```

2. **再利用性の向上**: 同じコンポーネントで異なるコンテンツタイプに対応

### データフロー分析

Part 2 の実装における完全なデータフローを理解しましょう：

```
1. ユーザークリック
   AccordionItem[num=1] がクリックされる

2. イベントハンドラー実行
   handleToggle() が呼び出される

3. 状態判定
   isOpen = (1 === curOpen) を評価

4. 状態更新要求
   onOpen(isOpen ? null : 1) を実行

5. 親コンポーネントの状態更新
   setCurOpen(1) が実行される
   curOpen = 1 に更新

6. 全子コンポーネントへの伝播
   全てのAccordionItemに新しいcurOpen=1が渡される

7. 各子コンポーネントでの再計算
   AccordionItem[num=0]: isOpen = (0 === 1) = false
   AccordionItem[num=1]: isOpen = (1 === 1) = true
   AccordionItem[num=2]: isOpen = (2 === 1) = false

8. UI更新
   num=1のアイテムのみが開いた状態で表示される
```

### 完全な実装（Part 2）

```javascript
import React, { useState } from "react";
import "./Accordion.css";

const faqs = [
  {
    title: "Where are these chairs assembled?",
    text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium, quaerat temporibus quas dolore provident nisi ut aliquid ratione beatae sequi aspernatur veniam repellendus.",
  },
  {
    title: "How long do I have to return my chair?",
    text: "Pariatur recusandae dignissimos fuga voluptas unde optio nesciunt commodi beatae, explicabo natus.",
  },
  {
    title: "Do you ship to countries outside the EU?",
    text: "Excepturi velit laborum, perspiciatis nemo perferendis reiciendis aliquam possimus dolor sed! Dolore laborum ducimus veritatis facere molestias!",
  },
];

function Accordion({ data }) {
  const [curOpen, setCurOpen] = useState(null);

  return (
    <div className="accordion">
      {data.map((el, i) => (
        <AccordionItem
          curOpen={curOpen}
          onOpen={setCurOpen}
          title={el.title}
          num={i}
          key={el.title}
        >
          {el.text}
        </AccordionItem>
      ))}

      {/* 高度な使用例 */}
      <AccordionItem
        curOpen={curOpen}
        onOpen={setCurOpen}
        title="React Benefits"
        num={22}
        key="react-benefits"
      >
        <p>Allows React developers to:</p>
        <ul>
          <li>Break up UI into components</li>
          <li>Make components reusable</li>
          <li>Place state efficiently</li>
        </ul>
      </AccordionItem>
    </div>
  );
}

function AccordionItem({ num, title, curOpen, onOpen, children }) {
  const isOpen = num === curOpen;

  function handleToggle() {
    onOpen(isOpen ? null : num);
  }

  return (
    <div className={`item ${isOpen ? "open" : ""}`} onClick={handleToggle}>
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="title">{title}</p>
      <p className="icon">{isOpen ? "-" : "+"}</p>

      {isOpen && <div className="content-box">{children}</div>}
    </div>
  );
}

function App() {
  return (
    <div>
      <Accordion data={faqs} />
    </div>
  );
}

export default App;
```

### CSS スタイリング

```css
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #343a40;
  line-height: 1.6;
  background-color: #f8f9fa;
}

.accordion {
  width: 700px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.item {
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
  padding: 20px 24px;
  padding-right: 48px;
  cursor: pointer;
  border-top: 4px solid #fff;
  border-bottom: 4px solid #fff;
  background-color: #fff;
  border-radius: 8px;
  transition: all 0.3s ease;

  display: grid;
  grid-template-columns: auto 1fr auto;
  column-gap: 24px;
  row-gap: 32px;
  align-items: center;
}

.item:hover {
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.number {
  font-size: 24px;
  font-weight: 500;
  color: #ced4da;
}

.title,
.icon {
  font-size: 24px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.icon {
  font-size: 32px;
  line-height: 1;
}

.content-box {
  grid-column: 2 / -1;
  padding-bottom: 16px;
  line-height: 1.6;
  animation: fadeIn 0.3s ease;
}

.content-box ul {
  color: #868e96;
  margin-left: 16px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-box p {
  margin-bottom: 16px;
  color: #495057;
}

/* アニメーション */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 開いた状態のスタイリング */
.item.open {
  border-top: 4px solid #087f5b;
  box-shadow: 0 6px 50px rgba(8, 127, 91, 0.1);
}

.item.open .number,
.item.open .title {
  color: #087f5b;
}

.item.open .icon {
  color: #087f5b;
  transform: rotate(180deg);
}
```

## 重要な学習ポイント

### 1. 状態管理の設計選択

**Part 1: 分散型状態管理**

```javascript
// 各コンポーネントが独自の状態を持つ
function AccordionItem() {
  const [isOpen, setIsOpen] = useState(false);
  // 独立した制御が可能
}
```

**Part 2: 集中型状態管理**

```javascript
// 親コンポーネントが全体状態を管理
function Accordion() {
  const [curOpen, setCurOpen] = useState(null);
  // 協調的な制御が可能
}
```

### 2. リフトアップの判断基準

**リフトアップが必要な場面**：

- 複数のコンポーネント間で状態を共有する必要がある
- 一つのコンポーネントの状態変更が他に影響する
- 排他的制御や協調動作が必要

**リフトアップ不要な場面**：

- コンポーネントが完全に独立している
- 状態の変更が他に影響しない
- 単純な表示/非表示切り替え

### 3. children prop の活用

**従来の prop 渡し**:

```javascript
<AccordionItem text={el.text} />
```

**children prop**:

```javascript
<AccordionItem>{el.text}</AccordionItem>
<AccordionItem>
  <p>Complex content</p>
  <ul><li>List item</li></ul>
</AccordionItem>
```

**利点**:

- より柔軟なコンテンツ表現
- JSX 要素の直接的な受け渡し
- コンポーネントの再利用性向上

## まとめ

この Accordion Component 演習を通じて、以下の重要な概念を実践的に学習しました：

### 技術的スキル

1. **状態管理パターン**: 分散型から集中型への設計変更
2. **リフトアップ**: 状態を適切な階層に配置する技術
3. **親子間通信**: props とコールバックによるデータ・イベント伝達
4. **children prop**: 柔軟なコンポーネント設計

### 設計思考

1. **要件分析**: 機能要件から適切な状態管理手法を選択
2. **データフロー設計**: 複雑な状態変更の流れを設計・実装
3. **再利用性**: 汎用的で拡張可能なコンポーネント設計

### 実用性

このパターンは実際の Web アプリケーションでよく使用される：

- **FAQ セクション**: よくある質問の表示
- **ナビゲーションメニュー**: 階層メニューの実装
- **設定パネル**: カテゴリ別設定の管理
- **フィルター機能**: 検索条件の展開/折りたたみ

これらの学習成果は、より高度な React アプリケーション開発における状態管理とコンポーネント設計の強固な基盤となります。
