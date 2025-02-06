const { v4: uuidV4 } = require('uuid');
const handler = {};

// Store rooms and participants
const rooms = {};

handler.socketConnection = (socket) => {
    console.log('Client connected', socket.id);

    // Create room (this is triggered by the client to create a new room)
    const roomCreate = (userId) => {
        const roomId = uuidV4();
        rooms[roomId] = []; // Initialize the room with an empty participant list
        socket.emit('room-created', { roomId, userId });
    };

    // Join room (this is triggered by the client when they want to join a room)
    const joinRoom = ({ roomId, peerId }) => {
        if (rooms[roomId]) {
            // Check if peerId is not already in the room, then add it
            if (!rooms[roomId].includes(peerId)) {
                rooms[roomId].push(peerId);
            }

            // Join the room and emit the user-joined event to the room
            socket.join(roomId);
            socket.to(roomId).emit('user-joined', { peerId });

            // Emit a list of current participants to the newly joined user
            socket.emit('get-users', {
                roomId,
                participants: rooms[roomId],
            });
        }
    };

    // Send a message to the room (this could be any event for communication, e.g., chat)
    const sendMessage = ({ roomId, userId, message }) => {
        if (rooms[roomId]) {
            socket.to(roomId).emit('message', { userId, message });
        }
    };

    // Disconnect handler (remove the user from the room when they disconnect)
    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);

        // Find and remove the user from all rooms
        for (const roomId in rooms) {
            const index = rooms[roomId].indexOf(socket.id);
            if (index > -1) {
                rooms[roomId].splice(index, 1);
                socket.to(roomId).emit('user-disconnected', socket.id);
            }
        }
    });

    // Listen for incoming events
    socket.on('create-room', roomCreate);
    socket.on('join-room', joinRoom);
    socket.on('send-message', sendMessage);
};

module.exports = handler;
