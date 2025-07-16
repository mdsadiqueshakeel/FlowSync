require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app"); // Import the app we just modularized

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Fail the process in CI if DB fails
  });
