const express = require("express");
const { registerUser, loginUser, getUser } = require("../controllers/user.controller");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create-account", registerUser);

router.post("/login", loginUser);

router.get("/get-user", authenticateToken, getUser);
 
module.exports = router;