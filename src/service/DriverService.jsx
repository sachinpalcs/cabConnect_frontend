import api from "../config/api";

const API_URL = '/drivers/';

// Function to get pending ride requests
const getPendingRequests = async () => {
    const response = await api.get(API_URL + 'pending-requests');
    return response.data;
};


// Accept a ride request
const acceptRide = async (rideRequestId) => {
    const response = await api.post(API_URL + `acceptRide/${rideRequestId}`);
    return response.data;
};

// Start a ride
const startRide = async (rideId, otp) => {
    const response = await api.post(API_URL + `startRide/${rideId}`, otp);
    return response.data;
};

// End a ride
const endRide = async (rideId) => {
    const response = await api.post(API_URL + `endRide/${rideId}`);
    return response.data;
};

// Cancel a ride
const cancelRide = async (rideId) => {
    const response = await api.post(API_URL + `cancelRide/${rideId}`);
    return response.data;
};

// Rate a rider
const rateRider = async (ratingDto) => {
    const response = await api.post(API_URL + 'rateRider', ratingDto);
    return response.data;
};

// Get driver's own profile
const getMyProfile = async () => {
    const response = await api.get(API_URL + 'getMyProfile');
    return response.data;
};

// Get all of driver's rides with pagination
const getAllMyRides = async (pageRequest = { pageOffset: 0, pageSize: 10 }) => {
    const response = await api.get(API_URL + 'getMyRides', { params: pageRequest });
    return response.data;
};

// Update driver availability status
const updateAvailability = async (isAvailable) => {
    const response = await api.patch(API_URL + 'updateAvailability', null, { params: { available: isAvailable } });
    return response.data;
};

// Update driver's current location
const updateLocation = async (locationData) => {
    const response = await api.patch(API_URL + 'updateLocation', locationData);
    return response.data;
};

// get ride details by id
const getRideDetails = async (rideId) => {
    const response = await api.get(API_URL + `getRideDetails/${rideId}`);
    return response.data;
};


const DriverService = {
    getPendingRequests,
    acceptRide,
    startRide,
    endRide,
    cancelRide,
    rateRider,
    getMyProfile,
    getAllMyRides,
    updateAvailability,
    updateLocation,
    getRideDetails,
};

export default DriverService;