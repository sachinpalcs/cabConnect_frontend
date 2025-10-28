import React, { useEffect, useRef, useState } from 'react';
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
import RideHistory from '../pages/RideHistory';


const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
    </svg>
);


const DriverDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile, rides, pendingRequests, isLoading, isError, message } = useSelector((state) => state.drivers);

    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locationError, setLocationError] = useState('');

    const [activeTab, setActiveTab] = useState('profile');

    const preRequestCount = useRef(0);

    useEffect(() => {
        dispatch(getMyDriverProfile());
        dispatch(getMyDriverRides());
        dispatch(fetchPendingRequests());
    }, [dispatch]);


    useEffect(() => {
        if (profile?.available) {
            const interval =setInterval(() => {
                dispatch(fetchPendingRequests());

            }, 3000);
            return ()=> clearInterval(interval);
        }
    }, [dispatch, profile?.available]);

    const rideHistory = rides?.content || [];
    const newPendingRequests = pendingRequests?.data || [];


    useEffect(() => {
        const currentCount = newPendingRequests.length;
        if(currentCount > 0 && currentCount > preRequestCount.current) {
            if (activeTab !== 'requests')
                setActiveTab('requests');
        }
        preRequestCount.current = currentCount;
    }, [newPendingRequests.length, activeTab]);
    
    const handleAcceptRide = async (rideRequestId) => {
        const result = await dispatch(acceptRide(rideRequestId));
        if (result.meta.requestStatus === 'fulfilled') {
            navigate(`/driver/ride`);
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

    const handleRateRiderSubmit = (rideId, rating) => {
        dispatch(rateRider({ rideId, rating })).then((result) => {
            if (!result.error) {
                alert('Rider rated successfully!');
                dispatch(getMyDriverRides());
            }
        });
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

            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Header Section (Adapted for Driver) */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <h1 className="text-3xl font-bold text-gray-800">Driver Dashboard</h1>
                            
                            {/* Driver-specific controls, moved here from old profile card */}
                            {profile && (
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
                            )}
                        </div>
                    </div>

                    {/* Tabs Navigation (Adapted for Driver) */}
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
                                onClick={() => setActiveTab('requests')}
                                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                                    activeTab === 'requests'
                                        ? 'border-b-2 border-black text-black'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Ride Requests ({newPendingRequests.length})
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

                    {/* Content Sections (Single card with conditional content) */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        
                        {/* --- PROFILE TAB --- */}
                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
                                {profile ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <span className="text-sm font-semibold text-gray-600">Name</span>
                                            <p className="text-lg text-gray-800 mt-1">{profile.user?.name || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <span className="text-sm font-semibold text-gray-600">Email</span>
                                            <p className="text-lg text-gray-800 mt-1">{profile.user?.email || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <span className="text-sm font-semibold text-gray-600">Rating</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-yellow-500 text-2xl">★</span>
                                                <span className="text-lg font-semibold text-gray-800">
                                                    {profile.rating ? profile.rating.toFixed(1) : '0.0'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <span className="text-sm font-semibold text-gray-600">Vehicle ID</span>
                                            <p className="text-lg text-gray-800 mt-1">{profile.vehicleId || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <span className="text-sm font-semibold text-gray-600">Status</span>
                                            <p className={`text-lg font-semibold mt-1 ${profile.available ? 'text-green-600' : 'text-red-600'}`}>
                                                {profile.available ? 'Available' : 'Offline'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                                            <span className="text-sm font-semibold text-gray-600">Current Location</span>
                                            <p className="text-lg text-gray-800 mt-1">
                                                {profile?.currentLocation ? <GeoLocationName lat={profile.currentLocation.coordinates[1]} lng={profile.currentLocation.coordinates[0]} /> : 'Not available'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">Loading profile...</p>
                                )}
                            </div>
                        )}

                        {/* --- RIDE REQUESTS TAB --- */}
                        {activeTab === 'requests' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">New Ride Requests</h2>
                                <div className="space-y-4">
                                    {newPendingRequests.length > 0 ? (
                                        newPendingRequests.map(request => (
                                            <div key={request.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition">
                                                <div className="flex flex-col lg:flex-row justify-between gap-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 flex-grow">
                                                        <div>
                                                            <span className="text-sm font-semibold text-gray-600">Rider</span>
                                                            <p className="text-lg text-gray-800 mt-1">{request?.rider?.user.name}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-semibold text-gray-600">Rider Rating</span>
                                                            <p className="text-lg text-gray-800 mt-1">{request?.rider?.rating?.toFixed(1)} ★</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-semibold text-gray-600">Fare</span>
                                                            <p className="text-xl font-bold text-gray-800 mt-1">₹{request?.fare?.toFixed(1)}</p>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <span className="text-sm font-semibold text-gray-600">From</span>
                                                            <p className="text-gray-800 mt-1">{request?.pickUpLocation?.coordinates ? <GeoLocationName lat={request.pickUpLocation.coordinates[1]} lng={request.pickUpLocation.coordinates[0]} /> : 'N/A'}</p>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <span className="text-sm font-semibold text-gray-600">To</span>
                                                            <p className="text-gray-800 mt-1">{request?.dropOffLocation?.coordinates ? <GeoLocationName lat={request.dropOffLocation.coordinates[1]} lng={request.dropOffLocation.coordinates[0]} /> : 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0 flex flex-col justify-center items-center gap-3 lg:border-l lg:pl-6 border-gray-200">
                                                        <button
                                                            onClick={() => handleAcceptRide(request.id)}
                                                            className="w-full sm:w-auto py-3 px-6 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            disabled={isLoading || !profile?.available}
                                                        >
                                                            {!profile?.available ? 'Go Online to Accept' : (isLoading ? 'Accepting...' : 'Accept Ride')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 py-8 text-center">No new ride requests at the moment.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- RIDE HISTORY TAB --- */}

                        {activeTab === 'history' && (
                            <RideHistory
                                rideHistory={rideHistory}
                                isLoading={isLoading}
                                userType="driver"
                                onRateSubmit={handleRateRiderSubmit}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DriverDashboard;