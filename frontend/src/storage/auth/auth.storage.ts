import { atom } from 'jotai';
import { createActor, canisterId } from '../../../../src/declarations/backend';
import { AuthClient } from '@dfinity/auth-client';
import { AuthUser } from './auth.types';

export const isFetchingAuthenticationAtom = atom<boolean>(false);

export const authUserAtom = atom<AuthUser>({ isAuthenticated: false });

export const fetchAuthUserAtom = atom(
  get => get(authUserAtom),
  async (get, set) => {
    set(isFetchingAuthenticationAtom, true);

    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();

    const actor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });

    const isAuthenticated = await authClient.isAuthenticated();

    if (isAuthenticated) {
      set(authUserAtom, {
        isAuthenticated: true,
        authClient,
        actor,
        principal: identity.getPrincipal(),
        identity,
      });
    }

    set(isFetchingAuthenticationAtom, false);

    return get(authUserAtom);
  },
);

export const logoutAtom = atom(null, async (get, set) => {
  const authUser = get(authUserAtom);

  if (!authUser.isAuthenticated) {
    throw new Error('Cannot logout the user that is not authenticated');
  }

  await authUser.authClient.logout();

  set(authUserAtom, { isAuthenticated: false });

  return get(authUserAtom);
});
