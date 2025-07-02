const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controllers');

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: API quản lý nhóm (teams)
 */

/**
 * @swagger
 * /api/v1/group/create:
 *   post:
 *     summary: Tạo nhóm mới
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo nhóm thành công
 *       400:
 *         description: Thiếu tên nhóm
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/v1/group/add-member:
 *   post:
 *     summary: Thêm thành viên vào nhóm
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team_id
 *               - user_id
 *               - role
 *             properties:
 *               team_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               role:
 *                 type: string
 *                 enum: [admin, member]
 *     responses:
 *       201:
 *         description: Thêm thành viên thành công
 *       400:
 *         description: Thiếu thông tin hoặc định dạng không hợp lệ
 *       409:
 *         description: Thành viên đã tồn tại trong nhóm
 *       500:
 *         description: Lỗi server
 */


router.post("/create", groupController.createGroup);
router.post("/add-member", groupController.addUserToTeam);

module.exports = router;