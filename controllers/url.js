const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const shortID = shortid.generate();

    await URL.create({
      shortId: shortID,
      redirectURL: url,
      visitHistory: [],
      createdBy: req.user._id,
    });

    const userUrls = await URL.find({ createdBy: req.user._id });

    return res.render("home", {
      id: shortID, // Pass the generated short ID
      urls: userUrls, // Pass the user's URLs
    });
  } catch (error) {
    console.error("Error generating short URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  try {
    const url = await URL.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    return res.json({
      totalClicks: url.visitHistory.length,
      visitHistory: url.visitHistory,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};