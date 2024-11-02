const cloudinary = require('cloudinary').v2;
const { config } = require('dotenv');
config(); // Ensure environment variables are loaded

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const uploadImage = async (image, folder) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: folder
    });
    return uploadResponse.secure_url
  } catch (error) {
    console.error('Error during Cloudinary upload:', error);
  }
};

module.exports = { uploadImage };

