import { axiosInstance } from ".";

export const addShow = async(payload) => {
    try {
        const response = await axiosInstance.post("/add-show", payload);
        return response.data;
    } catch (error) {
        console.log("Error while calling addShow api", error);
    }
}

export const deleteShow = async(payload) => {
    try {
        const response = await axiosInstance.delete("/delete-show", payload);
        return response.data;
    } catch (error) {
        console.log("Error while calling deleteShow api", error);
    }
}

export const updateShow = async(payload) => {
    try {
        const response = await axiosInstance.put("/update-show", payload);
        return response.data;
    } catch (error) {
        console.log("Error while calling updateShow api", error);
    }
}

export const getShow = async(showId) => {
    try {
        const response = await axiosInstance.get(`/get-show/${showId}`);
        return response.data;
    } catch (error) {
        console.log("Error while calling getShow api", error);
    }
}

export const getAllShows = async(payload) => {
    try {
        const response = await axiosInstance.get("/get-all-shows", payload);
        return response.data;
    } catch (error) {
        console.log("Error while calling getAllShows api", error);
    }
}

export const getShowsByTheatre = async(theatreId) => {
    try {
        const response = await axiosInstance.get(`/get-shows-by-theatre/${theatreId}`);
        return response.data;
    } catch (error) {
        console.log("Error while calling getShowsByTheatre api", error);
    }
}

export const getShowsByMovie = async(movieId) => {
    try {
        const response = await axiosInstance.get(`/get-shows-by-movie/${movieId}`);
        return response.data;
    } catch (error) {
        console.log("Error while calling getShowsByMovie api", error);
    }
}