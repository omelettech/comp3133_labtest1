const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        name:String,
        users: [
            // all members of the room
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        ],

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Room', schema);