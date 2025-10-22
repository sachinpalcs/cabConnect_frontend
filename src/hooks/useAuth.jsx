import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
    const { accessToken } = useSelector((state) => state.auth);

    let isAdmin = false;
    let isDriver = false;
    let isRider = false;
    let roles = [];

    if (accessToken) {
        try {
            const decoded = jwtDecode(accessToken);
            roles = decoded.roles || [];
            isAdmin = roles.includes('ADMIN');
            isDriver = roles.includes('DRIVER');
            isRider = roles.includes('RIDER');
        } catch (error) {
            console.error("Failed to decode JWT:", error);
            return { isAdmin: false, isDriver: false, isRider: false, roles: [] };
        }
    }

    return { isAdmin, isDriver, isRider, roles };
};
