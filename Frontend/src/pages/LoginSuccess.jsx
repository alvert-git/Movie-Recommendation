import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 1. Extract the token from the URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // 2. Save the token to localStorage
            localStorage.setItem('token', token);
            
            // 3. Redirect to dashboard
            navigate('/dashboard');
        } else {
            // If something went wrong, go back to login
            navigate('/login');
        }
    }, [location, navigate]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-white text-xl animate-pulse">
                Loading... 🍿
            </div>
        </div>
    );
};

export default LoginSuccess;