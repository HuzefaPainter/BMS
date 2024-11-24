const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();
require("./config/dbconfig");


const userRoute = require("./routes/userRoutes");
const movieRoute = require("./routes/movieRoutes");
const theatreRoute = require("./routes/theatreRoutes");
const showRoute = require("./routes/showRoutes");
const bookingRoute = require("./routes/bookingRoutes");


app.use(cors());
app.use(express.json());
app.use("/", userRoute);
app.use("/", movieRoute);
app.use("/", theatreRoute);
app.use("/", showRoute);
app.use("/", bookingRoute);

app.listen(8081, () => {
    console.log('server running')
});