const Order = require('../models/order.model');
const mongoose = require('mongoose');
const createOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

const getAllOrders = async () => {
  return await Order.find().populate('user').populate('food');
};

const getOrderById = async (id) => {
  return await Order.findById(id).populate('user').populate('food');
};
const getOrdersByUserId = async (userId) => {
  let id = new mongoose.Types.ObjectId(userId)
  return await Order.find({ user: id }).populate('user').populate('food');
};

const updateOrder = async (id, orderData) => {
  return await Order.findByIdAndUpdate(id, orderData, { new: true });
};

const deleteOrder = async (id) => {
  return await Order.findByIdAndDelete(id);
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, getOrdersByUserId };
