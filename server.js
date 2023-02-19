const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const messages = [];
const users = [];

io.on("connection", (socket) => {
  socket.emit("allMessages", messages);

  socket.on("user connected", (name) => {
    users.push(name);
    io.emit("userCount", users.length);
    socket.broadcast.emit(
      "message",
      JSON.stringify({ name, message: "connected." })
    );
  });

  socket.on("user disconnected", (name) => {
    users.splice(users.indexOf(name), 1);
    io.emit("userCount", users.length);
    socket.broadcast.emit(
      "message",
      JSON.stringify({ name, message: "disconnected." })
    );
  });

  socket.on("message", ({ name, message }) => {
    io.emit("message", JSON.stringify({ name, message }));
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
