import api from "../config/api";

const API_URL = '/riders/';

// Request a new ride
const requestRide = async (rideRequestDto) => {
    const response = await api.post(API_URL + 'requestRide', rideRequestDto);
    return response.data;
};

// Cancel a ride
const cancelRide = async (rideId) => {
    const response = await api.post(API_URL + `cancelRide/${rideId}`);
    return response.data;
};


// Cancle the rideRequest
const cancelRideRequest = async (rideRequestId) => {
    const response = await api.post(API_URL + `cancelRideRequest/${rideRequestId}`);
    return response.data;
}

// Rate a driver
const rateDriver = async (ratingDto) => {
    const response = await api.post(API_URL + 'rateDriver', ratingDto);
    return response.data;
};


// get ride details by id
const getRideDetails = async (rideId) => {
    const response = await api.get(API_URL + `getRideDetails/${rideId}`);
    return response.data;
};

// Get rider's own profile
const getMyProfile = async () => {
    const response = await api.get(API_URL + 'getMyProfile');
    return response.data;
};

// Get all of rider's rides with pagination
const getAllMyRides = async (pageRequest = { pageOffset: 0, pageSize: 10 }) => {
    const response = await api.get(API_URL + 'getMyRides', { params: pageRequest });
    return response.data;
};

// Get rideRequest details by id
const getRideRequestDetails = async (rideRequestId) => {
    const response = await api.get(API_URL + `getRideRequestDetails/${rideRequestId}`);
    return response.data;
};

const RiderService = {
    requestRide,
    cancelRide,
    cancelRideRequest,
    rateDriver,
    getMyProfile,
    getAllMyRides,
    getRideDetails,
    getRideRequestDetails,
};

export default RiderService;