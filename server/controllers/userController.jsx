const router= require('express').Router();
const User = require('../models/userModel.js');
const authMiddleware = require("../middlewares/authMiddleware.js");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");


async function getUser(request,response) {
try {
    const user = await User.findById(request.body.userId).select("-password");
    response.send({
        success: true,
        message: "User details fetched successfully",
        data: user
    });
} catch (error) {
    response.status(500).send({
        success:false,
        message: "Something went wrong"
    });
}
}

async function bookingConfirmed(request,response) {
try {
    const user = await User.findById(request.body.userId).select("-password");
    response.send({
        success: true,
        message: "User details fetched successfully",
        data: user
    });
} catch (error) {
    response.status(500).send({
        success:false,
        message: "Something went wrong"
    });
}}

async function loginUser (request, response) {
 try{
        const user = await User.findOne({email: request.body.email});
        if (!user){
            response.status(404).send({
                success: false,
                message: "User does not exists."
            });
            return;
        }
        const validPassword = await bcrypt.compare(request.body.password, user.password);
        if (!validPassword){
          response.status(404).send({
            success: false,
            message: "Invalid Credentials.",
          });
          return;   
        }

        const token = jwt.sign({userId: user._id, emailId: user.email}, process.env.jwt_secret, {expiresIn: "1d"});
        response.status(200).send({
            success: true,
            message: "Login successful",
            data: token
        });
    }
        catch(err){
            console.error(err);
            response.status(500).send ({
            success: false,
            message: "Something went wrong. Please try again in sometime."
        });
    }
};


async function registerUser (request, response) {
    try{
            const userExists = await User.findOne({email: request.body.email});
    
            if (userExists){
                response.status(403).send ({
                    success: false,
                    message: "User already exists."
                });
                return;
            }
    
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(request.body.password, salt);
            request.body.password = hashedPassword;
    
            const newUser = new User(request.body);
            await newUser.save();
    
            response.status(200).send({
                success: true,
                message: "User created successfully. Please Login"
            })
        }catch (err) {
            console.error(err);
            response.status(500).send ({
                success: false,
                message: "Something went wrong. Please try again in sometime."
            });
        };
    }
    
module.exports = {getUser, loginUser, registerUser, bookingConfirmed};