import { useState } from "react";
import Connect from "./pages/Connect/Connect";
import Chat from "./pages/Chat/Chat";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

function App() {
  const [userName, setUserName] = useState<string | null>(null);
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Connect setUserName={setUserName} />} />
          <Route path="/chatroom" element={<Chat userName={userName} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
