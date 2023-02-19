import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

type Message = {
  name: string;
  message: string;
};

type ChatRoomState = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  messages: Message[];
  userCount: number;
};

const useChatRoom = (name: string): ChatRoomState => {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);

    socket.on("connect", () => {
      socket.emit("user connected", name);
    });

    socket.on("message", (message: string) => {
      const parsed = JSON.parse(message);
      const formatted = { name: parsed.name, message: parsed.message };
      setMessages((messages) => [...messages, formatted]);
    });

    socket.on("user connected", (name: string) => {
      const message = { name: "Server", message: `${name} connected` };
      setMessages((messages) => [...messages, message]);
    });

    socket.on(
      "user disconnected",
      ({ name, message }: { name: string; message: string }) => {
        setMessages((messages) => [...messages, { name, message }]);
      }
    );

    socket.on("userCount", (count: number) => {
      setUserCount(count);
    });

    return () => {
      socket.disconnect();
    };
  }, [name]);

  return { socket, messages, userCount };
};

export default useChatRoom;
