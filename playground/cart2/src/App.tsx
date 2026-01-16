import Cart from "./components/Cart";
import { useCartStore, type Product } from "./store/useCartStore";

// 仮の商品データ
const sampleProducts: Product[] = [
  { id: 1, title: "iPhone 15", price: 999 },
  { id: 2, title: "MacBook Pro", price: 1999 },
  { id: 3, title: "AirPods Pro", price: 249 },
];

function App() {
  const addItem = useCartStore((state) => state.addItem);
  return (
    <div className="app">
      <h1>🛍️ Shop Catalog</h1>

      {/* 商品一覧 */}
      <section className="products">
        <h2>商品一覧</h2>
        <div className="product-grid">
          {sampleProducts.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.title}</h3>
              <p>${product.price}</p>
              <button onClick={() => addItem(product)}>カートに追加</button>
            </div>
          ))}
        </div>
      </section>

      {/* カート */}
      <Cart />
    </div>
  );
}

export default App;
