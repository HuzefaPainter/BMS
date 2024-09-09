const router= require('express').Router();
const User = require('../models/userModel.js');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
 

async function loginUser (request, response) {
 try{
        const user = await User.findOne({email: request.body.email});

        if (!user){
            response.status(401).send ({
                success: false,
                message: "User does not exists."
            });
            return;
        }
        const validPassword = await bcrypt.compare(request.body.password, user.password);

        if (!validPassword){
          response.status(401).send({
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

module.exports = loginUser;