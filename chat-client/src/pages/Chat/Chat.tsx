import React, { useState, useEffect, useRef } from "react";
import useChatRoom from "../../hooks/useChatRoom";
import Message from "../../components/Message/Message";
import UsersModal from "../../components/UsersModal/UsersModal";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import "./styles.css";

interface Props {
  userName: string | null;
}

const Chat: React.FC<Props> = ({ userName }) => {
  const navigate = useNavigate();

  const { socket, messages, userList, handleLeave } = useChatRoom(userName);
  const [inputValue, setInputValue] = useState<string>("");
  const chatRoomRef = useRef<HTMLDivElement>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    if (!userName) {
      socket?.disconnect();
      navigate("/");
    }
  }, [userName]);

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
  }, [messages.length]);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (inputValue.length === 0 || inputValue.length > 10000) {
      return;
    }
    if (socket) {
      socket.emit("message", {
        message: inputValue,
        userId: socket.id,
        userName,
      });
      setInputValue("");
      scrollToBottom();
    }
  };

  const reactToMessage = (messageId: string) => {
    if (socket) {
      socket.emit("reactToMessage", { messageId, userId: socket.id });
    }
  };

  if (!socket) {
    return null;
  }

  return (
    <Container>
      <UsersModal
        users={userList}
        isOpen={modalIsOpen}
        closeModal={() => setModalIsOpen(false)}
      />
      <div className="container">
        <p>Welcome, {userName}</p>
        <p>
          Room size: {userList.length} (
          <button className="view-users" onClick={() => setModalIsOpen(true)}>
            view
          </button>
          )
        </p>
        <div className="messages" ref={chatRoomRef}>
          {messages.map((message, index) => {
            const { reactions } = message;
            const getName = (userId: string) => {
              const user = [...userList].find((user) => user.id === userId);
              return user?.name;
            };

            const likes = reactions
              ?.map((userId) => getName(userId))
              .filter(Boolean);

            return (
              <Message
                key={message.id}
                message={message}
                likes={likes}
                socketId={socket.id}
                reactToMessage={reactToMessage}
              />
            );
          })}
        </div>
        <div className="input-container">
          <form onSubmit={sendMessage}>
            <textarea
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
            {showTip && (
              <div>
                Tip: double click a message to 'like'. Click the heart to see
                the likes. (
                <button
                  className="view-users"
                  onClick={() => setShowTip(false)}
                >
                  hide
                </button>
                )
              </div>
            )}
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Chat;
