import { axiosInstance } from ".";

export const makePayment = async ( status, txnid, amount, productinfo ) => {
    try {
        const response = await axiosInstance.post("/make-payment", { status, txnid, amount, productinfo });
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
        console.log("Error while calling bookShow API", error);
    }
}