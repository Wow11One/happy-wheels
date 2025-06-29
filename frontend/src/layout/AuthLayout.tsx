import { Navigate, Outlet } from 'react-router-dom';
import { ApplicationRoutes } from '../utils/constants';
import { useAuth } from '../hooks/auth.hooks';
import { AuthClient } from '@dfinity/auth-client';
import { useEffect, useState } from 'react';
import { useSiws } from "ic-siws-js/react";
import { useWallet } from '@solana/wallet-adapter-react';
import LoadingSpinner from '../components/TyreLoading/TyreLoading';

const AuthLayout = () => {
  const wallet = useWallet();
  //const { solanaIdentity } = useAuth();
  const { identity: solanaIdentity, clear } = useSiws();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const checkAuth = async () => {
    // authorized using icp
    setIsLoading(true);
    if (solanaIdentity) {
      setIsAuthenticated(true);
      // authorized using solana wallet
    } else {
      const authClient = await AuthClient.create();
      const isAuthenticatedWithID = await authClient.isAuthenticated();
      setIsAuthenticated(isAuthenticatedWithID);
      console.log('isAuthenticatedWithID', isAuthenticatedWithID);
    }
    setIsLoading(false);
    console.log('wallet.publicKey  d', wallet.publicKey);
    console.log('!!(wallet.publicKey && solanaIdentity)', !!(wallet.publicKey && solanaIdentity));
  };

  useEffect(() => {
    checkAuth();
  }, [
    //solanaIdentity
  ]);

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
