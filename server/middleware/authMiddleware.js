require('dotenv').config();
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin
      }, 
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    )
    return accessToken;
};

const verifyToken = (req, res, next) => {
  const token = req.cookies['access-token'];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      next();
  } catch(err) {
      return res.status(401).json({error: 'Invalid or Expired Token'});
  }
};

// Admin-only middleware
const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

module.exports = { generateToken, verifyToken, requireAdmin };