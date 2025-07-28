import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import { Navigate } from 'react-router';

const AdminRoute = ({children}) => {

    const {user, loading} = useAuth();
    const {role, isRoleLoading} = useUserRole();

    if (loading || isRoleLoading) {
        return <span className="loading loading-dots loading-xl"></span>
    }

    if (!user || role !== 'admin') {
        return <Navigate to='/forbidden'></Navigate>
    }


    return children;
};

export default AdminRoute;