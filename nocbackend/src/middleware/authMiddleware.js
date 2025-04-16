const jwt = require("jsonwebtoken");

const extractEmail = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "mujtpc"); // Replace with your secret key
  req.token = token;
  req.email = decoded.email;
  req.role = decoded.role;
  next();
};

module.exports = { extractEmail };