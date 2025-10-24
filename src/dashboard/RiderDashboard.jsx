import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, getMyRides, getRideDetails, cancelRide, rateDriver, reset } from '../redux/RiderSlice';

const RiderDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { profile, rides, currentRide, isLoading, isError, message } = useSelector((state) => state.rider);
    
    const [ratingRideId, setRatingRideId] = useState(null);
    const [currentRating, setCurrentRating] = useState(5);
    const [activeTab, setActiveTab] = useState('profile'); // profile, currentRide, history

    useEffect(() => {
        if (isError && message) {
            alert(message);
            dispatch(reset());
        }
    }, [isError, message, dispatch]);
    
    useEffect(() => {
        dispatch(getMyProfile());
        dispatch(getMyRides()); 
        // You can check if there's an active ride and fetch it
        // dispatch(getRideDetails(rideId)); 
    }, [dispatch]);

    const handleCancelRide = (rideId) => {
        if (window.confirm('Are you sure you want to cancel this ride?')) {
            dispatch(cancelRide(rideId));
        }
    };

    const handleRateDriver = (rideId) => {
        const ratingDto = { rideId, rating: currentRating };
        dispatch(rateDriver(ratingDto)).then((result) => {
            if (!result.error) {
                alert('Driver rated successfully!');
                setRatingRideId(null);
            }
        });
    };

    const handleViewRideDetails = (rideId) => {
        dispatch(getRideDetails(rideId));
        setActiveTab('currentRide');
    };

    // Show a loading indicator only on the initial data fetch
    if (isLoading && !profile && rides.length === 0) {
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
                    {/* PROFILE SECTION */}
                    {activeTab === 'profile' && profile && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="text-sm font-semibold text-gray-600">Name</span>
                                    <p className="text-lg text-gray-800 mt-1">{profile.user.name}</p>
                                </div>
                                
                                {/* Email */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="text-sm font-semibold text-gray-600">Email</span>
                                    <p className="text-lg text-gray-800 mt-1">{profile.user.email}</p>
                                </div>
                                
                                {/* Rating */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="text-sm font-semibold text-gray-600">Rating</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-yellow-500 text-2xl">★</span>
                                        <span className="text-lg font-semibold text-gray-800">
                                            {profile.rating ? profile.rating.toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Role */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="text-sm font-semibold text-gray-600">Role</span>
                                    <p className="text-lg text-gray-800 mt-1">
                                        {profile.user.roles && profile.user.roles.length > 0 
                                            ? profile.user.roles.join(', ') 
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CURRENT RIDE SECTION */}
                    {activeTab === 'currentRide' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Ride Details</h2>
                            {currentRide ? (
                                <div className="space-y-6">
                                    {/* Ride Status Banner */}
                                    <div className={`p-4 rounded-lg ${
                                        currentRide.rideStatues === 'CONFIRMED' ? 'bg-blue-50 border border-blue-200' :
                                        currentRide.rideStatues === 'ONGOING' ? 'bg-green-50 border border-green-200' :
                                        currentRide.rideStatues === 'ENDED' ? 'bg-gray-50 border border-gray-200' :
                                        currentRide.rideStatues === 'CANCELLED' ? 'bg-red-50 border border-red-200' :
                                        'bg-yellow-50 border border-yellow-200'
                                    }`}>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-600">Status</span>
                                            <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                                                currentRide.rideStatues === 'ENDED' ? 'bg-green-100 text-green-800' : 
                                                currentRide.rideStatues === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                                                currentRide.rideStatues === 'ONGOING' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {currentRide.rideStatues}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Driver Info */}
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Driver Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Name</span>
                                                <p className="text-lg text-gray-800 mt-1">{currentRide?.driver?.user?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Vehicle</span>
                                                <p className="text-lg text-gray-800 mt-1">
                                                    {currentRide?.driver?.vehicleModel || 'N/A'} - {currentRide?.driver?.vehiclePlate || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ride Details */}
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ride Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Pickup Location</span>
                                                <p className="text-base text-gray-800 mt-1">{currentRide?.pickupLocation || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Destination</span>
                                                <p className="text-base text-gray-800 mt-1">{currentRide?.destination || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Fare</span>
                                                <p className="text-xl font-bold text-gray-800 mt-1">${currentRide?.fare?.toFixed(2) || '0.00'}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Requested On</span>
                                                <p className="text-base text-gray-800 mt-1">
                                                    {new Date(currentRide.createdTime).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4">
                                        {currentRide.rideStatues === 'CONFIRMED' && (
                                            <button 
                                                onClick={() => handleCancelRide(currentRide.id)} 
                                                disabled={isLoading}
                                                className="bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 disabled:bg-red-300 font-semibold"
                                            >
                                                Cancel Ride
                                            </button>
                                        )}
                                        {currentRide.rideStatues === 'ENDED' && (
                                            <button 
                                                onClick={() => setRatingRideId(currentRide.id)}
                                                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 font-semibold"
                                            >
                                                Rate Driver
                                            </button>
                                        )}
                                    </div>

                                    {/* Rating Form */}
                                    {ratingRideId === currentRide.id && (
                                        <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                            <h4 className="text-lg font-semibold mb-4">Rate your driver</h4>
                                            <div className="flex items-center gap-4">
                                                <select 
                                                    value={currentRating} 
                                                    onChange={(e) => setCurrentRating(Number(e.target.value))} 
                                                    className="border-gray-300 rounded-md py-2 px-4"
                                                >
                                                    {[5,4,3,2,1].map(num => (
                                                        <option key={num} value={num}>{num} Star{num > 1 && 's'}</option>
                                                    ))}
                                                </select>
                                                <button 
                                                    onClick={() => handleRateDriver(currentRide.id)} 
                                                    disabled={isLoading}
                                                    className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 disabled:bg-green-300 font-semibold"
                                                >
                                                    Submit Rating
                                                </button>
                                                <button 
                                                    onClick={() => setRatingRideId(null)}
                                                    className="text-gray-600 hover:underline"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
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
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Ride History</h2>
                            <div className="space-y-4">
                                {rides && rides.length > 0 ? (
                                    rides.map((ride) => (
                                        <div key={ride.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800">
                                                        Ride with {ride?.driver?.user?.name || 'Unknown Driver'}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {new Date(ride.createdTime).toLocaleDateString()} at {new Date(ride.createdTime).toLocaleTimeString()}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        {ride?.pickupLocation || 'N/A'} → {ride?.destination || 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <p className="font-bold text-xl text-gray-900">${ride?.fare?.toFixed(2)}</p>
                                                    <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                                                        ride.rideStatues === 'ENDED' ? 'bg-green-100 text-green-800' : 
                                                        ride.rideStatues === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {ride.rideStatues}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* View Details Button */}
                                            <div className="mt-4 flex gap-3">
                                                <button
                                                    onClick={() => handleViewRideDetails(ride.id)}
                                                    className="text-sm bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors"
                                                >
                                                    View Details
                                                </button>
                                                {ride.rideStatues === 'ENDED' && (
                                                    <button 
                                                        onClick={() => {
                                                            setRatingRideId(ride.id);
                                                            handleViewRideDetails(ride.id);
                                                        }}
                                                        className="text-sm bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                                                    >
                                                        Rate Driver
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">You haven't taken any rides yet.</p>
                                        <button 
                                            onClick={() => navigate('/rideRequest')}
                                            className="mt-4 bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition duration-300"
                                        >
                                            Book Your First Ride
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RiderDashboard;