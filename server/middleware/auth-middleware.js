const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ message: "Authorization token is missing." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const user = await User.findById(decoded._id).select("_id name email"); 

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user; 
    next(); 
  } catch (error) {
    res.status(401).json({ message: "Authentication failed.", error: error.message });
  }
};

module.exports = authMiddleware;

