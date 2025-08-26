import { useAtom } from 'jotai';
import {
  createUserAtom,
  fetchAllUsersAtom,
  usersAtom,
  userStorageErrorsAtom,
} from '../storage/user/user.storage';

export const useUser = () => {
  const [users, setUsersInStorage] = useAtom(usersAtom);
  const [_fetchAllUsers, fetchAllUsers] = useAtom(fetchAllUsersAtom);
  const [_createUser, createUser] = useAtom(createUserAtom);
  const [userStorageErrors, setUserErrorsInStorage] = useAtom(userStorageErrorsAtom);

  return {
    users,
    userStorageErrors,
    fetchAllUsers,
    createUser,
    setUsersInStorage,
    setUserErrorsInStorage,
  };
};
