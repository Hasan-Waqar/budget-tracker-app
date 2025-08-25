const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

console.log("Cloudinary Config - API Key:", process.env.CLOUDINARY_API_KEY);
// Configure the Cloudinary SDK with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "budget-tracker-pfps", // This will create a folder in your Cloudinary account
    allowed_formats: ["jpeg", "png", "jpg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional: resize images on upload
  },
});

module.exports = storage;
