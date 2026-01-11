type CartItemProps = {
  item: {
    id: number;
    title: string;
    price: number;
    quantity: number;
  };
};

function CartItem({ item }: CartItemProps) {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <span className="cart-item-title">{item.title}</span>
        <span className="cart-item-price">${item.price}</span>
      </div>

      <div className="cart-item-actions">
        <button>−</button>
        <span className="cart-item-quantity">{item.quantity}</span>
        <button>+</button>
        <button>🗑️</button>
      </div>
    </div>
  );
}

export default CartItem;
