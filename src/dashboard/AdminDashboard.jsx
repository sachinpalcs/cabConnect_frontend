

// const AdminDashboard = () => {
//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//       <p className="mt-4">Welcome, Admin. Manage drivers, riders, and view system analytics.</p>
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onboardDriver, reset } from '../redux/AdminSlice';

const AdminDashboard = () => {
    const [formData, setFormData] = useState({
        userId: '',
        vehicleId: '',
    });

    const dispatch = useDispatch();
    const { isLoading, isSuccess, isError, message, onboardedDriver } = useSelector((state) => state.admin);

    useEffect(() => {
        if (isError) {
            alert(message || 'Failed to onboard driver.');
            dispatch(reset());
        }
        if (isSuccess) {
            alert(`Driver successfully onboarded! New Driver ID: ${onboardedDriver.id}`);
            // Clear the form on success
            setFormData({ userId: '', vehicleId: '' });
            dispatch(reset());
        }
    }, [isError, isSuccess, message, onboardedDriver, dispatch]);

    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.userId || !formData.vehicleId) {
            alert('Please fill out both User ID and Vehicle ID.');
            return;
        }
        dispatch(onboardDriver(formData));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

                {/* Onboard Driver Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Onboard New Driver</h2>
                    <p className="text-sm text-gray-500 mb-6">Enter the User ID of an existing RIDER and their Vehicle ID to upgrade them to a DRIVER.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                                User ID
                            </label>
                            <input
                                type="text"
                                id="userId"
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="e.g., 42"
                            />
                        </div>
                        <div>
                            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">
                                Vehicle ID / License Plate
                            </label>
                            <input
                                type="text"
                                id="vehicleId"
                                name="vehicleId"
                                value={formData.vehicleId}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="e.g., UP65AB1234"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                            >
                                {isLoading ? 'Onboarding...' : 'Onboard Driver'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

