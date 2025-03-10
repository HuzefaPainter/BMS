
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
{
    show : {
        type: mongoose.Schema.ObjectId,
        ref: "shows"
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "users"
    },
    booking:{
        type: mongoose.Schema.ObjectId,
        ref: "bookings"
    },
    amount: {
        type: Number,
        required: true
    },
    productInfo: {
        type: String,
        required: true
    },
},
{
    timestamps: true
}
);

module.exports= mongoose.model("transactions", transactionSchema);