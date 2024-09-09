const router= require('express').Router();
const User = require('../models/userModel.js');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

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

module.exports = registerUser;