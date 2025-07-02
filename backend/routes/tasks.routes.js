const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasks.controllers')
const { verifyToken } = require('../middleware/auth')
/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API quản lý công việc
 */

/**
 * @swagger
 * /api/v1/task/create:
 *   post:
 *     summary: Tạo task mới
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team_id
 *               - created_by_team_member_id
 *               - title
 *               - due_date
 *             properties:
 *               team_id:
 *                 type: integer
 *               created_by_team_member_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Tạo task thành công
 *       400:
 *         description: Thiếu trường bắt buộc
 */

/**
 * @swagger
 * /api/v1/task/assign:
 *   post:
 *     summary: Giao task cho thành viên
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task_id
 *               - team_member_id
 *             properties:
 *               task_id:
 *                 type: integer
 *               team_member_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Giao task thành công
 *       400:
 *         description: Thiếu task_id hoặc team_member_id
 *       409:
 *         description: Task đã được giao
 */

/**
 * @swagger
 * /api/v1/task/accept:
 *   post:
 *     summary: Thành viên nhận task được giao
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task_id
 *               - team_member_id
 *             properties:
 *               task_id:
 *                 type: integer
 *               team_member_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Nhận task thành công
 *       404:
 *         description: Không tìm thấy assignment
 */

/**
 * @swagger
 * /api/v1/task/{id}:
 *   get:
 *     summary: Lấy chi tiết task theo ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của task
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trả về chi tiết task, người tạo, người nhận và comment
 *       404:
 *         description: Không tìm thấy task
 */

/**
 * @swagger
 * /api/v1/task/{id}/complete:
 *   patch:
 *     summary: Đánh dấu task là hoàn thành
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của task
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã hoàn thành task
 *       404:
 *         description: Không tìm thấy task
 */

/**
 * @swagger
 * /api/v1/task/{id}:
 *   delete:
 *     summary: Xóa task theo ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của task
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task đã bị xóa
 *       404:
 *         description: Không tìm thấy task
 */

router.post("/create", taskController.createTask);
router.post('/accept', taskController.acceptTask);
router.post('/assign', verifyToken, taskController.assignTask);
router.get('/:id', verifyToken, taskController.getTaskDetail);
router.patch('/:id/complete', verifyToken, taskController.completeTask);
router.delete('/:id', verifyToken, taskController.deleteTask);

module.exports = router;