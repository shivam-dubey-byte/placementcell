const { createUser, findUserByEmail, comparePassword,findUserById, updatePassword } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { sendResetEmail } = require('../mail/resetMail');

// Profile image mapping based on the first letter of email
const profileImageLinks = {
    a: "https://i.imgur.com/829pqfV.jpg",
    b: "https://i.imgur.com/rnpqVhK.jpg",
    c: "https://i.imgur.com/KDmboxg.jpg",
    d: "https://i.imgur.com/6oTdEsH.jpg",
    e: "https://i.imgur.com/mC8nIrj.jpg",
    f: "https://i.imgur.com/wuL54zd.jpg",
    g: "https://i.imgur.com/6Bc7L3h.jpg",
    h: "https://i.imgur.com/dzGGWtD.jpg",
    i: "https://i.imgur.com/bfgkLdm.jpg",
    j: "https://i.imgur.com/UNwFW7J.jpg",
    k: "https://i.imgur.com/p250FFA.jpg",
    l: "https://i.imgur.com/undefined.jpg",
    m: "https://i.imgur.com/7z2t4m5.jpg",
    n: "https://i.imgur.com/E1FqdIT.jpg",
    o: "https://i.imgur.com/lTdf4pZ.jpg",
    p: "https://i.imgur.com/YWIpqnV.jpg",
    q: "https://i.imgur.com/OwyQilG.jpg",
    r: "https://i.imgur.com/d7C0di.jpg",
    s: "https://i.imgur.com/undefin.jpged",
    t: "https://i.imgur.com/MKzutOv.jpg",
    u: "https://i.imgur.com/jZ0zoqK.jpg",
    v: "https://i.imgur.com/H6og9ez.jpg",
    w: "https://i.imgur.com/lpC7Ghr.jpg",
    x: "https://i.imgur.com/lWZMLyq.jpg",
    y: "https://i.imgur.com/undefined.jpg",
    z: "https://i.imgur.com/undefined.jpg"
};

// User Signup
const signup = async (req, res) => {
  try {
    const { name,email, password,role="student" } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const firstLetter = email.charAt(0).toLowerCase();
    const profileImage = profileImageLinks[firstLetter] || "https://i.imgur.com/default.jpg";

    // Create new user
    const userId = await createUser(name,email, password,role,profileImage);
    res.status(201).json({ message: 'User signed up successfully', userId });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in DB
    const users = await findUserByEmail(email);
    if (!users) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await comparePassword(password, users.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: users._id, email: users.email,name: users.name,role: users.role }, 'mujtpc', {
      expiresIn: '1h',
    });//process.env.JWT_SECRET

    // Assign default profile image if not present in DB
    let profileImage = users.profile || profileImageLinks[email[0].toLowerCase()] || "https://i.imgur.com/default.jpg";

    res.status(200).json({ message: 'Login successful', token,profileImage });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Forgot Password Controller
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
      // Check if the user exists
      const user = await findUserByEmail(email);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Generate a reset token
      const resetToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {expiresIn: '1h',});

      // Save the reset token and expiration in the database
      //user.resetPasswordToken = resetToken;
      //user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      //await user.save();

      // Send the reset token via email
      const resetUrl = `https://knowledgesun.quantumsoftdev.in/reset-password/${resetToken}`;
      await sendResetEmail(user.email, resetUrl);

      res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

// Reset Password Controller
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    console.log(token);
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      const {id,email,iat,exp} = decoded;

      // Find the user
      const user = await findUserByEmail(email);
      console.log(user);

      if (!user) {
          return res.status(400).json({ message: 'Invalid or expired token' });
      }
      await updatePassword(user._id,newPassword );
      res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { signup, login, forgotPassword, resetPassword};
