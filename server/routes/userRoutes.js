const userRouter= require('express').Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const {
    getUser,
    loginUser,
    registerUser,
  } = require("../controllers/userController.jsx");

userRouter.post("/register", registerUser)
    
userRouter.post("/login", loginUser)
   
userRouter.get("/get-current-user", authMiddleware, getUser)
    

module.exports = userRouter;