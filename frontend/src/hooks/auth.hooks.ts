import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import {
  authUserAtom,
  fetchAuthUserAtom,
  isFetchingAuthenticationAtom,
  logoutAtom,
} from '../storage/auth/auth.storage';
import { ApplicationRoutes } from '../utils/constants';

export const useAuth = () => {
  const navigate = useNavigate();
  const [authUser, setAuthUserInStorage] = useAtom(authUserAtom);
  const [isFetchingAuthentication, setIsFetchingAuthenticationInStorage] = useAtom(
    isFetchingAuthenticationAtom,
  );
  const [_fetchAuthUser, fetchAuthUser] = useAtom(fetchAuthUserAtom);
  const [_logout, logoutAuthUser] = useAtom(logoutAtom);

  const logout = async () => {
    await logoutAuthUser();

    navigate(ApplicationRoutes.LoginPage);
  };

  return {
    authUser,
    isFetchingAuthentication,
    fetchAuthUser,
    logout,
    setAuthUserInStorage,
    setIsFetchingAuthenticationInStorage,
  };
};
