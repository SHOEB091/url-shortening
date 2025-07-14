const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { connectToMongoDB } = require("./connect");
const { checkForAuthentication, restrictTo } = require("./middlewares/auth");
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using the environment variable
connectToMongoDB(process.env.MONGO).then(() =>
  console.log("MongoDB connected")
);

// Set up the view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Apply authentication middleware globally
app.use(checkForAuthentication);

// Routes
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

// URL redirection routes
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );

    if (entry) {
      res.redirect(entry.redirectURL);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (error) {
    console.error("Error during redirection:", error);
    res.status(500).send("Internal server error");
  }
});

// New shorter URL redirection route (without /url/ prefix)
app.get("/:shortId", async (req, res, next) => {
  const shortId = req.params.shortId;
  
  // Skip this route for known paths
  if (["url", "user", "admin", "login", "signup"].includes(shortId)) {
    return next();
  }
  
  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );

    if (entry) {
      res.redirect(entry.redirectURL);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (error) {
    console.error("Error during redirection:", error);
    res.status(500).send("Internal server error");
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));