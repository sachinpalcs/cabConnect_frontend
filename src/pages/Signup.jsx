import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signup, reset } from '../redux/AuthSlice';

const Signup = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isSuccess, isError, isLoading, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            alert(message);
        }

        if (isSuccess) {
            alert("Signup successful! Please log in.");
            navigate('/login');
        }

        dispatch(reset());

    }, [isError, isSuccess, message, navigate, dispatch]);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const passwordsMatch = form.password === form.confirmPassword || !form.confirmPassword;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        const signupDto = {
            name: form.name,
            email: form.email,
            password: form.password,
        };

        dispatch(signup(signupDto));
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                        Sign Up
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name='name'
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="Your full name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name='email'
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative mt-1">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name='password'
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-2 text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="relative mt-1">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name='confirmPassword'
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className={`block w-full rounded-md border px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-500 ${passwordsMatch ? "border-gray-300" : "border-red-500"
                                        }`}
                                    placeholder="Re-enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-2 top-2 text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {!passwordsMatch && (
                                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 rounded-md bg-gray-600 text-white font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-black font-semibold text-base hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Signup;
