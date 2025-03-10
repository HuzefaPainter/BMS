const router= require('express').Router();
const crypto = require('crypto');
const Transaction = require('../models/transactionModel');
const mongoose = require("mongoose");
const PAYU_KEY = process.env.payu_key;
const PAYU_SALT = process.env.payu_salt;

async function generateTransaction(request, response) {
  console.log("amount check from generateTransaction", request.body);
  try {
    let params = {
      key: PAYU_KEY,
      amount: request.body.payload.amount,
      productInfo: request.body.payload.productInfo,
      firstname: request.body.payload.firstname,
      email: request.body.payload.email,
      surl: request.body.payload.surl,
      furl: request.body.payload.furl,
    };
    const newTransaction = new Transaction(request.body.payload);
    const generatedTransaction = await newTransaction.save();
    params["txnid"] = generatedTransaction._id.toString();
    let hashString =
      params["key"] +
      "|" +
      params["txnid"] +
      "|" +
      params["amount"] +
      "|" +
      params["productInfo"] +
      "|" +
      params["firstname"] +
      "|" +
      params["email"] +
      "|||||||||||" +
      PAYU_SALT;
    const hash = crypto.createHash("sha512").update(hashString, 'utf-8').digest("hex");
    params["hash"] = hash;
    console.log("Hashstring: ", hashString);
    const encodedParams = new URLSearchParams(params).toString();
    const apiEndpoint = "https://test.payu.in/_payment";
    const url = apiEndpoint + "?" + encodedParams;
    response.send({
      success: true,
      data: { txnid: generatedTransaction._id, hash: hash, key: PAYU_KEY, checkoutUrl: url },
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = { generateTransaction };