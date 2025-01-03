const Order = require('../models/order.model');
const mongoose = require('mongoose');

const createOrder = async (orderData) => {
  let userId = new mongoose.Types.ObjectId(orderData?.user);
  let foodId = new mongoose.Types.ObjectId(orderData?.food);
  orderData['food'] = foodId;
  orderData['user'] = userId;
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
  try {
    // Convert userId to ObjectId
    let id = await new mongoose.Types.ObjectId(userId);

    const orders = await Order.aggregate([
      { $match: { user: id } },  // Match orders for the specified user
      {
        $lookup: {
          from: 'foods',         // Name of the Food collection
          localField: 'food',    // Field in the Order collection
          foreignField: '_id',   // Field in the Food collection
          as: 'foodDetails'      // Alias for the populated food details
        }
      },
      { $unwind: '$food' },    // Unwind food details (optional if each order has multiple food items)
    ]);

    return orders;

  } catch (error) {
    console.error('Error retrieving orders:', error);
    throw error; // Handle or throw error as needed
  }
};

const updateOrder = async (id, orderData) => {
  return await Order.findByIdAndUpdate(id, orderData, { new: true });
};

const deleteOrder = async (id) => {
  return await Order.findByIdAndDelete(id);
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
};
