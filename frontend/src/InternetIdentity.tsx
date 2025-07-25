import { FC, useEffect, useState } from 'react';
import { ApplicationRoutes } from './utils/constants';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/auth.hooks';

const InternetIdentity: FC = () => {
  const { authUser, logout, fetchAuthUser } = useAuth();
  const [isComponentRendered, setIsComponentRendered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isComponentRendered) {
      return setIsComponentRendered(true);
    }

    fetchAuthUser();
  }, [isComponentRendered, fetchAuthUser]);

  return (
    <div className='flex items-center space-x-4'>
      {authUser.isAuthenticated ? (
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
