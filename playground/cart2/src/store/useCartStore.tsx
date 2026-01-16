import { create } from "zustand";

type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

export type Product = {
  id: number;
  title: string;
  price: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Product) => void;
  removeItem: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addItem: (item: Product) =>
    set((state) => ({ items: [...state.items, { ...item, quantity: 1 }] })),

  removeItem: (id: number) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

  increaseQuantity: (id: number) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      }),
    })),

  decreaseQuantity: (id: number) =>
    set((state) => ({
      items: state.items
        .map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    })),

  clearCart: () => set(() => ({ items: [] })),
}));
