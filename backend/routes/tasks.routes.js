const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasks.controllers')
const { verifyToken } = require('../middleware/auth')
router.post("/create", taskController.createTask);
router.post('/accept', taskController.acceptTask);
router.post('/assign', verifyToken, taskController.assignTask);
router.get('/:id', verifyToken, taskController.getTaskDetail);
router.patch('/:id/complete', verifyToken, taskController.completeTask);
router.delete('/:id', verifyToken, taskController.deleteTask);

module.exports = router;