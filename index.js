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

// Keep track of user-defined values
const userValues = {};

// Handle socket connections
io.on("connection", socket => {
  console.log("A user connected:", socket.id);

  // Handle new user joining the chat
  socket.on("join", username => {
    users[socket.id] = username;
    io.emit("userJoined", `${username} has joined the chat`);
    io.emit("updateUsers", Object.values(users));
  });

  const socketMessages = {};

  // Handle incoming messages
  socket.on("message", message => {
    const username = users[socket.id];
    const emojiMessage = replaceKeywordsWithEmojis(message);

    if (!socketMessages[socket.id]) {
      socketMessages[socket.id] = [];
    }

    socketMessages[socket.id].push(emojiMessage);

    // Check for slash command
    if (message.startsWith("/")) {
      handleSlashCommand(socket, message);
    } else {
      io.emit("message", `${username}: ${emojiMessage}`);
    }
  });

  function handleSlashCommand(socket, message) {
    const username = users[socket.id];
    const commandParts = message.substring(1).split(" ");
    const command = commandParts[0].toLowerCase();

    switch (command) {
      case "clear":
        io.to(socket.id).emit("clearChat");
        socketMessages[socket.id] = [];
        io.to(socket.id).emit("message", `Chat cleared by you`);
        break;
      case "help":
        const helpMessage =
          "Available commands: /clear, /help, /message, /random, /rem <get|set> <name> [<value>]";
        io.to(socket.id).emit("message", helpMessage);
        break;
      case "message":
        io.to(socket.id).emit(
          "message",
          `You have sent the following messages:\n${socketMessages[
            socket.id
          ].join("\n")}`
        );
        break;
      case "random":
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        io.to(socket.id).emit("message", `Random number: ${randomNumber}`);
        break;
      case "rem":
        handleRemCommand(socket, username, commandParts);
        break;
      default:
        io.to(socket.id).emit("message", `Unknown command: ${command}`);
        break;
    }
  }

  function handleRemCommand(socket, username, commandParts) {
    const name = commandParts[1];
    const value = commandParts.slice(2).join(" ");

    if (name === undefined) {
      io.to(socket.id).emit(
        "message",
        "Usage: /rem <name> [<value>] (to get, just use /rem <name>)"
      );
    } else if (value) {
      userValues[name] = value;
      io.to(socket.id).emit("message", `${name} set to: ${value}`);
    } else {
      const storedValue = userValues[name];
      if (storedValue !== undefined) {
        io.to(socket.id).emit("message", `${name}: ${storedValue}`);
      } else {
        io.to(socket.id).emit("message", `${name} not found`);
      }
    }
  }

  function replaceKeywordsWithEmojis(message) {
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
