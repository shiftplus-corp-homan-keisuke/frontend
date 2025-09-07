# Session8: 再利用可能コンポーネントとchildrenプロパティ

## セクション概要

このセッションでは、Reactの最も重要で実用的な概念の一つである「childrenプロパティ」について学習します。また、実践的な演習として、アコーディオンコンポーネントの構築を通じて、状態管理とReactの思考法をさらに深めていきます。

これまでに学んだ状態管理の知識を活用して、より複雑なインタラクティブコンポーネントを作成し、その後、コンポーネントの再利用性を高めるためのchildrenプロパティの使い方を習得します。

childrenプロパティは、Reactの最も強力で便利な機能の一つです。これを理解することで、真に再利用可能で柔軟なコンポーネントを作成できるようになり、実際の開発現場で非常に重要なスキルを身につけることができます。

## 演習1: アコーディオンコンポーネント（v1）の実装

それでは、もう一つの演習に取り組んでいきましょう。

一緒に状態管理とReactの思考法全般をもう少し練習するためです。

一緒に、このとてもシンプルなアコーディオンコンポーネントを構築していきます。ここで、これらのアコーディオンの各アイテムを開いたり閉じたりできるようになります。

閉じているときにクリックすると、開きます。

そして開いているときにクリックすると、基本的に再び閉じます。

そして、これらの各アイテムには、タイトル、実際にはここの番号、タイトル、そしてテキスト自体があります。

つまり、これは質問で、これは基本的に答えです。

再びスターターファイルがあります。この講義にリンクしています。

スターターファイルは、この頻繁に聞かれる質問の配列と、このCSSスタイルです。

いつものように、2つの選択肢があります。

自分のVS Codeで行うことができます。

その場合は、ここに行って、関連するすべてのスターターデータをコピーしてください。

もちろん、このコードサンドボックスをフォークすることもできます。

基本的に自分のものを作成するためです。

そして今、他のものから新しいものを作成したので、これを安全に変更できます。

### アコーディオンの構造を理解する

ここに戻って、何を構築する必要があるかを見てみましょう。

基本的に、ここの全体がアコーディオンコンポーネントです。

そして、それぞれがアコーディオンアイテムの一つです。

それでは、実際にこれらのアイテム自体を構築することから始めましょう。

そして、それぞれが番号、タイトル、そしていくつかのテキストを取得することを覚えておいてください。

アコーディオンコンポーネントは実際にすでに作成されています。

そして今度は、アコーディオンアイテムを作成しましょう。

### AccordionItemコンポーネントの作成

それぞれのアイテムが番号を取得することを覚えておいてください。

タイトルとテキストを取得します。

そして、すぐにここに書きましょう。基本的に、受け取るpropsとして。

そうすれば、すぐにこれらで構築できます。

以前と同じように、まずアプリの静的バージョンを構築することから始めます。

この場合は、これら2つのコンポーネントの静的バージョンです。

そして後で、実際にコンポーネントを動的にするために状態を追加します。

ここでdiv要素を返します。

そして、このdivには、提供したCSSからのitemというクラス名があります。

それをすぐに閉じることができます。

そして、番号用の段落が1つあります。

クラス名はnumberです。

そして、ここで、すぐに実際にこのpropを使用しましょう。

このコンポーネントをどこかに含め始めるとすぐに受け取るpropですが、すでにそのpropが存在するかのように使用できます。

```javascript
function AccordionItem({ num, title, text }) {
  return (
    <div className="item">
      <p className="number">{num}</p>
    </div>
  );
}
```

クラス名、それからtextと言いましょう。

そして再び、ここで同じことです。

すぐにpropを使用します。

```javascript
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

どのようにプラスとマイナスの間で切り替わるかを見てください。

今のところ、そこにマイナスから始めましょう。

しかし、後でそれを変更します。

```javascript
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

そして最後に、コンテンツ自体を含むdivがあります。

基本的にテキストです。

ここでクラス名はcontent-boxです。

そして、これは再び実際のテキストが入る場所です。

```javascript
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

これは実際にはタイトル用なので、なぜtextと呼んだのかわかりません。

クラスです。

でも、まあ、気にしないでください。

### Accordionコンポーネントの実装

そして今、このアコーディオンで必要なのは、いつものようにこのオブジェクトの配列をループすることだけです。

そして、オブジェクトのそれぞれに対して、これらのアイテムの1つをレンダリングしたいと思います。

そして実際に、これをもう少し再利用可能にするために、ここで何らかの汎用データを受け入れましょう。基本的に。

そして、ここでそのデータを渡します。

データとしてfaqsを使用します。

そうすれば、同じアコーディオンを異なる配列で再利用できます。

```javascript
function Accordion({ data }) {
  return (
    <div className="accordion">
      
    </div>
  );
}
```

このクラス名はaccordionであるべきです。

そして、ここでマッピングが発生します。

data.mapです。

そして、これらの要素のそれぞれに対して、

頻繁に聞かれる質問と呼ぶこともできますが、汎用的な要素にしましょう。

そして前に言ったように、それぞれに対してアコーディオンアイテムを1つレンダリングしたいと思います。

そして、そこに何を渡したいでしょうか？

タイトルはelement.titleになります。

これがここのものです。

そして、同じオブジェクトからのテキストも、element.textです。

そして今、番号も欲しいです。

これは自動的に1、2、3になるはずです。

mapで渡される現在のインデックスも使用することで、それを非常に簡単に行うことができます。

mapのコールバックは、実際に現在の要素に加えて、現在のインデックスも取得するからです。

現在の要素に加えて、現在のインデックスも取得します。

2番目の引数として、iと呼びましょう。

そして、numとして単純にiを渡すことができます。

それで終わりです。

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

### 初期表示の調整

何かがここにあります。

これを少し小さくしましょう。

すべてではありません。

サイドバーを閉じましょう。

はい、それははるかに良いです。

さらに少し小さくすることもできます。

そして比較してみましょう。

ここでは実際に01のようなものがあります。

そして、テキスタイルも少し違って見えます。

見てみましょう。

しかし、はい、クラス名はすべて正しく見えます。

しかし今、ここの番号を素早く処理しましょう。

ここで01、02、03を持ちたいです。

ここで少し魔法をかけましょう。

番号が9未満の場合、ここに0を置いてください。

そして番号プラス1です。

しかし、そうでなければ、ここで、それは単に番号プラス1です。

```javascript
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

そして、ここで、これをtitleに変更しましょう。

それで動作するはずです。

```javascript
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

ここをクリックすると、UIが変更されることがわかります。

UIに何らかの更新が発生するたびに考える必要がある最も基本的なことです。

ここでUIに何らかの更新が発生するということは、状態の一部が必要であることを意味します。

今、これらのアイテムのそれぞれは、他のものとは完全に独立して動作します。

ここでこれを開いても、他の2つには何も起こりません。

すべてを同時に開くことができます。

または、すべてを閉じることができます。つまり、

再び、それぞれが本当に独立した方法で動作します。

つまり、それぞれが独自の状態を保持する必要があります。

再び、これは開くことができるからです。

しかし、これも同様です。

そして、それが意味することは、これらのアイテムのそれぞれに状態変数を定義する必要があるということです。

それがここです。

そして、友達のuseStateを使用します。

状態変数をisOpenと呼び、setIsOpenとしましょう。

useStateが自動的にインポートされました。

これがここにあることを確認してください。

そして、デフォルトではfalseになります。

デフォルトでは、各ボックスを閉じたいからです。

```javascript
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

それはいつものように同じ3ステップのプロセスです。

定義し、使用し、そして更新します。

基本的に、isOpenがfalseのときに行いたいことです。

これが閉じているときは、下のこのcontent-boxを表示しないことです。

言い換えれば、この部分の条件付きレンダリングが必要です。

JavaScriptモードに入れましょう。

そして、isOpenと言いましょう。

そして、このような条件付きレンダリングです。

```javascript
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

isOpenと言いましょう。

そうすれば、マイナスを表示します。

そうでなければ、プラスを表示してください。

```javascript
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

JavaScriptモードを閉じます。

そして、これで、プラスが表示されています。

### イベントハンドラーの実装

今必要なのは、もちろん、ここをクリックしたときに、ボックスが実際に開くことです。

CSSスタイルで、この全体のdivにポインターカーソルを適用したことがわかります。

全体の要素にです。

そして、これがクリックイベントをリッスンしたい場所です。

このdivで。

onClickと言いましょう。

そして、ここでhandleToggleと呼ばれる関数を渡します。

そして、その関数を定義しましょう。

以前と同じように、外部関数を定義するだけです。

ここでhandleというキーワードを使用しますが、これは完全にオプションです。

しかし、これがイベントハンドラーとして使用される関数であることを理解しやすくします。

そして今、ここでsetIsOpenを使用しましょう。

そして、現在のものを取得します。

currentと呼ぶことができます。

もちろん、isOpenと呼ぶこともできます。

何でも動作します。

そして、反対のことをしたいだけです。

```javascript
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

### keyプロパティの追加

今、ここでいくつかのエラーがあります。

それはkeyプロパティのためです。

ここで一意のkeyプロパティを渡す必要があります。

実際に一意であるiを使用することもできます。

配列の反復から来る01と2です。

しかし、それに依存しない方が良いです。

代わりに、本当に一意なものを使用します。

例えば、各要素のタイトルです。

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

これを閉じて、実際にすべてで動作します。

### スタイリングの最終調整

1つの小さな詳細が欠けています。

これが開いているとき、ここに緑の境界線があります。

そして、すべてのテキストが緑になります。

これが開いているときにアイテムに追加される特別なクラスです。

アイテムで、ここです。

再び、開いている場合に2番目のクラスを追加したいと思います。

そのために、基本的にクラスの条件付きレンダリングが必要です。

ここで、テンプレート文字列またはテンプレートリテラルを構築する必要があります。

これはすでにitemの文字列を持っています。

そして、ここで条件に基づいて、

isOpenに基づいて、

openまたは何も追加したいと思います。

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

それで終わりです。

そして、それは動作します。

何らかの理由でこれが緑にならなかったようです。

ここでCSSを確認してみましょう。

何か正しくしなかったことがあるかもしれません。

はい、ここではtitleであるべきです。

はい、美しいです。

そして、これで、実際にこのアコーディオンを完成させました。

少なくとも今のところは。

後でこのセクションで、この演習の第2部があります。

そこで、これをもう少し現実的にします。

これら3つのうち1つだけが同時に開くことができるようにします。

### 完成したコード

以下が完成したアコーディオンコンポーネントのコードです：

**app.js**

```javascript
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

```javascript
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

## childrenプロパティ：再利用可能なボタンの作成

さて、次に進みましょう。今度は、React開発で常に使用する、さらに別の基本的な概念を学ぶ時です。

それは、「childrenプロパティ」です。

このプロジェクトを完成させました。

そして、基本的にControl Cでこれを終了できます。

そして今リロードすると、接続が失われたことがすぐにわかります。

または、このVS Codeウィンドウを単純に閉じることもできました。

さて、この講義と次の講義でchildrenプロパティを紹介する際に行いたいことは、以前に構築したstepsコンポーネントを使用することです。

stepsフォルダに戻って、VS Codeで開きましょう。

そして再び、お好みの方法で行うことができます。

今、実際にこのファイルを複製します。

作業しているこのApp.jsを、コピーしてから貼り付けて、書いたコードの最初のバージョンを保持できるようにします。

これをapp version oneと呼びます。

そして今、このファイルで作業を続けることができます。

### 開発サーバーの起動

それでは、ここでターミナルに来て、NPM startと書きましょう。

プロジェクトがブラウザで再び開くようにです。

はい、実際にstepsコンポーネントをここに2回含めていたことを覚えています。

そのうちの1つを削除またはコメントアウトしましょう。

そして、はい、なくなりました。

そして、いつものように、コンソールを開いておくことが重要です。

そして、コンポーネントツリーも開いておきましょう。

しかし今のところ、コンソールにとどまりましょう。
### 再利用可能なボタンコンポーネントの必要性

この講義のアイデアは、これら2つの代わりに使用できる再利用可能なボタンを作成することです。

そして、これらのボタンに絵文字も追加したいと思います。

それらがどこにあるかを見てみましょう。

はい、これら2つのボタンです。

再び、今度はこれら2つの代わりに使用する再利用可能なボタンを作成したいと思います。

それでは、それを行いましょう。

そして、すでに持っている知識を使用することから始めます。

function buttonと言いましょう。

そして、これが行うことは、button要素を返すことだけです。

ここにもこのスタイルがあります。

そしてonClickイベントハンドラーです。

これら2つをコピーしましょう。

そして、今のところここにテキストを置きましょう。

そして今、アイデアは、背景色、色、このonClickハンドラー、そしてテキストをpropsとして渡すことです。

基本的に、ここでいくつかのpropsを受け入れたいと思います。

テキストの色用です。

実際にそれをtextColorと呼びましょう。

textColor、backgroundColor、onClickハンドラー、そしてテキストです。

そして、実際にそのボタンを使用しましょう。

ボタンで作業を続ける前に、すぐにここに含めましょう。

すぐにこれを削除しましょう。

今構築しているコンポーネントを使用するまで。

```javascript
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

textColorを言いましょう。

これはここのものであるべきです。

または実際にそれは背景色です、もちろん。

bgColorです。

そして、テキストの色、

これはFFFで白であるべきです。

そして、onClickプロパティも。

そして、ここでhandlePrevious関数を指定したいと思います。

それを閉じます。

そして、テキストも。

ここで、これはpreviousと言いました。

そして今、下のボタンに来て、ハードコードされた値の代わりにこれらの値を使用しましょう。

ここで、backgroundColorは受け取ったbgプロパティであるべきです。

そして、これはtextColorであるべきです。

プロパティとして受け取ったものです。

そして、ここでonClickが欲しいです。

そして、ここでこの汎用テキストの代わりに、再びプロパティとして受け取ったテキストが欲しいです。

保存してみましょう。リロードもしてみましょう。

そして、このボタンを使用すると、以前とまったく同じように動作し、見た目も同じです。

それでは、これと同じことをこれでも行いましょう。

これをコピーして貼り付けて、onClickハンドラーをhandleNextに変更します。

そして、ここで、nextです。

このボタンを削除しましょう。

そして今、これで以前とまったく同じ機能を持っていますが、ここにあったボタンを再利用可能なボタンコンポーネントに抽出しました。

これは現在、textColor、background、onClickハンドラー、そしてテキストを受け入れます。

```javascript
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

すべてのこのデータをここでpropsとしてこのコンポーネントに渡すことは、この時点でかなり明確であるべきです。

うまくいけば、以前の講義でそれがどのように動作するかを正確に理解したでしょう。

### 絵文字の追加とchildrenプロパティの必要性

とにかく、今度は絵文字も追加したいと言いましょう。

それは簡単です。

ここでpropsとして受け入れるだけです。

emojiです。

そして、テキストの前にここに追加しましょう。

そして、実際にこの絵文字用のspan要素を作成しましょう。

spanを作成して、そこに絵文字を入れて、それからテキストです。

```javascript
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

そして、ここで、fingerを検索してみましょう。

previousにはこれが欲しいです。

そして、反対方向を指す指がnextに欲しいです。

これです。

```javascript
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

nextと言って、右側を指すようにです。

これで、ある種の問題があります。

すでに多くのpropsがあるからです。

そして、基本的にこの方向のためにさらに別のpropsを追加すべきだと思いますか？

まあ、多分そうではありません。

ここですべてのこれらのpropsで少しクレイジーになっているかもしれません。

そして、ボタンをさらにカスタマイズするために、さらに多くを追加し続けることができます。

しかし、この時点で、例えば、これをここに追加すべきではないと思います。

絵文字の方向や側面のために、

代わりに、ビデオの最初に言及したchildrenプロパティを使用すべきです。

### childrenプロパティの導入

この側面、この絵文字、そしてテキストを渡す代わりに、これらは基本的にこのbutton要素のコンテンツです。

単純にコンテンツをボタンに渡すことができたらどうでしょうか？

言い換えれば、単純にJSXをコンポーネントに渡して、コンポーネントがそのJSXを使用して単純に表示できたらどうでしょうか？

実際に、Reactでそれを行うことができます。

ここに来て、この時点まで、すべてのコンポーネントが常に自己終了していたことに注意してください。

このようなものは決してありませんでした。

そして、何らかのコンテンツ、そして要素を閉じる。

これまでこれを持ったことはありませんが、実際に、まさにこれを行うことができます。

HTML要素で行うのと同じように、開始タグ、いくつかのコンテンツ、そして終了タグがあります。

Reactコンポーネントでまったく同じことを行うことができます。

ここで、もちろん、そのでたらめは欲しくありません。

今のところそれを戻しましょう。

しかし、基本的に今ここで欲しいのは、絵文字でそのspanを書くことです。

これと、previousです。

これは、このボタンのコンテンツとして欲しいものです。

そして、単純なHTMLボタンとしてボタンを書いていたら、これはまさに書くものです。

実際に、これはここでこのボタンの内部で行ったことです。

そして再び、Reactコンポーネントでまったく同じことを行うことができます。

```javascript
<Button
  textColor="#fff"
  bgColor="#7950f2"
  onClick={handlePrevious}
>
  <span>👈</span>Previous
</Button>
```

そして、これらはもう必要ありません。

そして、同じことをここでも行いましょう。

そして今、絵文字の方向や側面を非常に簡単に変更できる部分が来ます。

単純にnextと書くことができるからです。

そして、JSXで絵文字を右側に置きます。

とても簡単ですよね？

```javascript
<Button
  textColor="#fff"
  bgColor="#7950f2"
  onClick={handleNext}
>
  Next<span>👉</span>
</Button>
```

ボタンを閉じるのを忘れました。

そして、もちろん、ここにはもうコンテンツが表示されません。

テキストと絵文字を渡していないからです。

そして今、これを修正する時です。

### childrenプロパティの実装

基本的に、今度はbutton要素に、開始タグと終了タグの間に書いたコンテンツへのアクセスを与える必要があります。

そして、それが最終的にchildrenプロパティの出番です。

childrenプロパティは、各Reactコンポーネントが自動的に受け取るプロパティです。

そして、childrenプロパティの値は、コンポーネントの開始タグと終了タグの間にあるものです。

これらすべてを削除しましょう。

そして、単純にchildrenと書く必要があります。

```javascript
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

これは本当にReact内の事前定義されたキーワードです。

そして最後のステップとして、これらすべてを削除して、単純にここでchildrenを使用できます。

保存してみましょう。

そして、そこに行きます。

美しいです。

まさに構築しようとしたものがあります。

左側に絵文字があり、右側にあります。

そして、もちろん、ここで何でもできます。

さらに多くの絵文字、さらに多くの要素を持つことができます。

そして、はい、本当に欲しいものは何でもできます。

この要素のこのコンテンツは、単純にchildrenプロパティとしてボタンに渡されるからです。

そして、ここでそのchildrenプロパティを使用して、このHTMLボタンの内部でそのすべてのコンテンツを表示します。

### childrenプロパティの重要性と利点

そして、これで、本当に、本当に重要な新しいツールを手に入れました。

Reactで常に使用されるツールです。

実際に、その最も有用な機能の一つだと言えるでしょう。

そして、その理由は、コンポーネントを真に再利用可能にすることを可能にするからです。

このchildrenプロパティで、このbutton要素に欲しいコンテンツを渡すことができるようになりました。

そして、buttonコンポーネントは、これがどのようなコンテンツになるかを知る必要さえありません。

行うことは、childrenを取ること、つまり、渡したすべてのコンテンツとすべてのJSXを取って、このbuttonコンポーネント内で単純にレンダリングすることです。

そして、そのため、childrenプロパティを、コンテンツをそのコンポーネントに渡すことで埋めることができる穴として考えることができます。

そして、何らかの理由でこれが奇妙に思えても、心配しないでください。

このchildrenプロパティをコースの最後まで常に使用します。

### childrenプロパティの仕組みの復習

そして今、終了するために、ここで行ったことを素早く要約しましょう。

buttonコンポーネントでchildrenプロパティを使用することで、基本的にコンポーネントに空の穴を残しました。

コンポーネントがchildrenとして受け取るJSXマークアップで埋めることができる穴です。

しかし、質問は、これらのchildrenをどのように渡すかです。

JSXでbuttonコンポーネントを含めるとき、要素をすぐに閉じる代わりに、その要素にさらにJSXを書くことができます。

HTMLと同じように、他のHTML要素内に任意のHTMLマークアップを書くことができますよね？

HTMLと同じように、使用しているコンポーネントの開始タグと終了タグの間に欲しいものを書くことができます。

この例では、このJSXの部分がbuttonコンポーネントのchildrenである要素を作成し、そのbuttonの内部でprops.childrenとしてアクセス可能になります。

そのため、childrenプロパティと言います。

基本的に、このような子要素を定義することで、他のプロパティを渡すのと同じように、buttonに渡しています。

違いは、より通常のプロパティとこれを指定する方法の違いです。

要素の開始タグと終了タグの間にコンテンツを渡すことで、基本的にそのbuttonコンポーネントのJSXでprops.childrenを使用することで残した穴を埋めます。

これについて考えると、childrenプロパティは、再利用可能で設定可能なコンポーネントを作成する理想的な方法です。

特に、コンポーネントのコンテンツに関しては。

例えば、2番目の類似したボタンを作成したいが、他の絵文字とテキストを使用したいとしましょう。

childrenプロパティについて知った今、それは本当に簡単です。

異なるJSXを渡すだけで、ボタンは完全に異なるコンテンツを取得します。

そして、この技術は、コンテンツについて実際に使用される前に知らない汎用コンポーネントを構築するのに本当に、本当に有用です。

例えば、モデルウィンドウ、汎用スライダー、または構築したような汎用ボタンです。

再び、このbuttonコンポーネントは、受け取っていたコンテンツについて、したがって表示していたコンテンツについて絶対に何も知りませんでした。

そして、これは汎用で再利用可能なコンポーネントを作成するのに本当に素晴らしいです。

このようにchildrenプロパティを使用することは、Reactを学ぶ際にマスターする必要がある本当に非常に強力な技術です。

しかし、これを何度も何度も使用します。

そして、練習する時間がたくさんあります。

実際に、次のビデオから始まります。

## まとめ

このセッションでは、Reactの重要な概念を2つ学習しました。

### アコーディオンコンポーネントの実装

まず、アコーディオンコンポーネントの実装を通じて、以下の重要な概念を実践しました：

1. **状態管理の実践**: 各アコーディオンアイテムが独立した状態を持つ設計
2. **条件付きレンダリング**: `isOpen`状態に基づくコンテンツの表示/非表示
3. **イベントハンドリング**: クリックイベントによる状態の切り替え
4. **動的スタイリング**: 状態に応じたCSSクラスの適用
5. **コンポーネント合成**: AccordionとAccordionItemの関係性

### childrenプロパティの習得

次に、childrenプロパティの概念と実装を学習しました：

1. **childrenプロパティの基本概念**: Reactコンポーネントが自動的に受け取る特別なプロパティ
2. **再利用可能なコンポーネント設計**: propsの数を減らし、柔軟性を高める方法
3. **コンポーネント合成パターン**: 開始タグと終了タグの間にJSXを記述する技術
4. **汎用コンポーネントの作成**: コンテンツを事前に知らないコンポーネントの設計

### 学習の成果

これらの概念をマスターすることで、以下のスキルを身につけました：

- より柔軟で再利用可能なコンポーネントの設計能力
- 状態管理とイベント処理の実践的な理解
- Reactの思考法に基づいたコンポーネント設計
- childrenプロパティを活用した高度なコンポーネント合成技術

これらのスキルは、実際のReact開発において非常に重要であり、より複雑なアプリケーションを構築する際の基盤となります。次のセッションでは、これらの概念をさらに発展させ、より高度なReactパターンを学習していきます。

### 再利用可能なボタンコンポーネントの必要性

この講義のアイデアは、これら2つの代わりに使用できる再利用可能なボタンを作成することです。

そして、これらのボタンに絵文字も追加したいと思います。

それらがどこにあるかを見てみましょう。

はい、これら2つのボタンです。

再び、今度はこれら2つの代わりに使用する再利用可能なボタンを作成したいと思います。

それでは、それを行いましょう。

そして、すでに持っている知識を使用することから始めます。

function buttonと言いましょう。

そして、これが行うことは、button要素を返すことだけです。

ここにもこのスタイルがあります。

そしてonClickイベントハンドラーです。

これら2つをコピーしましょう。

そして、今のところここにテキストを置きましょう。

そして今、アイデアは、背景色、色、このonClickハンドラー、そしてテキストをpropsとして渡すことです。

基本的に、ここでいくつかのpropsを受け入れたいと思います。

テキストの色用です。

実際にそれをtextColorと呼びましょう。

textColor、backgroundColor、onClickハンドラー、そしてテキストです。

そして、実際にそのボタンを使用しましょう。

ボタンで作業を続ける前に、すぐにここに含めましょう。

すぐにこれを削除しましょう。

今構築しているコンポーネントを使用するまで。

```javascript
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

textColorを言いましょう。

これはここのものであるべきです。

または実際にそれは背景色です、もちろん。

bgColorです。

そして、テキストの色、

これはFFFで白であるべきです。

そして、onClickプロパティも。