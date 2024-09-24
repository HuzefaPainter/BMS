const router= require('express').Router();
const Theatre = require('../models/theatreModel');

async function addTheatre(request,response) {
    try {
        const newTheatre = new Theatre(request.body);
        const savedTheatre = await newTheatre.save();
        if(savedTheatre) {      
        response.send({
            success: true,
            message: "Theatre added successfully",
        });
    }
    else{
        throw(somethingWentWrong);
    }
}    
    catch (error) {
        response.status(500).send({
            success:false,
            message: "Something went wrong"
        });
    }
}

async function getAllTheatres(request,response) {
    try {
        const allTheatres = await Theatre.find();
        if(allTheatres){
            response.send({
                success: true,
                message: "All Theatres fetched successfully",
                data: allTheatres,
            });
        }
        else{
            throw(somethingWentWrong);
        }
        
    } catch (error) {
        response.status(500).send({
            success:false,
            message: "Something went wrong"
        });
    }
}

async function getAllTheatresByOwner(request,response) {    
try {
    const theatresByOwner = await Theatre.find({owner:request.params.ownerId});
    if(theatresByOwner){
        response.send({
            success: true,
            message: "All Theatres according to owners fetched successfully",
            data: theatresByOwner,
        });
    }
    else{
        throw(somethingWentWrong);
    }    
} catch (error) {
    response.status(500).send({
        success:false,
        message: "Something went wrong"
    });
}
}

const updateTheatre = async (req, res) => {
    try {
      const updatedTheatre = await Theatre.findByIdAndUpdate(req.body._id, req.body);
      if (updatedTheatre) {
        res.send({
          success: true,
          message: "Theatre updated successfully",
          data: updatedTheatre
        });
      } else {
        throw (somethingWentWrong);
      }
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  };
  
  const deleteTheatre = async (req, res) => {
    try {
      const deleted = await Theatre.findByIdAndDelete(req.params.theatreId);
      if (deleted) {
        res.send({
          success: true,
          message: "Theatre deleted successfully"
        });
      } else {
        throw (somethingWentWrong);
      }
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  };

module.exports = {addTheatre, getAllTheatres, getAllTheatresByOwner, updateTheatre, deleteTheatre};