// import React, { useState } from 'react'

// const Login = () => {
//     const[form, setForm] = useState({
//         email: "",
//         password: "",
//     });

//     const handleSubmit = (e)=>{
//         e.prevenntDefault();
//     }

//     const handleChange = (e)=> {
//         setForm({...form, [e.target.name] : e.target.value})
//     }

//     const[showPassword, setShowPassword] = useState(false);

//   return (
//     <>
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
//         <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8">
//           <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
//             Log In
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 name='email'
//                 value={form.email}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                 placeholder="you@example.com"
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <div className="relative mt-1">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name='password'
//                   value={form.password}
//                   onChange={handleChange}
//                   className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                   placeholder="Enter password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-2 top-2 text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
//                 >
//                   {showPassword ? "Hide" : "Show"}
//                 </button>
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               className="w-full py-2 rounded-md bg-gray-600 text-white font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
//             >
//               Log In
//             </button>
//           </form>

//           <p className="mt-4 text-center text-sm text-gray-600">
//             Don't have an account?{" "}
//             <a href="/signup" className="text-black font-semibold text-base hover:underline">
//               Sign up
//             </a>
//           </p>
//         </div>
//       </div>
//     </>
//   )
// }

// export default Login


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../redux/AuthSlice';
import { useAuth } from '../hooks/useAuth';


// console.log('Is the login action defined on import?', login);
const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { accessToken, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
    
    // Use the custom hook to get role information once the token is available
    const { isAdmin, isDriver, isRider } = useAuth();

    useEffect(() => {
        if (isError) {
            alert(message);
            dispatch(reset());
        }

        // Handle login success
        if (isSuccess && accessToken) {
            if (isAdmin) {
                navigate('/admin/dashboard');
            } else if (isDriver) {
                navigate('/driver/dashboard');
            } else if (isRider) {
                navigate('/rider/dashboard');
            } else {
                navigate('/');
            }
            dispatch(reset());
        }

    }, [accessToken, isError, isSuccess, message, navigate, dispatch, isAdmin, isDriver, isRider]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const loginRequestDto = {
            email: form.email,
            password: form.password,
        };
        dispatch(login(loginRequestDto));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                        Log In
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 rounded-md bg-gray-600 text-white font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-black font-semibold text-base hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
