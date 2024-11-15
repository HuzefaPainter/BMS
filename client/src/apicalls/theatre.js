import {axiosInstance } from ".";

export const addTheatre = async (payload) => {
    try{
        const response = await axiosInstance.post("/add-theatre", payload);
        return response.data;
    }
    catch(err) {
        console.log("Error while calling addTheatre API", err);
    }
 };

 export const getAllTheatres = async () => {
    try{
        const response = await axiosInstance.get("/get-all-theatres");
        return response.data;
    }
    catch(err) {
        console.log("Error while calling getAllTheatres API", err);
    }
 };

 export const getAllTheatresByOwner = async (ownerId) => {
    try{
        const response = await axiosInstance.get(`/get-all-theatres-by-owner/${ownerId}`);
        return response.data;
    }
    catch(err) {
        console.log("Error while calling getAllTheatresByOwner API", err);
    }
 };

 export const getAllTheatresByMovie = async (movieId) => {
    try{
        const response = await axiosInstance.get(`/get-all-theatres-by-movie/${movieId}`);
        return response.data;
    }
    catch(err) {
        console.log("Error while calling getAllTheatresByMovie API", err);
    }
 };

 export const updateTheatre = async (payload) => {
    try{
        const response = await axiosInstance.put("/update-theatre", payload);
        return response.data;
    }
    catch(err) {
        console.log("Error while calling updateTheatre API", err);
    }
 };

 export const deleteTheatre = async (theatreId) => {
    try{
        const response = await axiosInstance.delete(`/delete-theatre/${theatreId}`);
        return response.data;
    }
    catch(err) {
        console.log("Error while calling deleteTheatre API", err);
    }
 };