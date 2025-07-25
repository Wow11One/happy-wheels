import { Navigate, Outlet } from 'react-router-dom';
import { ApplicationRoutes } from '../utils/constants';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/TyreLoading/TyreLoading';
import { useAuth } from '../hooks/auth.hooks';

const AuthLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isComponentRendered, setIsComponentRendered] = useState(false);
  const { authUser, fetchAuthUser } = useAuth();

  const checkAuth = async () => {
    setIsLoading(true);

    await fetchAuthUser();

    setIsLoading(false);
  };

  useEffect(() => {
    if (!isComponentRendered) {
      return setIsComponentRendered(true);
    }

    checkAuth().catch(console.error);
  }, [isComponentRendered, fetchAuthUser]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!isLoading && !authUser.isAuthenticated) {
    return <Navigate to={ApplicationRoutes.LoginPage} />;
  }

  return <Outlet />;
};

export default AuthLayout;
