const foodService = require('../services/food.service');
const upload = require('../config/cloudinary');
const createFood = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    let formattedImage = image;
    if (image && !image.startsWith('data:image/')) {
      // Determine image type (e.g., JPEG or PNG) and add the appropriate prefix
      const imageType = 'jpeg'; // You may need to determine this dynamically
      formattedImage = `data:image/${imageType};base64,${image}`;
    }
    // Upload the Base64 image to Cloudinary
    let imageUrl = '';
    if (image) {
      try {
        const url = await upload.uploadImage(formattedImage, 'food_pictures');
        console.log('Cloudinary response:', url);
        imageUrl = url
      } catch (error) {
        console.error('Error during Cloudinary upload:', error);
      }
    }
    console.log(imageUrl, 'imageUrl');
    // Save food item with image URL
    const foodData = {
      name,
      price,
      description,
      image: imageUrl,
    };

    const newFood = await foodService.createFood(foodData);
    res.status(201).json(newFood);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllFood = async (req, res) => {
  try {
    const food = await foodService.getAllFood();
    res.json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Other functions like getFoodById, updateFood, deleteFood

module.exports = { createFood, getAllFood };
