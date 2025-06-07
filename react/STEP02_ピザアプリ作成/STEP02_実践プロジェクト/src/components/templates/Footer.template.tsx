import React from "react";

/**
 * フッターコンポーネント
 * 
 * 学習者向けタスク：
 * 1. 現在の時刻を取得してhour変数に格納する
 * 2. 営業時間の定数を設定する（openHour: 12, closeHour: 22）
 * 3. 現在時刻が営業時間内かどうかを判定するisOpen変数を作成する
 * 4. 条件分岐で営業中と閉店中の表示を切り替える
 * 5. 営業中の場合は注文ボタンも表示する
 */
function Footer() {
  // TODO: 現在の時刻を取得してください
  // ヒント: new Date().getHours()
  const hour = 0; // ここを修正してください
  
  // TODO: 営業時間の定数を設定してください
  const openHour = 0; // ここを修正してください（12に設定）
  const closeHour = 0; // ここを修正してください（22に設定）
  
  // TODO: 営業時間内かどうかを判定してください
  // ヒント: hour >= openHour && hour <= closeHour
  const isOpen = false; // ここを修正してください

  return (
    <footer>
      <div className="order">
        {/* TODO: 条件分岐を実装してください */}
        {/* isOpenがtrueの場合: 営業中メッセージと注文ボタンを表示 */}
        {/* isOpenがfalseの場合: 閉店中メッセージを表示 */}
        
        {/* ヒント: 以下の構造を参考にしてください */}
        {/*
        {isOpen ? (
          <>
            <p>現在開店中！ {openHour}:00 から {closeHour}:00 まで営業しています。</p>
            <button className="btn">今すぐ注文</button>
          </>
        ) : (
          <p>現在閉店中。 {openHour}:00 に開店します。</p>
        )}
        */}
        
        <div>
          {/* ここに実装してください */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;