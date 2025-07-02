const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notifications.controllers')

router.post("/create", notificationController.createNotification);

module.exports = router;