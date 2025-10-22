import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import RiderService from '../service/RiderService';

const initialState = {
    rideRequest: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const requestRide = createAsyncThunk('riders/requestRide', async (rideData, thunkAPI) => {
        try {
            return await RiderService.requestRide(rideData);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const cancelRideRequest = createAsyncThunk('riders/cancelRideRequest', async (rideRequestId, thunkAPI) => {
    try {
        return await RiderService.cancelRideRequest(rideRequestId);
        } catch (error) {
            const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const RideRequestSlice = createSlice({
    name: 'rideRequest',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            state.rideRequest = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(requestRide.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(requestRide.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.rideRequest = action.payload.data;
            })
            .addCase(requestRide.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Cancel Ride Request
            .addCase(cancelRideRequest.pending, (state) => {
            state.isLoading = true; 
            })
            .addCase(cancelRideRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.rideRequest = null;
                state.message = action.payload.message || 'Ride cancelled successfully';
            })
            .addCase(cancelRideRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
    });
    },
});

export const { reset } = RideRequestSlice.actions;
export default RideRequestSlice.reducer;
