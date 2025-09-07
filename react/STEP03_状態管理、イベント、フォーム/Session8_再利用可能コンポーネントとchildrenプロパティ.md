# Session8: 再利用可能コンポーネントと children プロパティ

## セクション概要

このセッションでは、React の最も重要で実用的な概念の一つである「children プロパティ」について学習します。また、実践的な演習として、アコーディオンコンポーネントの構築を通じて、状態管理と React の思考法をさらに深めていきます。

これまでに学んだ状態管理の知識を活用して、より複雑なインタラクティブコンポーネントを作成し、その後、コンポーネントの再利用性を高めるための children プロパティの使い方を習得します。

children プロパティは、React の最も強力で便利な機能の一つです。これを理解することで、真に再利用可能で柔軟なコンポーネントを作成できるようになり、実際の開発現場で非常に重要なスキルを身につけることができます。

## 演習 1: アコーディオンコンポーネント（v1）の実装

それでは、もう一つの演習に取り組んでいきましょう。

状態管理と React の思考法を更に練習するために、とてもシンプルなアコーディオンコンポーネントを一緒に構築していきます。これらのアコーディオンの各アイテムを開いたり閉じたりできるようになります。

閉じている状態でクリックすると、開きます。

そして開いている状態でクリックすると、再び閉じます。

これらの各アイテムには、タイトル、番号、そしてテキスト自体があります。

つまり、これは質問で、これは基本的に答えです。

再び、スターターファイルがあります。この講義にリンクされています。

スターターファイルは、よくある質問の配列と、この CSS スタイルです。

いつものように、2 つの選択肢があります。

自分の VS Code で作業することができます。

その場合は、関連するすべてのスターターデータをコピーしてください。

もちろん、このコードサンドボックスをフォークすることもできます。

基本的に自分のコピーを作成するためです。

他のプロジェクトから新しいものを作成したので、これを安全に変更できます。

### アコーディオンの構造を理解する

元の状態に戻って、何を構築する必要があるかを見てみましょう。

基本的に、全体がアコーディオンコンポーネントです。

そして、それぞれがアコーディオンアイテムの一つです。

それでは、実際にこれらのアイテム自体を構築することから始めましょう。

それぞれが番号、タイトル、そしていくつかのテキストを受け取ることを覚えておいてください。

アコーディオンコンポーネントは実際にすでに作成されています。

そして今度は、アコーディオンアイテムを作成しましょう。

### AccordionItem コンポーネントの作成

それぞれのアイテムが番号を受け取ることを覚えておいてください。

タイトルとテキストを受け取ります。

そして、すぐにここに記述しましょう。基本的に、受け取る props として。

そうすれば、すぐにこれらを使って構築できます。

以前と同じように、まずアプリの静的バージョンを構築することから始めます。

この場合は、これら 2 つのコンポーネントの静的バージョンです。

そして後で、実際にコンポーネントを動的にするために状態を追加します。

ここで div 要素を返します。

そして、この div には、提供した CSS からの item というクラス名があります。

div を閉じることができます。

そして、番号用の段落が 1 つあります。

クラス名は number です。

そして、ここで、すぐに実際にこの prop を使用しましょう。

このコンポーネントをどこかに含めるとすぐに受け取る prop ですが、すでにその prop が存在するかのように使用できます。

```jsx
function AccordionItem({ num, title, text }) {
  return (
    <div className="item">
      <p className="number">{num}</p>
    </div>
  );
}
```

クラス名、それから text と言いましょう。

そして再び、ここで同じことです。

すぐに prop を使用します。

```jsx
function AccordionItem({ num, title, text }) {
  return (
    <div className="item">
      <p className="number">{num}</p>
      <p className="text">{title}</p>
    </div>
  );
}
```

そして最後に、アイコン用のこれです。

アイコンとは、このマイナスとプラスのことです。

プラスとマイナスの間でどのように切り替わるかを見てください。

今のところ、マイナスから始めましょう。

しかし、後でそれを変更します。

```jsx
function AccordionItem({ num, title, text }) {
  return (
    <div className="item">
      <p className="number">{num}</p>
      <p className="text">{title}</p>
      <p className="icon">-</p>
    </div>
  );
}
```

そして最後に、コンテンツ自体を含む div があります。

基本的にテキストです。

ここでクラス名は content-box です。

そして、これは再び実際のテキストが入る場所です。

```jsx
function AccordionItem({ num, title, text }) {
  return (
    <div className="item">
      <p className="number">{num}</p>
      <p className="text">{title}</p>
      <p className="icon">-</p>
      <div className="content-box">{text}</div>
    </div>
  );
}
```

ここでミスがあることがわかります。

これは実際にはタイトル用なので、なぜ text と呼んだのかわかりません。

クラス名の話です。

でも、まあ、気にしないでください。

### Accordion コンポーネントの実装

そして今、このアコーディオンで必要なのは、いつものようにこのオブジェクトの配列をループすることだけです。

そして、オブジェクトのそれぞれに対して、これらのアイテムの 1 つをレンダリングしたいと思います。

そして実際に、これをもう少し再利用可能にするために、何らかの汎用データを受け入れましょう。

そして、ここでそのデータを渡します。

データとして faqs を使用します。

そうすれば、同じアコーディオンを異なる配列で再利用できます。

```jsx
function Accordion({ data }) {
  return <div className="accordion"></div>;
}
```

このクラス名は accordion であるべきです。

そして、ここでマッピングが発生します。

data.map です。

そして、これらの要素のそれぞれに対して、

よくある質問と呼ぶこともできますが、汎用的な要素にしましょう。

そして前に言ったように、それぞれに対してアコーディオンアイテムを 1 つレンダリングしたいと思います。

そして、そこに何を渡したいでしょうか？

タイトルは element.title になります。

これがここのものです。

そして、同じオブジェクトからのテキストも、element.text です。

そして今、番号も欲しいです。

これは自動的に 1、2、3 になるはずです。

map で渡される現在のインデックスも使用することで、それを非常に簡単に行うことができます。

map のコールバックは、実際に現在の要素に加えて、現在のインデックスも取得するからです。

現在の要素に加えて、現在のインデックスも取得します。

2 番目の引数として、i と呼びましょう。

そして、num として単純に i を渡すことができます。

それで終わりです。

```jsx
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

### 初期表示の調整

何かが表示されています。

これを少し小さくしましょう。

すべてではありません。

サイドバーを閉じましょう。

はい、それははるかに良いです。

さらに少し小さくすることもできます。

そして比較してみましょう。

ここでは実際に 01 のような番号があります。

そして、テキストスタイルも少し違って見えます。

見てみましょう。

しかし、はい、クラス名はすべて正しく見えます。

しかし今、ここの番号を素早く処理しましょう。

ここで 01、02、03 を持ちたいです。

ここで少し魔法をかけましょう。

番号が 9 未満の場合、ここに 0 を置いてください。

そして番号プラス 1 です。

しかし、そうでなければ、ここで、それは単に番号プラス 1 です。

```jsx
function AccordionItem({ num, title, text }) {
  return (
    <div className="item">
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="text">{title}</p>
      <p className="icon">-</p>
      <div className="content-box">{text}</div>
    </div>
  );
}
```

それははるかに良く見えます。

そして、ここで、これを title に変更しましょう。

それで動作するはずです。

```jsx
function AccordionItem({ num, title, text }) {
  return (
    <div className="item">
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="title">{title}</p>
      <p className="icon">-</p>
      <div className="content-box">{text}</div>
    </div>
  );
}
```

### 状態管理の実装

そして、これで元のものに戻りましょう。

今度は状態について考え始める必要があるからです。

ここでこれらのボックスのそれぞれを個別に開いたり閉じたりできることを覚えておいてください。

基本的に、これらのボックスのそれぞれが独自の状態を保持していることを意味します。

ここをクリックすると、UI が変更されることがわかります。

UI に何らかの更新が発生するたびに考える必要がある最も基本的なことです。

ここで UI に何らかの更新が発生するということは、状態の一部が必要であることを意味します。

今、これらのアイテムのそれぞれは、他のものとは完全に独立して動作します。

ここでこれを開いても、他の 2 つには何も起こりません。

すべてを同時に開くことができます。

または、すべてを閉じることができます。つまり、

再び、それぞれが本当に独立した方法で動作します。

つまり、それぞれが独自の状態を保持する必要があります。

再び、これは開くことができるからです。

しかし、これも同様です。

そして、それが意味することは、これらのアイテムのそれぞれに状態変数を定義する必要があるということです。

それがここです。

そして、友達の useState を使用します。

状態変数を isOpen と呼び、setIsOpen としましょう。

useState が自動的にインポートされました。

これがここにあることを確認してください。

そして、デフォルトでは false になります。

デフォルトでは、各ボックスを閉じたいからです。

```jsx
function AccordionItem({ num, title, text }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="item">
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="title">{title}</p>
      <p className="icon">-</p>
      <div className="content-box">{text}</div>
    </div>
  );
}
```

状態変数を宣言したので、今度はそれを使用しましょう。

それはいつものように同じ 3 ステップのプロセスです。

定義し、使用し、そして更新します。

基本的に、isOpen が false のときに行いたいことです。

これが閉じているときは、下のこの content-box を表示しないことです。

言い換えれば、この部分の条件付きレンダリングが必要です。

JavaScript モードに入れましょう。

そして、isOpen と言いましょう。

そして、このような条件付きレンダリングです。

```jsx
function AccordionItem({ num, title, text }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="item">
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="title">{title}</p>
      <p className="icon">-</p>
      {isOpen && <div className="content-box">{text}</div>}
    </div>
  );
}
```

今、この場合、これもプラスであるべきです。

マイナスではありません。

そして、ここにも来ましょう。

isOpen と言いましょう。

そうすれば、マイナスを表示します。

そうでなければ、プラスを表示してください。

```jsx
function AccordionItem({ num, title, text }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="item">
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="title">{title}</p>
      <p className="icon">{isOpen ? "-" : "+"}</p>
      {isOpen && <div className="content-box">{text}</div>}
    </div>
  );
}
```

JavaScript モードを閉じます。

そして、これで、プラスが表示されています。

### イベントハンドラーの実装

今必要なのは、もちろん、ここをクリックしたときに、ボックスが実際に開くことです。

CSS スタイルで、この全体の div にポインターカーソルを適用したことがわかります。

全体の要素にです。

そして、これがクリックイベントをリッスンしたい場所です。

この div で。

onClick と言いましょう。

そして、ここで handleToggle と呼ばれる関数を渡します。

そして、その関数を定義しましょう。

以前と同じように、外部関数を定義するだけです。

ここで handle というキーワードを使用しますが、これは完全にオプションです。

しかし、これがイベントハンドラーとして使用される関数であることを理解しやすくします。

そして今、ここで setIsOpen を使用しましょう。

そして、現在のものを取得します。

current と呼ぶことができます。

もちろん、isOpen と呼ぶこともできます。

何でも動作します。

そして、反対のことをしたいだけです。

```jsx
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
      {isOpen && <div className="content-box">{text}</div>}
    </div>
  );
}
```

それでは、まだ動作しませんでした。

ここでリロードしてみましょう。時々必要です。

そして、はい、それは動作します。

そして再び閉じると、閉じます。美しいです。

### key プロパティの追加

今、ここでいくつかのエラーがあります。

それは key プロパティのためです。

ここで一意の key プロパティを渡す必要があります。

実際に一意である i を使用することもできます。

配列の反復から来る 01 と 2 です。

しかし、それに依存しない方が良いです。

代わりに、本当に一意なものを使用します。

例えば、各要素のタイトルです。

```jsx
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

これを閉じて、実際にすべてで動作します。

### スタイリングの最終調整

1 つの小さな詳細が欠けています。

これが開いているとき、ここに緑の境界線があります。

そして、すべてのテキストが緑になります。

これが開いているときにアイテムに追加される特別なクラスです。

アイテムで、ここです。

再び、開いている場合に 2 番目のクラスを追加したいと思います。

そのために、基本的にクラスの条件付きレンダリングが必要です。

ここで、テンプレート文字列またはテンプレートリテラルを構築する必要があります。

これはすでに item の文字列を持っています。

そして、ここで条件に基づいて、

isOpen に基づいて、

open または何も追加したいと思います。

```jsx
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

それで終わりです。

そして、それは動作します。

何らかの理由でこれが緑にならなかったようです。

ここで CSS を確認してみましょう。

何か正しくしなかったことがあるかもしれません。

はい、ここでは title であるべきです。

はい、美しいです。

そして、これで、実際にこのアコーディオンを完成させました。

少なくとも今のところは。

後でこのセクションで、この演習の第 2 部があります。

そこで、これをもう少し現実的にします。

これら 3 つのうち 1 つだけが同時に開くことができるようにします。

### 完成したコード

以下が完成したアコーディオンコンポーネントのコードです：

**app.js**

```jsx
import { useState } from "react";
import "./styles.css";

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

export default function App() {
  return (
    <div>
      <Accordion data={faqs} />
    </div>
  );
}

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
    setIsOpen((isOpen) => !isOpen);
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

**index.js**

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**styles.css**

```css
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  color: #343a40;
  line-height: 1;
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

  display: grid;
  grid-template-columns: auto 1fr auto;
  column-gap: 24px;
  row-gap: 32px;
  align-items: center;
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
}

.content-box {
  grid-column: 2 / -1;
  padding-bottom: 16px;
  line-height: 1.6;
}

.content-box ul {
  color: #868e96;
  margin-left: 16px;
  margin-top: 16px;

  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* OPEN STATE */
.open {
  border-top: 4px solid #087f5b;
}

.open .number,
.open .title {
  color: #087f5b;
}
```

## children プロパティ：再利用可能なボタンの作成

さて、次に進みましょう。今度は、React 開発で常に使用する、さらに別の基本的な概念を学ぶ時です。

それは、「children プロパティ」です。

このプロジェクトを完成させました。

そして、基本的に Control C でこれを終了できます。

そして今リロードすると、接続が失われたことがすぐにわかります。

または、この VS Code ウィンドウを単純に閉じることもできました。

さて、この講義と次の講義で children プロパティを紹介する際に行いたいことは、以前に構築した steps コンポーネントを使用することです。

steps フォルダに戻って、VS Code で開きましょう。

そして再び、お好みの方法で行うことができます。

今、実際にこのファイルを複製します。

作業しているこの App.js を、コピーしてから貼り付けて、書いたコードの最初のバージョンを保持できるようにします。

これを app version one と呼びます。

そして今、このファイルで作業を続けることができます。

### 開発サーバーの起動

それでは、ここでターミナルに来て、NPM start と書きましょう。

プロジェクトがブラウザで再び開くようにです。

はい、実際に steps コンポーネントをここに 2 回含めていたことを覚えています。

そのうちの 1 つを削除またはコメントアウトしましょう。

そして、はい、なくなりました。

そして、いつものように、コンソールを開いておくことが重要です。

そして、コンポーネントツリーも開いておきましょう。

しかし今のところ、コンソールにとどまりましょう。

### 再利用可能なボタンコンポーネントの必要性

この講義のアイデアは、これら 2 つの代わりに使用できる再利用可能なボタンを作成することです。

そして、これらのボタンに絵文字も追加したいと思います。

それらがどこにあるかを見てみましょう。

はい、これら 2 つのボタンです。

再び、今度はこれら 2 つの代わりに使用する再利用可能なボタンを作成したいと思います。

それでは、それを行いましょう。

そして、すでに持っている知識を使用することから始めます。

function button と言いましょう。

そして、これが行うことは、button 要素を返すことだけです。

ここにもこのスタイルがあります。

そして onClick イベントハンドラーです。

これら 2 つをコピーしましょう。

そして、今のところここにテキストを置きましょう。

そして今、アイデアは、背景色、色、この onClick ハンドラー、そしてテキストを props として渡すことです。

基本的に、ここでいくつかの props を受け入れたいと思います。

テキストの色用です。

実際にそれを textColor と呼びましょう。

textColor、backgroundColor、onClick ハンドラー、そしてテキストです。

そして、実際にそのボタンを使用しましょう。

ボタンで作業を続ける前に、すぐにここに含めましょう。

すぐにこれを削除しましょう。

今構築しているコンポーネントを使用するまで。

```jsx
function Button({ textColor, bgColor, onClick, text }) {
  return (
    <button
      style={{ backgroundColor: bgColor, color: textColor }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
```

textColor を言いましょう。

これはここのものであるべきです。

または実際にそれは背景色です、もちろん。

bgColor です。

そして、テキストの色、

これは FFF で白であるべきです。

そして、onClick プロパティも。

そして、ここで handlePrevious 関数を指定したいと思います。

それを閉じます。

そして、テキストも。

ここで、これは previous と言いました。

そして今、下のボタンに来て、ハードコードされた値の代わりにこれらの値を使用しましょう。

ここで、backgroundColor は受け取った bg プロパティであるべきです。

そして、これは textColor であるべきです。

プロパティとして受け取ったものです。

そして、ここで onClick が欲しいです。

そして、ここでこの汎用テキストの代わりに、再びプロパティとして受け取ったテキストが欲しいです。

保存してみましょう。リロードもしてみましょう。

そして、このボタンを使用すると、以前とまったく同じように動作し、見た目も同じです。

それでは、これと同じことをこれでも行いましょう。

これをコピーして貼り付けて、onClick ハンドラーを handleNext に変更します。

そして、ここで、next です。

このボタンを削除しましょう。

そして今、これで以前とまったく同じ機能を持っていますが、ここにあったボタンを再利用可能なボタンコンポーネントに抽出しました。

これは現在、textColor、background、onClick ハンドラー、そしてテキストを受け入れます。

```jsx
<Button
  textColor="#fff"
  bgColor="#7950f2"
  onClick={handlePrevious}
  text="Previous"
/>

<Button
  textColor="#fff"
  bgColor="#7950f2"
  onClick={handleNext}
  text="Next"
/>
```

すべてのこのデータをここで props としてこのコンポーネントに渡すことは、この時点でかなり明確であるべきです。

うまくいけば、以前の講義でそれがどのように動作するかを正確に理解したでしょう。

### 絵文字の追加と children プロパティの必要性

とにかく、今度は絵文字も追加したいと言いましょう。

それは簡単です。

ここで props として受け入れるだけです。

emoji です。

そして、テキストの前にここに追加しましょう。

そして、実際にこの絵文字用の span 要素を作成しましょう。

span を作成して、そこに絵文字を入れて、それからテキストです。

```jsx
function Button({ textColor, bgColor, onClick, text, emoji }) {
  return (
    <button
      style={{ backgroundColor: bgColor, color: textColor }}
      onClick={onClick}
    >
      <span>{emoji}</span>
      {text}
    </button>
  );
}
```

そして、その絵文字を実際に渡しましょう。

そして、ここで、finger を検索してみましょう。

previous にはこれが欲しいです。

そして、反対方向を指す指が next に欲しいです。

これです。

```jsx
<Button
  textColor="#fff"
  bgColor="#7950f2"
  onClick={handlePrevious}
  text="Previous"
  emoji="👈"
/>

<Button
  textColor="#fff"
  bgColor="#7950f2"
  onClick={handleNext}
  text="Next"
  emoji="👉"
/>
```

保存してみて、はい、それはうまく動作しました。

絵文字とテキストがあり、下で指定したとおりにボタンが正確に動作します。

しかし、今度はこの絵文字を左側に、しかし他の絵文字を右側に置きたいと言いましょう。

next と言って、右側を指すようにです。

これで、ある種の問題があります。

すでに多くの props があるからです。

そして、基本的にこの方向のためにさらに別の props を追加すべきだと思いますか？

まあ、多分そうではありません。

ここですべてのこれらの props で少しクレイジーになっているかもしれません。

そして、ボタンをさらにカスタマイズするために、さらに多くを追加し続けることができます。

しかし、この時点で、例えば、これをここに追加すべきではないと思います。

絵文字の方向や側面のために、

代わりに、ビデオの最初に言及した children プロパティを使用すべきです。

### children プロパティの導入

この側面、この絵文字、そしてテキストを渡す代わりに、これらは基本的にこの button 要素のコンテンツです。

単純にコンテンツをボタンに渡すことができたらどうでしょうか？

言い換えれば、単純に JSX をコンポーネントに渡して、コンポーネントがその JSX を使用して単純に表示できたらどうでしょうか？

実際に、React でそれを行うことができます。

ここに来て、この時点まで、すべてのコンポーネントが常に自己終了していたことに注意してください。

このようなものは決してありませんでした。

そして、何らかのコンテンツ、そして要素を閉じる。

これまでこれを持ったことはありませんが、実際に、まさにこれを行うことができます。

HTML 要素で行うのと同じように、開始タグ、いくつかのコンテンツ、そして終了タグがあります。

React コンポーネントでまったく同じことを行うことができます。

ここで、もちろん、そのでたらめは欲しくありません。

今のところそれを戻しましょう。

しかし、基本的に今ここで欲しいのは、絵文字でその span を書くことです。

これと、previous です。

これは、このボタンのコンテンツとして欲しいものです。

そして、単純な HTML ボタンとしてボタンを書いていたら、これはまさに書くものです。

実際に、これはここでこのボタンの内部で行ったことです。

そして再び、React コンポーネントでまったく同じことを行うことができます。

```jsx
<Button textColor="#fff" bgColor="#7950f2" onClick={handlePrevious}>
  <span>👈</span>Previous
</Button>
```

そして、これらはもう必要ありません。

そして、同じことをここでも行いましょう。

そして今、絵文字の方向や側面を非常に簡単に変更できる部分が来ます。

単純に next と書くことができるからです。

そして、JSX で絵文字を右側に置きます。

とても簡単ですよね？

```jsx
<Button textColor="#fff" bgColor="#7950f2" onClick={handleNext}>
  Next<span>👉</span>
</Button>
```

ボタンを閉じるのを忘れました。

そして、もちろん、ここにはもうコンテンツが表示されません。

テキストと絵文字を渡していないからです。

そして今、これを修正する時です。

### children プロパティの実装

基本的に、今度は button 要素に、開始タグと終了タグの間に書いたコンテンツへのアクセスを与える必要があります。

そして、それが最終的に children プロパティの出番です。

children プロパティは、各 React コンポーネントが自動的に受け取るプロパティです。

そして、children プロパティの値は、コンポーネントの開始タグと終了タグの間にあるものです。

これらすべてを削除しましょう。

そして、単純に children と書く必要があります。

```jsx
function Button({ textColor, bgColor, onClick, children }) {
  return (
    <button
      style={{ backgroundColor: bgColor, color: textColor }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

これは本当に React 内の事前定義されたキーワードです。

そして最後のステップとして、これらすべてを削除して、単純にここで children を使用できます。

保存してみましょう。

そして、そこに行きます。

美しいです。

まさに構築しようとしたものがあります。

左側に絵文字があり、右側にあります。

そして、もちろん、ここで何でもできます。

さらに多くの絵文字、さらに多くの要素を持つことができます。

そして、はい、本当に欲しいものは何でもできます。

この要素のこのコンテンツは、単純に children プロパティとしてボタンに渡されるからです。

そして、ここでその children プロパティを使用して、この HTML ボタンの内部でそのすべてのコンテンツを表示します。

### children プロパティの重要性と利点

そして、これで、本当に、本当に重要な新しいツールを手に入れました。

React で常に使用されるツールです。

実際に、その最も有用な機能の一つだと言えるでしょう。

そして、その理由は、コンポーネントを真に再利用可能にすることを可能にするからです。

この children プロパティで、この button 要素に欲しいコンテンツを渡すことができるようになりました。

そして、button コンポーネントは、これがどのようなコンテンツになるかを知る必要さえありません。

行うことは、children を取ること、つまり、渡したすべてのコンテンツとすべての JSX を取って、この button コンポーネント内で単純にレンダリングすることです。

そして、そのため、children プロパティを、コンテンツをそのコンポーネントに渡すことで埋めることができる穴として考えることができます。

そして、何らかの理由でこれが奇妙に思えても、心配しないでください。

この children プロパティをコースの最後まで常に使用するため、習得する機会は豊富にあります。

### children プロパティの仕組みの復習

そして今、終了するために、ここで行ったことを素早く要約しましょう。

button コンポーネントで children プロパティを使用することで、基本的にコンポーネントに空の穴を残しました。

コンポーネントが children として受け取る JSX マークアップで埋めることができる穴です。

しかし、質問は、これらの children をどのように渡すかです。

JSX で button コンポーネントを含めるとき、要素をすぐに閉じる代わりに、その要素にさらに JSX を書くことができます。

HTML と同じように、他の HTML 要素内に任意の HTML マークアップを書くことができますよね？

HTML と同じように、使用しているコンポーネントの開始タグと終了タグの間に欲しいものを書くことができます。

この例では、この JSX の部分が button コンポーネントの children である要素を作成し、その button の内部で props.children としてアクセス可能になります。

そのため、children プロパティと言います。

基本的に、このような子要素を定義することで、他のプロパティを渡すのと同じように、button に渡しています。

違いは、より通常のプロパティとこれを指定する方法の違いです。

要素の開始タグと終了タグの間にコンテンツを渡すことで、基本的にその button コンポーネントの JSX で props.children を使用することで残した穴を埋めます。

これについて考えると、children プロパティは、再利用可能で設定可能なコンポーネントを作成する理想的な方法です。

特に、コンポーネントのコンテンツに関しては。

例えば、2 番目の類似したボタンを作成したいが、他の絵文字とテキストを使用したいとしましょう。

children プロパティについて知った今、それは本当に簡単です。

異なる JSX を渡すだけで、ボタンは完全に異なるコンテンツを取得します。

そして、この技術は、コンテンツについて実際に使用される前に事前に知らない汎用コンポーネントを構築するのに非常に有用です。

例えば、モーダルウィンドウ、汎用スライダー、または構築したような汎用ボタンです。

再び、この button コンポーネントは、受け取っていたコンテンツについて、したがって表示していたコンテンツについて絶対に何も知りませんでした。

そして、これは汎用で再利用可能なコンポーネントを作成するのに本当に素晴らしい機能です。

このように children プロパティを使用することは、React を学ぶ際にマスターする必要がある非常に強力な技術です。

しかし、これから何度も何度も使用していきます。

そして、練習する機会がたくさんあります。

実際に、次のビデオから始まります。

## まとめ

このセッションでは、React の重要な概念を 2 つ学習しました。

### アコーディオンコンポーネントの実装

まず、アコーディオンコンポーネントの実装を通じて、以下の重要な概念を実践しました：

1. **状態管理の実践**: 各アコーディオンアイテムが独立した状態を持つ設計
2. **条件付きレンダリング**: `isOpen`状態に基づくコンテンツの表示/非表示
3. **イベントハンドリング**: クリックイベントによる状態の切り替え
4. **動的スタイリング**: 状態に応じた CSS クラスの適用
5. **コンポーネント合成**: Accordion と AccordionItem の関係性

### children プロパティの習得

次に、children プロパティの概念と実装を学習しました：

1. **children プロパティの基本概念**: React コンポーネントが自動的に受け取る特別なプロパティ
2. **再利用可能なコンポーネント設計**: props の数を減らし、柔軟性を高める方法
3. **コンポーネント合成パターン**: 開始タグと終了タグの間に JSX を記述する技術
4. **汎用コンポーネントの作成**: コンテンツを事前に知らないコンポーネントの設計

### 学習の成果

これらの概念をマスターすることで、以下のスキルを身につけました：

- より柔軟で再利用可能なコンポーネントの設計能力
- 状態管理とイベント処理の実践的な理解
- React の思考法に基づいたコンポーネント設計
- children プロパティを活用した高度なコンポーネント合成技術

これらのスキルは、実際の React 開発において非常に重要であり、より複雑なアプリケーションを構築する際の基盤となります。次のセッションでは、これらの概念をさらに発展させ、より高度な React パターンを学習していきます。
