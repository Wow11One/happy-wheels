import { useAtom } from 'jotai';
import { createUserAtom, userStorageErrorsAtom } from '../storage/user/user.storage';

export const useUser = () => {
  const [userStorageErrors, setUserErrorsInStorage] = useAtom(userStorageErrorsAtom);
  const [_createUser, createUser] = useAtom(createUserAtom);

  return {
    userStorageErrors,
    createUser,
    setUserErrorsInStorage,
  };
};
