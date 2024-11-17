const { getUser } = require("../service/auth");

// Middleware to authenticate users
function checkForAuthentication(req, res, next) {
  const tokenCookie = req.cookies?.token;
  req.user = null;

  if (!tokenCookie) return next();

  const user = getUser(tokenCookie);
  if (user) req.user = user;

  return next();
}

// Middleware to restrict routes to specific roles
function restrictTo(roles) {
  return (req, res, next) => {
    if (!req.user) return res.redirect("/login");
    if (!roles.includes(req.user.role)) return res.status(403).send("Unauthorized");
    next();
  };
}

function authenticateUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    next(); // Proceed to the next middleware/route
  } catch (err) {
    console.error("Invalid token:", err);
    return res.redirect("/login");
  }
}


module.exports = {
  checkForAuthentication,
  restrictTo,
  authenticateUser
};
