import React, { useState } from 'react';
import GeoLocationName from '../component/map/GeoLocationName';


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

const RideHistory = ({ rideHistory, isLoading, userType, onRateSubmit }) => {
    const [ratings, setRatings] = useState({});

    const handleRatingChange = (rideId, rating) => {
        setRatings(prev => ({ ...prev, [rideId]: rating }));
    };

    const handleRateSubmit = (rideId) => {
        const rating = ratings[rideId];
        if (!rating || rating < 1 || rating > 5) {
            alert('Please enter a valid rating between 1 and 5');
            return;
        }

        onRateSubmit(rideId, Number(rating));

        setRatings(prev => {
            const newRatings = { ...prev };
            delete newRatings[rideId];
            return newRatings;
        });
    };

    const isRiderView = userType === 'rider';

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Ride History</h2>
            <div className="space-y-4">
                {rideHistory.length > 0 ? (
                    rideHistory.map(ride => (
                        <div key={ride.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition">
                            <div className="flex flex-col lg:flex-row justify-between gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 flex-grow">
                                    
                                    {/* --- Status --- */}
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Status</span>
                                        <p className={`mt-1 inline-block px-2 py-1 rounded text-sm font-semibold ${
                                            ride.rideStatues === 'ENDED' ? 'bg-green-100 text-green-800' :
                                            ride.rideStatues === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                            ride.rideStatues === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {ride.rideStatues}
                                        </p>
                                    </div>
                                    
                                    {/* --- Fare --- */}
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Fare</span>
                                        <p className="text-lg font-bold text-gray-800 mt-1">₹{ride?.fare?.toFixed(2)}</p>
                                    </div>

                                    {/* --- Conditional Fields (Rider vs Driver) --- */}
                                    {isRiderView ? (
                                        <>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Driver</span>
                                                <p className="text-gray-800 mt-1">{ride?.driver?.user?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Vehicle ID</span>
                                                <p className="text-gray-800 mt-1">{ride?.driver?.vehicleId || 'N/A'}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Rider</span>
                                                <p className="text-gray-800 mt-1">{ride?.rider?.user.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-600">Rider Rating</span>
                                                <p className="text-gray-800 mt-1">{ride?.rider?.rating?.toFixed(2) || 'N/A'} ★</p>
                                            </div>
                                        </>
                                    )}

                                    {/* --- Payment Method --- */}
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Payment Method</span>
                                        <p className="text-gray-800 mt-1">{ride?.paymentMethod || 'N/A'}</p>
                                    </div>
                                    
                                    {/* --- Created Time --- */}
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Created</span>
                                        <p className="text-gray-800 mt-1">{formatDateTime(ride.createdTime)}</p>
                                    </div>

                                    {/* --- Started At --- */}
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Started</span>
                                        <p className="text-gray-800 mt-1">{formatDateTime(ride.startedAt)}</p>
                                    </div>

                                    {/* --- Ended At --- */}
                                    <div>
                                        <span className="text-sm font-semibold text-gray-600">Ended</span>
                                        <p className="text-gray-800 mt-1">{formatDateTime(ride.endedAt)}</p>
                                    </div>

                                    {/* --- Pickup Location --- */}
                                    <div className="md:col-span-2">
                                        <span className="text-sm font-semibold text-gray-600">Pickup Location</span>
                                        <p className="text-gray-800 mt-1">
                                            {ride?.pickUpLocation?.coordinates ? 
                                                <GeoLocationName 
                                                    lat={ride.pickUpLocation.coordinates[1]} 
                                                    lng={ride.pickUpLocation.coordinates[0]} 
                                                /> : 'N/A'}
                                        </p>
                                    </div>
                                    
                                    {/* --- Drop-off Location --- */}
                                    <div className="md:col-span-2">
                                        <span className="text-sm font-semibold text-gray-600">Drop-off Location</span>
                                        <p className="text-gray-800 mt-1">
                                            {ride?.dropOffLocation?.coordinates ? 
                                                <GeoLocationName 
                                                    lat={ride.dropOffLocation.coordinates[1]} 
                                                    lng={ride.dropOffLocation.coordinates[0]} 
                                                /> : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* --- Conditional Rating Section --- */}
                                {ride.rideStatues === 'ENDED' && (
                                    <div className="flex-shrink-0 flex flex-col justify-center items-center gap-3 lg:border-l lg:pl-6 border-gray-200">
                                        <span className="text-sm font-semibold text-gray-600">
                                            {isRiderView ? 'Rate Driver' : 'Rate Rider'}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                min="1" max="5" 
                                                placeholder="1-5" 
                                                value={ratings[ride.id] || ''}
                                                onChange={(e) => handleRatingChange(ride.id, e.target.value)}
                                                className="w-20 p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button 
                                                onClick={() => handleRateSubmit(ride.id)}
                                                disabled={!ratings[ride.id] || isLoading}
                                                className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-semibold"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 py-8 text-center">No past rides found.</p>
                )}
            </div>
        </div>
    );
};

export default RideHistory;