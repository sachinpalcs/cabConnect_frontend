import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startRide, endRide, cancelRide } from '../redux/DriverSlice';
import GeoLocationName from '../component/map/GeoLocationName';

const DriverAfterAccept = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { activeRide, isLoading, isError, message } = useSelector((state) => state.drivers);

    const [otp, setOtp] = useState('');

    const handleStartRide = (e) => {
        e.preventDefault();
        if (otp && activeRide?.id) {
            dispatch(startRide({ rideId: activeRide.id, otp }));
        }
    };

    const handleEndRide = () => {
        if (activeRide?.id) {
            dispatch(endRide(activeRide.id));
        }
    };

    const handleCancelRide = () => {
        if (activeRide?.id) {
            dispatch(cancelRide(activeRide.id));    
        }
    };

    if (!activeRide) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="mb-6">
                        <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">No Active Ride</h2>
                    <p className="text-gray-600 mb-6">You don't have any active ride at the moment.</p>
                    <button 
                        onClick={() => navigate('/driver/dashboard')}
                        className="w-full py-3 px-6 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <div className="max-w-2xl mx-auto my-10 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Ride Details</h2>
                
                <div className="space-y-2">
                    <p className="text-gray-600">
                        <strong>Status:</strong>
                        <span className="font-bold text-blue-600 ml-2">{activeRide?.rideStatues}</span>
                    </p>
                    <p className="text-gray-600">
                        <strong>Rider:</strong>
                        <span className="font-semibold text-gray-800 ml-2">{activeRide?.rider?.user?.name}</span>
                    </p>
                    <p className="text-gray-600">
                        <strong>Fare:</strong>
                        <span className="font-semibold text-gray-800 ml-2">{activeRide?.fare}</span>
                    </p>
                    <p className="text-gray-600">
                        <strong>Pickup:</strong>
                        <span className="font-semibold text-gray-800 ml-2">
                            {activeRide?.pickUpLocation?.coordinates ? (
                                <GeoLocationName
                                    lat={activeRide.pickUpLocation.coordinates[1]} 
                                    lng={activeRide.pickUpLocation.coordinates[0]} 
                                />
                            ) : 'N/A'}
                        </span>
                    </p>
                    <p className="text-gray-600">
                        <strong>Dropoff:</strong>
                        <span className="font-semibold text-gray-800 ml-2">
                            {activeRide?.dropOffLocation?.coordinates ? (
                                <GeoLocationName
                                    lat={activeRide.dropOffLocation.coordinates[1]} 
                                    lng={activeRide.dropOffLocation.coordinates[0]} 
                                />
                            ) : 'N/A'}
                        </span>
                    </p>
                </div>
                
                <hr className="my-6 border-t border-gray-200" />

                {/* Conditional Actions */}
                <div className="space-y-4">
                    {activeRide.rideStatues === 'CONFIRMED' && (
                        <form onSubmit={handleStartRide} className="space-y-3">
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                Enter Rider's OTP to Start
                            </label>
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="4-digit OTP"
                                className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button 
                                type="submit" 
                                className="w-full py-3 px-5 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                                disabled={isLoading || !otp}
                            >
                                {isLoading ? 'Starting...' : 'Start Ride'}
                            </button>
                        </form>
                    )}

                    {activeRide.rideStatues === 'ONGOING' && (
                        <button 
                            onClick={handleEndRide} 
                            className="w-full py-3 px-5 font-bold text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-200 disabled:opacity-50" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Ending...' : 'End Ride'}
                        </button>
                    )}
                    
                    {/* Allow cancellation only before the ride starts */}
                    {activeRide.rideStatues === 'CONFIRMED' && (
                        <button 
                            onClick={handleCancelRide} 
                            className="w-full py-3 px-5 font-bold text-white bg-gray-500 rounded-md hover:bg-gray-600 transition duration-200 disabled:opacity-50" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Cancelling...' : 'Cancel Ride'}
                        </button>
                    )}
                </div>

                {isError && <p className="text-red-500 mt-4 text-center">{message}</p>}
            </div>
        </div>
    );
};

export default DriverAfterAccept;