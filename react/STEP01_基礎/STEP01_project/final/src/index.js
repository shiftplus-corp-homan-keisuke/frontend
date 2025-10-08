import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const pizzaData = [
  {
    name: "フォカッチャ",
    ingredients: "イタリアンオリーブオイルとローズマリーのパン",
    price: 6,
    photoName: "pizzas/focaccia.jpg",
    soldOut: false,
  },
  {
    name: "マルゲリータピザ",
    ingredients: "トマトとモッツァレラチーズ",
    price: 10,
    photoName: "pizzas/margherita.jpg",
    soldOut: false,
  },
  {
    name: "スピナーチピザ",
    ingredients: "トマト、モッツァレラ、ほうれん草、リコッタチーズ",
    price: 12,
    photoName: "pizzas/spinaci.jpg",
    soldOut: false,
  },
  {
    name: "フンギピザ",
    ingredients: "トマト、モッツァレラ、マッシュルーム、玉ねぎ",
    price: 12,
    photoName: "pizzas/funghi.jpg",
    soldOut: false,
  },
  {
    name: "サラミーノピザ",
    ingredients: "トマト、モッツァレラ、ペパロニ",
    price: 15,
    photoName: "pizzas/salamino.jpg",
    soldOut: true,
  },
  {
    name: "プロシュート・ディ・パルマピザ",
    ingredients: "トマト、モッツァレラ、ハム、ルッコラ、ブッラータチーズ",
    price: 18,
    photoName: "pizzas/prosciutto.jpg",
    soldOut: false,
  },
];

function App() {
  return (
    <div className="container">
      <Header />
      <Menu />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <h1>Fast React Pizza Co.</h1>
    </header>
  );
}

function Menu() {
  const pizzas = pizzaData;

  const numPizzas = pizzas.length;

  return (
    <main className="menu">
      <h2>Our menu</h2>

      {numPizzas > 0 ? (
        <>
          <p>
            本格イタリアン、石窯からお届けする、創造性あふれる6つの料理。すべて有機食材を使用し、どれも絶品です
          </p>

          <ul className="pizzas">
            {pizzas.map((pizza) => (
              <Pizza pizzaObj={pizza} key={pizza.name} />
            ))}
          </ul>
        </>
      ) : (
        <p>ただいまメニューを準備中です。また後ほどお越しください。</p>
      )}
    </main>
  );
}

function Pizza({ pizzaObj }) {
  console.log(pizzaObj);

  return (
    <li className={`pizza ${pizzaObj.soldOut ? "sold-out" : ""}`}>
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>

        <span>{pizzaObj.soldOut ? "SOLD OUT" : pizzaObj.price}</span>
      </div>
    </li>
  );
}

function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;
  console.log(isOpen);

  return (
    <footer className="footer">
      {isOpen ? (
        <Order closeHour={closeHour} openHour={openHour} />
      ) : (
        <p>
          {openHour}:00から{closeHour}:00の間、皆様のご来店をお待ちしております。
        </p>
      )}
    </footer>
  );
}

function Order({ closeHour, openHour }) {
  return (
    <div className="order">
      <p>
        {openHour}:00から{closeHour}:00まで営業しております。ご来店またはオンラインでご注文ください。
      </p>
      <button className="btn">注文する</button>
    </div>
  );
}

// React v18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
