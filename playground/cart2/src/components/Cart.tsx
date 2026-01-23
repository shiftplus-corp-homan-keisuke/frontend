import { useCartStore } from "../store/useCartStore";
import CartItem from "./CartItem";


function Cart() {
  const { items, clearCart } = useCartStore();

  // 仮の合計計算
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="cart">
      <h2>🛒 カート ({totalItems})</h2>

      {items.length === 0 ? (
        <p>カートは空です</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="cart-summary">
            <p className="cart-total">合計: ${totalPrice.toFixed(2)}</p>
            <button onClick={clearCart}>カートを空にする</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
