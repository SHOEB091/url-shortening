const express = require("express");
const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
} = require("../controllers/url");
const { restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.post("/", restrictTo(['NORMAL', 'ADMIN']), handleGenerateNewShortURL);

router.get("/analytics/:shortId", restrictTo(['NORMAL', 'ADMIN']), handleGetAnalytics);

module.exports = router;
