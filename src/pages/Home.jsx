import React from 'react'

const Home = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-[80vh] bg-gray-100">
      
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center">
            Go anywhere with <span className="text-black">CabConnect</span>
        </h1>

        {/* Form Section */}
        <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-md">
            <label className="block text-gray-700 font-medium mb-1">Pick-up Location</label>
            <input
            type="text"
            placeholder="Enter pick-up location"
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring focus:ring-gray-400"
            />

            <label className="block text-gray-700 font-medium mb-1">Drop Location</label>
            <input
            type="text"
            placeholder="Enter drop location"
            className="w-full p-2 border rounded mb-6 focus:outline-none focus:ring focus:ring-gray-400"
            />

            {/* Book Ride Button */}
            <button className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition">
            Book Ride
            </button>
        </div>
      </div>
      </>
  )
}

export default Home;
