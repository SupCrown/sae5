import { useEffect, useState } from "react";
import "./App.css";
import NextProduct from "./pages/NextProduct";
import Usericone from "./assets/images/ProfileIcon.png";

export default function App() {
  const [username, setUsername] = useState("Utilisateur");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUsername(storedUser || "Utilisateur");
  }, []);

  return (
    <div>
      <header
  style={{
    padding: "12px 16px",
    borderBottom: "10px solid #AD211B",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  }}
>
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
      {username}
    </h3>

    <img
      src={Usericone}
      alt="User"
      style={{ width: 44, height: 44 }}
    />
  </div>
</header>

      <main style={{ padding: "16px" }}>
        <NextProduct />
      </main>
    </div>
  );
}