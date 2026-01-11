import { create } from "zustand";

type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

type Product = {
  id: number;
  title: string;
  price: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product) => void;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (product: Product) =>
    set((state) => {
      return {
        items: [...state.items, { ...product, quantity: 1 }],
      };
    }),
  removeItem: (id: number) => {
    set((state) => {
      return { items: state.items.filter((item) => item.id !== id) };
    });
  },
}));
