const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const {login} = require("../controllers/userAuth");

const User = require("../models/User");

router.post("/login", login)

module.exports = router;
