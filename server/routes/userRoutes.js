const userRouter= require('express').Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const {
    getUser,
    loginUser,
    registerUser,
    bookingConfirmed  
  } = require("../controllers/userController.jsx");

userRouter.post("/register", registerUser)
    
userRouter.post("/login", loginUser)

userRouter.post("/booking-confirmed", bookingConfirmed)
   
userRouter.get("/get-current-user", authMiddleware, getUser)
    

module.exports = userRouter;