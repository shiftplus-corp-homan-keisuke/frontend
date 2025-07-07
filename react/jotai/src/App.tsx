import "./App.css";
import { useAtom } from "jotai";
import {
  useUsers,
  createUser,
  usersWithFullNameAtom,
  activeUsersAtom,
  usersByDomainAtom,
} from "./store/user-store";

function App() {
  // 新しいパターンを使用したユーザー管理
  const { entities: users, count, actions, dispatchSpecific } = useUsers();

  // 派生Atomを使用してフルネーム付きユーザーを取得
  const [usersWithFullName] = useAtom(usersWithFullNameAtom);
  const [activeUsers] = useAtom(activeUsersAtom);
  const [usersByDomain] = useAtom(usersByDomainAtom);

  // ユーザー追加ハンドラー
  const addUserHandler = () => {
    const newUser = createUser("John", "Doe", "john.doe@example.com");
    actions.add(newUser);
  };

  // ランダムユーザー追加ハンドラー
  const addRandomUserHandler = () => {
    const names = [
      { first: "Alice", last: "Smith", email: "alice@company.com" },
      { first: "Bob", last: "Johnson", email: "bob@startup.io" },
      { first: "Carol", last: "Williams", email: "carol@enterprise.org" },
      { first: "David", last: "Brown", email: "david@company.com" },
    ];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const newUser = createUser(
      randomName.first,
      randomName.last,
      randomName.email
    );
    actions.add(newUser);
  };

  // ユーザー削除ハンドラー
  const removeUserHandler = (id: string) => {
    actions.remove(id);
  };

  // ユーザーのアクティブ状態切り替えハンドラー
  const toggleActiveHandler = (id: string) => {
    if (dispatchSpecific) {
      dispatchSpecific({ type: "toggleActive", payload: id });
    }
  };

  // メール更新ハンドラー
  const updateEmailHandler = (id: string) => {
    const newEmail = prompt("新しいメールアドレスを入力してください:");
    if (newEmail && dispatchSpecific) {
      dispatchSpecific({
        type: "updateEmail",
        payload: { id, email: newEmail },
      });
    }
  };

  // 全ユーザークリアハンドラー
  const clearAllHandler = () => {
    if (confirm("全てのユーザーを削除しますか？")) {
      actions.clear();
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>ユーザー管理システム</h1>

      {/* 統計情報 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "5px",
        }}
      >
        <h3>統計情報</h3>
        <p>総ユーザー数: {count}</p>
        <p>アクティブユーザー数: {activeUsers.length}</p>
        <p>ドメイン数: {Object.keys(usersByDomain).length}</p>
      </div>

      {/* 操作ボタン */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={addUserHandler} style={{ marginRight: "10px" }}>
          デフォルトユーザー追加
        </button>
        <button onClick={addRandomUserHandler} style={{ marginRight: "10px" }}>
          ランダムユーザー追加
        </button>
        <button onClick={clearAllHandler} style={{ color: "red" }}>
          全削除
        </button>
      </div>

      {/* ユーザーリスト */}
      <div style={{ marginBottom: "30px" }}>
        <h2>ユーザーリスト</h2>
        {usersWithFullName.length === 0 ? (
          <p>ユーザーが登録されていません。</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {usersWithFullName.map((user) => (
              <li
                key={user.id}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  backgroundColor:
                    user.active === false ? "#ffebee" : "#e8f5e8",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{user.fullName}</strong>
                    <br />
                    <small>{user.email}</small>
                    <br />
                    <span
                      style={{
                        color: user.active === false ? "red" : "green",
                        fontSize: "12px",
                      }}
                    >
                      {user.active === false ? "非アクティブ" : "アクティブ"}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => toggleActiveHandler(user.id)}
                      style={{ marginRight: "5px", fontSize: "12px" }}
                    >
                      {user.active === false ? "有効化" : "無効化"}
                    </button>
                    <button
                      onClick={() => updateEmailHandler(user.id)}
                      style={{ marginRight: "5px", fontSize: "12px" }}
                    >
                      メール変更
                    </button>
                    <button
                      onClick={() => removeUserHandler(user.id)}
                      style={{ color: "red", fontSize: "12px" }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ドメイン別ユーザー表示 */}
      <div>
        <h2>ドメイン別ユーザー</h2>
        {Object.keys(usersByDomain).length === 0 ? (
          <p>ユーザーが登録されていません。</p>
        ) : (
          Object.entries(usersByDomain).map(([domain, domainUsers]) => (
            <div key={domain} style={{ marginBottom: "15px" }}>
              <h3 style={{ color: "#666" }}>
                @{domain} ({domainUsers.length}人)
              </h3>
              <ul style={{ marginLeft: "20px" }}>
                {domainUsers.map((user) => (
                  <li key={user.id}>
                    {user.firstName} {user.lastName}
                    {user.active === false && (
                      <span style={{ color: "red" }}> (非アクティブ)</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
