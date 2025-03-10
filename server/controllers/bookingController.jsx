const crypto = require('crypto');
const router = require('express').Router();
const Booking = require('../models/bookingModel');
const Transaction = require('../models/transactionModel');
const Show = require('../models/showModel');
const mongoose = require("mongoose");
const PAYU_KEY = process.env.payu_key;
const PAYU_SALT = process.env.payu_salt;
const ngrock_url = process.env.ngrock_domain;
const frontend_url = process.env.frontend_domain;
const {v4: uuidv4} = require('uuid');

async function bookShow(request, response) {
    const session = await mongoose.startSession();
    const {seats, user, show} = request.body;

    session.startTransaction();

    try {

        // Step 1: Fetch and lock the show for seat validation

        const showData = await Show.findById(request.body.show).populate("movie");
        if (request.body.seats.some(seat => showData.bookedSeats.includes(seat))) {
            throw new Error("One or more selected seats are already booked. Please try again.");
        }
        const show = request.body.show
        // Step 2: Reserve seats and create a pending booking
        const newBookingData = {user, show, seats, transactionId: generateTransactionId(), status: "pending"}
        console.log("newBookingData", newBookingData)
        const newBooking = new Booking(newBookingData);
        console.log("newBooking", newBooking);
        if (!newBooking){
            throw (new Error("Something went wrong while new booking, please try again"));
        }

        const savedBooking = await newBooking.save();
        console.log("Booking saved successfully:", savedBooking);
        if(!savedBooking){
            throw(new Error("Error saving booking"))
        }        

        const updatedBookedSeats = [...showData.bookedSeats, ...request.body.seats];
        if(!updatedBookedSeats){
                throw (new Error("Something went wrong while updating seats, please try again"));
        }
        const showUpdateStatus = await Show.findByIdAndUpdate(request.body.show, {bookedSeats: updatedBookedSeats})

        if(!showUpdateStatus)
            {
                throw (new Error("Something went wrong while updating show, please try again"));
            }

        const populateBooking = await Booking.findById(savedBooking._id)
            .populate("user")
            .populate("show")
            .populate({ path: "show", populate: { path: "movie", model: "movies" } })
            .populate({ path: "show", populate: { path: "theatre", model: "theatres" } })
            

         if (!populateBooking) {
                throw (new Error("Something went wrong while booking show, please try again"));
            }

        generatePaymentData(request.body);
        const paymentResponse = generatePaymentData(request.body);

        await session.commitTransaction(); // Commit partial success
        session.endSession();

        response.send({
            success: true,
            message: "Booking initiated. Proceed to payment.",
            data: {
                booking: populateBooking,
                paymentResponse: paymentResponse
            },
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        response.status(500).send({
            success: false,
            message: error.message,
        });
    }
}

function generatePaymentData(payload){
    try {
        const txnid = generateTransactionId() ; // Use booking ID as transaction ID
        const {amount, productInfo, email, firstname} = payload;
        const hashString = `${PAYU_KEY}|${txnid}|${amount}|${productInfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;
        const hash = crypto.createHash("sha512").update(hashString).digest("hex");

       return {
            key: PAYU_KEY,
            txnid,
            amount,
            productinfo: productInfo,
            firstname,
            email,
            phone: "1234567890", // Example
            surl: `${ngrock_url}/payment-success`, // Success callback
            furl: `${ngrock_url}/payment-failure`, // Failure callback
            hash,
        };
        } 
    catch (error) {
        console.log("Error in payment", error.message);
    }
}

function generateTransactionId(){
    try {
        return uuidv4();
    } catch (error) {
        console.log("Error in generating transaction id", error.message)
    }
}

async function paymentSuccess(req, res) {
    try {
        const {txnid, status, amount } = req.body;

        const updateBookingStatus = await Booking.findByIdAndUpdate(req.body._id,{status : "confirmed"} );
        console.log(`Booking ${req.body._id} updated`);

        if (!updateBookingStatus) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({
            success: true,
            message: "Payment successful. Booking confirmed!",
            booking: updateBookingStatus,
        });

        // Redirect user to frontend with transaction details
        res.redirect(`${frontend_url}/payment-success?txnid=${txnid}&status=${status}&amount=${amount}`);
    } catch (error) {
        console.error("Error handling payment success:", error.message);
        res.redirect(`${frontend_url}/payment-failure`);
    }
}

async function paymentFailure(req, res) {
    try {
        const { txnid } = req.body;

        // Delete the failed booking
        await Booking.findByIdAndDelete(txnid);
        console.log(`Booking ${txnid} deleted due to payment failure`);

        const updateBookingStatus = await Booking.findByIdAndUpdate(req.body._id,{status : "failed"} );
        if (!updateBookingStatus) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({
            success: false,
            message: "Payment failed. Booking has been removed.",
            booking: updateBookingStatus
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong while processing payment failure." });
    }
}

module.exports = { bookShow, paymentSuccess, paymentFailure };
