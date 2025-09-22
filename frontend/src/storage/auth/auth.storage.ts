import { atom } from 'jotai';
import { createActor, canisterId } from '../../../../src/declarations/backend';
import { AuthClient } from '@dfinity/auth-client';
import { AuthStorageErrors, AuthUser, LoginResponse } from './auth.types';

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === 'ic'
    ? 'https://id.ai'
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943';

export const isFetchingAuthenticationAtom = atom<boolean>(false);
export const authStorageErrorsAtom = atom<AuthStorageErrors>({
  fetchAuthUser: null,
  login: null,
  logout: null,
});

export const authUserAtom = atom<AuthUser>({ isAuthenticated: false });

export const fetchAuthUserAtom = atom(
  get => get(authUserAtom),
  async (get, set): Promise<AuthUser> => {
    try {
      set(authStorageErrorsAtom, { ...get(authStorageErrorsAtom), fetchAuthUser: null });
      set(isFetchingAuthenticationAtom, true);

      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();

      const actor = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });

      const isAuthenticated = await authClient.isAuthenticated();

      const principal = identity.getPrincipal();
      const userId = principal.toString();

      const userExists = await actor.user_exists(userId);

      if (isAuthenticated) {
        if (userExists) {
          const [profile] = await actor.get_user_by_principal(userId);
          const transactions = await actor.get_transactions_by_user(userId);
          const allTires = await actor.get_all_tires();

          const tires = allTires.filter(tire => tire.user_id === userId);

          if (!profile) {
            return get(authUserAtom);
          }

          set(authUserAtom, {
            isAuthenticated: true,
            userId,
            authClient,
            actor,
            principal,
            identity,
            profile,
            transactions,
            tires,
          });
        } else {
          set(authUserAtom, {
            isAuthenticated: true,
            userId,
            authClient,
            actor,
            principal,
            identity,
          });
        }
      }

      return get(authUserAtom);
    } catch (error: any) {
      set(authStorageErrorsAtom, { ...get(authStorageErrorsAtom), fetchAuthUser: error.message });
      throw error;
    } finally {
      set(isFetchingAuthenticationAtom, false);
    }
  },
);

export const loginAtom = atom(null, async (get, set): Promise<LoginResponse> => {
  try {
    set(authStorageErrorsAtom, { ...get(authStorageErrorsAtom), login: null });

    const authClient = await AuthClient.create();

    return new Promise(async (resolve, reject) => {
      try {
        await authClient.login({
          identityProvider,
          onSuccess: async () => {
            const identity = authClient.getIdentity();
            const actor = createActor(canisterId, {
              agentOptions: {
                identity,
              },
            });

            const userId = identity.getPrincipal().toString();

            const userExists = await actor.user_exists(userId);

            return resolve({ isUserFirstLoggedIn: !userExists });
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  } catch (error: any) {
    set(authStorageErrorsAtom, { ...get(authStorageErrorsAtom), login: error.message });
    throw error;
  }
});

export const logoutAtom = atom(null, async (get, set): Promise<AuthUser> => {
  try {
    set(authStorageErrorsAtom, { ...get(authStorageErrorsAtom), logout: null });
    const authUser = get(authUserAtom);

    if (!authUser.isAuthenticated) {
      throw new Error('Cannot logout the user that is not authenticated');
    }

    await authUser.authClient.logout();

    set(authUserAtom, { isAuthenticated: false });

    return get(authUserAtom);
  } catch (error: any) {
    set(authStorageErrorsAtom, { ...get(authStorageErrorsAtom), logout: error.message });
    throw error;
  }
});
