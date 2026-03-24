  const bookingRouter = require('express').Router();
  const { bookShow, paymentFailure, paymentSuccess, getBookingsByUser } = require("../controllers/bookingController.jsx");

  bookingRouter.get("/get-bookings-by-user/:userId", getBookingsByUser);

  bookingRouter.post("/book-show", bookShow);

  bookingRouter.get("/payment-success", paymentSuccess);

  bookingRouter.get("/payment-failure", paymentFailure);


  module.exports = bookingRouter;
