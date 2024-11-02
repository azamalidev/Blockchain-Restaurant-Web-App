const express = require('express');
const foodController = require('../controllers/food.controller');
const router = express.Router();
const upload = require('../config/cloudinary'); 

router.post('/', foodController.createFood);
router.get('/', foodController.getAllFood);

// Other routes like getFoodById, updateFood, deleteFood

module.exports = router;
