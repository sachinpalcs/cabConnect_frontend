import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, getMyRides, cancelRide, rateDriver, reset } from '../redux/RiderSlice';


const RiderDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { profile, rides, isLoading, isError, message } = useSelector((state) => state.rider);

    const [ratingRideId, setRatingRideId] = useState(null);
    const [currentRating, setCurrentRating] = useState(5);

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

    // Show a loading indicator only on the initial data fetch
    if (isLoading && !profile && rides.length === 0) {
        return <div className="text-center p-10 text-xl font-semibold">Loading your dashboard...</div>;
    }

    return (
         <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section - Centered */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Rider Dashboard</h1>
                        <button 
                            onClick={() => navigate('/rideRequest')}
                            className="bg-black text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition duration-300"
                        >
                            Book a New Ride
                        </button>
                    </div>
                    
                    {/* Profile Section with Grid Layout */}
                    {profile && (
                        <div className="border-t pt-6 mt-4">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Profile</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Name */}
                                <div>
                                    <span className="text-sm font-semibold text-gray-600">Name:</span>
                                    <p className="text-lg text-gray-800 mt-1">{profile.user.name}</p>
                                </div>
                                
                                {/* Email */}
                                <div>
                                    <span className="text-sm font-semibold text-gray-600">Email:</span>
                                    <p className="text-lg text-gray-800 mt-1">{profile.user.email}</p>
                                </div>
                                
                                {/* Rating */}
                                <div>
                                    <span className="text-sm font-semibold text-gray-600">Rating:</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-yellow-500 text-xl">★</span>
                                        <span className="text-lg font-semibold text-gray-800">
                                            {profile.rating ? profile.rating.toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Role */}
                                <div>
                                    <span className="text-sm font-semibold text-gray-600">Role:</span>
                                    <p className="text-lg text-gray-800 mt-1">
                                        {profile.user.roles && profile.user.roles.length > 0 
                                            ? profile.user.roles.join(', ') 
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>        
                        </div>
                    )}
                </div>

                {/* Ride History Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Ride History</h2>
                    <div className="space-y-4">
                        {rides && rides.length > 0 ? (
                            rides.map((ride) => (
                                <div key={ride.id} className="border-b border-gray-200 py-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800">Ride with {ride?.driver?.user?.name}</p>
                                            <p className="text-sm text-gray-500">On {new Date(ride.createdTime).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-lg text-gray-900">${ride?.fare?.toFixed(2)}</p>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                ride.rideStatues === 'ENDED' ? 'bg-green-100 text-green-800' : 
                                                ride.rideStatues === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {ride.rideStatues}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* ACTION BUTTONS */}
                                    {/* <div className="mt-4 flex gap-4 items-center">
                                        {ride.rideStatues === 'CONFIRMED' && (
                                            <button onClick={() => handleCancelRide(ride.id)} disabled={isLoading} className="text-sm bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 disabled:bg-red-300">
                                                Cancel Ride
                                            </button>
                                        )}
                                        {ride.rideStatues === 'ENDED' && (
                                            <button onClick={() => setRatingRideId(ride.id)} className="text-sm bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600">
                                                Rate Driver
                                            </button>
                                        )}
                                    </div> */}

                                    {/* RATING FORM (Conditional) */}
                                    {ratingRideId === ride.id && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                            <h4 className="text-sm font-semibold mb-2">Rate your driver:</h4>
                                            <div className="flex items-center gap-4">
                                                <select value={currentRating} onChange={(e) => setCurrentRating(Number(e.target.value))} className="border-gray-300 rounded-md">
                                                    {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Star{num > 1 && 's'}</option>)}
                                                </select>
                                                <button onClick={() => handleRateDriver(ride.id)} disabled={isLoading} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-green-300">
                                                    Submit Rating
                                                </button>
                                                <button onClick={() => setRatingRideId(null)} className="text-sm text-gray-600 hover:underline">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">You haven't taken any rides yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderDashboard;


