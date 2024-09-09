import { axiosInstance } from ".";

//Register
 export const RegisterUser = async (payload) => {
    try{
        const response = await axiosInstance.post("/register", payload);
        return response.data;
    }
    catch(err) {
        return err;
    }
 }

 //Login 
 export const LoginUser = async (payload) => {
    try {
        const response = await axiosInstance.post("/login", payload);
        return response.data;
        
    } catch (err) {
        return err;
    }
 }

 //Get current user 
 export const GetCurrentUser = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        const response = await axiosInstance.get('/get-current-user', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        // Assuming the API returns an object with a `data` field
        if (response.status === 200 && response.data) {
            return {
                success: true,
                data: response.data.data,
            };
        } else {
            throw new Error('Failed to fetch user data');
        }
    } catch (err) {
        console.error('Error fetching current user:', err.message || err);
        return {
            success: false,
            message: err.message || 'Something went wrong',
        };
    }
};
