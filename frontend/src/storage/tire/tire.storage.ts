import { atom } from 'jotai';
import { CreateTireDto, TireStorageErrors } from './tire.types';
import { authUserAtom } from '../auth/auth.storage';
import { Tire } from '../../../../src/declarations/backend/backend.did';

export const tireStorageErrorsAtom = atom<TireStorageErrors>({
  fetchAllTires: null,
  create: null,
  recycle: null,
});

export const tiresAtom = atom<Tire[]>([]);

export const createTireAtom = atom(null, async (get, set, data: CreateTireDto): Promise<void> => {
  try {
    set(tireStorageErrorsAtom, { ...get(tireStorageErrorsAtom), create: null });

    const authUser = get(authUserAtom);

    if (!authUser.isAuthenticated) {
      throw new Error('The user is not authenticated to perform this action');
    }

    return authUser.actor.create_tire(
      data.uuid,
      data.brand,
      data.size,
      data.season,
      data.treadDepth,
      data.productionYear,
      data.imageUrl,
    );
  } catch (error: any) {
    set(tireStorageErrorsAtom, { ...get(tireStorageErrorsAtom), create: error.message });
    throw error;
  }
});

export const recycleTireAtom = atom(null, async (get, set, tireId: Tire['id']): Promise<void> => {
  try {
    set(tireStorageErrorsAtom, { ...get(tireStorageErrorsAtom), recycle: null });

    const authUser = get(authUserAtom);

    if (!authUser.isAuthenticated) {
      throw new Error('The user is not authenticated to perform this action');
    }

    return authUser.actor.recycle_tire(tireId);
  } catch (error: any) {
    set(tireStorageErrorsAtom, { ...get(tireStorageErrorsAtom), recycle: error.message });
    throw error;
  }
});

export const fetchAllTiresAtom = atom(
  get => get(tiresAtom),
  async (get, set): Promise<Tire[]> => {
    try {
      set(tireStorageErrorsAtom, { ...get(tireStorageErrorsAtom), fetchAllTires: null });

      const authUser = get(authUserAtom);

      if (!authUser.isAuthenticated) {
        throw new Error('The user is not authenticated to perform this action');
      }

      const tires = await authUser.actor.get_all_tires();

      set(tiresAtom, tires);

      return get(tiresAtom);
    } catch (error: any) {
      set(tireStorageErrorsAtom, { ...get(tireStorageErrorsAtom), fetchAllTires: error.message });
      throw error;
    }
  },
);
