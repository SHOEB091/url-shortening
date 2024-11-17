const User = require("../models/user");
const { setUser } = require("../service/auth");

// Handle user signup
async function handleUserSignup(req, res) {
  const { name, email, password, username } = req.body; // Include username here
  try {
    const user = await User.create({
      name,
      email,
      password,
      username, // Pass username to the User.create method
      role: "NORMAL", // Default role
    });

    const token = setUser(user);
    res.cookie("token", token, { httpOnly: true });

    return res.redirect("/");
  } catch (err) {
    console.error("Error during user signup:", err);
    return res.status(500).render("signup", { error: "Failed to register user" });
  }
}

async function handleUserLogout(req, res) {
  try {
    // Clear the authentication cookie
    res.clearCookie("token");
    return res.redirect("/login"); // Redirect to the login page
  } catch (err) {
    console.error("Error during logout:", err);
    return res.status(500).send("Failed to log out");
  }
}

// Handle user login
async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.render("login", {
        error: "Invalid email or password",
      });
    }

    const token = setUser(user);
    res.cookie("token", token, { httpOnly: true });
    return res.redirect("/");
  } catch (err) {
    console.error("Error during user login:", err);
    return res.status(500).render("login", { error: "Failed to login user" });
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout
};