import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestRide, reset as resetRiderState } from '../redux/RiderSlice'; 
import MapComponent from '../component/map/MapPicker';
import { FaMapMarkerAlt, FaRegDotCircle } from 'react-icons/fa';

const Ride = () => {
    const dispatch = useDispatch();
    const { rideRequest, isLoading, isError, message } = useSelector((state) => state.rider);
    
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropoffLocation, setDropoffLocation] = useState(null);
    const [selecting, setSelecting] = useState('pickup'); // 'pickup' or 'dropoff'
    const [estimatedFare, setEstimatedFare] = useState(0);

    // Clean up Redux state on component unmount to prevent stale data
    useEffect(() => {
        return () => {
            dispatch(resetRiderState());
        }
    }, [dispatch]);

    // Simple fare estimation logic (for demonstration)
    useEffect(() => {
        if (pickupLocation && dropoffLocation) {
            // A real app would use the distance service here.
            // This is a simplified calculation for UI purposes.
            const latDiff = Math.abs(pickupLocation.lat - dropoffLocation.lat);
            const lngDiff = Math.abs(pickupLocation.lng - dropoffLocation.lng);
            const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 100; // Rough distance factor
            const fare = Math.max(50, Math.round(distance * 15)); // Base fare ₹50, ₹15/km
            setEstimatedFare(fare);
        } else {
            setEstimatedFare(0);
        }
    }, [pickupLocation, dropoffLocation]);

    const handleMapClick = (latlng) => {
        if (selecting === 'pickup') {
            setPickupLocation(latlng);
            setSelecting('dropoff'); 
        } else {
            setDropoffLocation(latlng);
        }
    };

    const handleRideRequest = (e) => {
        e.preventDefault();
        if (!pickupLocation || !dropoffLocation) {
            alert('Please select both a pickup and drop-off location on the map.');
            return;
        }

        const rideRequestDto = {
            pickUpLocation: {
                type: "Point",
                coordinates: [pickupLocation.lng, pickupLocation.lat]
            },
            dropOffLocation: {
                type: "Point",
                coordinates: [dropoffLocation.lng, dropoffLocation.lat]
            },
            paymentMethod: "WALLET", 
            fare: estimatedFare
        };

        dispatch(requestRide(rideRequestDto));
    };

    const handleReset = () => {
        setPickupLocation(null);
        setDropoffLocation(null);
        setSelecting('pickup');
        dispatch(resetRiderState());
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Request a Ride</h1>
                <p className="text-center text-gray-600 mb-6">
                    {rideRequest ? 'Your ride is on its way!' : 
                        selecting === 'pickup' 
                        ? 'Click on the map to set your pickup location.' 
                        : 'Now, click on the map to set your drop-off location.'}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Map Section */}
                    <div className="lg:col-span-2 h-96 lg:h-[600px] rounded-2xl shadow-lg overflow-hidden border">
                        <MapComponent 
                            onMapClick={handleMapClick} 
                            pickup={pickupLocation} 
                            dropoff={dropoffLocation} 
                        />
                    </div>

                    {/* Ride Details & Request Section */}
                    <form onSubmit={handleRideRequest} className="bg-white p-6 rounded-2xl shadow-lg border">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Trip Details</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <FaMapMarkerAlt className="text-green-500 text-xl"/>
                                <div>
                                    <h3 className="font-medium text-gray-600">Pickup Location</h3>
                                    <p className="text-gray-800 text-sm">
                                        {pickupLocation ? `${pickupLocation.lat.toFixed(4)}, ${pickupLocation.lng.toFixed(4)}` : 'Not selected'}
                                    </p>
                                </div>
                            </div>
                             <div className="flex items-center space-x-3">
                                <FaRegDotCircle className="text-red-500 text-xl"/>
                                <div>
                                    <h3 className="font-medium text-gray-600">Drop-off Location</h3>
                                    <p className="text-gray-800 text-sm">
                                        {dropoffLocation ? `${dropoffLocation.lat.toFixed(4)}, ${dropoffLocation.lng.toFixed(4)}` : 'Not selected'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={handleReset}
                                className="w-full text-sm text-center text-gray-600 hover:text-black transition"
                            >
                                Reset Locations
                            </button>
                        </div>
                        
                        <div className="mt-6 border-t pt-6 space-y-4">
                             <div>
                                <h3 className="font-medium text-gray-600">Estimated Fare</h3>
                                <p className="text-2xl font-bold text-gray-800">
                                    ₹ {estimatedFare.toFixed(2)}
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !pickupLocation || !dropoffLocation || rideRequest}
                                className="w-full py-3 px-4 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-black transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Requesting...' : rideRequest ? 'Ride Requested' : 'Confirm Ride'}
                            </button>
                        </div>

                        {/* Feedback Messages */}
                        {isError && (
                            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center text-sm">
                                Error: {message}
                            </div>
                        )}
                        {rideRequest && !isError && (
                             <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center text-sm">
                                Success! Your ride has been requested. We are searching for a driver near you.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Ride;

