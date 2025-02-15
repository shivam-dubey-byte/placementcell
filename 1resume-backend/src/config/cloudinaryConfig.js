const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: 'dny7yaqfc', // Your Cloudinary cloud name
  api_key: '753531425513564', // Your Cloudinary API key
  api_secret: '0HfGEgcaBrVaV14rq2P0yLnFIak', // Your Cloudinary API secret
  
});

module.exports = cloudinary;