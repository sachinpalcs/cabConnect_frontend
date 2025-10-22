// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { startRide, endRide, cancelRide } from '../redux/DriverSlice';
// import GeoLocationName from '../component/map/GeoLocationName';

// const DriverAfterAccept = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { activeRide, isLoading, isError, message } = useSelector((state) => state.drivers);

//     const [otp, setOtp] = useState('');

//     // useEffect(() => {
//     //     if (!activeRide) {
//     //         navigate('/driver/dashboard');
//     //     }
//     // }, [activeRide, navigate]);

//     const handleStartRide = (e) => {
//         e.preventDefault();
//         if (otp && activeRide?.id) {
//             dispatch(startRide({ rideId: activeRide.id, otp }));
//         }
//     };

//     const handleEndRide = () => {
//         if (activeRide?.id) {
//             dispatch(endRide(activeRide.id));
//         }
//     };

//     const handleCancelRide = () => {
//         if (activeRide?.id) {
//             dispatch(cancelRide(activeRide.id));    
//         }
//     };

//     if (!activeRide) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5 flex items-center justify-center">
//                 <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
//                     <div className="mb-6">
//                         <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                     </div>
//                     <h2 className="text-2xl font-bold text-gray-800 mb-3">No Active Ride</h2>
//                     <p className="text-gray-600 mb-6">You don't have any active ride at the moment.</p>
//                     <button 
//                         onClick={() => navigate('/driver/dashboard')}
//                         className="w-full py-3 px-6 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
//                     >
//                         Go to Dashboard
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-100 p-5">
//             <div className="max-w-2xl mx-auto my-10 bg-white p-6 rounded-lg shadow-md">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Ride Details</h2>
                
//                 <div className="space-y-2">
//                     <p className="text-gray-600">
//                         <strong>Status:</strong>
//                         <span className="font-bold text-blue-600 ml-2">{activeRide?.rideStatues}</span>
//                     </p>
//                     <p className="text-gray-600">
//                         <strong>Rider:</strong>
//                         <span className="font-semibold text-gray-800 ml-2">{activeRide?.rider?.user?.name}</span>
//                     </p>
//                     <p className="text-gray-600">
//                         <strong>Fare:</strong>
//                         <span className="font-semibold text-gray-800 ml-2">{activeRide?.fare}</span>
//                     </p>
//                     <p className="text-gray-600">
//                         <strong>Pickup:</strong>
//                         <span className="font-semibold text-gray-800 ml-2">
//                             {activeRide?.pickUpLocation?.coordinates ? (
//                                 <GeoLocationName
//                                     lat={activeRide.pickUpLocation.coordinates[1]} 
//                                     lng={activeRide.pickUpLocation.coordinates[0]} 
//                                 />
//                             ) : 'N/A'}
//                         </span>
//                     </p>
//                     <p className="text-gray-600">
//                         <strong>Dropoff:</strong>
//                         <span className="font-semibold text-gray-800 ml-2">
//                             {activeRide?.dropOffLocation?.coordinates ? (
//                                 <GeoLocationName
//                                     lat={activeRide.dropOffLocation.coordinates[1]} 
//                                     lng={activeRide.dropOffLocation.coordinates[0]} 
//                                 />
//                             ) : 'N/A'}
//                         </span>
//                     </p>
//                 </div>
                
//                 <hr className="my-6 border-t border-gray-200" />

//                 {/* Conditional Actions */}
//                 <div className="space-y-4">
//                     {activeRide.rideStatues === 'CONFIRMED' && (
//                         <form onSubmit={handleStartRide} className="space-y-3">
//                             <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
//                                 Enter Rider's OTP to Start
//                             </label>
//                             <input
//                                 type="text"
//                                 id="otp"
//                                 value={otp}
//                                 onChange={(e) => setOtp(e.target.value)}
//                                 placeholder="4-digit OTP"
//                                 className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                             <button 
//                                 type="submit" 
//                                 className="w-full py-3 px-5 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
//                                 disabled={isLoading || !otp}
//                             >
//                                 {isLoading ? 'Starting...' : 'Start Ride'}
//                             </button>
//                         </form>
//                     )}

//                     {activeRide.rideStatues === 'ONGOING' && (
//                         <button 
//                             onClick={handleEndRide} 
//                             className="w-full py-3 px-5 font-bold text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-200 disabled:opacity-50" 
//                             disabled={isLoading}
//                         >
//                             {isLoading ? 'Ending...' : 'End Ride'}
//                         </button>
//                     )}
                    
//                     {/* Allow cancellation only before the ride starts */}
//                     {activeRide.rideStatues === 'CONFIRMED' && (
//                         <button 
//                             onClick={handleCancelRide} 
//                             className="w-full py-3 px-5 font-bold text-white bg-gray-500 rounded-md hover:bg-gray-600 transition duration-200 disabled:opacity-50" 
//                             disabled={isLoading}
//                         >
//                             {isLoading ? 'Cancelling...' : 'Cancel Ride'}
//                         </button>
//                     )}
//                 </div>

//                 {isError && <p className="text-red-500 mt-4 text-center">{message}</p>}
//             </div>
//         </div>
//     );
// };

// export default DriverAfterAccept;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { requestRide, reset, cancelRideRequest } from '../redux/RideRequestSlice';
import MapPicker from '../component/map/MapPicker';
import GeoLocationName from '../component/map/GeoLocationName';

const RideRequest = () => {
    const [pickUpLocation, setPickUpLocation] = useState(null);
    const [dropOffLocation, setDropOffLocation] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [isSettingPickup, setIsSettingPickup] = useState(true);
    
    // Local state for persisted ride data
    const [persistedRideData, setPersistedRideData] = useState(null);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, isSuccess, isError, message, rideRequest } = useSelector((state) => state.rideRequest);

    // Load persisted ride data on mount
    useEffect(() => {
        const savedRide = localStorage.getItem('activeRideRequest');
        if (savedRide) {
            try {
                setPersistedRideData(JSON.parse(savedRide));
            } catch (error) {
                console.error('Error parsing saved ride data:', error);
                localStorage.removeItem('activeRideRequest');
            }
        }
    }, []);

    // Save ride data to localStorage when successful
    useEffect(() => {
        if (isSuccess && rideRequest) {
            const rideData = {
                id: rideRequest.id,
                fare: rideRequest.fare,
                rideRequestStatues: rideRequest.rideRequestStatues,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('activeRideRequest', JSON.stringify(rideData));
            setPersistedRideData(rideData);
        }
    }, [isSuccess, rideRequest]);

    // Update persisted data when ride status changes in Redux
    useEffect(() => {
        if (rideRequest?.rideRequestStatues) {
            const savedRide = localStorage.getItem('activeRideRequest');
            if (savedRide) {
                try {
                    const parsed = JSON.parse(savedRide);
                    parsed.rideRequestStatues = rideRequest.rideRequestStatues;
                    localStorage.setItem('activeRideRequest', JSON.stringify(parsed));
                    setPersistedRideData(parsed);
                } catch (error) {
                    console.error('Error updating ride status:', error);
                }
            }
        }
    }, [rideRequest?.rideRequestStatues]);

    useEffect(() => {
        if (isError) {
            alert(message || 'Failed to request ride.');
            dispatch(reset());
        }
    }, [isError, message, dispatch]);

    const handleMapClick = (latlng) => {
        if (isSettingPickup) {
            setPickUpLocation(latlng);
        } else {
            setDropOffLocation(latlng);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!pickUpLocation || !dropOffLocation) {
            alert('Please select both a pickup and a drop-off location on the map.');
            return;
        }

        const rideRequestDto = {
            pickUpLocation: {
                coordinates: [pickUpLocation.lng, pickUpLocation.lat],
                type: "Point"
            },
            dropOffLocation: {
                coordinates: [dropOffLocation.lng, dropOffLocation.lat],
                type: "Point"
            },
            paymentMethod: paymentMethod
        };

        dispatch(requestRide(rideRequestDto));
    };

    const handleCancelRequest = () => {
        const rideId = rideRequest?.id || persistedRideData?.id;
        
        if (rideId) {
            dispatch(cancelRideRequest(rideId));
            
            // Clear persisted data
            localStorage.removeItem('activeRideRequest');
            setPersistedRideData(null);
            
            // Reset form
            setPickUpLocation(null);
            setDropOffLocation(null);
            setPaymentMethod('CASH');
            setIsSettingPickup(true);
        } else {
            alert("Could not find ride ID to cancel.");
            dispatch(reset());
        }
    };

    // Determine which ride data to display
    const displayRideData = rideRequest || persistedRideData;
    const rideStatus = displayRideData?.rideRequestStatues;
    const showSuccessView = (isSuccess && rideRequest) || (persistedRideData && rideStatus !== 'CONFIRMED');

    // Check if ride is confirmed
    if (displayRideData && rideStatus === 'CONFIRMED') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="mb-6">
                        <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Ride is Confirmed!</h2>
                    <p className="text-gray-600 mb-6">Your driver has accepted the ride. Go to dashboard to see details.</p>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('activeRideRequest');
                            navigate('/rider/dashboard');
                        }}
                        className="w-full py-3 px-6 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-screen-xl mx-auto">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
                    {showSuccessView ? (
                        // SUCCESS VIEW - WAITING FOR DRIVER
                        <div className="max-w-lg mx-auto">
                            <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Ride Requested!</h1>
                            <div className="text-center p-6 bg-green-50 border border-green-200 rounded-md space-y-3">
                                <p className="text-lg text-gray-700">We are now finding a driver for you.</p>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">ESTIMATED FARE</p>
                                    <p className="text-4xl font-bold text-green-600">
                                        ₹{displayRideData?.fare?.toFixed(2) || "Calculating..."}
                                    </p>
                                </div>
                                <p className="text-md text-gray-600">
                                    Status: <span className="font-semibold text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full">
                                        {rideStatus}
                                    </span>
                                </p>
                            </div>
                            <button 
                                onClick={handleCancelRequest}
                                disabled={isLoading}
                                className="w-full mt-6 py-3 px-4 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 disabled:bg-gray-400"
                            >
                                {isLoading ? 'Cancelling...' : 'Cancel Ride Request'}
                            </button>
                            <div className="mt-6">
                                <button 
                                    onClick={() => navigate('/rider/dashboard')}
                                    className="w-full py-3 px-6 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </div>
                    ) : (
                        // FORM VIEW
                        <>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">Request a Ride</h1>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className='md:col-span-2 h-[500px] md:h-auto min-h-[50px] rounded-lg overflow-hidden'>
                                    <MapPicker onMapClick={handleMapClick} pickup={pickUpLocation} dropoff={dropOffLocation} />
                                </div>
                                <div className="md:col-span-1 flex flex-col justify-center">
                                    <div className="max-w-md mx-auto w-full">
                                        <div className="grid grid-cols-2 gap-4">
                                            <button 
                                                onClick={() => setIsSettingPickup(true)} 
                                                className={`w-full py-3 rounded-md font-semibold transition-colors ${
                                                    isSettingPickup ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                Set Pickup
                                            </button>
                                            <button 
                                                onClick={() => setIsSettingPickup(false)} 
                                                className={`w-full py-3 rounded-md font-semibold transition-colors ${
                                                    !isSettingPickup ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                Set Drop-off
                                            </button>
                                        </div>
                                        <div className="space-y-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-md my-6">
                                            <p>
                                                <strong>Pickup:</strong> <GeoLocationName lat={pickUpLocation?.lat} lng={pickUpLocation?.lng} /> : Select the location
                                            </p>
                                            <p>
                                                <strong>Drop-off:</strong> <GeoLocationName lat={dropOffLocation?.lat} lng={dropOffLocation?.lng} /> : Select the location
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                                <select 
                                                    name="paymentMethod" 
                                                    value={paymentMethod} 
                                                    onChange={(e) => setPaymentMethod(e.target.value)} 
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                >
                                                    <option value="CASH">Cash</option>
                                                    <option value="WALLET">Wallet</option>
                                                </select>
                                            </div>
                                            <div>
                                                <button 
                                                    type="submit" 
                                                    disabled={isLoading} 
                                                    className="w-full py-3 px-4 rounded-md bg-black text-white font-semibold hover:bg-gray-800 disabled:bg-gray-400"
                                                >
                                                    {isLoading ? 'Finding Ride...' : 'Request Ride Now'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <button 
                                    onClick={() => navigate('/rider/dashboard')}
                                    className="py-3 px-6 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RideRequest;
