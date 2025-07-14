const mongoose = require("mongoose");

// Enable strict query mode for MongoDB
mongoose.set("strictQuery", true);

/**
 * Connect to MongoDB using the provided connection URL.
 * @param {string} url - MongoDB connection string.
 * @returns {Promise<void>} - Resolves when the connection is successful.
 */
async function connectToMongoDB(url) {
  try {
    console.log("Attempting to connect to MongoDB with connection string...");
    
    // Connect to MongoDB with the connection string
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("Connected to MongoDB successfully");
    // The database will be created automatically when you first insert data
    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    console.error("Full error:", error);
    process.exit(1); // Exit process with failure
  }
}

module.exports = {
  connectToMongoDB,
};




/*const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
async function connectToMongoDB(url) {
  return mongoose.connect(url);
}

module.exports = {
  connectToMongoDB,
};
*/
