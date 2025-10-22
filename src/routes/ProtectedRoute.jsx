// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

// const ProtectedRoute = ({ children, allowedRoles }) => {
//     const { roles, accessToken } = useAuth();

//     if (!accessToken) {
//         // User not logged in
//         return <Navigate to="/login" replace />;
//     }

//     const hasRequiredRole = allowedRoles.some(role => roles.includes(role));

//     if (!hasRequiredRole) {
//         // User does not have the required role
//         // Redirect to a 'not-authorized' page or home
//         return <Navigate to="/" replace />;
//     }

//     return children;
// };

// export default ProtectedRoute;

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { accessToken } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!accessToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // const decodedToken = jwtDecode(accessToken);
    // const userRoles = decodedToken.roles || [];

    let userRoles = [];
    try {
        const decodedToken = jwtDecode(accessToken);
        const rolesFromToken = decodedToken.roles || [];

        if (typeof rolesFromToken === 'string' && rolesFromToken.startsWith('[') && rolesFromToken.endsWith(']')) {
            userRoles = rolesFromToken.replace(/[\[\]]/g, '').split(',');
        } else if (Array.isArray(rolesFromToken)) {
            userRoles = rolesFromToken;
        }

    } catch (error) {
        console.error("Failed to decode or parse roles from JWT:", error);
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));

    if (!hasRequiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;