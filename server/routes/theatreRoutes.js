const theatreRouter = require('express').Router();
const {
    addTheatre,
    deleteTheatre,
    updateTheatre,
    getAllTheatres,
    getAllTheatresByOwner,
    getAllTheatresByMovie,

  } = require("../controllers/theatreController.jsx");


theatreRouter.post("/add-theatre", addTheatre);

theatreRouter.delete("/delete-theatre/:theatreId", deleteTheatre);

theatreRouter.put("/update-theatre", updateTheatre);

theatreRouter.get("/get-all-theatres", getAllTheatres);

theatreRouter.get("/get-all-theatres-by-owner/:ownerId", getAllTheatresByOwner);

theatreRouter.get("/get-all-theatres-by-movie/:movieId", getAllTheatresByMovie);


module.exports = theatreRouter;


