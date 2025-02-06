// import dependencies
const express = require('express');
const {Conversation, Message, User, Room} = require('../models');

const app = express.Router();



const getUserFromUsername = async (username) => {
    return await User.findOne({ username });
};

//Find group with roup id
app.get('/findGroup/:groupId', async (req, res) => {
    try {
        const { groupId } = req.params;
        const messages = await Message.find({ roomId: groupId }).populate('userInfo', 'username');
        res.json(messages);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Find conversations| groups with two people
app.get('/findConversation/:user1/:user2', async (req, res) => {
    try {
        const { user1, user2 } = req.params;
        const user1Doc = await getUserFromUsername(user1);
        const user2Doc = await getUserFromUsername(user2);

        const room = await Room.findOne({
            $or: [
                { userIds: { $in: [user1Doc._id, user2Doc._id] } },
                { userIds: { $in: [user2Doc._id, user1Doc._id] } }
            ]
        });

        const messages = await Message.find({ roomId: room._id }).populate('userInfo', 'username');
        res.json(messages);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// if not create new conversation

// 5. Get Groups the current user is in
app.get('/getGroups/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await getUserFromUsername(username);

        const rooms = await Room.find({ users: user }).populate('users', 'username');
        res.json(rooms);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 3. Create Group
app.post('/createGroup', async (req, res) => {
    try {
        const { username, roomName } = req.body;
        const user = await getUserFromUsername(username);
        console.log(user)

        const newRoom = new Room({
            name: roomName,
            users: [user],
        });
        await newRoom.save();

        res.status(201).json({ roomId: newRoom._id });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
/**
 * Gets all groups
 */
app.get('/getAllGroups', async (req, res) => {
    try {
        const rooms = await Room.find().populate('users', 'username');
        res.json(rooms);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get All Users
app.get('/getUsers', async (req, res) => {
    try {
        const users = await User.find({}, 'username');
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 4. Send Message
app.post('/sendMessage', async (req, res) => {
    try {
        const { username, roomId, message } = req.body;
        const user = await getUserFromUsername(username);

        const newMessage = new Message({
            userInfo: user._id,
            roomId,
            message
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


module.exports = app;