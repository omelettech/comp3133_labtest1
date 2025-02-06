const mongoose = require("mongoose").default;
const express = require("express");
const { createServer } = require("http");
// const routes = require('./routes');  // Use the path correctly here
const routes = require("./routes");  // Ensure it's correctly pointing to the actual file
const dotenv = require("dotenv").config();
const socketIo = require('socket.io');

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(r => console.log('Connected to MongoDB...')).catch(e => console.error(e))

console.log("Starting server")
// Middleware
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allows all origins
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
const server = createServer(app);
server.listen(process.env.PORT)
app.use('/', routes);




const io = socketIo(server, {
    cors: {
        origin: "*",  // Allow any origin to connect
        methods: ["GET", "POST"]
    }
});
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Event listeners
    socket.on('join-room', ({ roomId, peerId }) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', { peerId });
        console.log(`${peerId} joined room: ${roomId}`);
    });

    socket.on('send-message', ({ roomId, userId, message }) => {
        io.to(roomId).emit('message', { user: userId, message: message });
        console.log(`Message sent to room ${roomId}: ${message} by ${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});


module.exports=app





