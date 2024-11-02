const orderService = require('../services/order.service');

const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const listOrder = async (req, res) => {
  try {
    const order = await orderService.getAllOrders(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 


const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const order = await orderService.getOrdersByUserId(userId);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Other functions like getAllOrders, getOrderById, updateOrder, deleteOrder

module.exports = { createOrder, listOrder, getMyOrders };
