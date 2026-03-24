const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.sendgrid_api_key);

const sendBookingConfirmation = async (booking) => {
  const { user, show, seats } = booking;

  const msg = {
    to: user.email,
    from: process.env.sendgrid_from_email,
    subject: `Booking Confirmed — ${show.movie.title}`,
    html: `
      <h2>Booking Confirmed! 🎉</h2>
      <p>Hi ${user.name},</p>
      <p>Your booking has been confirmed. Here are your ticket details:</p>
      <table>
        <tr><td><strong>Movie</strong></td><td>${show.movie.title}</td></tr>
        <tr><td><strong>Theatre</strong></td><td>${show.theatre.name}, ${show.theatre.address}</td></tr>
        <tr><td><strong>Date</strong></td><td>${new Date(show.date).toDateString()}</td></tr>
        <tr><td><strong>Time</strong></td><td>${show.time}</td></tr>
        <tr><td><strong>Seats</strong></td><td>${seats.join(', ')}</td></tr>
      </table>
      <p>Enjoy the movie!</p>
    `,
  };

  await sgMail.send(msg);
  console.log(`Booking confirmation sent to ${user.email}`);
};

module.exports = { sendBookingConfirmation };
