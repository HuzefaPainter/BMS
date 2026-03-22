const cron = require('node-cron');
const Booking = require('../models/bookingModel');
const Transaction = require('../models/transactionModel');
const Show = require('../models/showModel');

const startCleanupJob = () => {
  cron.schedule('* * * * *', async () => {
    console.log("Cleaning up bookings...");
    try {
      const expiredBookings = await Booking.find({
        status: "pending",
        expiresAt: { $lt: new Date() }
      });

      for (const booking of expiredBookings) {
        const show = await Show.findById(booking.show);
        if (show) {
          const releasedSeats = show.bookedSeats.filter(
            seat => !booking.seats.includes(seat)
          );
          await Show.findByIdAndUpdate(booking.show, { bookedSeats: releasedSeats });
        }

        await Booking.findByIdAndUpdate(booking._id, { status: "failed" });
        await Transaction.findOneAndUpdate(
          { booking: booking._id },
          { status: "failed" }
        );

        console.log(`Expired booking ${booking._id} cleaned up`);
      }
    } catch (error) {
      console.error("Cron cleanup error:", error.message);
    }
  });

  console.log("Cleanup job scheduled");
};

module.exports = startCleanupJob;
