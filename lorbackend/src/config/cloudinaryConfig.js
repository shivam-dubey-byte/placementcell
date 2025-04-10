const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: 'dw2vai9yn',
    api_key: '591298414525489',
    api_secret: 'CHMdW_Eefqa4FR7mnu7lQTz33u8',
});

module.exports = cloudinary;
