const userRouter= require('express').Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const loginUser = require('../controllers/loginController.jsx');
const registerUser = require('../controllers/registerController.jsx');
const getUser = require('../controllers/getUserController.jsx');

userRouter.post("/register", registerUser)
    
userRouter.post("/login", loginUser)
   
userRouter.get("/get-current-user", authMiddleware, getUser)
    

module.exports = userRouter;