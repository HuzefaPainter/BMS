const router= require('express').Router();
const Movie = require('../models/movieModel.js');

//add movie 

async function addMovie(request,response) {
    try {

        const [year, month, day] = request.body.releaseDate.split("-");
        const releaseDate = new Date(`${year}-${month}-${day}`);
        const newMovieData = { ...request.body, releaseDate };
        const newMovie = new Movie(newMovieData);
        const movieResponse = await newMovie.save();   
        if (movieResponse) {
            return response.send({
                success: true,
                message: "Movie added successfully",
            });
        }
        throw new Error("Failed to add movie.");        
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({
            success:false,
            message: "Something went wrong"
        });
    }
}

//delete movie
async function deleteMovie(request,response) {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(request.params.id);
        //TODO: check for deletedMovie response then send success. do this in the entire file
        response.send({
            success: true,
            message: "Movie deleted successfully",
            data: deletedMovie
        });
    } catch (error) {
        response.status(500).send({
            success:false,
            message: "Something went wrong"
        });
    }
    }

//update movie

async function updateMovie(request,response) {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(request.body._id , request.body);
        response.send({
            success: true,
            message: "Movie updated successfully",
            data: updatedMovie
        });
    } catch (error) {
        response.status(500).send({
            success:false,
            message: "Something went wrong"
        });
    }
    }

//get movie
async function getMovie(request,response) {
    try {
        const getMovie = await Movie.findById(request.body._id);
        response.send({
            success: true,
            message: "Movie updated successfully",
            data: getMovie
        });
    } catch (error) {
        response.status(500).send({
            success:false,
            message: "Something went wrong"
        });
    }
    }

// get all movies
async function getAllMovie(request,response) {
    try {
        const allMovies = await Movie.find();
        if (allMovies){
            response.send({
                success: true,
                message: "Movies fetched successfully",
                data: allMovies
            });
        }else{
            throw(somethingWentWrong);
        }
        
    } catch (error) {
        response.status(500).send({
            success:false,
            message: "Something went wrong"
        });
    }
    }

module.exports = { addMovie, deleteMovie, updateMovie, getMovie, getAllMovie };