import "./App.css";
import { useEffect, useRef } from "react";

function App() {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div>
      <button>下にスクロール</button>
      <div style={{ height: "1000px" }}> nagai</div>
      <div ref={bottomRef}>target</div>
    </div>
  );
}

export default App;
