const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hackathon_secret_super_secure';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expect "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ error: 'A token is required for authentication' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Token' });
  }
  return next();
};

const verifyVendor = (req, res, next) => {
  if (req.user?.role !== 'vendor') {
    return res.status(403).json({ error: 'Require Vendor Role!' });
  }
  next();
};

module.exports = { verifyToken, verifyVendor, JWT_SECRET };
