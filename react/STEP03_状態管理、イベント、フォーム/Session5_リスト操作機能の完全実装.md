# Session5: リスト操作機能の完全実装

## 学習目標

このセッションでは、Far Away アプリケーションを完成させるために、残りの重要な機能を実装します。アイテムの削除、チェック機能、派生状態による統計計算、ソート機能、そしてリストのクリア機能を学習します。

### このセッションで学ぶこと

- 子から親への通信パターンの応用
- 配列の不変性を保った削除・更新操作
- 派生状態（Derived State）の概念と実装
- 複雑な配列操作（filter、map、sort）
- 条件付きレンダリングの高度な使用法
- ユーザビリティを考慮した機能実装

## アイテム削除機能：さらなる子から親への通信

### 削除機能の概要

子から親への通信について学習したので、今度はそれをさらに活用して、リストからアイテムを削除する機能を実装しましょう。

アイテムの横にある「×」ボタンをクリックすると、そのアイテムが状態から削除され、ユーザーインターフェースからも削除されるようにします。

### 削除機能の設計思想

このクリックは Item コンポーネント内で発生します。各アイテムは実際には Item コンポーネントなので、これらの「×」ボタンのクリックは Item 内で発生します。

しかし、状態は App コンポーネント、つまり親コンポーネントに存在します。そのため、これは子から親への通信のもう一つの例となります。

### handleDeleteItem 関数の実装

まず、状態が存在する App コンポーネントに戻って、新しい関数`handleDeleteItem`を作成します。

```jsx
function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItem(id) {
    // アイテムを削除するために、どのアイテムを削除するかを知る必要がある
    // そのため、この関数を呼び出すときにIDを渡す
    setItems((items) => items.filter((item) => item.id !== id));
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList items={items} onDeleteItem={handleDeleteItem} />
      <Stats items={items} />
    </div>
  );
}
```

### 削除操作の詳細解説

アイテムを削除するには、削除すべきアイテムがどれかを知る必要があります。そのため、後でこの関数を呼び出すときに ID を渡します。

各アイテムには ID があるので、その ID を使用して対応するオブジェクトを items 配列から削除できます。

削除操作自体については、状態を更新することでユーザーインターフェースからアイテムを削除します。`setItems`を呼び出し、アイテムが削除された後の新しい配列を渡します。

この新しい items 配列は現在の配列に基づいているので、現在のアイテムを入力として受け取るコールバック関数が必要です。

```jsx
function handleDeleteItem(id) {
  setItems((items) => items.filter((item) => item.id !== id));
}
```

`items.filter`を使用して配列をループし、各反復で items オブジェクトにアクセスします。基本的に、ここで渡された ID を持つアイテムを除外したいのです。

`item.id !== id`という条件が真の場合、そのアイテムは新しい配列に含まれます（残すアイテムの配列になります）。しかし、この条件が偽の場合、つまり`item.id`が ID と等しい場合、その要素は新しい配列から除外されます。

これが配列から要素を削除する方法です。この仕組みが理解できない場合は、JavaScript の基本概念を復習するセクションに戻ってください。そこで詳しく説明しています。

### props の受け渡し

次に、クリックが発生したときにこの関数を呼び出す必要があります。どうやってそこに到達するのでしょうか？

この関数を props として PackingList にも渡す必要があります。アイテムは PackingList 内で呼び出されるからです。

```jsx
<PackingList items={items} onDeleteItem={handleDeleteItem} />
```

同じ命名規則を使用して、prop を`onDeleteItem`と呼び、関数`handleDeleteItem`を渡します。

PackingList でこの prop を受け取りましょう：

```jsx
function PackingList({ items, onDeleteItem }) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => (
          <Item item={item} key={item.id} onDeleteItem={onDeleteItem} />
        ))}
      </ul>
    </div>
  );
}
```

これは非常に便利です。なぜなら、PackingList が受け取る props が一目でわかるからです。

クリックは実際にはこのボタンで発生することを覚えておいてください。つまり、Item コンポーネント内で発生します。そのため、ここでもこの prop にアクセスする必要があります。

したがって、item と一緒にここでも渡す必要があります：

```jsx
<Item item={item} key={item.id} onDeleteItem={onDeleteItem} />
```

基本的に、この prop を PackingList を通して Item に渡しています。App から PackingList に移動し、次に各 Item に移動します。

PackingList 自体は実際にはそれを必要としませんが、これが受け取ることができる唯一の場所です。App から Item に直接渡すことはできないからです。

### Item コンポーネントでの実装

```jsx
function Item({ item, onDeleteItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => {}} // 後で実装
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}
```

ここで`onClick`prop を使用し、ハンドラー関数を指定します。

単に`onDeleteItem`とだけ書くと、これは機能しません。なぜでしょうか？

単に関数をこのように指定すると、React はイベントが発生したときに関数を呼び出し、イベントオブジェクトを渡します。

Form で実際にこれを活用しました。そこではイベントオブジェクトを受け取りました。しかし、今回はイベントオブジェクトを受け取りたいのではなく、現在のアイテムの ID を渡したいのです。

そのため、ここで新しい関数を作成し、現在の ID を渡す必要があります：

```jsx
<button onClick={() => onDeleteItem(item.id)}>❌</button>
```

これを忘れないことが非常に重要です。そうしないと、React が関数をすぐに呼び出してしまい、それは望ましくありません。ここには関数への参照が必要で、React がイベントが発生したときにのみこの関数を呼び出せるようにします。

### 動作確認

これで完成です。テストしてみましょう。

アイテムを追加して削除ボタンをクリックすると、アイテムが削除されます。コンソールに ID もログ出力され、その ID に基づいて新しい items 配列が設定されます。

状態が更新され、React がコンポーネントを再レンダリングします。より正確には、コンポーネントツリーを再レンダリングします。

### 初期アイテムの削除

ここで、ESLint から初期アイテムが使用されていないという警告が出ているので、それらを削除しましょう。ESLint からの有用な指摘です。

もちろん、これらの初期アイテムを初期状態として使用することもできました：

```jsx
const [items, setItems] = useState(initialItems);
```

そうすると、リロードするたびにデフォルトで 3 つのアイテムが表示されます。それらを状態に追加し、すべて同じように動作します。削除してもリロードすれば戻ってきます。

しかし、それは望ましくないので、すべて削除しましょう。

これで最後の操作を実装するだけです。チェックボックスをクリックしてアイテムをパック済みとしてマークする機能です。これが次の講義のトピックです。

## アイテム更新機能：複雑な不変データ操作

### 更新機能の概要

次に、パック状態を切り替えることでアイテムを更新する機能を実装しましょう。これは前の講義の最後に示した機能です。

### チェックボックスの作成

まず、チェックボックスを作成する必要があります。現在はチェックボックスがありません。

Item コンポーネントに移動し、span の前に input を追加しましょう：

```jsx
function Item({ item, onDeleteItem }) {
  return (
    <li>
      <input type="checkbox" />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}
```

これで実際にチェックボックスをオン・オフできますが、もちろん何も起こりません。

### 制御された要素への変換

この要素を制御された要素に変換したいと思います。制御された要素とは、要素の値が何らかの状態によって定義され、変更をリッスンして状態を適切に更新するイベントハンドラーも持つ要素のことです。

この 2 つのことを行いましょう。

まず、値は`item.packed`状態によって与えられます：

```jsx
<input type="checkbox" value={item.packed} />
```

この`packed`は常に true または false の値で、これはチェックボックスの値に渡す必要がある値の型です。

実際には、ここは`checked`であるべきです。`value`ではありません。チェックボックスの場合は`checked`プロパティを使用します。

```jsx
<input type="checkbox" checked={item.packed} onChange={() => {}} />
```

次に、`onChange`ハンドラーを追加する必要があります。変更イベントをリッスンする必要があります。これは基本的にチェックボックスをクリックするたびに発生します。

今のところ、空の関数を指定しましょう。何もしない関数です。

### handleToggleItem 関数の実装

もちろん、ここで最終的に指定する関数は、アイテム状態の packed 値を変更します。そして、その関数は状態が実際に存在する場所、つまり App 内に配置されます。

そして、`onDeleteItem`と同じように、props を使用してそれを渡します。これは同じような仕組みです。アイテムを削除する代わりに、単にアイテムのプロパティを 1 つ更新します。

その更新は、チェックボックスをクリックするたびに発生します。

この関数を書きましょう：

```jsx
function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
      />
      <Stats items={items} />
    </div>
  );
}
```

`handle`キーワードで始まり、次に`toggleItem`とします。ここでは packed プロパティのみを切り替えるからです。オブジェクト全体の更新を許可するのではなく、その packed プロパティの値を変更するだけです。

変更するオブジェクトを特定するために、再び ID を渡す必要があります。

そして、`setItems`を呼び出します。以前と同様に、現在の配列に基づいて新しい配列を作成する必要があります。

配列内のオブジェクトの 1 つを更新するために、`map`メソッドを使用して配列全体をループします。これにより、最終的に元の items 配列と同じ長さの新しい配列が返されます。

しかし、オブジェクトの 1 つが更新されます。

各要素の処理では、各要素を item と呼びます。そして、ここで行うことは次のとおりです：

現在のアイテムの ID が渡された ID と一致する場合、つまり、これが実際に更新したいオブジェクトである場合、現在の item に基づいて新しいオブジェクトを作成し、packed プロパティを`!item.packed`（現在の値の反対）に設定します。

それ以外の場合、他のすべてのオブジェクトについては、変更せずに現在の item をそのまま返します。

もう一度強調したいのは、これが配列内のオブジェクトを更新する方法であることを、JavaScript の基本概念を復習するセクションで詳しく説明したということです。これが奇妙に見える場合は、そちらを参照してください。

### props の受け渡し

この関数を PackingList に追加して、PackingList がそれを Item に追加できるようにしましょう。

再び、props を通信チャネルとして使用します：

```jsx
<PackingList
  items={items}
  onDeleteItem={handleDeleteItem}
  onToggleItem={handleToggleItem}
/>
```

これをコピーして、props のリストに追加しましょう：

```jsx
function PackingList({ items, onDeleteItem, onToggleItem }) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>
    </div>
  );
}
```

そして、それを Item 自体に渡します。

最後に、ここで受け取ります：

```jsx
function Item({ item, onDeleteItem, onToggleItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onToggleItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}
```

再び、PackingList を Item 自体に到達するための中間ステップとして使用する必要があります。

そして、ここでこの空の関数を`onToggleItem`の呼び出しに置き換えることができます。以前と同様に、現在の ID を渡して、変更する必要があるオブジェクトを実際に知ることができるようにします。

### 動作確認

これで完成です。少なくともそうであるはずです。

動作するかどうか見てみましょう。靴下、シャツ、充電器を追加します。

クリックすると、美しく動作します。チェックボックスが更新され、取り消し線も更新されることがわかります。これは、アイテムがパックされているときに正確にここから来ています。

もちろん、他のすべてでも同じように動作します。このボタンをクリックすると、`item.id`は別のものになり、この関数は別の値を受け取り、別のオブジェクトを更新します。

削除もまだ動作します。

これで、アイテムに対して実行できる 2 つの操作の構築が完了しました。パック状態の切り替えと削除です。

次に進む前に、ここで書いたコードを確認してください。基本的に、ここで起こっていることすべて、なぜこの方法で行っているのか、そしてこれらの関数を props として必要なコンポーネントまで渡す方法を理解していることを確認してください。

これは、再び子から親への通信であり、常に使用するものです。

状態のリフトアップと同様に、次の講義に進む前に、この概念を本当に理解していることを確認してください。次の講義は派生状態についてです。

## 派生状態（Derived State）

### 派生状態の概念

状態管理の講義で言及したもう一つの側面は派生状態でした。複雑に聞こえますが、実際にはかなり簡単です。

基本的に、派生状態は既存の状態や props から計算される状態のことです。

実際のコードを見てみましょう。

### 問題のある実装例

ここに 3 つの状態があります。3 つの`useState`関数呼び出しで確認できます：

```jsx
// ❌ 問題のある実装
function SomeComponent() {
  const [cart, setCart] = useState([]);
  const [numItems, setNumItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // カートが更新されるたびに、これらの状態も手動で更新する必要がある
  // これは同期の問題を引き起こし、複数の再レンダリングを発生させる
}
```

しかし、これらの状態を分析すると、実際にはすべてが存在する意味がありません。`numItems`と`totalPrice`は完全にカートに依存しているからです。

`numItems`は単にカート内のアイテム数で、`totalPrice`はカート内のすべての価格の合計です。

そのため、これら 2 つの状態のすべてのデータは実際にはすでにカートにあるので、これらの追加の状態変数を作成する必要はありません。そうすることは実際にかなり問題があります。

### 問題点の詳細

まず、これらすべての状態を同期させる必要があります。常に一緒に更新するよう注意する必要があります。

この状況では、カートを更新するたびに、アイテム数と総価格も手動で更新する必要があります。そうしないと、状態が同期しなくなります。

しかし、これら 3 つの状態を別々に更新することで 2 番目の問題が生じます。コンポーネントが 3 回再レンダリングされることになり、この例では完全に不要です。

### 正しい実装：派生状態の使用

代わりに、カートから`numItems`と`totalPrice`状態を単純に派生させることができ、これによりすべての問題が解決されます。カートにはすでに必要なすべてのデータが含まれているからです。

```jsx
// ✅ 正しい実装：派生状態を使用
function SomeComponent() {
  const [cart, setCart] = useState([]);

  // 派生状態：既存の状態から計算
  const numItems = cart.length;
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  // useStateは不要、通常の変数に格納
}
```

ここでは、`numItems`をカートの長さとして計算し、`totalPrice`をすべての価格の合計として計算し、それらを通常の変数に格納します。

ここでは`useState`は必要ありません。これにより、不要な再レンダリングが発生しません。

カート状態は、これらの関連する状態の単一の情報源として機能し、すべてが常に同期していることを確認します。

### 派生状態が機能する理由

これが機能するのは、カートを更新するとコンポーネントが再レンダリングされ、関数が再び呼び出されるからです。そして、すべてのコードが再び実行されると、`numItems`と`totalPrice`も自動的に再計算されます。

もちろん、ほとんどの場合、状態を派生させることはできませんが、このような状況がある場合、つまり一つの状態が別の状態から簡単に計算できる場合は、常に派生状態を選択してください。

実際に必要なのが 1 つだけなのに、2 つの状態変数を作成しないでください。これは非常に一般的な初心者の間違いですが、今ではそれを避けることができるでしょう。

## 統計情報の計算：派生状態の実践

### 統計機能の実装

派生状態のアイデアを実際に使用してみましょう。特に、統計を計算したいと思います。

リスト上のアイテム数、すでにパックしたアイテム数、そしてそのパーセンテージを計算します。

これらの数値について考えてみると、例えば、リスト内のアイテム数は、items 配列自体から直接計算できますよね？そのため、派生状態はこれに最適です。

### 間違った方法の例

派生状態を使用する前に、やってはいけない方法を示します。

```jsx
// ❌ やってはいけない方法
function Stats({ items }) {
  const [numItems, setNumItems] = useState(0);
  // このコードは書かないでください

  // アイテムが追加されるたびに、この状態も更新する必要がある
  // setNumItems(num => num + 1);
}
```

状態を作成し、初期値を 0 アイテムとします。

この問題は、前述したように、この状態も更新する必要があることです。例えば、新しいアイテムが 1 つ追加されるたびに、アイテムの追加に加えて、この数値も増加させる必要があります。

これにより、これら 2 つの状態が同期していることを確認できますが、忘れる可能性のある多くの追加作業があり、少なくとも 1 つが不要な複数の再レンダリングを引き起こす可能性があります。

React 18 では、これらはバッチ処理されるはずです。つまり、これら 2 つは同時に発生するはずですが、それについては後で詳しく説明します。

いずれにせよ、これはひどいアイデアです。

### 正しい方法：派生状態の使用

代わりに、`numItems`という新しい変数を定義できますが、items 配列に基づいて計算することができます：

```jsx
// ✅ 正しい方法
function Stats({ items }) {
  const numItems = items.length;

  // アイテムが更新されるとコンポーネントが再レンダリングされ、
  // この値も自動的に再計算される
}
```

これは、アイテムが更新されるとすぐに、この状態が更新され、コンポーネントが再レンダリングされるため機能します。

コンポーネントが再レンダリングされると、ここの関数が再び呼び出されます。したがって、このコードが再び実行されます。新しいアイテムが追加された場合、items 状態（この配列）は異なり、したがって長さも異なります。

### Stats コンポーネントでの実装

この`numItems`変数は、実際には App コンポーネントではなく、Stats コンポーネントで必要です。

2 つのオプションがあります。1 つ目は`numItems`をここに保持し、prop として Stats に渡すことです。しかし、より理にかなっているのは、実際に Stats 自体でこの状態を計算することです。

また、実際には 3 つの値を計算するので、ここで計算すると 3 つの props を渡す必要があり、あまり意味がありません。

```jsx
function Stats({ items }) {
  // 早期リターン：アイテムがない場合
  if (!items.length) {
    return (
      <p className="stats">
        <em>Start adding some items to your packing list 🚀</em>
      </p>
    );
  }

  // 派生状態の計算
  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "You got everything! Ready to go ✈️"
          : `💼 You have ${numItems} items on your list, and you already packed ${numPacked} (${percentage}%)`}
      </em>
    </footer>
  );
}
```

しかし、保存するとすぐにエラーが発生します。Stats コンポーネントがこの items が何であるかを知らないからです。

Stats コンポーネントも Items 状態を必要とする別のコンポーネントなので、PackingList に渡したのと同じように、prop として渡します：

```jsx
<Stats items={items} />
```

もちろん、ここでその prop を受け取る必要があります。これで問題が解決されます。

ここでその値を使用できます。リストに`numItems`個のアイテムがあります。

実際、今は 0 ですが、ここに靴下とシャツを追加すると、新しいアイテムを追加するとすぐに配列が成長し、この数値も更新されることがわかります。

Enter を押すと何が起こるか見てください。すぐに 2 から 3 に変わりました。

### 他の派生状態の計算

他の派生状態も導出しましょう。パック済みのアイテム数とパーセンテージの両方がアイテム自体に依存しています。

```jsx
const numPacked = items.filter((item) => item.packed).length;
```

パック済みの数は、すでにパックされているアイテムでフィルタリングされた items 配列です。これは新しい配列なので、その長さを取ることができます。

すでにパック済みの数が表示され、すぐに 0 になりますが、それらの 1 つをパック済みとしてマークすると、美しく動作します。2 つ、そしてすべて。素晴らしい。

最後にパーセンテージです。これは非常に簡単です：

```jsx
const percentage = Math.round((numPacked / numItems) * 100);
```

パック済みの数をアイテム数で割り、100 を掛けて、すべてを`Math.round`で囲みます。

これも動作し、100%に達します。

この場合、100%の場合、ここで完全に異なるメッセージを表示したいと思います。基本的に、完了したことを伝えるメッセージです。

デモアプリで何が起こるか見てください。そうです、それです。

ここでそれを書きましょう。そのために、さらに条件付きレンダリングが必要です。

実際には、この em 要素内の内容を条件付きで定義します。

JavaScript モードに入り、percentage が 100 に等しい場合、内容はこの文字列になるようにします：

```jsx
{
  percentage === 100
    ? "You got everything! Ready to go ✈️"
    : `💼 You have ${numItems} items on your list, and you already packed ${numPacked} (${percentage}%)`;
}
```

ここに飛行機の絵文字も追加しましょう。

テンプレートリテラルを作成したくない場合は、もちろん、これらの各ケースに対して単純に 1 つの em をレンダリングすることもできました。

これは正しく見えませんが、おそらくここのせいです。しかし、間違ったアプリにいるにもかかわらず、動作しているように見えます。

ああ、でもここにはすでに正しいメッセージがあります。

これらの 1 つのチェックを外してみましょう。リストに 3 つのアイテムがあります。素晴らしい。

これとこれも削除しましょう。

### 早期リターンパターンの実装

すでに 0 個パックしており、この場合も別のメッセージを表示したいと思います。

配列にアイテムがない場合、これらすべての計算を実行する必要さえありません。とにかく 0 になるだけだからです。

ここで、条件付きレンダリングとしての早期リターンの良い使用例を示したいと思います。

アイテムの長さがない場合、単純にリターンします：

```jsx
if (!items.length) {
  return (
    <p className="stats">
      <em>Start adding some items to your packing list 🚀</em>
    </p>
  );
}
```

ここでリロードして、アイテムがないようにしましょう。

そうです、ここにあります。ここで定義したテキスト、この段落です。

ここでクラス名は footer ではなく、stats です。基本的にここと同じです。

そして、このテキストを取得しました。これは、この場合、配列に要素がないのであれば、これらすべての計算を行う必要さえないからです。

この場合、もちろん、これらの計算を行うことは問題ありませんでした。多くの作業ではなく、ここで条件付きレンダリングを行うこともできました。

しかし、これは早期リターンのオプションも時々良いことを示すためでした。私に言わせれば、ここでもかなり読みやすいです。

このコンポーネントに到着したとき、おそらく以前に見たことがないかもしれません。同僚の 1 人が書いたものだからです。そうすると、アイテムがない場合はこれを返すだけで、他のすべての場合はコンポーネントの残りのロジックを実行することがすぐにわかります。

素晴らしい。うまくいったと思うので、次に、派生状態のもう一つの使用例を見てみましょう。このソート機能を実装することです。

これにより、このアプリケーションがさらに実際のライフライクに見えるようになり、これは本当に楽しいと思います。

## アイテムのソート機能

### ソート機能の概要

アプリケーションに新しい機能を追加しましょう。ユーザーが 3 つの異なる基準でアイテムをソートできるようにします。

基本的に、このセレクトボックスを構築し、そこからユーザーがリストをソートする基準を選択できるようにします。これはほとんどの Web アプリケーションで非常に一般的なものです。

その非常にシンプルなバージョンを構築しましょう。

### PackingList コンポーネントでの実装

これを PackingList コンポーネントで直接行います。これだけのために新しいコンポーネントを作成すると、状態をさらにリフトアップする追加の作業が少し発生するからです。

ここではシンプルに保ち、さらに混乱させたくありません。PackingList で直接行うことは問題ありません。

この div の後、実際にはこの順序なしリストの後に行いましょう。

```jsx
function PackingList({ items, onDeleteItem, onToggleItem }) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>

      <div className="actions">
        <select>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
      </div>
    </div>
  );
}
```

すでに作成した actions というクラス名で div を作成します。ここにはその select 要素があり、後でリスト全体をクリアするボタンもあります。

select 要素内では、いつものように、異なる値を持つ option 要素が必要です。

後でこれらの値に基づいて、順序付けられたリストを計算します。

最初のものは入力に基づいています。これらは、ここで作成している文字列です。

入力は基本的に入力順です。入力順でソートします。これらのアイテムが実際にリストに配置された順序です。

次に、説明でソートしたいと思います。基本的にアルファベット順です。

最後に、パック状態でもソートしましょう。パック状態でソートします。

素晴らしい。そこにあります。見た目も良いです。

### 制御された要素としての select

実際にこれを実装する方法を見てみましょう。

まず、コンポーネント内で、つまり React アプリケーション内で、現在選択されている要素が何かを知る必要があります。

そのために、これを再び制御された要素に変換します。

そのために、3 つのステップが必要です。

まず、新しい状態を作成します：

```jsx
function PackingList({ items, onDeleteItem, onToggleItem }) {
  const [sortBy, setSortBy] = useState("input");

  return (
    // ...
  );
}
```

これを`sortBy`と`setSortBy`と呼び、`useState`を使用します。

デフォルトは最初のものになります。デフォルトで入力でソートされるようにしたいと思います。

この入力は、ここで定義したこの文字列と正確に同じですが、description や packed でもかまいません。

その状態をここで値として使用しましょう：

```jsx
<select value={sortBy}>
```

上で packed を使用した場合、UI にすでに反映されているはずです。

デフォルトでパック状態でソートが表示されているのがわかります。この文字列を使用したからです。

React が警告を出しているのは、3 番目のステップが欠けているからです。onChange イベントハンドラーをアタッチして、ユーザーがそこで選択したものに基づいて状態を更新できるようにする必要があります。

```jsx
<select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
>
```

この関数は自動的にイベントオブジェクトを受け取るので、`setSortBy`を使用して`e.target.value`を設定できます。

ある時点で、この種のことを書くことに本当に慣れ、それが第二の天性になるでしょう。これは常に従う必要があるレシピのようなもので、常に正確に同じ方法で動作します。

見てみましょう。うまく動作します。

コンポーネントの状態を確認すると、まず画面に少しスペースが必要ですが、ここに状態内に sortBy の値があることがわかります。

素晴らしい。これで作業できます。

### 派生状態を使ったソート実装

アプリケーションが選択した基準でここにアイテムを表示するようにするにはどうすればよいでしょうか？

その基準でソートされた新しい items 配列を作成します。

元の items 配列を操作するつもりはありません。その状態は変更されないままにしておく必要があります。

代わりに、再び派生状態を使用します。1 つの配列のソートは、その初期配列に基づいて計算できるからです。それは完全に理にかなっていますよね？

再び、ここで新しい状態変数を作成しません。それは完全に不要だからです。

単純に新しい変数を作成し、実際には let 変数を作成します：

```jsx
function PackingList({ items, onDeleteItem, onToggleItem }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy === "input") {
    sortedItems = items;
  }

  if (sortBy === "description") {
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  }

  if (sortBy === "packed") {
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  }

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
      </div>
    </div>
  );
}
```

`sortedItems`と呼び、let を使用しているので、いくつかの簡単な if 文を実行できます。

`sortBy`が"input"と等しい場合、これがデフォルトですよね？この場合、`sortedItems`は元の items と等しくなるだけです。

もちろん、最終的には、元の items 配列をレンダリングする代わりに、これらのソートされたアイテムを使用する必要があります。

ここでいくつかのアイテムを入れてみましょう。靴下、充電器。これらは書きやすいです。

今のところ、これだけが動作します。これを行うと、`sortedItems`はこの空の変数になり、React はそれをレンダリングする方法がわからないため、エラーが発生します。

ここですべてを再び書く必要があります。靴下、シャツ、充電器。

他の 2 つのケースの if を書きましょう。

`sortBy`が"description"と等しい場合、実際にアイテムをソートしたいと思います：

```jsx
if (sortBy === "description") {
  sortedItems = items
    .slice()
    .sort((a, b) => a.description.localeCompare(b.description));
}
```

`sortedItems`は`items`になります。まず`slice`を使用します。これにより、基本的に配列のコピーを取得します。これは非常に重要です。`sort`メソッドは変更メソッドだからです。

これを行わないと、元の items も実際にソートされてしまいます。それは望ましくありません。アプリケーションの元の状態を変更してはいけないからです。

`slice().sort`を使用します。ここでは、JavaScript セクションの復習ですでにこのメソッドの動作を説明したので、コードを書くだけです。

この場合、アルファベット順にソートしたいので、`localeCompare`メソッドを使用できます。

配列の 1 つのオブジェクトである a を取り、その description を取ります。これは各オブジェクトのプロパティの 1 つです。

これは文字列なので、`localeCompare`を呼び出すことができます。ここで別の文字列を渡します。これは`b.description`です。

これで動作するはずです。

最後に、最後のケースのコードも追加しましょう。packed によるものです：

```jsx
if (sortBy === "packed") {
  sortedItems = items
    .slice()
    .sort((a, b) => Number(a.packed) - Number(b.packed));
}
```

非常に似ています。`sortedItems`は`items`のコピーを取り、`.sort`します。

そして、基本的に比較されている配列の 2 つのオブジェクトである a と b です。

パック状態でソートしたいので、これはブール値なので、まず数値に変換する必要があります。

`Number(a.packed) - Number(b.packed)`です。

これを試してみましょう。

説明によると、アルファベット順になっているのがわかります。C、S、S。

最後に、パック状態によると。今のところ、すべてがアンパックされています。

クリックすると、最後に移動することがわかります。

ここでも同じことです。

削除すると、ここに戻ります。

素晴らしい。

もちろん、デフォルトもあります。これは入力順で、パック状態にあり、どれもパックされていない場合に起こることと同じです。

素晴らしい。

この簡単な機能を実装しましたが、派生状態の力を使用して非常に一般的な機能でもあります。

再び、ソートされたアイテムの新しい状態を作成しませんでした。必要な状態は`sortBy`状態だけです。

React が常にこの入力フィールドの値を持つようにするためです。

そして、それに基づいて、この派生状態のソートされたアイテムを作成し、最終的にユーザーインターフェースにレンダリングします。

これで、残っているのは、リストをクリアするこのボタンを追加することだけです。

それが次のビデオのタスクです。

## リストのクリア機能

### クリア機能の概要

アプリケーションを機能完全にするために、リスト全体を一度にクリアするボタンを追加しましょう。

select の後に、シンプルなボタンを追加します：

```jsx
<div className="actions">
  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
    <option value="input">Sort by input order</option>
    <option value="description">Sort by description</option>
    <option value="packed">Sort by packed status</option>
  </select>

  <button onClick={onClearList}>Clear list</button>
</div>
```

そこにあります。

いつものように、`onClick`イベントハンドラーを追加する必要があり、基本的にこれらすべての要素を一度に削除する関数が必要です。

これは、すべてを削除する関数を作成し、その関数をこのコンポーネントに渡し、ボタンに追加するという、あなたにとって良いチャレンジかもしれません。

それほど難しくないはずです。

今すぐビデオを一時停止してください。

本当に自分でこれを試してください。これは本当に良い学習体験だからです。

そして、そのタスクを終えたら、1 分後、または 5 分後にここに戻ってきてください。

### handleClearList 関数の実装

他のすべての関数の近くに関数を作成します。

`handleAddItems`、`Delete`、`Toggle`があります。

単純にもう 1 つ追加しましょう：

```jsx
function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleClearList() {
    setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}
```

`handleClearList`は、実際には何も必要ありません。

ここで行う必要があるのは、単純に「アイテムを元の値に戻す」ことです。これはもちろん、この空の配列でした。

それだけです。

ほとんど簡単すぎます。

しかし、今度はこの関数をボタンに接続する必要があります。

そのボタンは PackingList にあります。

そこでこれを prop に渡します：

```jsx
<PackingList
  items={items}
  onDeleteItem={handleDeleteItem}
  onToggleItem={handleToggleItem}
  onClearList={handleClearList}
/>
```

`onClearList`は`handleClearList`になります。

それを取得しましょう。

この PackingList は本当に多くの props を受け取ります：

```jsx
function PackingList({ items, onDeleteItem, onToggleItem, onClearList }) {
  // ...
}
```

そして、ここで`onClick`prop です。

新しい関数を作成する必要さえありません。

これを渡すだけです：

```jsx
<button onClick={onClearList}>Clear list</button>
```

保存すると、それで完了です。

リストをクリアすると、はい、すべてがなくなりました。

素晴らしい。

これもやってくれたことを願っています。

### 確認ダイアログの追加

ここでもう 1 つ、このデモアプリでは、ユーザーが誤ってすべてを削除することを防いでいます。

リストをクリアをクリックすると、まずすべてのアイテムを削除するかどうかを尋ねられ、OK をクリックした場合にのみ、すべてが削除されます。

見てください、今は空です。

ここでも同じことを素早く行いましょう。

これは標準的な DOM 関数なので、非常に簡単です：

```jsx
function handleClearList() {
  const confirmed = window.confirm(
    "Are you sure you want to delete all items?"
  );

  if (confirmed) setItems([]);
}
```

これは実際には JavaScript の一部ではありませんが、Web API の一部です。

いずれにせよ、ここで変数を作成できます。

`confirmed`と言いましょう。

そして、その確認は`window.confirm`によって定義されます。

ここで任意の文字列を渡すことができます。

これがユーザーに表示されるメッセージになります。

「すべてのアイテムを削除してもよろしいですか？」

ユーザーが「OK」をクリックすると、confirmed は true になり、「キャンセル」をクリックした場合は false になります。

これで条件付きで実行できます。

confirmed の場合、アイテムを空の配列に設定します。

確認のために、リロードしましょう。

靴下と充電器、

リストをクリアすると、はい、確認が表示され、美しく動作します。

最近、すべてのスクロールに少しイライラしたかもしれません。コンポーネントがどんどん大きくなっているからです。

例えば、ここで何かを渡したい場合、ここまでスクロールして、例えばこれらの props を受け入れる必要がありました。

そのため、最初に言ったように、実際のアプリケーションでは通常、ファイルごとに 1 つのコンポーネントがあります。

次の講義では、基本的にこの 1 つのファイルを複数のファイルに分割する方法のトリックを示します。

コンポーネントごとに 1 つのファイルです。

## コンポーネントを別々のファイルに移動

### ファイル分割の必要性

最近、コンポーネントがどんどん大きくなり、多くのスクロールが必要になっていることにお気づきかもしれません。

例えば、ここで何かを渡したい場合、ここまでスクロールして、これらの props を受け入れる必要がありました。

そのため、最初に言ったように、実際のアプリケーションでは通常、ファイルごとに 1 つのコンポーネントがあります。

### ファイル分割の実装

次の講義では、基本的にこの 1 つのファイルを複数のファイルに分割する方法のトリックを示します。コンポーネントごとに 1 つのファイルです。

これにより、コードの管理がはるかに簡単になり、各コンポーネントの責任が明確になります。

## まとめ

### 学習した重要な概念

このセッションでは、以下の重要な概念を学習しました：

#### 1. 子から親への通信パターン

- アイテム削除機能の実装を通じて学習
- props を使った関数の受け渡し
- イベントハンドラーの正しい書き方

#### 2. 配列の不変性を保った操作

- `filter`メソッドによる削除操作
- `map`メソッドによる更新操作
- スプレッド演算子を使ったオブジェクトの更新

#### 3. 派生状態（Derived State）

- 既存の状態から計算される値
- 不要な状態の作成を避ける
- パフォーマンスの向上と同期問題の回避

#### 4. 条件付きレンダリングの高度な使用

- 早期リターンパターン
- 三項演算子による条件分岐
- 状態に応じた動的なメッセージ表示

#### 5. 配列操作メソッドの実践的使用

- `filter`：要素の削除
- `map`：要素の更新
- `sort`：要素の並び替え
- `slice`：配列のコピー作成

### 実装した機能

1. **アイテム削除機能**

   - 各アイテムの × ボタンによる削除
   - ID ベースの要素特定
   - 状態の適切な更新

2. **アイテム更新機能（チェック機能）**

   - チェックボックスによるパック状態の切り替え
   - 制御された要素としての実装
   - 視覚的フィードバック（取り消し線）

3. **統計情報の表示**

   - 総アイテム数の計算
   - パック済みアイテム数の計算
   - 完了パーセンテージの計算
   - 状況に応じたメッセージ表示

4. **ソート機能**

   - 入力順、アルファベット順、パック状態順でのソート
   - セレクトボックスによる制御
   - 派生状態を使った効率的な実装

5. **リストクリア機能**
   - 全アイテムの一括削除
   - 確認ダイアログによる誤操作防止
   - ユーザビリティの向上

### 次のステップ

次のセッションでは、以下のトピックを学習します：

1. **コンポーネントの分割**

   - ファイルごとに 1 つのコンポーネント
   - import/export の使用
   - プロジェクト構造の最適化

2. **より高度な状態管理**

   - 複雑な状態の管理方法
   - 状態の正規化
   - パフォーマンスの最適化

3. **React の思考法**
   - コンポーネント設計の原則
   - 再利用可能なコンポーネントの作成
   - 保守性の高いコードの書き方

### 練習課題

学習を深めるために、以下の課題に取り組んでみてください：

1. **機能拡張**

   - アイテムの編集機能を追加
   - カテゴリ別のフィルタリング機能
   - 重要度による優先順位付け

2. **ユーザビリティ向上**

   - キーボードショートカットの追加
   - ドラッグ&ドロップによる並び替え
   - アニメーション効果の追加

3. **データ永続化**
   - ローカルストレージへの保存
   - データのインポート/エクスポート
   - 複数のリストの管理

これらの課題を通じて、React の理解をさらに深め、実践的なスキルを身につけることができます。
