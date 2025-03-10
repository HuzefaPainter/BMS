  const bookingRouter = require('express').Router();
  const {
      bookShow,
      paymentFailure,
      paymentSuccess,
    } = require("../controllers/bookingController.jsx");

  bookingRouter.post("/book-show", bookShow);

  bookingRouter.post("/payment-success", paymentSuccess);

  bookingRouter.post("/payment-failure", paymentFailure);


  module.exports = bookingRouter;