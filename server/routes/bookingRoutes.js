const bookingRouter = require('express').Router();
const {
    makePayment,
    bookShow,
  } = require("../controllers/bookingController.jsx");

bookingRouter.post("/make-payment", makePayment);

bookingRouter.post("/book-show", bookShow);

module.exports = bookingRouter;