import React, { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { requestRide, reset, cancelRideRequest, getRideRequestDetails } from '../redux/RideRequestSlice';
import MapPicker from '../component/map/MapPicker';
import GeoLocationName from '../component/map/GeoLocationName';

const RideRequest = () => {
    const [pickUpLocation, setPickUpLocation] = useState(null);
    const [dropOffLocation, setDropOffLocation] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('CASH');

    const [isSettingPickup, setIsSettingPickup] = useState(true);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { isLoading, isSuccess, isError, message, rideRequest } = useSelector((state) => state.rideRequest);

    const { accessToken } = useSelector((state) => state.auth);

    const rideRequestId = rideRequest?.id;
    const displayedStatus = rideRequest?.rideRequestStatues;

    useEffect(() => {
        if(rideRequestId) {
            dispatch(getRideRequestDetails(rideRequestId));
        }
    }, [dispatch, rideRequestId]);

    useEffect(() => {
        let pollingInterval = null;
        if (displayedStatus === 'PENDING' && isSuccess && rideRequestId) {
            pollingInterval = setInterval(() => {
                dispatch(getRideRequestDetails(rideRequestId));
            }, 3000);
        }

        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [displayedStatus, isSuccess, rideRequestId, dispatch]);


    useEffect(() => {
        if (displayedStatus !== 'PENDING') {
            const timer = setTimeout(() => {
                dispatch(reset());
            }, 5000);
            return () => clearTimeout(timer);   
        }
    }, [displayedStatus, dispatch]);

    useEffect(() => {
        if (isError) {
            alert(message || 'Failed to request ride.');
            dispatch(reset());
        }
    }, [isError, message, dispatch]);


    useEffect(() => {
        let autoCancelTimeout = null;
        if (isSuccess && rideRequestId && displayedStatus === 'PENDING') {
            autoCancelTimeout = setTimeout(() => {
                if(displayedStatus === 'PENDING' ) {
                    alert("We could not find a driver in time. Your request has been automatically cancelled.");
                    dispatch(cancelRideRequest(rideRequestId));
                }
            }, 120000); // 120 seconds
        }
        return () => {
            if(autoCancelTimeout) {
                clearTimeout(autoCancelTimeout);
            }
        };
    }, [isSuccess, rideRequestId, displayedStatus, dispatch]);

    useEffect(() => {
        if(!isSuccess && !rideRequest) {
            setPickUpLocation(null);
            setDropOffLocation(null);
            setPaymentMethod('CASH');
            setIsSettingPickup(true);
        }
    }, [isSuccess, rideRequest]);



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
        if (rideRequestId) {
            dispatch(cancelRideRequest(rideRequestId));
        } else {
            alert("Could not find ride ID to cancel.");
            dispatch(reset());
        }
    };

    const getStatusText = () => {
        switch (displayedStatus) {
            case 'PENDING':
                return 'We are now finding a driver for you.';
            case 'CANCELLED':
                return 'Your ride has been cancelled.';
            case 'CONFIRMED':
                return 'Your ride is confirmed!';
            default:
                return 'We are finding a driver for you.';
        }
    };

    const getStatusBadgeClass = () => {
        switch (displayedStatus) {
            case 'PENDING':
                return 'font-semibold text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full';
            case 'CANCELLED':
                return 'font-semibold text-red-800 bg-red-100 px-2 py-1 rounded-full';
            case 'CONFIRMED':
                return 'font-semibold text-green-800 bg-green-100 px-2 py-1 rounded-full';
            default:
                return 'font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded-full';
        }
    };

    if (!accessToken) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
                    <p className="text-gray-600 mb-6">
                        You must be logged in to request a ride.
                    </p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="w-full py-3 px-6 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <style>
            {`
                @keyframes fillProgress {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }
                .animate-fillProgress {
                    animation: fillProgress 120s linear;
                    transform-origin: left;
                }
            `}
            </style>
            <div className="w-full max-w-screen-xl mx-auto">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
                    {isSuccess && rideRequest ? (
                        // SUCCESS VIEW
                        <div className="max-w-lg mx-auto">
                            <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
                                {displayedStatus === 'CANCELLED' ? 'Ride Cancelled' :
                                 displayedStatus === 'CONFIRMED' ? 'Ride Confirmed' :
                                'Ride Requested!'}
                            </h1>
                            <div className={`text-center p-6 border rounded-md space-y-3 ${
                               displayedStatus === 'CANCELLED' ? 'bg-red-50 border-red-200' : 
                               displayedStatus === 'CONFIRMED' ? 'bg-green-50 border-green-200' :
                                'bg-yellow-50 border-yellow-200'
                            }`}>
                                <p className={`text-lg ${
                                    displayedStatus === 'CANCELLED' ? 'text-red-700 font-semibold' : 'text-gray-700'
                                }`}>
                                    {getStatusText()}
                                </p>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">ESTIMATED FARE</p>
                                    <p className={`text-4xl font-bold ${
                                        displayedStatus === 'CANCELLED' ? 'text-red-600' :
                                        displayedStatus === 'CONFIRMED' ? 'text-green-600' :
                                        'text-yellow-700'
                                    }`}>
                                        ₹{(rideRequest.fare || 0).toFixed(2)}
                                    </p>
                                </div>
                                <p className="text-md text-gray-600">
                                    Status: <span className={getStatusBadgeClass()}>
                                        {displayedStatus || 'PENDING'}
                                    </span>
                                </p>
                            </div>
                            {displayedStatus === 'PENDING' && (
                                <>
                                    {/** --- ADDED PROGRESS BAR --- */}
                                    <div className='my-4'>
                                        <p className="text-sm text-center text-gray-500 mb-1">
                                            Auto-cancelling in 2 minutes...
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div className="bg-blue-600 h-2 rounded-full animate-fillProgress"></div>
                                        </div>
                                    </div>
                                    {/** --- END OF ADDED PROGRESS BAR --- */}

                                    <button onClick={handleCancelRequest}
                                        disabled={isLoading}
                                        className="w-full mt-2 py-3 px-4 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 disabled:bg-gray-400">
                                        {isLoading ? 'Cancelling...' : 'Cancel Ride Request'}
                                    </button>
                                </>
                            )}
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
                                            <button onClick={() => setIsSettingPickup(true)} className={`w-full py-3 rounded-md font-semibold transition-colors ${isSettingPickup ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                                Set Pickup
                                            </button>
                                            <button onClick={() => setIsSettingPickup(false)} className={`w-full py-3 rounded-md font-semibold transition-colors ${!isSettingPickup ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                                Set Drop-off
                                            </button>
                                        </div>
                                        <div className="space-y-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-md my-6">
                                            <p><strong>Pickup:</strong> <GeoLocationName lat={pickUpLocation?.lat} lng={pickUpLocation?.lng} /> : Select the location</p>
                                            <p><strong>Drop-off:</strong> <GeoLocationName lat={dropOffLocation?.lat} lng={dropOffLocation?.lng} /> : Select the location</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                                <select name="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                                    <option value="CASH">Cash</option>
                                                    <option value="WALLET">Wallet</option>
                                                </select>
                                            </div>
                                            <div>
                                                <button type="submit" disabled={isLoading} className="w-full py-3 px-4 rounded-md bg-black text-white font-semibold hover:bg-gray-800 disabled:bg-gray-400">
                                                    {isLoading ? 'Finding Ride...' : 'Request Ride Now'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="mt-8 max-w-md w-full text-center mx-auto">
                        <button 
                            onClick={() => navigate('/rider/dashboard')}
                            className="w-full py-3 px-6 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default RideRequest;