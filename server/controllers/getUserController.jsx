const router= require('express').Router();
const User = require('../models/userModel.js');
const authMiddleware = require("../middlewares/authMiddleware.js");

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

module.exports = getUser;
