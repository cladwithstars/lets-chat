import { useState, useEffect, useRef } from "react";
import useChatRoom from "../../hooks/useChatRoom";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import "./styles.css";

interface Props {
  name: string | null;
}

interface Message {
  name: string;
  message: string;
}

const Chat: React.FC<Props> = ({ name }) => {
  const navigate = useNavigate();

  const { socket, messages, userCount, handleLeave } = useChatRoom(name);
  const [inputValue, setInputValue] = useState<string>("");
  const chatRoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!name) {
      socket?.disconnect();
      navigate("/");
    }
  }, [name]);

  const scrollToBottom = () => {
    if (chatRoomRef && chatRoomRef.current) {
      chatRoomRef.current.scrollTo({
        top: chatRoomRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (socket) {
      socket.emit("message", { message: inputValue, name });
      setInputValue("");
      scrollToBottom();
    }
  };

  return (
    <div className="container">
      <p>Welcome, {name}</p>
      <p>Room size: {userCount}</p>
      <div className="messages" ref={chatRoomRef}>
        {messages.map((message, index) => {
          const { name, type } = message;
          console.log("message: ", message);
          const msgClassName = clsx("message-body", {
            "connect-msg": type === "connected",
            "disconnect-msg": type === "disconnected",
          });
          return (
            <div key={index} className="message">
              <div className="message-header">{message.name}</div>
              <div className={msgClassName}>{message.message}</div>
            </div>
          );
        })}
      </div>
      <div className="input-container">
        <form onSubmit={sendMessage}>
          <input
            className="input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="button" type="submit">
            Send
          </button>
          <button className="button button-red" onClick={handleLeave}>
            Leave
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
