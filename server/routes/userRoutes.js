const router= require('express').Router();
const User = require('../models/userModel.js');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const authMiddleware = require("../middlewares/authMiddleware.js");
const loginUser = require('../controllers/loginController.jsx');
const registerUser = require('../controllers/registerController.jsx');
const getUser = require('../controllers/getUserController.jsx');

router.post("/register", registerUser)
    
router.post("/login", loginUser)
   
router.get("/get-current-user", authMiddleware, getUser)
    

module.exports = router;