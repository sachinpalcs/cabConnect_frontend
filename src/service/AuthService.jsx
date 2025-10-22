import api from "../config/api";

const API_URL = '/auth/';

// Sign up user
const signup = async (signupDto) => {
    const response = await api.post(API_URL + 'signup', signupDto);
    return response.data;
};

// Login user
const login = async (loginRequestDto) => {
    const response = await api.post(API_URL + 'login', loginRequestDto);
    return response.data;
};

// Logout user
const logout = async () => {
    await api.post(API_URL + 'logout');
};

// Onboard a new driver (Admin only)
const onboardNewDriver = async (userId, onboardDriverDto) => {
    const response = await api.post(API_URL + `onBoardNewDriver/${userId}`, onboardDriverDto);
    return response.data;
}

// Refresh access token
const refreshToken = async () => {
    const response = await api.post(API_URL + 'refresh');
    return response.data;
}


const AuthService = {
    signup,
    login,
    logout,
    onboardNewDriver,
    refreshToken
};

export default AuthService;