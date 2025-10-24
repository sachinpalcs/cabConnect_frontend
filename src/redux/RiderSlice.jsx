import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import RiderService from '../service/RiderService';

const initialState = {
    profile: null,
    rides: [],
    rideRequest: null,
    currentRide: null,
    isLoading: false,
    isError: false,
    message: '',
};

export const getMyProfile = createAsyncThunk('riders/getMyProfile', async (_, thunkAPI) => {
    try {
        return await RiderService.getMyProfile();
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getMyRides = createAsyncThunk('riders/getMyRides', async (pageRequest, thunkAPI) => {
    try {
        return await RiderService.getAllMyRides(pageRequest);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getRideDetails = createAsyncThunk('riders/getRideDetails', async (rideId, thunkAPI) => {
    try {
        return await RiderService.getRideDetails(rideId);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const cancelRide = createAsyncThunk('riders/cancelRide', async (rideId, thunkAPI) => {
    try {
        return await RiderService.cancelRide(rideId);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const rateDriver = createAsyncThunk('riders/rateDriver', async (ratingData, thunkAPI) => {
    try {
        return await RiderService.rateDriver(ratingData);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const RiderSlice = createSlice({
    name: 'rider',
    initialState,
    reducers: {
        reset: (state) => {
            state.rideRequest = null;
            state.currentRide = null;
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
        clearCurrentRide: (state) => {
            state.currentRide = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get My Profile
            .addCase(getMyProfile.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(getMyProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = '';
                state.profile = action.payload.data;
            })
            .addCase(getMyProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            // Get My Rides (History)
            .addCase(getMyRides.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(getMyRides.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = '';
                state.rides = action.payload.data;
            })
            .addCase(getMyRides.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            // Get Ride Details (Current/Active Ride)
            .addCase(getRideDetails.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(getRideDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = '';
                state.currentRide = action.payload.data;
            })
            .addCase(getRideDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            // Cancel Ride (Cancel Current/Active Ride)
            .addCase(cancelRide.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(cancelRide.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = '';
                
                const cancelledRide = action.payload.data || action.payload;
                
                if (state.currentRide?.id === cancelledRide.id) {
                    state.currentRide = cancelledRide;
                }

                if (state.rides && state.rides.content) {
                    const rideIndex = state.rides.content.findIndex(r => r.id === cancelledRide.id);
                    if (rideIndex !== -1) {
                        state.rides.content[rideIndex] = cancelledRide;
                    }
                }
            })
            .addCase(cancelRide.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            // Rate Driver
            .addCase(rateDriver.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(rateDriver.fulfilled, (state, action) => { 
                state.isLoading = false;
                state.isError = false;
                state.message = '';
                const ratedRide = action.payload.data || action.payload;
                if (state.currentRide?.id === ratedRide.id) {
                    state.currentRide = ratedRide;
                }
            })
            .addCase(rateDriver.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clearCurrentRide } = RiderSlice.actions;
export default RiderSlice.reducer;