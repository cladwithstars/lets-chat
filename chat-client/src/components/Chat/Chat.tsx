import { useState, useEffect, useRef } from "react";
import useChatRoom from "../../hooks/useChatRoom";
import "./styles.css";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface Props {
  name: string;
}

interface Message {
  name: string;
  message: string;
}

const Chat: React.FC<Props> = ({ name }) => {
  const { socket, messages, userCount } = useChatRoom(name);
  const [inputValue, setInputValue] = useState<string>("");
  const chatRoomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatRoomRef && chatRoomRef.current) {
      console.log("scrolling");
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

  const handleLeave = () => {
    if (socket) {
      socket.emit("user disconnected", name, () => {
        setTimeout(() => {
          if (socket.connected) {
            socket.disconnect();
          }
        }, 5000); // wait 5 seconds before disconnecting
      });
    }
  };

  return (
    <div className="container">
      <p>Num users in room: {userCount}</p>
      <div className="messages" ref={chatRoomRef}>
        {messages.map((message, index) => (
          <div key={index} className="message">
            <div className="message-header">{message.name}</div>
            <div className="message-body">{message.message}</div>
          </div>
        ))}
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
        </form>
        <button className="button" onClick={handleLeave}>
          Leave
        </button>
        <div>{name}</div>
      </div>
    </div>
  );
};

export default Chat;
