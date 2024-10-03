const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const app = express();
app.use(express.json());
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const PORT = process.env.PORT || 5000

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
    socket.in(roomId).emit("member left", {username: socketID_to_Users_Map[socket.id].username})

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
        if(room in roomID_to_Code_Map){
            io.to(socket.id).emit("o language change", {languageUsed: roomID_to_Code_Map[roomId].languageUsed})
            io.to(socket.id).emit("on code change", {code:roomID_to_Code_Map[roomId].code})
        }

        // /alerting other users in room tha new user joined
        socket.in(roomId).emit("new member joined", {
            username
        })

    })

    // for other users in room to view the changes
    socket.on("update lnguage",({roomId, languageUsed}) =>  {
        if(roomId in roomID_to_Code_Map){
            roomID_to_Code_Map[roomId]['languageUsed'] = languageUsed
        }
        else{
            roomID_to_Code_Map[roomId] = {languageUsed}
        }
    })

    // for user editing the code o reflect on there screen
    socket.on("sycing the language", ({roomId}) => {
        if(roomId in roomID_to_Code_Map)
        {
            socket.in(roomId).emit("on lanuage change",{languageUsed: roomID_to_Code_Map[roomId].languageUsed})
        }
    })

    // for other users in room to iew the changes
    socket.on("update code", ({roomId, code}) => {
        if(roomId in roomID_to_Code_Map)
        {
            roomID_to_Code_Map[roomId]['code'] = code
        }
        else
        {
            roomID_to_Code_Map[roomId] = {code}
        }
    })

    // for user editing he code too reflect on ther screenn
    socket.on("syncing the code", ({roomId}) => {
        if(roomId in roomID_to_Code_Map)
        {
            socket.in(roomId).emit("on code change", {code:roomID_to_Code_Map[roomId].code})
        }
    })

    socket.on("leave room", ({roomId}) => {
        socket.leave(roomId)
        updateUserlistandCodemap(io, socket, roomId)
    })

    socket.on("diconnect", function(){
        console.log('A user disconnected');
    })
})

app.listen(PORT, ()=>{
    console.log('local host 5000');
})