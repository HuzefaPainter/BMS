const showRouter = require('express').Router();

const {
    addShow,
     getAllShows, 
     getShowsByTheatre,
     getShow,
     getShowsByMovie, 
     deleteShow, 
     updateShow
} = require("../controllers/showController.jsx");

showRouter.post("/add-show", addShow);

showRouter.get("/get-all-shows", getAllShows);

showRouter.get("/get-shows-by-theatre/:theatreId", getShowsByTheatre);

showRouter.delete("/delete-show", deleteShow);

showRouter.put("/update-show", updateShow);

showRouter.get("/get-show/:showId", getShow);

showRouter.get("/get-shows-by-movie/:movieId", getShowsByMovie);

module.exports = showRouter;



