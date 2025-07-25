import { useAtom } from 'jotai';
import { internetIdentityAtom } from '../storage/auth.storage';

export const useAuth = () => {
  const [internetIdenity, setInternetIdentity] = useAtom(internetIdentityAtom);

  return {
    internetIdenity,
    setInternetIdentity,
  };
};
