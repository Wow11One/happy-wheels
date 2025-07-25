import { FC, useEffect } from 'react';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

const HeaderFooterLayout: FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default HeaderFooterLayout;
