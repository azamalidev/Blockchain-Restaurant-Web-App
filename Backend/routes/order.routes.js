const express = require('express');
const orderController = require('../controllers/order.controller');
const router = express.Router();

router.post('/', orderController.createOrder);
router.get('/list', orderController.listOrder);
router.get('/mine', orderController.getMyOrders);

// Other routes like getAllOrders, getOrderById, updateOrder, deleteOrder

module.exports = router;
