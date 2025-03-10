const transactionRouter = require('express').Router();
const {
    generateTransaction,
  } = require("../controllers/transactionController");

transactionRouter.post("/generate-transaction", generateTransaction);


module.exports = transactionRouter;