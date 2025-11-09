export default function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>荷造りリストにアイテムを追加しましょう 🚀</em>
      </p>
    );

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "すべて揃いました！出発の準備完了 ✈️"
          : ` 💼 リストに${numItems}個のアイテムがあり、すでに${numPacked}個(${percentage}%)を荷造り済みです`}
      </em>
    </footer>
  );
}
