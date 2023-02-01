const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);

const users = [{}];

const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New connection!");
  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(user, " has been connected to the room!");
    socket.broadcast.emit('userJoined', {
      user: "Admin",
      message: `${users[socket.id]} has joined !`,
    });
    socket.emit("Welcome", {
      user: "Admin",
      message: `Welcome to the chat , ${users[socket.id]}`,
    });
  });

   
  socket.on('message',({message,id})=>{
    io.emit("sendMessage",{user:users[id],message,id});
  })




  socket.on("disconnect", () => {
    console.log("User left!");
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]} have left`,
    });
  });
});

app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello , server is responding!");
});

const port = 5000 || process.env.PORT;

server.listen(port, (req, res) => {
  console.log(`Server is working on http://localhost:${port}`);
});
