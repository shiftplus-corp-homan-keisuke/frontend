import { useState } from "react";

const messages = ["Reactを学ぶ ⚛️", "仕事に応募する 💼", "新しい収入を得る 🤑"];

function App() {
  const state = useState(0);
  console.log(state);

  return (
    <div className="steps">
      <div className="numbers">
        <div className="active">1</div>
        <div>2</div>
        <div>3</div>
      </div>

      <p className="message">Step 1: Reactを学ぶ ⚛️</p>

      <div className="buttons">
        <button
          style={{ backgroundColor: "#7950f2", color: "#fff" }}
          onClick={() => alert("Previous")}
        >
          Previous
        </button>
        <button
          style={{ backgroundColor: "#7950f2", color: "#fff" }}
          onClick={() => alert("Next")}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/*
 演習1: 基本的なイベントハンドリング
 要件：
- ボタンをクリックするとアラートが表示される
- 適切な命名規則を使用する
- 関数呼び出しではなく関数を渡す
 */
function ClickCounter() {
  // ここにイベントハンドラーを実装してください

  return (
    <div>
      <button>クリックしてください</button>
    </div>
  );
}

/*
演習2: 複数のイベントハンドラー
要件：
- クリック時：「ボタンがクリックされました」をコンソールに出力
- マウスエンター時：「マウスが入りました」をコンソールに出力
- マウスリーブ時：「マウスが出ました」をコンソールに出力
*/
function InteractiveButton() {
  return <button>インタラクティブボタン</button>;
}

/*
演習3: 基本的なカウンター
以下のカウンターコンポーネントを完成させてください：

*/
function Counter() {
  // ここにuseStateを実装してください
  
  // return (
  //   <div>
  //     <h2>カウンター</h2>
  //     <p>現在の値: {/* ここに状態値を表示 */}</p>
  //     <button onClick={/* 増加ハンドラー */}>+1</button>
  //     <button onClick={/* 減少ハンドラー */}>-1</button>
  //     <button onClick={/* リセットハンドラー */}>リセット</button>
  //   </div>
  // );
}

/*
演習4: 表示/非表示の切り替え
*/
function ToggleComponent() {
  // ここにuseStateを実装してください
  
  // return (
  //   <div>
  //     <button onClick={/* 切り替えハンドラー */}>
  //       {/* 状態に応じてボタンテキストを変更 */}
  //     </button>
      
  //     {/* 条件付きレンダリングでメッセージを表示/非表示 */}
  //     <p>この文章は表示/非表示が切り替わります</p>
  //   </div>
  // );
}

/*
演習5: 
以下のコードの問題点を見つけて修正してください：
*/
function BuggyCounter() {
  // let [count, setCount] = useState(0);
  // const [user, setUser] = useState({ name: "Alice", age: 25 });

  // function incrementCount() {
  //   count = count + 1; // 問題1
  // }

  // function updateAge() {
  //   user.age = user.age + 1; // 問題2
  // }

  // return (
  //   <div>
  //     <p>Count: {count}</p>
  //     <p>
  //       User: {user.name}, Age: {user.age}
  //     </p>
  //     <button onClick={incrementCount}>Increment</button>
  //     <button onClick={updateAge}>Age Up</button>
  //   </div>
  // );
}

/*
演習6: 
以下の要件を満たすコンポーネントを作成してください：
*/
function UserProfile() {
  // const [user, setUser] = useState({
  //   name: "John",
  //   age: 30,
  //   address: {
  //     city: "Tokyo",
  //     country: "Japan",
  //   },
  //   hobbies: ["reading", "coding"],
  // });

  // 以下の関数を実装してください：
  // 1. 名前を更新する関数
  // 2. 年齢を1つ増やす関数
  // 3. 都市を更新する関数
  // 4. 新しい趣味を追加する関数
  // 5. 趣味を削除する関数
}

/*
演習7: 
以下の要件を満たすタイマーコンポーネントを作成してください：
*/
function Timer() {
  // 必要な状態を定義してください
  // - seconds: 現在の秒数
  // - isRunning: タイマーが動作中かどうか
  // - isVisible: タイマーが表示されているかどうか

  // 以下の関数を実装してください：
  // 1. startTimer: タイマーを開始
  // 2. stopTimer: タイマーを停止
  // 3. resetTimer: タイマーをリセット
  // 4. toggleVisibility: 表示/非表示を切り替え

  return <div>{/* UIを実装してください */}</div>;
}

/*
演習8: 
複数の状態を管理するショッピングカートを作成してください：
*/
function ShoppingCart() {
  // 必要な状態：
  // - items: カート内のアイテム配列
  // - total: 合計金額
  // - isOpen: カートの開閉状態
  // - itemCount: アイテム数

  const products = [
    { id: 1, name: "商品A", price: 1000 },
    { id: 2, name: "商品B", price: 1500 },
    { id: 3, name: "商品C", price: 800 },
  ];

  // 実装する関数：
  // 1. addToCart(product): 商品をカートに追加
  // 2. removeFromCart(productId): 商品をカートから削除
  // 3. clearCart(): カートを空にする
  // 4. toggleCart(): カートの開閉

  return <div>{/* 商品リストとカートUIを実装 */}</div>;
}

export default App;
