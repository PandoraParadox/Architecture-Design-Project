const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comments.controllers');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API quản lý bình luận cho task
 */

/**
 * @swagger
 * /api/v1/comment/create:
 *   post:
 *     summary: Tạo bình luận mới cho một task
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task_id
 *               - team_member_id
 *               - content
 *             properties:
 *               task_id:
 *                 type: integer
 *               team_member_id:
 *                 type: integer
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bình luận đã được tạo thành công
 *       400:
 *         description: Thiếu trường bắt buộc
 *       404:
 *         description: Không tìm thấy task hoặc thành viên
 *       500:
 *         description: Lỗi server
 */


router.post("/create", commentController.createComment);

module.exports = router;