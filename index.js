const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Keep track of connected users
const users = {};

// Handle socket connections
io.on("connection", socket => {
  console.log("A user connected:", socket.id);

  // Handle new user joining the chat
  socket.on("join", username => {
    users[socket.id] = username;
    io.emit("userJoined", `${username} has joined the chat`);
    io.emit("updateUsers", Object.values(users));
  });

  // Handle incoming messages
  socket.on("message", message => {
    const username = users[socket.id];
    io.emit("message", `${username}: ${message}`);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit("userLeft", `${username} has left the chat`);
    io.emit("updateUsers", Object.values(users));
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
