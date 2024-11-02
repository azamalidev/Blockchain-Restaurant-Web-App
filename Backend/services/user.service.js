const User = require('../models/user.model');

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const getAllUsers = async () => {
  return await User.find();
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const userLogin = async (body) => {
  return await User.findOne({ email: body.email, password: body.password });
};

const updateUser = async (id, userData) => {
  return await User.findByIdAndUpdate(id, userData, { new: true });
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  userLogin,
};
