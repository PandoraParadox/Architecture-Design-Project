const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const path = require('path');
const http = require('http');
const pool = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const swaggerJsDoc = require("swagger-jsdoc");
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

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Quản lý công việc API",
            version: "1.0.0",
            description: "API cho ứng dụng quản lý công việc nhóm",
        },
        servers: [{ url: "http://localhost:5000" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/task', taskRoutes);
app.use('/api/v1/group', groupRoutes);
app.use('/api/v1/comment', commentRoutes);
app.use('/api/v1/notification', notificationRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});



const PORT = 5000

wss.on('connection', (ws) => {
    console.log('Client connected');
})
server.listen(PORT, () => {
    console.log(`Server is runnning on port ${PORT}`)
})