import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

interface Props {
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

const Connect: React.FC<Props> = ({ setUsername }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSubmitName = (e: any) => {
    e.preventDefault();
    setUsername(name);
    navigate("/chatroom");
  };

  return (
    <div className="connect-container">
      <h1>Enter your name to join the chat</h1>
      <form onSubmit={handleSubmitName}>
        <input
          className="connect-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <button className="connect-button" disabled={!name} type="submit">
          Join
        </button>
      </form>
    </div>
  );
};

export default Connect;
