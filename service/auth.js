const jwt = require('jsonwebtoken');

const secret = "Shoeb$123@$"; // Use environment variables for security in production

// Generate JWT token
function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: "1d" } // Token expiration time
  );
}

// Decode and verify JWT token
function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
