import React, { useState, useEffect, use } from 'react';
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
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { isLoading, isSuccess, isError, message, rideRequest } = useSelector((state) => state.rideRequest);
    const rideRequestId = rideRequest?.id;

    useEffect(() => {
        if (isError) {
            alert(message || 'Failed to request ride.');
            dispatch(reset());
            if (!isSuccess && !rideRequest) {
                dispatch(reset());
            } else {
                dispatch(clearError());
            }
        }
    }, [isError, message, dispatch]);

    useEffect(() => {
        let autoCancelTimeout = null;
        if (isSuccess && rideRequestId) {
            autoCancelTimeout = setTimeout(() => {
                if(rideRequest?.id === rideRequestId) {
                    alert("We could not find a driver in time. Your request has been automatically cancelled.");
                    dispatch(cancelRideRequest(rideRequest.id));
                }
            }, 120000);
        }
        return () => {
            if(autoCancelTimeout) {
                clearTimeout(autoCancelTimeout);
            }
        };
    }, [isSuccess, rideRequestId, dispatch, rideRequest]);

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
        if (rideRequest && rideRequest.id) {
            dispatch(cancelRideRequest(rideRequest.id));
        } else {
            alert("Could not find ride ID to cancel.");
            dispatch(reset());
        }
    };
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-screen-xl mx-auto">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
                    {isSuccess && rideRequest ? (
                        // SUCCESS VIEW
                        <div className="max-w-lg mx-auto">
                            <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Ride Requested!</h1>
                            <div className="text-center p-6 bg-green-50 border border-green-200 rounded-md space-y-3">
                                <p className="text-lg text-gray-700">We are now finding a driver for you.</p>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">ESTIMATED FARE</p>
                                    <p className="text-4xl font-bold text-green-600">₹{rideRequest.fare.toFixed(2) || "Calculating..."}</p>
                                </div>
                                <p className="text-md text-gray-600">
                                    Status: <span className="font-semibold text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full">{rideRequest?.rideRequestStatues}</span>
                                </p>
                            </div>
                            <button onClick={handleCancelRequest}
                                disabled={isLoading}
                                className="w-full mt-6 py-3 px-4 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 disabled:bg-gray-400">
                                {isLoading ? 'Cancelling...' : 'Cancel Ride Request'}
                            </button>
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
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
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
