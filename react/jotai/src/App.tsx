import "./App.css";
import { User, useUserState } from "./store/user-store";

function App() {
  const [users, userStore, setUser] = useUserState();

  const clickHandler = () => {
    setUser(
      userStore.addItem(
        new User(crypto.randomUUID(), "John", "Doe", "john.doe@example.com")
      )
    );
  };

  return (
    <>
      <h1>User List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.fullName}</li>
        ))}
      </ul>
      <button onClick={clickHandler}>add user</button>
    </>
  );
}

export default App;
