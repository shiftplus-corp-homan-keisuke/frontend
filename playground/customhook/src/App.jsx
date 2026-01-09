import "./App.css";
import useCounter from "./hooks/use-counter";

function App() {
  return (
    <div>
      <Counter />
    </div>
  );
}

export default App;

function Counter() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <p>count: {count} </p>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => decrement()}>-1</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}

function GameScore() {
  const {
    count: score,
    increment: addPoint,
    decrement: subtractPoint,
    reset: newGame,
  } = useCounter(0);

  return (
    <div>
      <p>スコア: {score}</p>
      <button onClick={() => addPoint(1)}>得点！</button>
      <button onClick={() => addPoint(5)}>大得点！</button>
      <button onClick={() => addPoint(10)}>超大得点！</button>
      <button onClick={() => subtractPoint(1)}>減点！</button>
      <button onClick={newGame}>新しいゲーム</button>
    </div>
  );
}
