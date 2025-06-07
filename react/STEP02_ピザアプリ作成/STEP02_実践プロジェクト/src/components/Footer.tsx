import React from "react";

function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;

  return (
    <footer>
      <div className="order">
        {isOpen ? (
          <>
            <p>
              現在開店中！ {openHour}:00 から {closeHour}:00
              まで営業しています。
            </p>
            <button className="btn">今すぐ注文</button>
          </>
        ) : (
          <p>現在閉店中。 {openHour}:00 に開店します。</p>
        )}
      </div>
    </footer>
  );
}

export default Footer;
