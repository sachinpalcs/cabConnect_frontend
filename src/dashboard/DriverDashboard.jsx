import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    getMyDriverProfile, 
    getMyDriverRides, 
    acceptRide, 
    rateRider,
    updateDriverAvailability,
    updateDriverLocation,
    fetchPendingRequests
} from '../redux/DriverSlice';
import MapPicker from '../component/map/MapPicker';
import GeoLocationName from '../component/map/GeoLocationName';

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
    </svg>
);

// Helper function to format date and time
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

const DriverDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // 2. SELECT the new `pendingRequests` state from the Redux store
    const { profile, rides, pendingRequests, isLoading, isError, message } = useSelector((state) => state.drivers);

    const [ratings, setRatings] = useState({});
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locationError, setLocationError] = useState('');

    useEffect(() => {
        dispatch(getMyDriverProfile());
        dispatch(getMyDriverRides()); // Fetches ride history
        dispatch(fetchPendingRequests()); // 3. DISPATCH the action to get new job offers
    }, [dispatch]);

    const rideHistory = rides?.content || [];
    const newPendingRequests = pendingRequests?.data || [];
    
    const handleAcceptRide = async (rideRequestId) => { // This is now the correct ID
        const result = await dispatch(acceptRide(rideRequestId));
        if (result.meta.requestStatus === 'fulfilled') {
            navigate(`/driver/ride`);
        }
    };
    
    const handleRatingChange = (rideId, rating) => {
        setRatings(prev => ({ ...prev, [rideId]: rating }));
    };

    const handleRateSubmit = (rideId) => {
        const rating = ratings[rideId];
        if (rating) {
            dispatch(rateRider({ rideId, rating: parseInt(rating, 10) }));
            setRatings(prev => ({ ...prev, [rideId]: '' }));
        }
    };

    const handleAvailabilityToggle = () => {
        if (profile) {
            dispatch(updateDriverAvailability(!profile.available));
        }
    };

    const handleDeviceLocationUpdate = () => {
        setLocationError('');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const locationData = {
                    currentLocation: { coordinates: [longitude, latitude], type: "Point" }
                };
                dispatch(updateDriverLocation(locationData));
                setIsLocationModalOpen(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocationError(`Error: ${error.message}. Please enable location services.`);
            },
            { enableHighAccuracy: true }
        );
    };

    const handleMapLocationUpdate = () => {
        if (selectedLocation) {
            const { lat, lng } = selectedLocation;
            const locationData = {
                currentLocation: { coordinates: [lng, lat], type: "Point" }
            };
            dispatch(updateDriverLocation(locationData));
            setIsMapModalOpen(false);
            setSelectedLocation(null);
        }
    };

    if (isLoading && !profile) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <h2 className="text-xl font-semibold text-gray-700">Loading Dashboard...</h2>
            </div>
        );
    }

    if (isError && !message.includes('location')) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <h2 className="text-xl font-semibold text-red-500">Error: {message}</h2>
            </div>
        );
    }

    return (
        <>
            {isLocationModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                        <h3 className="text-lg font-bold mb-4">Update Your Location</h3>
                        <p className="text-gray-600 mb-4">Choose how to update your position.</p>
                        {locationError && <p className="text-red-500 text-sm mb-4">{locationError}</p>}
                        <div className="flex flex-col space-y-3">
                            <button onClick={handleDeviceLocationUpdate} className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full">Use Device Location</button>
                            <button onClick={() => { setIsLocationModalOpen(false); setIsMapModalOpen(true); }} className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 w-full">Choose on Map</button>
                            <button onClick={() => setIsLocationModalOpen(false)} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 w-full mt-2">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {isMapModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
                        <h3 className="text-lg font-bold mb-4">Select Your Location</h3>
                        <p className="text-sm text-gray-500 mb-2">Click on the map to set your location.</p>
                        
                        {selectedLocation && (
                            <div className="text-sm text-gray-800 bg-gray-100 p-2 rounded-md mb-4">
                                <strong>Selected:</strong> <GeoLocationName lat={selectedLocation.lat} lng={selectedLocation.lng} />
                            </div>
                        )}
                        <MapPicker 
                            onMapClick={(latlng) => setSelectedLocation(latlng)} 
                            selectedLocation={selectedLocation}
                        />
                        <div className="flex justify-end space-x-3 mt-4">
                            <button onClick={() => { setIsMapModalOpen(false); setSelectedLocation(null); }} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                            <button 
                                onClick={handleMapLocationUpdate} 
                                disabled={!selectedLocation}
                                className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Confirm Location
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* --- SECTION 1: Profile --- */}
                    {profile && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                                <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsLocationModalOpen(true)}
                                        className="flex items-center gap-2 py-2 px-4 font-semibold text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition duration-200"
                                    >
                                        <MapPinIcon />
                                        Update Location
                                    </button>
                                    <button
                                        onClick={handleAvailabilityToggle}
                                        disabled={isLoading}
                                        className={`w-32 text-center py-2 px-5 font-bold text-white rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${profile.available ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                    >
                                        {isLoading ? '...' : profile.available ? 'Go Offline' : 'Go Online'}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                                <p><strong className="font-semibold text-gray-600">Name:</strong> {profile?.user?.name}</p>
                                <p><strong className="font-semibold text-gray-600">Email:</strong> {profile?.user?.email}</p>
                                <p><strong className="font-semibold text-gray-600">Rating:</strong> {profile?.rating?.toFixed(1) || 'N/A'} ★</p>
                                <p><strong className="font-semibold text-gray-600">Vehicle ID:</strong> {profile?.vehicleId}</p>
                                <p>
                                    <strong className="font-semibold text-gray-600">Status:</strong> 
                                    <span className={`ml-2 font-bold ${profile.available ? 'text-green-600' : 'text-red-600'}`}>
                                        {profile.available ? 'Available for Rides' : 'Offline'}
                                    </span>
                                </p>
                                <p className="sm:col-span-2">
                                    <strong className="font-semibold text-gray-600">Current Location:</strong> 
                                    <span className="ml-2 text-gray-800">
                                        {profile?.currentLocation ? <GeoLocationName lat={profile.currentLocation.coordinates[1]} lng={profile.currentLocation.coordinates[0]} /> : 'Not available'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {/* --- SECTION 2: New Ride Requests --- */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">New Ride Requests</h2>
                        <div className="space-y-4">
                            
                            {newPendingRequests.length > 0 ? (
                                newPendingRequests.map(request => (
                                    <div key={request.id} className="p-4 border-t border-gray-200 first:border-t-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 flex-grow">
                                            <p><strong className="font-semibold text-gray-600">Rider:</strong> {request?.rider?.user.name}</p>
                                            <p><strong className="font-semibold text-gray-600">Fare:</strong> ₹{request?.fare?.toFixed(2)}</p>
                                            <p className="sm:col-span-2"><strong className="font-semibold text-gray-600">From:</strong> {request?.pickUpLocation?.coordinates ? <GeoLocationName lat={request.pickUpLocation.coordinates[1]} lng={request.pickUpLocation.coordinates[0]} /> : 'N/A'}</p>
                                            <p className="sm:col-span-2"><strong className="font-semibold text-gray-600">To:</strong> {request?.dropOffLocation?.coordinates ? <GeoLocationName lat={request.dropOffLocation.coordinates[1]} lng={request.dropOffLocation.coordinates[0]} /> : 'N/A'}</p>
                                             <p><strong className="font-semibold text-gray-600">Rating:</strong> {request?.rider?.rating?.toFixed(2)}</p>
                                        </div>
                                        <div className="flex-shrink-0 w-full sm:w-auto">
                                             <button
                                                onClick={() => handleAcceptRide(request.id)}
                                                className="w-full sm:w-auto py-2 px-5 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isLoading || !profile?.available}
                                            >
                                                {!profile?.available ? 'Go Online to Accept' : (isLoading ? 'Accepting...' : 'Accept Ride')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 py-4 text-center">No new ride requests at the moment.</p>
                            )}
                        </div>
                    </div>

                    {/* --- SECTION 3: Ride History --- */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Ride History</h2>
                        <div className="space-y-4">
                             {rideHistory.length > 0 ? (
                                rideHistory.map(ride => (
                                    <div key={ride.id} className="p-4 border-t border-gray-200 first:border-t-0">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 flex-grow">
                                                <p><strong className="font-bold text-gray-700">Rider:</strong> {ride?.rider?.user.name}</p>
                                                <p><strong className="font-bold text-gray-700">Status:</strong> {ride?.rideStatues}</p>
                                                <p><strong className="font-bold text-gray-700">Payment Method:</strong> {ride?.paymentMethod}</p>
                                                <p><strong className="font-bold text-gray-700">Fare:</strong> ₹{ride?.fare?.toFixed(2)}</p>
                                                <p><strong className="font-bold text-gray-700">Rider Rating:</strong> {ride?.rider?.rating.toFixed(2)}</p>
                                                <p className="sm:col-span-2"><strong className="font-bold text-gray-700">Create Date and Time:</strong> {formatDateTime(ride.createdTime)}</p>
                                                <p className="sm:col-span-2"><strong className="font-bold text-gray-700">Start Date and Time:</strong> {formatDateTime(ride.startedAt)}</p>
                                                <p className="sm:col-span-2"><strong className="font-bold text-gray-700">End Date and Time:</strong> {formatDateTime(ride.endedAt)}</p>
                                                <p className="sm:col-span-2"><strong className="font-bold text-gray-700">Pick Up Location:</strong> {ride?.pickUpLocation?.coordinates ? <GeoLocationName lat={ride.pickUpLocation.coordinates[1]} lng={ride.pickUpLocation.coordinates[0]} /> : 'N/A'}</p>
                                                <p className="sm:col-span-2"><strong className="font-bold text-gray-700">Drop off Location:</strong> {ride?.dropOffLocation?.coordinates ? <GeoLocationName lat={ride.dropOffLocation.coordinates[1]} lng={ride.dropOffLocation.coordinates[0]} /> : 'N/A'}</p>

                                                <p><strong className="font-bold text-gray-700">Driver:</strong> {ride?.driver?.user.name}</p>
                                                <p><strong className="font-bold text-gray-700">Vehicle ID:</strong> {ride?.driver?.vehicleId}</p>
                                            </div>
                                            {ride.rideStatues === 'ENDED' && (
                                                <div className="flex-shrink-0 w-full sm:w-auto flex items-center gap-2">
                                                     <input 
                                                        type="number" 
                                                        min="1" max="5" 
                                                        placeholder="Rate" 
                                                        value={ratings[ride.id] || ''}
                                                        onChange={(e) => handleRatingChange(ride.id, e.target.value)}
                                                        className="w-20 p-2 border rounded-md"
                                                    />
                                                    <button 
                                                        onClick={() => handleRateSubmit(ride.id)}
                                                        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 py-4 text-center">No past rides found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DriverDashboard;