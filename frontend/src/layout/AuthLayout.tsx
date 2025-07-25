import { Navigate, Outlet } from 'react-router-dom';
import { ApplicationRoutes } from '../utils/constants';
import { AuthClient } from '@dfinity/auth-client';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/TyreLoading/TyreLoading';

const AuthLayout = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const checkAuth = async () => {
    // authorized using icp
    setIsLoading(true);
    const authClient = await AuthClient.create();
    const isAuthenticatedWithID = await authClient.isAuthenticated();
    setIsAuthenticated(isAuthenticatedWithID);
    setIsLoading(false);
  };

  useEffect(
    () => {
      checkAuth();
    },
    [],
  );

  if (isLoading) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!isLoading && !isAuthenticated) {
    return <Navigate to={ApplicationRoutes.LoginPage} />;
  }

  return <Outlet />;
};

export default AuthLayout;
