const mongoose = require("mongoose").default;
const express = require("express");
const { createServer } = require("http");
// const routes = require('./routes');  // Use the path correctly here
const routes = require("./routes");  // Ensure it's correctly pointing to the actual file
const dotenv = require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(r => console.log('Connected to MongoDB...')).catch(e => console.error(e))

console.log("Starting server")
// Middleware
const app = express();
app.use(express.json());
const server = createServer(app);
server.listen(process.env.PORT)
app.use('/', routes);

module.exports=app



