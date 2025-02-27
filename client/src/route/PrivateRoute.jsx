import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const isLoggedIn = useSelector(state => state.user.token);
  console.log('🚀 > PrivateRoute > isLoggedIn:', isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoute;
