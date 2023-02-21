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

// serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use("", express.static(__dirname + "/chat-client/build/"));
  app.get("*", (req, res) => {
    res.sendFile(__dirname + "/client/build/index.html");
  });
}

const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 3000;

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
