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

export default App;
