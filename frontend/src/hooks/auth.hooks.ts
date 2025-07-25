import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import {
  authStorageErrorsAtom,
  authUserAtom,
  fetchAuthUserAtom,
  isFetchingAuthenticationAtom,
  loginAtom,
  logoutAtom,
} from '../storage/auth/auth.storage';
import { ApplicationRoutes } from '../utils/constants';
import { AuthUser, NotAuthenticatedUser } from '../storage/auth/auth.types';

export const useAuth = <User extends AuthUser = NotAuthenticatedUser>() => {
  const navigate = useNavigate();

  const [authUser, setAuthUserInStorage] = useAtom(authUserAtom);
  const [isFetchingAuthentication, setIsFetchingAuthenticationInStorage] = useAtom(
    isFetchingAuthenticationAtom,
  );
  const [_fetchAuthUser, fetchAuthUser] = useAtom(fetchAuthUserAtom);
  const [_login, loginAuthUser] = useAtom(loginAtom);
  const [_logout, logoutAuthUser] = useAtom(logoutAtom);
  const [authStorageErrors, setAuthErrorsInStorage] = useAtom(authStorageErrorsAtom);

  const login = async () => {
    const { isUserFirstLoggedIn } = await loginAuthUser();

    if (isUserFirstLoggedIn) {
      return navigate(ApplicationRoutes.UserSpecifyInfo);
    }

    navigate(ApplicationRoutes.Profile);
  };

  const logout = async () => {
    await logoutAuthUser();

    navigate(ApplicationRoutes.LoginPage);
  };

  return {
    authUser: authUser as User,
    isFetchingAuthentication,
    authStorageErrors,
    fetchAuthUser,
    login,
    logout,
    setAuthUserInStorage,
    setIsFetchingAuthenticationInStorage,
    setAuthErrorsInStorage,
  };
};
