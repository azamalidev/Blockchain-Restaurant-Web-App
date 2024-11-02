const userService = require('../services/user.service');

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await userService.userLogin(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Other functions like getAllUsers, getUserById, updateUser, deleteUser

module.exports = { createUser , login };
