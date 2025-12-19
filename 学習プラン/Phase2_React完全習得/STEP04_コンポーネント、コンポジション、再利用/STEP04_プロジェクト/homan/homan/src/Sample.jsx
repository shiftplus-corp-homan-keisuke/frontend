import { useEffect, useState } from "react";

export default function Sample() {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  useEffect(() => {
    setInterval(() => {
      console.log("useEffect");
    }, 1000);

    return () => {
      clearInterval();
    };
  }, []);

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Count2: {count2}</p>
      <button onClick={() => setCount2(count2 + 1)}>Increment2</button>
    </>
  );
}

function Form() {
  const [firstName, setFirstName] = useState("Taylor");
  const [lastName, setLastName] = useState("Swift");

  useCallBack(() => {});
}
