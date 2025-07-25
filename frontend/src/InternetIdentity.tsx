import { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor, canisterId } from 'declarations/backend';
import { ApplicationRoutes } from './utils/constants';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const InternetIdentity = ({
  setActor,
  isAuthenticated,
  setIsAuthenticated,
  setIsFetchingAuthentication,
  authClient,
  setAuthClient,
}) => {
  const [principal, setPrincipal] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    updateActor();
  }, []);

  async function updateActor() {
    setIsFetchingAuthentication(true);
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const actor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });
    const isAuthenticated = await authClient.isAuthenticated();

    setActor(actor);
    console.log('await authClient.isAuthenticated()', await authClient.isAuthenticated());
    setAuthClient(authClient);
    setIsAuthenticated(isAuthenticated);
    setPrincipal(identity.getPrincipal().toString());
    setIsFetchingAuthentication(false);
  }

  async function logout() {
    const authClient = await AuthClient.create();
    await authClient.logout();
    setIsAuthenticated(false);
    navigate(ApplicationRoutes.LoginPage);
  }

  return (
    <div className='flex items-center space-x-4'>
      {isAuthenticated ? (
        <>
          <p className='text-sm'>{/* <span className="font-mono">{principal}</span> */}</p>
          <button onClick={logout}>Sign Out</button>
        </>
      ) : (
        <>
          <button onClick={() => navigate(ApplicationRoutes.LoginPage)}>Sign In</button>
        </>
      )}
    </div>
  );
};

export default InternetIdentity;
