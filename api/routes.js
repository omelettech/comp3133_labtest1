const express = require('express');

const router = express.Router();

const authRoutes = require('./controllers/authController');
const chatRoutes = require('./controllers/chatController');
const socketRoutes = require('./controllers/SocketController');


router.get('/', async (req, res) => {
    res.status(200).json({
        title: 'Express Testing',
        message: 'The app is working properly!',
        users: `${req.protocol}://${req.get('host')}${req.originalUrl}users`
    });
});
// const baseRoutes = require('./controllers/base.ontroller');
// router.use('/api', baseRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/chat', chatRoutes);

module.exports = router;