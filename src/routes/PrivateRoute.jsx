import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({children}) => {
    const location = useLocation();

    const {user, loading} = useAuth();

    if (loading) {
        return <span className="loading loading-ring loading-xl"></span>
    }

    if (!user) {
        return <Navigate to='/login' state={location.pathname}></Navigate>
    }

    return children;
};

export default PrivateRoute;