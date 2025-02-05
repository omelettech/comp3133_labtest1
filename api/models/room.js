const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        users: [
            // all members of the room
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        ],
        lastMessage: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Room', schema);