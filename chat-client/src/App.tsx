import { useState } from "react";
import Connect from "./pages/Connect/Connect";
import Chat from "./pages/Chat/Chat";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

function App() {
  const [name, setName] = useState<string | null>(null);
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Connect setUsername={setName} />} />
          <Route path="/chatroom" element={<Chat name={name} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
