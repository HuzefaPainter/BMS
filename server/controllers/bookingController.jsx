const crypto = require('crypto');
const router = require('express').Router();
const Booking = require('../models/bookingModel');
const Show = require('../models/showModel');
const PAYU_KEY = process.env.payu_key;
const PAYU_SALT = process.env.payu_salt;

async function makePayment(request, response) {
    try {
        const { email, amount } = request.body;
        // const hashString = `${PAYU_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;
        const hashString = `${PAYU_KEY} |${amount}|${email}|||||||||||${PAYU_SALT}`;
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');
        response.json({ 
            key: PAYU_KEY,
            // txnid: txnid,
            amount: amount,
            email: email,
            hash: hash,
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({
            success: false,
            message: "Something went wrong"
        });
    }
}

async function bookShow(request, response) {
    try {
        const newBooking = new Booking(request.body);
        await newBooking.save();
        const show = await Show.findById(request.body.show).populate("movie");
        const updatedBookedSeats = [...show.bookedSeats, ...request.body.seats];
        await Show.findByIdAndUpdate(request.body.show, {
            bookedSeats: updatedBookedSeats,
        })

        const populateBooking = await Booking.findById(newBooking._id)
            .populate("user").populate("show").populate({ path: "show", populate: { path: "movie", model: "movies" } }).populate({ path: "show", populate: { path: "theatre", model: "theatres" } })

        if (populateBooking) {
            response.send({
                success: "true",
                message: "Show booked successfully",
                data: newBooking,
            })
        }
        else{
            console.log(response.message, "Error in booking show")
        }

    } catch (error) {
        console.log(error.message);
        response.status(500).send({
            success: false,
            message: "Something went wrong"
        })
    }
}

module.exports = { makePayment, bookShow }