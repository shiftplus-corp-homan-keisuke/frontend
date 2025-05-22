## Typescript(javascript)の this について

TypeScript (および JavaScript) における `this` キーワードは、実行コンテキスト（関数がどこで、どのように呼び出されたか）に依存して参照先が変わる、やや複雑な概念です。

### 1. `this` とは何か？

`this` は、関数が実行される際のコンテキストオブジェクトを指します。言い換えると、関数内で `this` を使用すると、その関数を呼び出したオブジェクトや、関数が属しているオブジェクトにアクセスできます。しかし、`this` の値は関数の定義時ではなく、**呼び出し時に決定される**という点が重要です。

### 2. `this` がどのように決定されるか

`this` の値は、関数の呼び出し方によって主に以下のパターンで決まります。

#### a. グローバルコンテキスト

関数の外側、つまりトップレベルスコープで `this` を使用すると、ブラウザ環境では `window` オブジェクト（Strict モードでない場合）、Node.js 環境では `global` オブジェクトを指します。Strict モード (`'use strict'`) の場合は `undefined` になります。

```typescript
// ブラウザ環境 (Strict モードでない場合)
console.log(this === window); // true

function greet() {
  console.log(this);
}
greet(); // window (Strict モードでない場合)、undefined (Strict モードの場合)
```

#### b. 関数呼び出し (通常の関数)

通常の関数として呼び出された場合、`this` の値はグローバルコンテキストと同様のルールに従います。つまり、Strict モードでなければグローバルオブジェクト（ブラウザでは `window`）、Strict モードでは `undefined` になります。

```typescript
function showThis() {
  console.log(this);
}

showThis(); // window (非Strictモード時) または undefined (Strictモード時)

const myObj = {
  name: "My Object",
  getValue: function () {
    function innerFunction() {
      console.log(this); // ここでの this も呼び出し方に依存する
    }
    innerFunction(); // 通常の関数呼び出しなので、window または undefined
    return this.name;
  },
};

console.log(myObj.getValue()); // "My Object"
// innerFunction 内の this は window または undefined (Strict モード時)
```

#### c. メソッド呼び出し

オブジェクトのプロパティとして関数が呼び出される場合（メソッド呼び出し）、`this` はそのオブジェクトを指します。

```typescript
const person = {
  name: "Alice",
  greet: function () {
    console.log(`Hello, I am ${this.name}`);
  },
};

person.greet(); // "Hello, I am Alice" (this は person オブジェクトを指す)

const greetFunction = person.greet;
greetFunction(); // undefined (Strict モードの場合) またはグローバルオブジェクトの name プロパティを参照しようとする
// (呼び出し元がオブジェクトではないため)
```

#### d. コンストラクタ呼び出し

`new` キーワードを使って関数（コンストラクタ関数）を呼び出すと、新しいオブジェクトが作成され、その関数内の `this` は新しく作成されたオブジェクトを指します。

```typescript
function Person(name: string) {
  // this は新しく作成されるインスタンスを指す
  // @ts-ignore (TypeScriptでは暗黙のanyを避けるため、thisの型を明示することが推奨される)
  this.name = name;
  // @ts-ignore
  this.sayHello = function () {
    // @ts-ignore
    console.log(`Hello from ${this.name}`);
  };
}

const alice = new (Person as any)("Alice"); // TypeScriptでは型安全のため、このようなキャストは推奨されない
alice.sayHello(); // "Hello from Alice"

const bob = new (Person as any)("Bob");
bob.sayHello(); // "Hello from Bob"
```

TypeScript では、クラス構文を使用することが一般的です。クラスのコンストラクタやメソッド内では、`this` はそのクラスのインスタンスを指します。

```typescript
class PersonClass {
  name: string;
  constructor(name: string) {
    this.name = name; // this は PersonClass のインスタンスを指す
  }

  greet() {
    console.log(`Hello, my name is ${this.name}`); // this は PersonClass のインスタンスを指す
  }
}

const charlie = new PersonClass("Charlie");
charlie.greet(); // "Hello, my name is Charlie"
```

#### e. `apply()`, `call()`, `bind()` による明示的な指定

これらのメソッドを使用すると、関数の `this` の値を明示的に設定できます。

- `call(thisArg, arg1, arg2, ...)`: 関数を呼び出し、`this` の値を `thisArg` に設定します。引数は個別に渡します。
- `apply(thisArg, [argsArray])`: 関数を呼び出し、`this` の値を `thisArg` に設定します。引数は配列として渡します。
- `bind(thisArg)`: 新しい関数を作成し、その関数の `this` の値を `thisArg` に恒久的に束縛（バインド）します。元の関数は呼び出されません。

```typescript
function introduce(city: string, country: string) {
  console.log(`I am ${this.name} from ${city}, ${country}.`);
}

const person1 = { name: "David" };
const person2 = { name: "Eve" };

introduce.call(person1, "London", "UK"); // "I am David from London, UK."
introduce.apply(person2, ["Paris", "France"]); // "I am Eve from Paris, France."

const introduceDavid = introduce.bind(person1);
introduceDavid("Berlin", "Germany"); // "I am David from Berlin, Germany."
// (cityとcountryはbindではなく呼び出し時に渡される)

const introduceDavidFromTokyo = introduce.bind(person1, "Tokyo", "Japan");
introduceDavidFromTokyo(); // "I am David from Tokyo, Japan."
```

#### f. アロー関数 (`=>`)

アロー関数は、`this` の扱いが通常の関数と大きく異なります。アロー関数は自身の `this` を持ちません。アロー関数内の `this` は、それが定義された時点で周囲のスコープ（レキシカルスコープ）の `this` の値を継承します。これにより、コールバック関数などで `this` が期待通りに動作しない問題を解決しやすくなります。

```typescript
const myObject = {
  value: 42,
  getValueRegular: function () {
    console.log("Regular function this:", this.value); // 42 (myObjectを指す)
    setTimeout(function () {
      // console.log("setTimeout regular this:", this.value); // undefined (Strictモード) or window.value
      // (thisはwindowまたはundefinedを指すため)
    }, 100);
  },
  getValueArrow: function () {
    console.log("Arrow function outer this:", this.value); // 42 (myObjectを指す)
    setTimeout(() => {
      console.log("setTimeout arrow this:", this.value); // 42 (外側のスコープのthisを継承)
    }, 100);
  },
};

myObject.getValueRegular();
myObject.getValueArrow();
```

### 3. TypeScript における `this` の扱い

TypeScript は JavaScript のスーパーセットであり、`this` の基本的な挙動は JavaScript と同じです。しかし、TypeScript は型システムを通じて `this` の安全な利用を支援します。

#### a. `this` の型推論と明示的な型指定

TypeScript は、多くの場合 `this` の型を文脈から推論しようとします。例えば、クラスのメソッド内では `this` はそのクラスのインスタンス型として扱われます。

しかし、場合によっては `this` の型が `any` になってしまうことがあります。これを避けるために、TypeScript では関数の最初の引数として `this` の型を明示的に指定できます（`this` パラメータ）。これは実際の引数ではなく、コンパイラに対して `this` がどのような型であることを期待するかを伝えるためのものです。

```typescript
interface Card {
  suit: string;
  card: number;
}

interface Deck {
  suits: string[];
  cards: number[];
  createCardPicker(this: Deck): () => Card; // thisパラメータでDeck型であることを指定
}

let deck: Deck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  createCardPicker: function (this: Deck) {
    // ここでのthisはDeck型
    return () => {
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);
      return { suit: this.suits[pickedSuit], card: pickedCard % 13 }; // アロー関数なのでthisはDeckを指す
    };
  },
};

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

console.log("card: " + pickedCard.card + " of " + pickedCard.suit);
```

この例では、`createCardPicker` メソッドの `this` パラメータに `Deck` 型を指定することで、`this.suits` へのアクセスが型安全に行われます。

#### b. `--noImplicitThis` オプション

TypeScript のコンパイラオプション `noImplicitThis` を有効にすると、`this` の型が明示的に指定されていないか、文脈から推論できない場合にエラーを報告します。これにより、`this` に関連する潜在的なバグを防ぐのに役立ちます。

#### c. アロー関数とレキシカル `this`

前述の通り、アロー関数は `this` をレキシカルに束縛するため、コールバック関数内での `this` の問題を回避するのに非常に有効です。TypeScript でもこの挙動は同じであり、積極的に活用されます。

### 4. よくある間違いや注意点

- **コールバック関数内での `this`**: 通常の関数をコールバックとして渡すと、その関数内の `this` は期待したオブジェクトを指さないことが多いです（`window` や `undefined` になる）。これを避けるには、アロー関数を使うか、`bind` メソッド、または一時変数（例: `const self = this;`）を使うなどの対策が必要です。
- **イベントハンドラでの `this`**: DOM のイベントハンドラでは、`this` はイベントが発生した DOM 要素を指すことが一般的です。ただし、アロー関数をイベントハンドラとして使用すると、`this` は周囲のスコープの値を保持します。
- **Strict モードの影響**: Strict モード (`'use strict'`) では、特定の状況下での `this` の値が `undefined` になるため、非 Strict モードとの挙動の違いに注意が必要です。TypeScript はデフォルトで Strict モードに近い振る舞いをすることが多いです（例: モジュールは自動的に Strict モード）。
