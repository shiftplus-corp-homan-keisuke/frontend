import { useCartStore } from "../store/useCartStore";

type CartItemProps = {
  item: {
    id: number;
    title: string;
    price: number;
    quantity: number;
  };
};

function CartItem({ item }: CartItemProps) {
  const { removeItem, increaseQuantity, decreaseQuantity } = useCartStore();
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <span className="cart-item-title">{item.title}</span>
        <span className="cart-item-price">${item.price}</span>
      </div>

      <div className="cart-item-actions">
        <button onClick={() => decreaseQuantity(item.id)}>−</button>
        <span className="cart-item-quantity">{item.quantity}</span>
        <button onClick={() => increaseQuantity(item.id)}>+</button>
        <button onClick={() => removeItem(item.id)}>🗑️</button>
      </div>
    </div>
  );
}

export default CartItem;
