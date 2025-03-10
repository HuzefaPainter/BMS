import { axiosInstance } from ".";

export const generateTransaction = async (payload) => {
    try {
        const response = await axiosInstance.post("/generate-transaction", { payload });
        return response.data;
    } catch (error) {
        console.log("Error while calling makePayment API", error);
    }
}

export const makePayment = async (url) => {
    try {
        const response = await axiosInstance.post(url);
        return response.data;
    } catch (error) {
        console.log("Error while calling makePayment API", error);
    }
}

export const bookShow = async (payload) => {
    try {
        const response = await axiosInstance.post("/book-show" , payload);
        return response.data;
    } catch (error) {
        return {success: false, message: "Something went wrong booking the show, please try again."};
    }
}
