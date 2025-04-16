const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });
  console.log(token);

  try {
    const decoded = jwt.verify(token, "mujtpc"); // use your actual secret
    req.user = {
      email: decoded.email,
      role: decoded.role,
      name: decoded.name
    };
    console.log(req.user);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

/*
const jwt = require("jsonwebtoken");

const extractEmail = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, "mujtpc"); // hardcoded JWT_SECRET
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { extractEmail };*/