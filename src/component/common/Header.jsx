import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearAuth, logout} from '../../redux/AuthSlice';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { accessToken } = useSelector((state) => state.auth);

    const { isAdmin, isDriver, isRider } = useAuth();

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearAuth())
        navigate('/login');
    };
    const navLinkClasses = ({ isActive }) =>
        `px-2 py-1 rounded transition duration-200 ${
            isActive ? "underline underline-offset-4" : "hover:bg-gray-700"
        }`;

    return (
        <header className="bg-gray-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

                {/* Logo */}
                <NavLink to="/" className="text-2xl font-bold tracking-wide">
                    CabConnect
                </NavLink>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center space-x-6">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `px-2 py-1 rounded transition duration-200 ${isActive ? "underline underline-offset-4" : "hover:bg-gray-700"
                            }`
                        }
                    >
                        Home
                    </NavLink>
                    {!accessToken ? (
                        <>
                            <NavLink to="/rideRequest" className={navLinkClasses}>
                                Book a Ride
                            </NavLink>
                        </>
                    ) : (
                        <>
                            {isRider && (
                                <>
                                    <NavLink to="/rider/dashboard" className={navLinkClasses}>
                                            Dashboard
                                    </NavLink>
                                    <NavLink to="/rideRequest" className={navLinkClasses}>
                                            Book a Ride
                                    </NavLink>
                                </>
                            )}
                            {isDriver && (
                                <>
                                    <NavLink to="/driver/dashboard" className={navLinkClasses}>
                                            Dashboard
                                    </NavLink>
                                    <NavLink to="/driver/ride" className={navLinkClasses}>
                                            Active Ride
                                    </NavLink>
                                </>
                            )}
                            {isAdmin && (
                                <NavLink to="/admin/dashboard" className={navLinkClasses}>
                                     Admin Panel
                                </NavLink>
                            )}
                        </>
                    )}

                    <NavLink
                        to="/about-us"
                        className={({ isActive }) =>
                            `px-2 py-1 rounded transition duration-200 ${isActive ? "underline underline-offset-4" : "hover:bg-gray-700"
                            }`
                        }
                    >
                        About Us
                    </NavLink>
                    <NavLink
                        to="/contact-us"
                        className={({ isActive }) =>
                            `px-2 py-1 rounded transition duration-200 ${isActive ? "underline underline-offset-4" : "hover:bg-gray-700"
                            }`
                        }
                    >
                        Contact Us
                    </NavLink>
                </nav>

                {/* Right Side Buttons: Changes based on login state */}
                <div className="space-x-4">
                    {accessToken ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 hover:bg-red-600"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className="bg-white text-black px-4 py-2 rounded-lg font-semibold transition duration-200 hover:bg-gray-300"
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/signup"
                                className="bg-white text-black px-4 py-2 rounded-lg font-semibold transition duration-200 hover:bg-gray-300"
                            >
                                Signup
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;