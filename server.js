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
const users = {};

io.on("connection", (socket) => {
  socket.emit("allMessages", messages);

  socket.on("disconnect", () => {
    const name = users[socket.id];
    delete users[socket.id];
    io.emit("userCount", Object.keys(users).length);
    socket.broadcast.emit(
      "message",
      JSON.stringify({ name, message: "disconnected.", type: "disconnected" })
    );
  });

  socket.on("user connected", (name) => {
    users[socket.id] = name;
    io.emit("userCount", Object.keys(users).length);
    socket.broadcast.emit(
      "message",
      JSON.stringify({ name, message: "connected.", type: "connected" })
    );
  });

  socket.on("connect", (name) => {
    users[socket.id] = name;
    io.emit("userCount", Object.keys(users).length);
    socket.broadcast.emit(
      "message",
      JSON.stringify({ name, message: "connected.", type: "connected" })
    );
  });

  socket.on("message", ({ message }) => {
    const name = users[socket.id];
    io.emit("message", JSON.stringify({ name, message, type: "msg" }));
  });
});

// socket.on("user disconnected", () => {
//   const name = users[socket.id];
//   delete users[socket.id];
//   io.emit("userCount", Object.keys(users).length);
//   socket.broadcast.emit(
//     "message",
//     JSON.stringify({ name, message: "disconnected." })
//   );
// });

http.listen(3000, () => {
  console.log("listening on *:3000");
});
