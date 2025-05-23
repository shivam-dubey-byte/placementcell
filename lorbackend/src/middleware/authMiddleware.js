const jwt = require("jsonwebtoken");

const extractEmail = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "mujtpc"); // Replace with your secret key
  req.email = decoded.email;
  req.role = decoded.role;
  req.token = token;
  next();
};

module.exports = { extractEmail };