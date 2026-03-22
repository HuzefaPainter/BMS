const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
{
    show : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shows"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    seats:{
        type: Array,
        required: true
    },
    status:{
        type: String,
        enum: ["pending", "confirmed", "failed"], default: "pending"
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000)
    }
},
{
    timestamps: true
}
);

module.exports= mongoose.model("bookings", bookingSchema);
