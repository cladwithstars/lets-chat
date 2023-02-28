import React, { useState } from "react";
import clsx from "clsx";
import { Message as MessageType } from "../../types";
import useChatRoom from "../../hooks/useChatRoom";
import "./styles.css";

interface Props {
  message: MessageType;
  socketId: string;
  reactToMessage: (messageId: string) => void;
  likes: (string | undefined)[];
}

const Message: React.FC<Props> = ({
  message,
  socketId,
  likes,
  reactToMessage,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { id, type, userId, userName, reactions } = message;
  const isOwnMessage = socketId === message.userId;
  const msgContainerClass = clsx("message", {
    left: !isOwnMessage,
    right: isOwnMessage,
  });
  const msgClassName = clsx("message-body", {
    "connect-msg": type === "connected",
    "disconnect-msg": type === "disconnected",
    "own-message": isOwnMessage && type === "msg",
    "other-message": !isOwnMessage && type === "msg",
  });

  const isLikedByUser = type === "msg" && reactions?.includes(socketId);

  return (
    <div className={msgContainerClass}>
      <div className="message-header">{userName}</div>
      <div
        className={msgClassName}
        onDoubleClick={() => {
          if (reactions.includes(socketId) || socketId === userId) {
            return;
          }
          reactToMessage(id);
        }}
      >
        {message.message}
      </div>
      {type === "msg" && reactions.length > 0 && (
        <div
          className={clsx("reactions", { liked: isLikedByUser })}
          onClick={() => {
            setShowModal(!showModal);
          }}
        >
          <i className={clsx("fas fa-heart", { liked: isLikedByUser })}></i>
          <span className="reaction-count">{reactions.length}</span>
        </div>
      )}
      {showModal && (
        <div>
          <ul className="liked-by-list">
            {likes.map((name) => {
              return <li key={name}>{name}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Message;
