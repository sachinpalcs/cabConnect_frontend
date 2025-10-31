import React from 'react';
import { Link } from 'react-router-dom';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-blue-600">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-green-600">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path>
    </svg>
);

const CarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2 text-gray-700">
        <path d="M14 16.94V18a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1.06"></path><path d="M14 9h4l3 5v3a1 1 0 0 1-1 1h-1"></path><path d="M4 17a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h2"></path><path d="M18 17h1a1 1 0 0 0 1-1v-3l-3-5h-4l-3 5"></path><path d="M2 12h3"></path><path d="m19 12 3-5"></path><path d="M5 7 2 2"></path><path d="M12 2v3"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle>
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2 text-gray-700">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
    </svg>
);


const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
                    About CabConnect
                </h1>
                <p className="text-center text-xl text-gray-600 mb-12">
                    Connecting riders and drivers, one journey at a time.
                </p>

                {/* Main Content Area */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    
                    {/* Our Mission */}
                    <div className="p-8 md:p-12 text-center border-b border-gray-200">
                        <div className="flex justify-center mb-4">
                            <EyeIcon />
                        </div>
                        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Our mission is to provide safe, reliable, and affordable transportation for everyone. We believe in creating opportunities for our driver-partners and a seamless, modern experience for our riders.
                        </p>
                    </div>

                    {/* Our Story */}
                    <div className="p-8 md:p-12 bg-gray-50 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0 flex justify-center">
                                <HistoryIcon />
                            </div>
                            <div>
                                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Story</h2>
                                <p className="text-lg text-gray-600 mb-4">
                                    Founded in 2025, CabConnect started with a simple idea: to make getting around the city easier. We saw the challenges in urban mobility and decided to build a platform that wasn't just a service, but a community.
                                </p>
                                <p className="text-lg text-gray-600">
                                    From a small team with a big dream, we've grown into a trusted network, tirelessly working to improve our technology and expand our reach, all while keeping our users at the heart of everything we do.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What We Offer */}
                    <div className="p-8 md:p-12">
                        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">What We Offer</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* For Riders */}
                            <div className="bg-white p-6 rounded-lg border border-gray-200">
                                <div className="flex items-center mb-3">
                                    <UserIcon />
                                    <h3 className="text-2xl font-semibold text-gray-800">For Riders</h3>
                                </div>
                                <p className="text-gray-600">
                                    Get where you're going quickly and safely. With upfront pricing, real-time tracking, and 24/7 support, your peace of mind is our priority.
                                </p>
                                <Link 
                                    to="/rideRequest" 
                                    className="mt-4 inline-block text-blue-600 font-medium hover:underline"
                                >
                                    Book a Ride →
                                </Link>
                            </div>
                            {/* For Drivers */}
                            <div className="bg-white p-6 rounded-lg border border-gray-200">
                                <div className="flex items-center mb-3">
                                    <CarIcon />
                                    <h3 className="text-2xl font-semibold text-gray-800">For Drivers</h3>
                                </div>
                                <p className="text-gray-600">
                                    Be your own boss. We offer flexible hours, competitive earnings, and a supportive team to help you succeed on the road.
                                </p>
                                <Link 
                                    to="/contact-us" 
                                    className="mt-4 inline-block text-green-600 font-medium hover:underline"
                                >
                                    Drive with Us →
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="p-8 md:p-12 bg-gray-50 text-center border-t border-gray-200">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Join the Journey</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                            Whether you're a rider needing a lift or a driver looking for an opportunity, we invite you to be a part of the CabConnect community.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link 
                                to="/signup"
                                className="py-3 px-6 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow"
                            >
                                Sign Up to Ride
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AboutUs;
