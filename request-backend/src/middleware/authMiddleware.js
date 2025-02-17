const jwt = require("jsonwebtoken");

const extractEmail = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  const decoded = jwt.verify(token, "mujtpc"); // Replace with your secret key
  console.log(decoded);
  console.log(decoded.email);
  req.email = decoded.email;
  console.log(req.email);
  next();
};

module.exports = { extractEmail };