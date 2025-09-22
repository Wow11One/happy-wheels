import { FC } from 'react';
import { ApplicationRoutes } from './utils/constants';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HeaderFooterLayout from './layout/HeaderFooterLayout';
import AuthLayout from './layout/AuthLayout';
import { Slide, ToastContainer } from 'react-toastify';
import UserInfoForm from './pages/UserSpecifyInfoPage/UserInfoForm';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Marketplace from './pages/MarketplacePage/MarketplacePage';
import ServiceProviders from './pages/ServicesPage/ServicesPage';
import CreateTirePage from './pages/CreateTirePage/CreateTirePage';

const App: FC = () => {
  return (
    <BrowserRouter>
      <ToastContainer transition={Slide} theme='light' />
      <Routes>
        <Route element={<HeaderFooterLayout />}>
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
  );
};

export default App;
