import { useState } from "react";

export default function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  function increment(n = 1) {
    setCount((prevCount) => prevCount + n);
  }

  function decrement(n = 1) {
    setCount((prevCount) => prevCount - n);
  }

  function reset() {
    setCount(initialValue);
  }

  return {
    count,
    increment,
    decrement,
    reset,
  };
}
