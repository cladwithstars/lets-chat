import React, { useState } from "react";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import "./styles.css";

interface Props {
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

const Connect: React.FC<Props> = ({ setUsername }) => {
  const [name, setName] = useState("");

  const handleSubmitName = (e: any) => {
    e.preventDefault();
    setUsername(name);
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
        <button className="connect-button" type="submit">
          Join
        </button>
      </form>
    </div>
  );
};

export default Connect;
