import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import RiderService from '../service/RiderService';

const initialState = {
    profile: null,
    rides: [],
    rideRequest: null,
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
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyProfile.pending, (state) => { state.isLoading = true; })
            .addCase(getMyProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload.data;
            })
            .addCase(getMyProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getMyRides.pending, (state) => { state.isLoading = true; })
            .addCase(getMyRides.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rides = action.payload.content;
            })
            .addCase(getMyRides.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(cancelRide.pending, (state) => { state.isLoading = true; })
            .addCase(cancelRide.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rides = state.rides.map((ride) =>
                    ride.id === action.payload.id ? action.payload : ride
                );
            })
            .addCase(cancelRide.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(rateDriver.pending, (state) => { state.isLoading = true; })
            .addCase(rateDriver.fulfilled, (state) => { state.isLoading = false; })
            .addCase(rateDriver.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = RiderSlice.actions;
export default RiderSlice.reducer;