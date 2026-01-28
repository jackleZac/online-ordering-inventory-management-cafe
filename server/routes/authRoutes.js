require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/authMiddleware');

// Import model schemas
const User = require('../model/userSchema');

// Defines routes to handle authentication
router.post('/register', async (req, res) => {
  // Receive user details
  const { 
    username,
    birthDate, 
    email, 
    phone, 
    password,
    isAdmin, 
  } = req.body;
  // Hash user password
  const hashpassword = await bcrypt.hash(password, 10);
  // Insert user details in MongoDB
  const registerUser = new User({ 
    username: username, 
    birthDate: birthDate,
    email: email, 
    phone: phone,
    password: hashpassword,
    isAdmin: isAdmin, 
  });
  await registerUser.save();
  // Send status to client
  res.status(200).json({ message: "Registration Success!"})
  
});

router.post('/login', async (req, res) => {
  console.log("Incoming request:", req.method, req.path);
  const { username, password } = req.body;
  // Check if user exists
  try {
    const user = await User.findOne({ username: username });
    if (!user) return res.status(400).json({error: "User Not Found"});

    // Check password validity
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({error: "Incorrect Password"});

    // Sign token
    const token = generateToken(user);

    // Send token as cookie
    res.cookie("access-token", token, {
      httpOnly: true,
      sameSite: "lax",
    });
    
    // Send status to client
    res.json({ 
      message: "Logged In", 
      id: user._id,
      username: user.username, 
      isAdmin: user.isAdmin 
    });

  } catch (err) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;