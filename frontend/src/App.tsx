import { useState, useEffect, FC } from 'react';
import { ApplicationRoutes } from './utils/constants';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HeaderFooterLayout from './layout/HeaderFooterLayout';
import AuthLayout from './layout/AuthLayout';
import { Slide, ToastContainer } from 'react-toastify';
import Web3AuthProvider from './providers/Web3AuthProvider';
import SiwsProvider from './providers/SiwsProvider';
import { Buffer } from 'buffer';
import UserInfoForm from './pages/UserSpecifyInfoPage/UserInfoForm';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Marketplace from './pages/MarketplacePage/MarketplacePage';
import ServiceProviders from './pages/ServicesPage/ServicesPage';
import CreateTirePage from './pages/CreateTirePage/CreateTirePage';

const App: FC = () => {
  window.Buffer = window.Buffer || Buffer;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFetchingAuthentication, setIsFetchingAuthentication] = useState(true);
  const [actor, setActor] = useState();
  const [tokenCreated, setTokenCreated] = useState(false);
  const [authClient, setAuthClient] = useState();

  return (
    <Web3AuthProvider>
      <SiwsProvider>
        <BrowserRouter>
          <ToastContainer transition={Slide} theme='light' />
          <Routes>
            <Route
              element={
                <HeaderFooterLayout
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
              }
            >
              <Route path={ApplicationRoutes.LoginPage} element={<LoginPage />} />

              <Route element={<AuthLayout />}>
                <Route index path={ApplicationRoutes.Profile} element={<ProfilePage />} />
                <Route index path={`${ApplicationRoutes.Profile}/:id`} element={<ProfilePage />} />
                <Route path='/' element={<Navigate to={ApplicationRoutes.Profile} />} />

                <Route path={ApplicationRoutes.Marketplace} element={<Marketplace />} />
                <Route path={ApplicationRoutes.Services} element={<ServiceProviders />} />
                <Route path={ApplicationRoutes.UserSpecifyInfo} element={<UserInfoForm />} />
                <Route path={ApplicationRoutes.TyreCreateForm} element={<CreateTirePage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </SiwsProvider>
    </Web3AuthProvider>
  );
};

export default App;
