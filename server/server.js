import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

// Setup Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
  }
});

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send("Server is running");
});

// Maps to track users and code by roomId
const socketID_to_Users_Map = {};
const roomID_to_Code_Map = {};

// Function to retrieve users in a specific room
async function getUsersinRoom(roomId, io) {
    console.log("RoomID from server: " + roomId)
  const socketList = await io.in(roomId).allSockets();
  const usersList = [];
  socketList.forEach((each) => {
    if (each in socketID_to_Users_Map) {
      usersList.push(socketID_to_Users_Map[each].username);
    }
  });
  return usersList;
}

// Update user list and code map when a user leaves
async function updateUserlistandCodemap(io, socket, roomId) {
  socket.to(roomId).emit("member left", { username: socketID_to_Users_Map[socket.id].username });
  
  // Remove user from the map
  delete socketID_to_Users_Map[socket.id];
  
  const usersList = await getUsersinRoom(roomId, io);
  socket.to(roomId).emit("updating client list", { usersList: usersList });

  // Clear code map if no users left in the room
  if (usersList.length === 0) {
    delete roomID_to_Code_Map[roomId];
  }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
  
    // Ensure roomId is present before allowing a user to join
    socket.on("when a user joins", async ({ roomId, username }) => {
      if (!roomId) return; // Stop if no roomId is provided
  
      console.log("Room ID when user joins: "+ roomId); // Ensure you log the roomId, not `room`
      socketID_to_Users_Map[socket.id] = { username }; // Store user in map
      socket.join(roomId); // Join the room using roomId
  
      const usersList = await getUsersinRoom(roomId, io);
      socket.to(roomId).emit("updating client list", { usersList: usersList });
      io.to(socket.id).emit("updating client list", { usersList: usersList });
  
      // Send the current language and code to the new user
      if (roomId in roomID_to_Code_Map) {
        io.to(socket.id).emit("on language change", { languageUsed: roomID_to_Code_Map[roomId].languageUsed });
        io.to(socket.id).emit("on code change", { code: roomID_to_Code_Map[roomId].code });
      }
  
      socket.to(roomId).emit("new member joined", { username });
    });
  
    socket.on("update language", ({ roomId, languageUsed }) => {
      if (!roomId) return; // Ensure roomId is present
  
      if (!roomID_to_Code_Map[roomId]) {
        roomID_to_Code_Map[roomId] = {};
      }
      roomID_to_Code_Map[roomId]['languageUsed'] = languageUsed;
      socket.to(roomId).emit("on language change", { languageUsed });
    });
  
    socket.on("update code", ({ roomId, code }) => {
      if (!roomId) return; // Ensure roomId is present
  
      if (!roomID_to_Code_Map[roomId]) {
        roomID_to_Code_Map[roomId] = {};
      }
      roomID_to_Code_Map[roomId]['code'] = code;
      socket.to(roomId).emit("on code change", { code });
    });
  
    socket.on("leave room", ({ roomId }) => {
      if (!roomId) return; // Ensure roomId is present before attempting to leave
  
      socket.leave(roomId); // Leave the room using roomId
      updateUserlistandCodemap(io, socket, roomId);
    });
  
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
