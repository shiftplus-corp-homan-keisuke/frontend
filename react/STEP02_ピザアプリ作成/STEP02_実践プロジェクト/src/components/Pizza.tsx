import React from "react";
import { Pizza as PizzaType } from "../data/pizzaData";

interface PizzaProps {
  pizzaObj: PizzaType;
}

const Pizza: React.FC<PizzaProps> = ({ pizzaObj }) => {
  const pizzaClassName = pizzaObj.soldOut ? "pizza sold-out" : "pizza";

  return (
    <li className={pizzaClassName}>
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <span>{pizzaObj.soldOut ? "SOLD OUT" : `$${pizzaObj.price}`}</span>
      </div>
    </li>
  );
};

export default Pizza;
