const express = require('express');
const User = require('../models/User');
const bcrypt = require("bcrypt");
const app = express.Router();

app.post("/signup", async (req, res) => {
    const {name,username, password} = req.body
    if (!(username && password && name)) {
        //Checks if all 3 fields are filled
        return res.status(400).json({message: 'username must be unique AND all 3 fields required'});

    }
    try {
        if (await User.findOne({username})) {
            return res.status(409).json({message: 'User with this username already exists.'});
        } else {
            const newUser = new User({name,username, password})
            await newUser.save();
            return res.status(201).json({message: 'User created successfully!'});
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: "Error creating user"})
    }
})

app.post('/login', async (req, res) => {
    const {username, password} = req.body
    if (!(username && password)) {
        //Checks if all 3 fields are filled
        return res.status(400).json({message: 'all fields required'});
    }
    try {
        const user = await User.findOne({username});
        if (!user) {
            return res.status(401).json({message: 'User doesnt exist.'});
        }
        if (!(await bcrypt.compare(password, user.password))) {
            //match password with database pass
            return res.status(401).json({message: 'Invalid username or password.'});
        }
        // If login is successful
        return res.status(200).json({message: 'Login successful!',userInfo:user});

    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({message: 'Internal server error.'});
    }
})
module.exports = app