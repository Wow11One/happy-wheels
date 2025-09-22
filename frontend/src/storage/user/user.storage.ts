import { atom } from 'jotai';
import { CreateUserDto, UserStorageErrors } from './user.types';
import { authUserAtom } from '../auth/auth.storage';
import { User } from '../../../../src/declarations/backend/backend.did';

export const userStorageErrorsAtom = atom<UserStorageErrors>({
  fetchAllUsers: null,
  create: null,
});

export const usersAtom = atom<User[]>([]);

export const createUserAtom = atom(null, async (get, set, data: CreateUserDto): Promise<void> => {
  try {
    set(userStorageErrorsAtom, { ...get(userStorageErrorsAtom), create: null });

    const authUser = get(authUserAtom);

    if (!authUser.isAuthenticated) {
      throw new Error('The user is not authenticated to perform this action');
    }

    return authUser.actor.create_user(
      authUser.userId,
      data.name,
      data.imageUrl,
      data.isServiceProvider,
      data.city,
    );
  } catch (error: any) {
    set(userStorageErrorsAtom, { ...get(userStorageErrorsAtom), create: error.message });
    throw error;
  }
});

export const fetchAllUsersAtom = atom(
  get => get(usersAtom),
  async (get, set): Promise<User[]> => {
    try {
      set(userStorageErrorsAtom, { ...get(userStorageErrorsAtom), fetchAllUsers: null });

      const authUser = get(authUserAtom);

      if (!authUser.isAuthenticated) {
        throw new Error('The user is not authenticated to perform this action');
      }

      const users = await authUser.actor.get_all_users();

      set(usersAtom, users);

      return get(usersAtom);
    } catch (error: any) {
      set(userStorageErrorsAtom, { ...get(userStorageErrorsAtom), fetchAllUsers: error.message });
      throw error;
    }
  },
);
