const express = require("express");
const URL = require("../models/url");
const { restrictTo } = require("../middlewares/auth");

const router = express.Router();

// Admin view all URLs
router.get('/admin/urls', restrictTo(['ADMIN']), async (req, res) => {
  const allUrls = await URL.find({});
  // Pass the base URL from environment variables
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  return res.render("home", {
    urls: allUrls,
    id: null, // Pass a default value for id
    baseUrl: baseUrl // Pass the base URL
  });
});

// Normal user view their own URLs
router.get("/", restrictTo(['NORMAL', 'ADMIN']), async (req, res) => {
  const userUrls = await URL.find({ createdBy: req.user._id });
  // Pass the base URL from environment variables
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  return res.render("home", {
    urls: userUrls,
    id: null, // Pass a default value for id
    baseUrl: baseUrl // Pass the base URL
  });
});

// Signup page
router.get("/signup", (req, res) => {
  return res.render("signup", { error: null });
});

// Login page
router.get("/login", (req, res) => {
  return res.render("login", { error: null });
});

module.exports = router;




