# simple-chat-app

# Real-time Chat App using Node.js and Socket.io

This is a simple real-time chat application built using Node.js and Socket.io. It allows multiple users to join a chat room and exchange messages in real-time.

## Features

- Join a chat room with a username
- See the list of currently online users
- Send and receive messages in real-time
- Replace keywords with emojis: "hey" ➡️ 👋, "woah" ➡️ 😲, "lol" ➡️ 😂, "like" ➡️ ❤️ (and more!)
- Slash commands support:
  - `/clear` to clear the chat
  - `/help` to show all available commands
  - `/message` to show your sent messages
  - `/random` to show a random whole number
  - `/rem <name> [<value>]` to set and retrieve user-defined values
  - `/calc <expression>` to perform basic calculations

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (with npm)

## Installation

1. Clone this repository or download the ZIP archive.

```
git clone https://github.com/venkatesh9ui/simple-chat-app.git
```

2. Navigate to the project directory:

```
cd simple-chat-app
```

3. Install the dependencies:

```
npm install
```

## Usage

1. Start the server:

```
node index.js
```

2. Open your web browser and navigate to `http://localhost:3000`.

3. Enter your desired username and start chatting with others in real-time!

## Customization

You can further customize and enhance the application:

- Implement user authentication and login system
- Add support for private messaging
- Store and display message history
- Improve the user interface and styles

## Contributing

Contributions are welcome! If you have any ideas for improvements or new features, feel free to fork this repository, make your changes, and create a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

Enjoy chatting in real-time with emojis, slash commands, and even basic calculations using this Node.js and Socket.io chat app!
