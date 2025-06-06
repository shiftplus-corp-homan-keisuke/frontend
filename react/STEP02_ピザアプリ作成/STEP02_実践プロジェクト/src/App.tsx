import React from "react";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import "./index.css"; // グローバルスタイルシートをインポート

function App() {
  return (
    <div className="container">
      <Header title="ピザメニュー" />
      <main>
        <Menu />
      </main>
      <Footer />
    </div>
  );
}

export default App;
