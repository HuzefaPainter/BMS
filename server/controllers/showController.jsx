const router = require('express').Router();
const Show = require("../models/showModel");

async function addShow(request, response) {
    try {
        const newShow = new Show(request.body);
        const savedShow = newShow.save();
        if (savedShow){
            response.send({
                success:true,
                message: "Show added successfully",
                data: savedShow
            })
        }
        else{
            throw(somethingWentWrong);
        }
    } catch (error) {
        response.status(500).send({
            success: false,
            message: "Something went wrong"
        })
        
    }
    
}
async function getShow(request, response) {
    try {
        const show = await Show.findById(request.params.id).populate('movie').populate('theatre');
        if (show) {
            response.send({
                success:true,
                message: "Show fetched successfully",
                data: show
            })
        }
        else{
            throw(somethingWentWrong);
        }
    } catch (error) {
        response.status(500).send({
            success: false,
            message: "Something went wrong"
        })
    }
    
}

async function getAllShows(request, response) {
    try {
        const allShows = await Show.find();
        if (allShows){
            response.send({
                success:true,
                message:"Shows fetched successfully.",
                data: allShows
            })
        }
        else{
            throw(somethingWentWrong);           
        }
    } catch (error) {
        response.status(500).send({
            success: false,
            message: "Something went wrong"
    })
    
}
}

async function getShowsByTheatre(request, response){
    try {
        const showsByTheatre = await Show.find({theatre: request.params.theatreId}).populate("movie");
        if (showsByTheatre.length > 0) {
            response.send({
                success: true,
                message: "Shows fetched successfully.",
                data: showsByTheatre
            });
        } else {
            response.status(404).send({
                success: false,
                message: "No shows found for this theatre."
            });
        }
    } catch (error) {
        response.status(500).send({
            success: false,
            message: "Something went wrong"
    }) 
    }
}

async function getShowsByMovie(request, response){
    try {
        const showsByMovie = await Show.findById({movie: request.params.movieId});
        if (showsByMovie){
            response.send({
                success:true,
                message:"Shows fetched successfully.",
                data: showsByMovie
            })
        }
        else{
            throw(somethingWentWrong);
        }
    } catch (error) {
        response.status(500).send({
            success: false,
            message: "Something went wrong"
    }) 
    }
}

async function deleteShow(request, response){
    try{
        const deletedShow = await Show.findByIdAndDelete(request.params.id)
        if (deletedShow)
            {
                response.send({
                    success:true,
                    message:"Show deleted successfully"
                })
            }
        else{
            throw(somethingWentWrong);
        }
    }
    catch(error){
        response.status(500).send({
            success: false,
            message: "Something went wrong"
    })
    }
}

async function updateShow(request, response){
    try {
        const updatedShow = await Show.findByIdAndUpdate(request.body._id, request.body);
        if(updatedShow){
            response.send({
                success:true,
                message:"Shows updated successfully.",
                data: updatedShow
            })
        }
        else{
            throw(somethingWentWrong);
        }
    } catch (error) {
        response.status(500).send({
            success: false,
            message: "Something went wrong"
        }
    )
    }
}

module.exports= {addShow, getAllShows, getShowsByTheatre, getShow,getShowsByMovie, deleteShow, updateShow};
