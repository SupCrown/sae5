import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div>
       <header
        style={{
          padding: "16px",
          borderBottom: "10px solid #AD211B", 
          textAlign: "center",
        }}
      ></header>
      {/* header / navbar etc */}
      <Outlet />
    </div>
  );
}