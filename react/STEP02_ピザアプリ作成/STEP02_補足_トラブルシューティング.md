# STEP02 補足資料：トラブルシューティング

このドキュメントでは、STEP02「コンポーネント型設計とプロップの受け渡し」の学習中に遭遇する可能性のある一般的な問題とその解決策を提供します。

## 📚 目次

- [1. TypeScript の型エラー](#1-typescript-の型エラー)
  - [エラー: Property 'xxx' does not exist on type 'yyy'](#エラー-property-xxx-does-not-exist-on-type-yyy)
  - [エラー: Type 'string | undefined' is not assignable to type 'string'](#エラー-type-string--undefined-is-not-assignable-to-type-string)
  - [エラー: Argument of type 'Event' is not assignable to parameter of type 'MouseEvent'](#エラー-argument-of-type-event-is-not-assignable-to-parameter-of-type-mouseevent)
- [2. React のレンダリングに関する問題](#2-react-のレンダリングに関する問題)
  - [問題: リスト要素に `key` プロップがないという警告](#問題-リスト要素に-key-プロップがないという警告)
  - [問題: コンポーネントが期待通りに更新されない](#問題-コンポーネントが期待通りに更新されない)
- [3. スタイリングに関する問題](#3-スタイリングに関する問題)
  - [問題: CSS スタイルが適用されない/意図しないスタイルが適用される](#問題-css-スタイルが適用されない意図しないスタイルが適用される)
- [4. 開発環境に関する問題](#4-開発環境に関する問題)
  - [問題: `npm run dev` が起動しない](#問題-npm-run-dev-が起動しない)

---

### 1. TypeScript の型エラー

#### エラー: Property 'xxx' does not exist on type 'yyy'

- **具体的なエラーメッセージ**: `Property 'title' does not exist on type '{}'.` または `Property 'pizzaObj' does not exist on type 'IntrinsicAttributes & { children?: ReactNode; }'.`
- **原因**: コンポーネントの `props` の型が正しく定義されていないか、`props` オブジェクトから存在しないプロパティにアクセスしようとしています。
- **解決策**:

  1. **`props` の型定義を確認**: コンポーネントが受け取る `props` の `interface` または `type` が正しく定義されているか確認してください。
  2. **`React.FC` に型を渡す**: 関数コンポーネントの定義で `React.FC<YourPropsType>` のように型を渡しているか確認してください。
  3. **プロパティ名のスペルミス**: `props.title` のようにアクセスしているプロパティ名が、型定義と一致しているか確認してください。

  **例**:

  ```typescript
  // 誤った例: propsの型定義がない、または間違っている
  // const Header: React.FC = ({ title }) => { ... };

  // 正しい例: HeaderPropsインターフェースを定義し、React.FCに渡す
  interface HeaderProps {
    title: string;
  }
  const Header: React.FC<HeaderProps> = ({ title }) => {
    return <h1>{title}</h1>;
  };
  ```

#### エラー: Type 'string | undefined' is not assignable to type 'string'

- **具体的なエラーメッセージ**: `Type 'string | undefined' is not assignable to type 'string'.`
- **原因**: オプショナルなプロパティ（`?` が付いているプロパティ）や、`null` または `undefined` の可能性がある値が、必須の文字列型として扱われる場所で使用されています。
- **解決策**:

  1. **Nullish Coalescing (`??`)**: デフォルト値を設定して `undefined` の可能性を排除します。
  2. **オプショナルチェイニング (`?.`)**: プロパティが存在しない場合にエラーにならないようにします。
  3. **条件付きレンダリング**: 値が存在する場合のみレンダリングします。
  4. **型ガード**: `if (value)` や `typeof` などで型を絞り込みます。

  **例**:

  ```typescript
  interface User {
    name: string;
    email?: string; // emailはオプショナル
  }

  const user: User = { name: "Alice" };

  // 誤った例: user.emailがundefinedの可能性がある
  // const userEmail: string = user.email; // エラー

  // 正しい例 1: Nullish Coalescingでデフォルト値を設定
  const userEmail1: string = user.email ?? "N/A";

  // 正しい例 2: 条件付きレンダリング
  {
    user.email && <p>Email: {user.email}</p>;
  }

  // 正しい例 3: 型ガード
  if (user.email) {
    console.log(user.email.toUpperCase()); // このブロック内ではstring型として扱われる
  }
  ```

#### エラー: Argument of type 'Event' is not assignable to parameter of type 'MouseEvent'

- **具体的なエラーメッセージ**: `Argument of type 'Event' is not assignable to parameter of type 'MouseEvent<HTMLButtonElement, MouseEvent>'.`
- **原因**: イベントハンドラーの引数に、期待されるイベント型（例: `React.MouseEvent`）とは異なる型が渡されています。これは通常、イベントハンドラーの型注釈が不足しているか、間違っている場合に発生します。
- **解決策**:

  - イベントハンドラーの引数に適切な React イベント型を明示的に指定します。

  **例**:

  ```typescript
  // 誤った例: イベント引数の型がanyまたはEventになっている
  // const handleClick = (event: any) => { ... };

  // 正しい例: ボタンのクリックイベントにはReact.MouseEvent<HTMLButtonElement>を指定
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget.tagName); // 'BUTTON'
  };

  // JSX
  <button onClick={handleClick}>クリック</button>;
  ```

### 2. React のレンダリングに関する問題

#### 問題: リスト要素に `key` プロップがないという警告

- **具体的な警告メッセージ**: `Warning: Each child in a list should have a unique "key" prop.`
- **原因**: `Array.prototype.map()` などを使って要素のリストをレンダリングする際に、各リストアイテムに一意の `key` プロップが指定されていません。
- **解決策**:

  - リスト内の各要素に、その要素を一意に識別できる安定した `key` プロップを割り当ててください。通常はデータの ID を使用します。ID がない場合は、一時的に配列のインデックスを使用することもできますが、リストの順序が変更される可能性がある場合は避けるべきです。

  **例**:

  ```typescript
  // 誤った例: keyプロップがない
  // {items.map(item => <li>{item.name}</li>)}

  // 正しい例: item.idをkeyとして使用
  {
    items.map((item) => <li key={item.id}>{item.name}</li>);
  }
  ```

#### 問題: コンポーネントが期待通りに更新されない

- **原因**: `props` が変更されたにもかかわらず、コンポーネントが再レンダリングされない、または古いデータが表示される。これは通常、`props` が正しく渡されていないか、コンポーネントが `props` の変更を検知できていない場合に発生します。
- **解決策**:

  1. **親コンポーネントからの `props` の確認**: 親コンポーネントが実際に新しい `props` の値を渡しているか確認してください。
  2. **子コンポーネントでの `props` の使用**: 子コンポーネント内で `props` の値が正しく参照されているか確認してください。
  3. **イミュータブルな更新**: オブジェクトや配列を `props` として渡す場合、それらを直接変更するのではなく、新しいオブジェクト/配列を作成して渡すようにしてください。React は参照の変更を検知して再レンダリングします。

  **例**:

  ```typescript
  // 誤った例: 配列を直接変更
  // const newItems = items;
  // newItems.push(newItem); // これではReactは変更を検知しにくい

  // 正しい例: 新しい配列を作成
  const newItems = [...items, newItem]; // スプレッド構文で新しい配列を作成
  setItems(newItems); // stateを更新
  ```

### 3. スタイリングに関する問題

#### 問題: CSS スタイルが適用されない/意図しないスタイルが適用される

- **原因**: CSS ファイルのパスが間違っている、セレクタが正しくない、スタイルの優先順位の問題、または CSS Modules の使用方法が間違っている。
- **解決策**:

  1. **CSS ファイルのインポートパス**: コンポーネントファイルで CSS ファイルが正しくインポートされているか確認してください（例: `import './MyComponent.css';`）。
  2. **セレクタの確認**: HTML 要素のクラス名やタグ名が CSS セレクタと一致しているか確認してください。
  3. **スタイルの優先順位**: より具体的なセレクタや `!important` を使用しているスタイルがないか確認してください。
  4. **CSS Modules**: CSS Modules を使用している場合、クラス名が `styles.myClass` のようにアクセスされているか確認してください。通常の CSS と混同しないように注意してください。

  **例 (CSS Modules)**:

  ```typescript
  // src/components/Button.tsx
  import React from 'react';
  import styles from './Button.module.css'; // .module.css をインポート

  const Button: React.FC = () => {
    return <button className={styles.myButton}>クリック</button>;
  };
  export default Button;

  // src/components/Button.module.css
  .myButton {
    background-color: blue;
    color: white;
  }
  ```

### 4. 開発環境に関する問題

#### 問題: `npm run dev` が起動しない

- **原因**: 依存関係の不足、ポートの競合、Node.js/npm のバージョン問題、またはプロジェクトの破損。
- **解決策**:
  1. **依存関係の再インストール**: `node_modules` フォルダと `package-lock.json` (または `yarn.lock`) を削除し、`npm install` を再度実行します。
  2. **ポートの競合**: 別のアプリケーションが同じポートを使用している可能性があります。Vite は通常、自動的に別のポートを探しますが、手動でポートを指定することもできます (`vite.config.ts` で `server.port` を設定)。
  3. **Node.js/npm のバージョン**: プロジェクトの `package.json` に記載されている Node.js のバージョン要件を確認し、現在の環境がそれを満たしているか確認してください。
  4. **エラーメッセージの確認**: ターミナルに表示されるエラーメッセージを注意深く読み、指示に従ってください。
