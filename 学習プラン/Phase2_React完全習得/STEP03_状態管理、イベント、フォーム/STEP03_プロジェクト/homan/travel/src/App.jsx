import { useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Logo />
      <Form />
      <PackingList />
      <Stats />
    </div>
  );
}

function Logo() {
  return <h1> 旅行の準備APP </h1>;
}

function Form() {
  const [description, setDescription] = useState("穂満");

  function handleSubmit(event) {
    event.preventDefault();
    setDescription("穂満");
    console.log("フォームが送信されました");
  }

  return (
    <form className="add-form" onSubmit={(e) => handleSubmit(e)}>
      <h3>旅行に何が必要ですか？ 😍</h3>
      <select>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        value={description}
        type="text"
        placeholder="アイテム名"
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>追加 ✈️</button>
    </form>
  );
}

function PackingList() {
  const initialItems = [
    { id: 1, description: "Passports", quantity: 2, packed: true },
    { id: 2, description: "Socks", quantity: 12, packed: false },
    { id: 3, description: "Charger", quantity: 1, packed: false },
  ];
  return (
    <ul className="list">
      {initialItems.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </ul>
  );
}

function Item({ item }) {
  return (
    <li>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button>❌️</button>
    </li>
  );
}

function Stats() {
  return (
    <footer className="stats">
      💼 リストにX個のアイテムがあり、すでにX個(X%)を荷造り済みです
    </footer>
  );
}

export default App;
