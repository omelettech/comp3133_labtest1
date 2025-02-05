const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema(
    {
        name: String,
        username: String,
        password: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {type: Date, default: Date.now},

    },
    {
        timestamps: true
    }
);

schema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        // Hash the password with salt
        this.password = await bcrypt.hash(this.password, salt);
        this.updatedAt = Date.now();
        next();
    } catch (err) {
        next(err);
    }
});


// hide password from response
schema.methods.toJSON = function test() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', schema);