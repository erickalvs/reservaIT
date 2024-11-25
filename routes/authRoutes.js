const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/login", authController.showLoginForm);

module.exports = router;
