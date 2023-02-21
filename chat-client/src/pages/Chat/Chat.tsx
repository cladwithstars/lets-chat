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
    if (inputValue.length === 0) {
      return;
    }
    if (inputValue.length > 10000) {
      return;
    }
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
          const { type } = message;
          const isOwnMessage = name === message.name;
          console.log("isOwnMessage ", isOwnMessage);
          const msgContainerClass = clsx("message", {
            left: !isOwnMessage,
            right: isOwnMessage,
          });
          const msgClassName = clsx("message-body", {
            "connect-msg": type === "connected",
            "disconnect-msg": type === "disconnected",
            "own-message": isOwnMessage && type === "msg",
            "other-message": !isOwnMessage && type === "msg",
            "own-bubble": isOwnMessage && type === "msg",
            "other-bubble": !isOwnMessage && type === "msg",
          });
          return (
            <div key={index} className={msgContainerClass}>
              <div className="message-header">{message.name}</div>
              <div className={msgClassName}>{message.message}</div>
            </div>
          );
        })}
      </div>
      <div className="input-container">
        <form onSubmit={sendMessage}>
          <textarea
            className="input"
            value={inputValue}
            minLength={0}
            maxLength={10000}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="button"
            disabled={!inputValue || inputValue.length > 10000}
            type="submit"
          >
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
