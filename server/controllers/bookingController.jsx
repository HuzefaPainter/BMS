const crypto = require('crypto');
const router = require('express').Router();
const Booking = require('../models/bookingModel');
const Transaction = require('../models/transactionModel');
const Show = require('../models/showModel');
const mongoose = require("mongoose");
const PAYU_KEY = process.env.payu_key;
const PAYU_SALT = process.env.payu_salt;
const ngrock_url = process.env.ngrok_domain;
const frontend_url = process.env.frontend_domain;
const {v4: uuidv4} = require('uuid');

async function bookShow(request, response) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { seats, user, show, amount, productInfo, firstname, email } = request.body;

    // Step 1 — validate seats
    const showData = await Show.findById(show).populate("movie");
    if (seats.some(seat => showData.bookedSeats.includes(seat))) {
      throw new Error("One or more selected seats are already booked. Please try again.");
    }

    // Step 2 — reserve seats
    const updatedBookedSeats = [...showData.bookedSeats, ...seats];
    await Show.findByIdAndUpdate(show, { bookedSeats: updatedBookedSeats });

    // Step 3 — create pending booking
    const newBooking = new Booking({
      user, show, seats,
      status: "pending"
    });
    const savedBooking = await newBooking.save({ session });

    // Step 4 — create pending transaction
    const txnid = uuidv4();
    const newTransaction = new Transaction({
      booking: savedBooking._id,
      user,
      amount,
      txnid,
      productInfo,
      status: "pending"
    });
    const savedTransaction = await newTransaction.save({ session });
    console.log("SAVED TRANSACTION:", savedTransaction);

    // Step 5 — generate PayU hash
    const paymentResponse = generatePaymentData({ txnid, amount, productInfo, firstname, email });

    await session.commitTransaction();
    session.endSession();

    response.send({
      success: true,
      message: "Booking initiated. Proceed to payment.",
      data: { paymentResponse }
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    response.status(500).send({ success: false, message: error.message });
  }
}

function generatePaymentData(payload){
  try {
    const {txnid, amount, productInfo, email, firstname} = payload;
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

async function paymentSuccess(req, res) {
  console.log("PAYMENT SUCCESS: ", req.body);
  try {
    const { txnid, status, amount } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { txnid },
      { status: "success" },
      { new: true }
    );

    if (!transaction) {
      return res.redirect(`${frontend_url}/payment-failure`);
    }

    await Booking.findByIdAndUpdate(transaction.booking, { status: "confirmed" });

    res.redirect(`${frontend_url}/payment-success?txnid=${txnid}&status=${status}&amount=${amount}`);
  } catch (error) {
  console.log("PAYMENT SUCCESS ERROR: ", error);
    res.redirect(`${frontend_url}/payment-failure`);
  }
}

async function paymentFailure(req, res) {
  console.log("PAYMENT FAILURE: ", req.body);
  try {
    const { txnid, status } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { txnid },
      { status: "failed" },
      { new: true }
    );

    if (transaction) {
      const booking = await Booking.findByIdAndUpdate(
        transaction.booking,
        { status: "failed" },
        { new: true }
      );

      // release seats
      if (booking) {
        const show = await Show.findById(booking.show);
        const releasedSeats = show.bookedSeats.filter(
          seat => !booking.seats.includes(seat)
        );
        await Show.findByIdAndUpdate(booking.show, { bookedSeats: releasedSeats });
      }
    }

    res.redirect(`${frontend_url}/payment-failure?txnid=${txnid}&status=${status}`);
  } catch (error) {
    console.log("PAYMENT FAILURE ERROR: ", error);
    res.redirect(`${frontend_url}/payment-failure`);
  }
}

async function getBookingsByUser(req, res) {
  try {
    const bookings = await Booking.find({
      user: req.params.userId,
      status: "confirmed"
    })
      .populate({ path: "show", populate: { path: "movie", model: "movies" } })
      .populate({ path: "show", populate: { path: "theatre", model: "theatres" } })
      .sort({ createdAt: -1 });

    res.send({ success: true, data: bookings });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

module.exports = { bookShow, paymentSuccess, paymentFailure, getBookingsByUser };
