const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API quản lý người dùng
 */

/**
 * @swagger
 * /api/v1/user/create:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Người dùng được tạo thành công
 *       400:
 *         description: Thiếu thông tin hoặc người dùng đã tồn tại
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token
 *       401:
 *         description: Sai email hoặc mật khẩu
 *       500:
 *         description: Lỗi server
 */

router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);
module.exports = router;