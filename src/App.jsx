// import { useState } from 'react'
// import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
// import MainLayout from './layout/MainLayout'
// import Home from './pages/Home'
// import Signup from './pages/Signup'
// import Login from './pages/Login'
// import MapComponent from './component/map/MapComponent'


// function App() {

  
//     const router = createBrowserRouter(
//       createRoutesFromElements(
//         <Route path="/" element={<MainLayout/>}>
//           <Route path='' element={<Home />}/>
//           <Route path='signup' element={<Signup/>}/>
//           <Route path='login' element={<Login/>}/>
//           <Route path='map' element={<MapComponent/>}/>

//         </Route>
//       )
//     )

//   return (
//     <>
//     <RouterProvider router={router}/>
//     </>
//   )
// }

// export default App



import React from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import RideRequest from './pages/RideRequest';
import AdminDashboard from './dashboard/AdminDashboard';
import DriverDashboard from './dashboard/DriverDashboard';
import RiderDashboard from './dashboard/RiderDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import DriverAfterAccept from './pages/DriverAfterAccpet';

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="signup" element={<Signup />} />
                <Route path="login" element={<Login />} />
                <Route path="rideRequest" element={<RideRequest />} />
                <Route path="driver/ride" element={<DriverAfterAccept />} />
                {/* <Route path="driver" element={<DriverDashboard />} /> */}
                <Route
                    path="rider/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['RIDER']}>
                            <RiderDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="driver/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['DRIVER']}>
                            <DriverDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

            </Route>
        )
    );

    return (
      <>
        <RouterProvider router={router} />
      </>
    );
}

export default App;

