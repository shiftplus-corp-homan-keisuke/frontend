import React from "react";
import Pizza from "./Pizza";
import { pizzaData } from "../data/pizzaData";

const Menu: React.FC = () => {
  const numPizzas = pizzaData.length;

  return (
    <main className="menu">
      <h2>Our Menu</h2>

      {numPizzas > 0 ? (
        <ul className="pizzas">
          {pizzaData.map((pizza) => (
            <Pizza pizzaObj={pizza} key={pizza.id} />
          ))}
        </ul>
      ) : (
        <p>現在、ピザの準備中です。しばらくお待ちください 😊</p>
      )}
    </main>
  );
};

export default Menu;
