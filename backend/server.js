const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const path = require('path');
const http = require('http');
const pool = require('./config/db');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.use(cors());
app.use(express.json());
const userRoutes = require('./routes/user.routes');
const groupRoutes = require('./routes/group.routes');
const taskRoutes = require('./routes/tasks.routes');
const commentRoutes = require('./routes/comments.routes');
const notificationRoutes = require('./routes/notifications.routes');

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/task', taskRoutes);
app.use('/api/v1/group', groupRoutes);
app.use('/api/v1/comment', commentRoutes);
app.use('/api/v1/notification', notificationRoutes);


const PORT = 5000

wss.on('connection', (ws) => {
    console.log('Client connected');
})
server.listen(PORT, () => {
    console.log(`Server is runnning on port ${PORT}`)
})