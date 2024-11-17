const express = require("express");
const URL = require("../models/url");
const { restrictTo } = require("../middlewares/auth");

const router = express.Router();

// Admin view all URLs
router.get('/admin/urls', restrictTo(['ADMIN']), async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", {
    urls: allUrls,
    id: null, // Pass a default value for id
  });
});

// Normal user view their own URLs
router.get("/", restrictTo(['NORMAL', 'ADMIN']), async (req, res) => {
  const userUrls = await URL.find({ createdBy: req.user._id });
  return res.render("home", {
    urls: userUrls,
    id: null, // Pass a default value for id
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




