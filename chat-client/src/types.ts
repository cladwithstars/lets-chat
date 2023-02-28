export interface Message {
  id: string;
  userId: string;
  userName: string | null;
  message: string;
  type: "msg" | "connected" | "disconnected";
  reactions: string[];
}

export interface User {
  id: string;
  name: string;
}
