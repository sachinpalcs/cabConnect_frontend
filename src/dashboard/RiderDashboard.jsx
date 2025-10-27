import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GeoLocationName from '../component/map/GeoLocationName';
import { getMyProfile, getMyRides, getRideDetails, cancelRide, rateDriver, reset } from '../redux/RiderSlice';
import RideHistory from '../pages/RideHistory';

const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true
        }).format(new Date(dateTimeString));
    } catch (e) {
        return 'Invalid Date';
    }
};


const RiderDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { profile, rides, currentRide, isLoading, isError, message } = useSelector((state) => state.rider);
    
    const [ratings, setRatings] = useState({});
    const [activeTab, setActiveTab] = useState('profile');

    const rideHistory = rides?.content || [];
    const currentRideDetails = currentRide;


    useEffect(() => {
        if (isError && message) {
            alert(message);
            dispatch(reset());
        }
    }, [isError, message, dispatch]);
    
    useEffect(() => {
        dispatch(getMyProfile());
        dispatch(getMyRides()); 
    }, [dispatch]);

    useEffect(() => {
        if (rideHistory.length > 0 && !currentRideDetails) {
            const activeRide = 
                rideHistory.find(ride => ride.rideStatues === 'ONGOING') ||
                rideHistory.find(ride => ride.rideStatues === 'CONFIRMED');

            if (activeRide) {
                dispatch(getRideDetails(activeRide.id));
                setActiveTab('currentRide');
            }
        }
    }, [rideHistory, currentRideDetails, dispatch]);



    const handleCancelRide = (rideId) => {
        if (window.confirm('Are you sure you want to cancel this ride?')) {
            dispatch(cancelRide(rideId)).then((result) => {
                if (!result.error) {
                    alert('Ride cancelled successfully!');
                    dispatch(getMyRides());
                    dispatch(getRideDetails(activeRide.id));
                }
            });
        }
    };



    const handleRateDriverSubmit = (rideId, rating) => {
        const ratingDto = { rideId, rating };
        dispatch(rateDriver(ratingDto)).then((result) => {
            if (!result.error) {
                alert('Driver rated successfully!');
                dispatch(getMyRides());
            }
        });
    };


    if (isLoading && !profile && rideHistory.length === 0) {
        return <div className="text-center p-10 text-xl font-semibold">Loading your dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-800">Rider Dashboard</h1>
                        <button 
                            onClick={() => navigate('/rideRequest')}
                            className="bg-black text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition duration-300"
                        >
                            Book a New Ride
                        </button>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                                activeTab === 'profile'
                                    ? 'border-b-2 border-black text-black'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('currentRide')}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                                activeTab === 'currentRide'
                                    ? 'border-b-2 border-black text-black'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Current Ride
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                                activeTab === 'history'
                                    ? 'border-b-2 border-black text-black'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Ride History
                        </button>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
                            {profile ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <span className="text-sm font-semibold text-gray-600">Name</span>
                                        <p className="text-lg text-gray-800 mt-1">{profile.user?.name || profile.name || 'N/A'}</p>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <span className="text-sm font-semibold text-gray-600">Email</span>
                                        <p className="text-lg text-gray-800 mt-1">{profile.user?.email || profile.email || 'N/A'}</p>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <span className="text-sm font-semibold text-gray-600">Rating</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-yellow-500 text-2xl">★</span>
                                            <span className="text-lg font-semibold text-gray-800">
                                                {profile.rating ? profile.rating.toFixed(2) : '0.00'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <span className="text-sm font-semibold text-gray-600">Role</span>
                                        <p className="text-lg text-gray-800 mt-1">
                                            {profile.user?.roles && profile.user.roles.length > 0 
                                                ? profile.user.roles.join(', ') 
                                                : profile.roles && profile.roles.length > 0
                                                ? profile.roles.join(', ')
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Loading profile...</p>
                            )}
                        </div>
                    )}

                    {/* CURRENT RIDE SECTION */}
                    {activeTab === 'currentRide' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Ride Details</h2>
                            {currentRideDetails ? (
                                <div className="space-y-6">
                                    {/* Ride Status Banner */}
                                    <div className={`p-4 rounded-lg ${
                                        currentRideDetails.rideStatues === 'CONFIRMED' ? 'bg-blue-50 border border-blue-200' :
                                        currentRideDetails.rideStatues === 'ONGOING' ? 'bg-green-50 border border-green-200' :
                                        currentRideDetails.rideStatues === 'ENDED' ? 'bg-gray-50 border border-gray-200' :
                                        currentRideDetails.rideStatues === 'CANCELLED' ? 'bg-red-50 border border-red-200' :
                                        'bg-yellow-50 border border-yellow-200'
                                    }`}>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-600">Status</span>
                                            <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                                                currentRideDetails.rideStatues === 'ENDED' ? 'bg-green-100 text-green-800' : 
                                                currentRideDetails.rideStatues === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                                                currentRideDetails.rideStatues === 'ONGOING' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {currentRideDetails.rideStatues}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Driver Info */}
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Driver Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Name</span>
                                                <p className="text-lg text-gray-800 mt-1">{currentRideDetails?.driver?.user?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Vehicle ID</span>
                                                <p className="text-lg text-gray-800 mt-1">
                                                    {currentRideDetails?.driver?.vehicleId || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">OTP</span>
                                                <p className="text-lg text-gray-800 mt-1">
                                                    {currentRideDetails?.otp || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ride Details */}
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ride Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <span className="text-sm font-semibold text-gray-600">Pickup Location</span>
                                                <p className="text-base text-gray-800 mt-1">
                                                    {currentRideDetails?.pickUpLocation?.coordinates ? 
                                                        <GeoLocationName 
                                                            lat={currentRideDetails.pickUpLocation.coordinates[1]} 
                                                            lng={currentRideDetails.pickUpLocation.coordinates[0]} 
                                                        /> : 'N/A'}
                                                </p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <span className="text-sm font-semibold text-gray-600">Drop-off Location</span>
                                                <p className="text-base text-gray-800 mt-1">
                                                    {currentRideDetails?.dropOffLocation?.coordinates ? 
                                                        <GeoLocationName 
                                                            lat={currentRideDetails.dropOffLocation.coordinates[1]} 
                                                            lng={currentRideDetails.dropOffLocation.coordinates[0]} 
                                                        /> : 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Fare</span>
                                                <p className="text-xl font-bold text-gray-800 mt-1">₹{currentRideDetails?.fare?.toFixed(2) || '0.00'}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Payment Method</span>
                                                <p className="text-base text-gray-800 mt-1">{currentRideDetails?.paymentMethod || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Created Time</span>
                                                <p className="text-base text-gray-800 mt-1">{formatDateTime(currentRideDetails.createdTime)}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Started At</span>
                                                <p className="text-base text-gray-800 mt-1">{formatDateTime(currentRideDetails.startedAt)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {currentRideDetails.rideStatues === 'CONFIRMED' && (
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => handleCancelRide(currentRideDetails.id)} 
                                                disabled={isLoading}
                                                className="bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 disabled:bg-red-300 font-semibold transition"
                                            >
                                                {isLoading ? 'Cancelling...' : 'Cancel Ride'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg mb-4">No current ride selected</p>
                                    <p className="text-gray-400 text-sm">Select a ride from your history to view details</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* RIDE HISTORY SECTION */}
                    {activeTab === 'history' && (
                        <RideHistory
                            rideHistory={rideHistory}
                            isLoading={isLoading}
                            userType="rider"
                            onRateSubmit={handleRateDriverSubmit}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RiderDashboard;