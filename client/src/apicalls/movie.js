import { axiosInstance } from ".";

export const getAllMovie = async () => {
    try{
        const response = await axiosInstance.get("/get-all-movie");
        return response.data;
    }
    catch(err) {
        console.log("Error while calling getAllMovie API", err);
    }
 };

 export const addMovie = async (payload) => {
    try{
        const response = await axiosInstance.post("/add-movie", payload);
        return response.data;
    }
    catch(err) {
        console.log("Error while calling addMovie API", err);
    }
 };

 export const deleteMovie = async (movieId) => {
    try{
        const response = await axiosInstance.delete(`/delete-movie/${movieId}`);
        console.log("response for delete:", response);
        return response.data;
    }
    catch(err) {
        console.log("Error while calling deleteMovie API", err);
    }
 };

 export const updateMovie = async (payload) => {
    try{
        const response = await axiosInstance.put("/update-movie", payload);
        return response.data;
    }
    catch(err) {
        console.log("Error while calling updateMovie API", err);
    }
 };

