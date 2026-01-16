import { useState } from "react";
import { create } from "zustand";

export default function Counter() {
  const { count, decrement } = useCountStore();
  return (
    <div>
      <p>Count: {count}</p>
      <Increment />
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

export function Increment() {
  const increment = useCountStore((state) => state.increment);
  return <button onClick={increment}>Increment</button>;
}

function useCounter(initialCount: number) {
  const [count, setCount] = useState(initialCount);
  function increment() {
    setCount((count) => count + 1);
  }

  function decrement() {
    setCount((count) => count - 1);
  }

  return {
    count,
    increment,
    decrement,
  };
}

type CountState = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

const useCountStore = create<CountState>((set) => {
  return {
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
  };
});
