import React from "react";
import type { Pizza as PizzaType } from "../types";

interface PizzaProps {
  pizzaObj: PizzaType;
}

function Pizza({ pizzaObj }: PizzaProps) {
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
}

export default Pizza;
