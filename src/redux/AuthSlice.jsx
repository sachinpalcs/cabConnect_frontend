import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../service/AuthService';


// const accessToken = localStorage.getItem('accessToken') ? JSON.parse(localStorage.getItem('accessToken')) : null;

const getInitialToken = () => {
    try {
        const item = localStorage.getItem('accessToken');
        if (item && item !== 'undefined') {
            return JSON.parse(item);
        }
        return null;
    } catch (error) {
        console.error("Failed to parse accessToken from localStorage:", error);
        return null;
    }
};

const accessToken = getInitialToken();

const initialState = {
    accessToken: accessToken,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const signup = createAsyncThunk('auth/signup', async (signupDto, thunkAPI) => {
    try {
        return await AuthService.signup(signupDto);
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const login = createAsyncThunk('auth/login', async (loginRequestDto, thunkAPI) => {
    try {
        const data = await AuthService.login(loginRequestDto);
        return data; // Should return { accessToken: '...' }
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
   await AuthService.logout();
});


export const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
            localStorage.setItem('accessToken', JSON.stringify(action.payload));
        },
        clearAuth: (state) => {
            state.accessToken = null;
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
            localStorage.removeItem('accessToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signup.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.accessToken = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.accessToken = action.payload.data.accessToken;
                localStorage.setItem('accessToken', JSON.stringify(action.payload.data.accessToken));
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.accessToken = null;
                localStorage.removeItem('accessToken');
            })
            .addCase(logout.fulfilled, (state) => {
                state.accessToken = null;
                localStorage.removeItem('accessToken');
            });
    },
});

export const { reset, setAccessToken, clearAuth } = AuthSlice.actions;
export default AuthSlice.reducer;