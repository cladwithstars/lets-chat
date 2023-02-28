const express = require("express");
const http = require("http");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { Server, Socket } = require("socket.io");

// interface User {
//   id: string;
//   name: string;
// }

// interface Message {
//   id: string;
//   userId: string;
//   userName: string | number;
//   message: string;
//   type: "msg" | "connected" | "disconnected";
//   reactions: String[];
// }

const messages = [];
let users = [];

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("user connected", (name) => {
    users.push({ id: socket.id, name });
    io.emit("userList", [...users]);
    socket.broadcast.emit(
      "message",
      JSON.stringify({
        id: uuidv4(),
        userId: socket.id,
        userName: name,
        message: "connected.",
        type: "connected",
      })
    );
  });

  socket.on("disconnect", () => {
    const disconnectedUser = users.find((user) => user.id === socket.id);
    if (!disconnectedUser) {
      return;
    }
    users = users.filter((user) => user.id !== disconnectedUser.id);
    io.emit("userList", users);
    socket.broadcast.emit(
      "message",
      JSON.stringify({
        id: uuidv4(),
        userName: disconnectedUser.name,
        message: "disconnected.",
        type: "disconnected",
      })
    );
  });

  socket.on("message", ({ message, userId, userName }) => {
    const msg = {
      id: uuidv4(),
      userId,
      userName,
      message,
      type: "msg",
      reactions: [],
    };
    messages.push(msg);
    io.emit("message", JSON.stringify(msg));
  });

  socket.on("reactToMessage", ({ messageId, userId }) => {
    const message = messages.find((message) => message.id === messageId);
    if (message) {
      message.reactions?.push(userId);
      io.emit("reaction", { messageId, userId });
    }
  });
});

// serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "/chat-client/dist/")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/chat-client/dist/index.html"));
  });
}

const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 3000;

httpServer.listen(port, () => {
  console.log(`listening on *:${port}`);
});
