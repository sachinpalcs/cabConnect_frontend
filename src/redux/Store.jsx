import { configureStore } from "@reduxjs/toolkit"

import authReducer ,{ setAccessToken, logout} from './AuthSlice'
import driverReducer from './DriverSlice'
import riderReducer from './RiderSlice'
import adminReducer from './AdminSlice'
import rideRequestReducer from './RideRequestSlice'
import { setupInterceptors } from "../config/api"



export const Store = configureStore({
    reducer :{
        auth: authReducer,
        rider: riderReducer,
        drivers: driverReducer,
        admin: adminReducer,
        rideRequest: rideRequestReducer,

    },
});

setupInterceptors(Store, { setAccessToken, logout })