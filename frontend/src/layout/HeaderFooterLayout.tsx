import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const HeaderFooterLayout = ({
  actor,
  setActor,
  isAuthenticated,
  setIsAuthenticated,
  tokenCreated,
  setTokenCreated,
  setIsFetchingAuthentication,
  authClient,
  setAuthClient,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <>
      <Header
        actor={actor}
        setActor={setActor}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        tokenCreated={tokenCreated}
        setTokenCreated={setTokenCreated}
        setIsFetchingAuthentication={setIsFetchingAuthentication}
        authClient={authClient}
        setAuthClient={setAuthClient}
      />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default HeaderFooterLayout;
