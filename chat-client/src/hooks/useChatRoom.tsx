import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

type Message = {
  name: string | null;
  message: string;
  type: "msg" | "connected" | "disconnected";
};

type ChatRoomState = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  messages: Message[];
  userCount: number;
  handleLeave: () => void;
};

const useChatRoom = (name: string | null): ChatRoomState => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userCount, setUserCount] = useState<number>(0);

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
    const socket = io("http://localhost:3000");
    setSocket(socket);

    socket.on("connect", () => {
      socket.emit("user connected", name);
    });

    socket.on("message", (message) => {
      setMessages((messages) => [...messages, JSON.parse(message)]);
    });

    socket.on("userCount", (count: number) => {
      setUserCount(count);
    });

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

  return { socket, messages, userCount, handleLeave };
};

export default useChatRoom;
