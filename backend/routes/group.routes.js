const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controllers');


router.post("/create", groupController.createGroup);
router.post("/add-member", groupController.addUserToTeam);

module.exports = router;