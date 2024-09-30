const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

app.use(cors());
const app = express();
app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const PORT = 3000;

app.get('/', function(req,res){
    res.send("hehe babu")
})

const socketID_to_Users_Map = {};
const roomID_to_Code_Map = {};

async function getUsersinRoom(roomId, io){
    const socketList = await io.in(roomId).allSockets()
    const usersList = []
    socketList.forEach((each => {
        (each in socketID_to_Users_Map) && userslist.push(socketID_to_Users_Map[each].username)
    }))

return usersList
}

async function updateUserlistandCodemap(io, socket, roomId){
    socket.in(roomId).emit("member left", {username: socketID_to_Users_Mapp[socket.id].username})

    // update user list
    delete socketID_to_Users_Map[socket.id]
    const usersList = await getUsersinRoom(roomId, io)
    socket.in(roomId).emit("updating client list", {
        usersList: usersList
    })

    usersList.length === 0 && delete roomID_to_Code_Map
    [roomId]
}

// call join -> executed
io.on('connection', function (socket) {
    console.log('A user connected', socket.id)

    socket.on("when a user joins", async ({roomId, username})=>{
        console.log("username:", username)
        socketID_to_Users_Map[socket.id] = {username}
        socket.join(roomId)

        const usersList = await getUsersinRoom(roomId, io)

        // for others -> updating client list
        socket.in(roomId).emit("updating client list", {
            usersList: usersList
        })

        // this user -> updating client list
        io.to(socket.id).emit("updating client list", {
            usersList: usersList
        })

        // send latest code changes to this user when joined to existing room
    })
})



app.listen(PORT, ()=>{
    console.log('local host 3000');
})