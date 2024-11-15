const movieRouter= require('express').Router();
const {
    addMovie,
    deleteMovie,
    updateMovie,
    getMovie,
    getAllMovie,

  } = require("../controllers/movieController.jsx");


movieRouter.post("/add-movie", addMovie);

movieRouter.delete("/delete-movie/:id", deleteMovie);

movieRouter.put("/update-movie", updateMovie);

movieRouter.get("/get-movie/:movieId", getMovie);

movieRouter.get("/get-all-movie", getAllMovie);

module.exports = movieRouter;


