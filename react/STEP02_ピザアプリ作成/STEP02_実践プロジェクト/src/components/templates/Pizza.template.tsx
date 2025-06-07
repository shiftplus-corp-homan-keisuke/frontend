import React from "react";
import type { PizzaProps } from "../../types";

/**
 * ピザコンポーネント
 * 
 * 学習者向けタスク：
 * 1. PizzaPropsインターフェースを使用してpropsを受け取る
 * 2. pizzaObj.soldOutに基づいて条件付きクラス名を設定する
 * 3. ピザの画像、名前、材料、価格を表示する
 * 4. 売り切れの場合は"SOLD OUT"を表示し、そうでなければ価格を表示する
 */
function Pizza({ pizzaObj }: PizzaProps) {
  // TODO: pizzaObj.soldOutに基づいて条件付きクラス名を設定してください
  // ヒント: pizzaObj.soldOut ? "pizza sold-out" : "pizza"
  const pizzaClassName = "pizza"; // ここを修正してください

  return (
    <li className={pizzaClassName}>
      {/* TODO: ピザの画像を表示してください */}
      {/* ヒント: <img src={pizzaObj.photoName} alt={pizzaObj.name} /> */}
      
      <div>
        {/* TODO: ピザの名前をh3要素で表示してください */}
        
        {/* TODO: ピザの材料をp要素で表示してください */}
        
        {/* TODO: 売り切れの場合は"SOLD OUT"、そうでなければ価格を表示してください */}
        {/* ヒント: {pizzaObj.soldOut ? "SOLD OUT" : `$${pizzaObj.price}`} */}
        <span>価格または売り切れ表示</span>
      </div>
    </li>
  );
}

export default Pizza;