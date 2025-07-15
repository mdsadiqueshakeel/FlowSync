const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

router.get("/dashboard", auth(["Admin"]), (req, res) => {
  res.json({
    message: "Welcome to the Admin dashboard!",
    user: req.user
  });
});

module.exports = router;
