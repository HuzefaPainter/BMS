const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();
require("./config/dbconfig");

const userRoute = require("./routes/userRoutes");
const movieRoute = require("./routes/movieRoutes");

app.use(cors());
app.use(express.json());
app.use("/", userRoute);
app.use("/", movieRoute);


app.listen(8081, () => {
    console.log('server running')
});