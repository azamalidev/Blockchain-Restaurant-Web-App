const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

router.post('/', userController.createUser);
router.post('/login', userController.login);

// Other routes like getAllUsers, getUserById, updateUser, deleteUser

module.exports = router;
