const Food = require('../models/food.model');

const createFood = async (foodData) => {
  const food = new Food(foodData);
  return await food.save();
};

const getAllFood = async () => {
  return await Food.find();
};

const getFoodById = async (id) => {
  return await Food.findById(id);
};

const updateFood = async (id, foodData) => {
  return await Food.findByIdAndUpdate(id, foodData, { new: true });
};

const deleteFood = async (id) => {
  return await Food.findByIdAndDelete(id);
};

module.exports = { createFood, getAllFood, getFoodById, updateFood, deleteFood };
