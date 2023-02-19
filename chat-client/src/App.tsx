import { useState } from "react";
import Connect from "./components/Connect/Connect";
import Chat from "./components/Chat/Chat";
import "./App.css";

function App() {
  const [name, setName] = useState<string | null>(null);
  return (
    <div className="App">
      {!name && <Connect setUsername={setName} />}
      {name && <Chat name={name} />}
    </div>
  );
}

export default App;
