import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaInstagram, FaTwitter, FaYoutube, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Social Media Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <FaInstagram className="text-pink-500" /> 
              <a href="#" className="hover:underline">Instagram</a>
            </li>
            <li className="flex items-center gap-2">
              <FaTwitter className="text-blue-400" /> 
              <a href="#" className="hover:underline">Twitter</a>
            </li>
            <li className="flex items-center gap-2">
              <FaYoutube className="text-red-600" /> 
              <a href="#" className="hover:underline">YouTube</a>
            </li>
            <li className="flex items-center gap-2">
              <FaLinkedin className="text-blue-700" /> 
              <a href="#" className="hover:underline">LinkedIn</a>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><NavLink to="/contact" className="hover:underline">Contact Us</NavLink></li>
            <li><NavLink to="/safety" className="hover:underline">Safety</NavLink></li>
          </ul>
        </div>

        {/* Emergency Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Emergency Call</h3>
          <p className="text-xl font-bold">100 / 112</p>
          <p className="text-sm mt-1">Available 24/7 Nationwide</p>
        </div>

      </div>

      <div className="mt-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} CabConnect. All rights reserved.
      </div>
    </footer>
    </>
  )
}

export default Footer
