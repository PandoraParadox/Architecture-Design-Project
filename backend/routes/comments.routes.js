const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comments.controllers');


router.post("/create", commentController.createComment);

module.exports = router;