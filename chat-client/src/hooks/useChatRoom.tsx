import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { Message, User } from "../types";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

type ChatRoomState = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  messages: Message[];
  userList: User[];
  handleLeave: () => void;
};

const isProduction = process.env.NODE_ENV === "production";

const target = isProduction
  ? "https://lets-chat.herokuapp.com"
  : "http://localhost:3000";

const useChatRoom = (name: string | null): ChatRoomState => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);
  const [userList, setUserList] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleLeave = () => {
    if (socket) {
      socket.emit("user disconnected", name);
      setTimeout(() => {
        socket.disconnect();
      }, 2000);
      navigate("/");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.emit("user connected", name);
    }
  }, [socket, name]);

  useEffect(() => {
    const socket = io(target);
    if (!socket) {
      return;
    }
    setSocket(socket);

    socket.on("userList", (users) => {
      console.log("userList received", users);
      setUserList(users);
    });

    socket.on("message", (message) => {
      setMessages((messages) => [...messages, JSON.parse(message)]);
    });

    socket.on(
      "reaction",
      ({ messageId, userId }: { messageId: string; userId: string }) => {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((msg) => {
            if (msg.id === messageId) {
              return { ...msg, reactions: [...msg.reactions, userId] };
            } else {
              return msg;
            }
          });
          return updatedMessages;
        });
      }
    );

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      handleLeave();
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.disconnect();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [name]);

  return { socket, messages, userList, handleLeave };
};

export default useChatRoom;
