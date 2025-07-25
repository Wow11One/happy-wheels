import { atom } from 'jotai';
import { CreateUserDto, UserStorageErrors } from './user.types';
import { authUserAtom } from '../auth/auth.storage';

export const userStorageErrorsAtom = atom<UserStorageErrors>({
  create: null,
});

export const createUserAtom = atom(null, async (get, set, data: CreateUserDto) => {
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
