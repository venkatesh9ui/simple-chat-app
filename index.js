const emojiMap = {
  hey: "👋",
  woah: "😲",
  lol: "😂",
  like: "❤️",
  react: "⚛️",
  javascript: "🔥",
  css: "🎨",
  scss: "🎨",
  "node.js": "🌐",
  html: "📄",
  python: "🐍",
  ruby: "💎",
  java: "☕",
  "c++": "🔍",
  typescript: "🔷",
  angular: "🅰️",
  vue: "🖖",
  php: "🐘",
  swift: "🐦",
  git: "🗄️",
  github: "🐙",
  docker: "🐳",
  sql: "📊",
  mongodb: "🍃",
  firebase: "🔥",
  aws: "☁️",
  linux: "🐧",
  windows: "🪟",
  macOS: "🍏",
  android: "🤖",
  ios: "🍎",
  api: "🔌",
  json: "📝",
  // Add more keywords and emojis as needed
};

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
    const emojiMessage = replaceKeywordsWithEmojis(message);
    io.emit("message", `${username}: ${emojiMessage}`);
  });

  function replaceKeywordsWithEmojis(message) {
    const words = message.split(" ");

    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase();
      if (emojiMap[word]) {
        words[i] = emojiMap[word];
      }
    }

    return words.join(" ");
  }

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
