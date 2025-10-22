import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../service/AuthService';

const initialState = {
    onboardedDriver: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};


export const onboardDriver = createAsyncThunk(
    'admin/onboardDriver',
    async ({ userId, vehicleId }, thunkAPI) => {
        try {
            const onboardDriverDto = { vehicleId };
            return await AuthService.onboardNewDriver(userId, onboardDriverDto);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const AdminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            state.onboardedDriver = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(onboardDriver.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(onboardDriver.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.onboardedDriver = action.payload;
            })
            .addCase(onboardDriver.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = AdminSlice.actions;
export default AdminSlice.reducer;