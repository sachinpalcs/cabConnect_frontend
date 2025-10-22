import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DriverService from '../service/DriverService';

const initialState = {
    profile: null,
    rides: [],
    pendingRequests: [],
    activeRide: null,
    isLoading: false,
    isError: false,
    message: '',
};

// Async Thunks
export const getMyDriverProfile = createAsyncThunk('drivers/getMyProfile', async (_, thunkAPI) => {
    try {
        return await DriverService.getMyProfile();
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to fetch driver profile.');
    }
});

export const getMyDriverRides = createAsyncThunk('drivers/getMyRides', async (pageRequest, thunkAPI) => {
    try {
        return await DriverService.getAllMyRides(pageRequest);
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to fetch driver rides.');
    }
});


// Thunk for fetching PENDING requests ---
export const fetchPendingRequests = createAsyncThunk(
    'drivers/fetchPendingRequests',
    async (_, thunkAPI) => {
        try {
            return await DriverService.getPendingRequests();
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch pending requests.');
        }
    }
);

export const acceptRide = createAsyncThunk('drivers/acceptRide', async (rideRequestId, thunkAPI) => {
    try {
        return await DriverService.acceptRide(rideRequestId);
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to accept ride.');
    }
});

export const startRide = createAsyncThunk('drivers/startRide', async ({ rideId, otp }, thunkAPI) => {
    try {
        return await DriverService.startRide(rideId, { otp });
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to start ride. Please check OTP.');
    }
});

export const endRide = createAsyncThunk('drivers/endRide', async (rideId, thunkAPI) => {
    try {
        return await DriverService.endRide(rideId);
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to end ride.');
    }
});

export const cancelRide = createAsyncThunk('drivers/cancelRide', async (rideId, thunkAPI) => {
    try {
        return await DriverService.cancelRide(rideId);
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to cancel ride.');
    }
});

export const rateRider = createAsyncThunk('drivers/rateRider', async (ratingDto, thunkAPI) => {
    try {
        return await DriverService.rateRider(ratingDto);
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to rate rider.');
    }
});

export const updateDriverAvailability = createAsyncThunk('drivers/updateAvailability', async (isAvailable, thunkAPI) => {
        try {
            return await DriverService.updateAvailability(isAvailable);
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to update status.');
        }
    }
);

export const updateDriverLocation = createAsyncThunk('drivers/updateLocation', async (locationData, thunkAPI) => {
        try {
            return await DriverService.updateLocation(locationData);
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to update location.');
        }
    }
);


export const DriverSlice = createSlice({
    name: 'drivers',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyDriverProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyDriverProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload.data;
            })
            .addCase(getMyDriverProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Rides
            .addCase(getMyDriverRides.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyDriverRides.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rides = action.payload.data;
            })
            .addCase(getMyDriverRides.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Accept Ride
            .addCase(acceptRide.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(acceptRide.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activeRide = action.payload.data;
            })
            .addCase(acceptRide.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // NEW: Start Ride Reducers
            .addCase(startRide.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(startRide.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activeRide = action.payload.data;
            })
            .addCase(startRide.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(endRide.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(endRide.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activeRide = null; // Ride is over, so clear the active ride
            })
            .addCase(endRide.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Cancel Ride
            .addCase(cancelRide.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(cancelRide.fulfilled, (state) => {
                state.isLoading = false;
                state.activeRide = null;
            })
            .addCase(cancelRide.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Rate Rider Reducers
            .addCase(rateRider.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(rateRider.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(rateRider.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update Availability
            .addCase(updateDriverAvailability.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateDriverAvailability.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload.data;
            })
            .addCase(updateDriverAvailability.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update Location Reducers
            .addCase(updateDriverLocation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateDriverLocation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload.data;
            })
            .addCase(updateDriverLocation.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Reducers for fetching pending requests ---
            .addCase(fetchPendingRequests.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPendingRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.pendingRequests = action.payload;
            })
            .addCase(fetchPendingRequests.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = DriverSlice.actions;
export default DriverSlice.reducer;