require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
require("./config/dbconfig");
import { rateLimit } from 'express-rate-limit'
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
import helmet from "helmet";

const userRoute = require("./routes/userRoutes");
const movieRoute = require("./routes/movieRoutes");
const theatreRoute = require("./routes/theatreRoutes");
const showRoute = require("./routes/showRoutes");
const bookingRoute = require("./routes/bookingRoutes");
const transactionRoute = require("./routes/transactionRoutes");
const startCleanupJob = require("./jobs/cleanupExpiredBookings");

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window`
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56,
})

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(limiter)
app.use(cors({
  origin: process.env.frontend_domain,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use("/", userRoute);
app.use("/", movieRoute);
app.use("/", theatreRoute);
app.use("/", showRoute);
app.use("/", bookingRoute);
app.use("/", transactionRoute);

app.listen(8081, () => {
  console.log('server running v2')
  startCleanupJob();
});
