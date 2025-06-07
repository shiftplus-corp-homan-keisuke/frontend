import React from "react";
import Pizza from "../Pizza";
import { pizzaData } from "../../data/pizzaData";

/**
 * メニューコンポーネント
 * 
 * 学習者向けタスク：
 * 1. pizzaDataの配列の長さを取得してnumPizzas変数に格納する
 * 2. 条件分岐でピザが存在する場合とない場合の表示を切り替える
 * 3. map関数を使用してピザデータをPizzaコンポーネントにレンダリングする
 * 4. 適切なkey属性を設定する
 */
function Menu() {
  // TODO: pizzaDataの長さを取得してnumPizzas変数に格納してください
  const numPizzas = 0; // ここを修正してください

  return (
    <main className="menu">
      <h2>Our Menu</h2>

      {/* TODO: 条件分岐を実装してください */}
      {/* numPizzas > 0 の場合: ピザリストを表示 */}
      {/* そうでない場合: "現在、ピザの準備中です。しばらくお待ちください 😊" を表示 */}
      
      {/* ヒント: 三項演算子を使用してください */}
      {/* numPizzas > 0 ? (...ピザリスト...) : (...準備中メッセージ...) */}
      
      <div>
        {/* ここに実装してください */}
      </div>
    </main>
  );
}

export default Menu;