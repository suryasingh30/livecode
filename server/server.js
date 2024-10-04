const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

// Setup Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

const PORT = process.env.PORT || 5000;

// Basic route
app.get('/', function (req, res) {
  res.send("hehe babu");
});

// Maps to keep track of users and rooms
const socketID_to_Users_Map = {};
const roomID_to_Code_Map = {};

// Function to get all users in a specific room
async function getUsersinRoom(roomId, io) {
  const socketList = await io.in(roomId).allSockets();
  const usersList = [];
  socketList.forEach((each) => {
    if (each in socketID_to_Users_Map) {
      usersList.push(socketID_to_Users_Map[each].username);
    }
  });
  return usersList;
}

// Function to update user list and code map when a user leaves
async function updateUserlistandCodemap(io, socket, roomId) {
  console.log(roomId);
  socket.to(roomId).emit("member left", { username: socketID_to_Users_Map[socket.id].username });

  // Update user list
  delete socketID_to_Users_Map[socket.id];
  const usersList = await getUsersinRoom(roomId, io);
  socket.to(roomId).emit("updating client list", { usersList: usersList });

  if (usersList.length === 0) {
    delete roomID_to_Code_Map[roomId];
  }
}

// Handle socket.io connections
io.on('connection', function (socket) {
  // console.log('A user connected here', socket.id);

  // When a user joins a room
  socket.on("when a user joins", async ({ roomId, username }) => {
    // console.log("username:", username);
    socketID_to_Users_Map[socket.id] = { username };
    socket.join(roomId);

    const usersList = await getUsersinRoom(roomId, io);

    // Update client list for other users in the room
    socket.to(roomId).emit("updating client list", { usersList: usersList });

    // Send the updated client list to the user who joined
    io.to(socket.id).emit("updating client list", { usersList: usersList });

    // Send latest code changes to this user if they joined an existing room
    if (roomId in roomID_to_Code_Map) {
      io.to(socket.id).emit("on language change", { languageUsed: roomID_to_Code_Map[roomId].languageUsed });
      io.to(socket.id).emit("on code change", { code: roomID_to_Code_Map[roomId].code });
    }

    // Alert other users in the room that a new user has joined
    socket.to(roomId).emit("new member joined", { username });
  });

  // Handle language update in the room
  socket.on("update language", ({ roomId, languageUsed }) => {
    if (roomId in roomID_to_Code_Map) {
      roomID_to_Code_Map[roomId]['languageUsed'] = languageUsed;
    } else {
      roomID_to_Code_Map[roomId] = { languageUsed };
    }
  });

  // Sync the language for other users in the room
  socket.on("syncing the language", ({ roomId }) => {
    if (roomId in roomID_to_Code_Map) {
      socket.to(roomId).emit("on language change", { languageUsed: roomID_to_Code_Map[roomId].languageUsed });
    }
  });

  // Handle code update in the room
  socket.on("update code", ({ roomId, code }) => {
    if (roomId in roomID_to_Code_Map) {
      roomID_to_Code_Map[roomId]['code'] = code;
    } else {
      roomID_to_Code_Map[roomId] = { code };
    }
  });

  // Sync the code for other users in the room
  socket.on("syncing the code", ({ roomId }) => {
    if (roomId in roomID_to_Code_Map) {
      socket.to(roomId).emit("on code change", { code: roomID_to_Code_Map[roomId].code });
    }
  });

  // Handle user leaving a room
  socket.on("leave room", ({ roomId }) => {
    socket.leave(roomId);
    updateUserlistandCodemap(io, socket, roomId);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log('A user disconnected');
    const rooms = Array.from(socket.rooms);
    rooms.forEach(roomId => updateUserlistandCodemap(io, socket, roomId));
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
