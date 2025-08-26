import { useAtom } from 'jotai';
import {
  createTireAtom,
  fetchAllTiresAtom,
  recycleTireAtom,
  tiresAtom,
  tireStorageErrorsAtom,
} from '../storage/tire/tire.storage';

export const useTire = () => {
  const [tires, setTiresInStorage] = useAtom(tiresAtom);
  const [_fetchAllTires, fetchAllTires] = useAtom(fetchAllTiresAtom);
  const [_createTire, createTire] = useAtom(createTireAtom);
  const [_recycleTire, recycleTire] = useAtom(recycleTireAtom);
  const [tireStorageErrors, setTireErrorsInStorage] = useAtom(tireStorageErrorsAtom);

  return {
    tires,
    tireStorageErrors,
    fetchAllTires,
    createTire,
    recycleTire,
    setTiresInStorage,
    setTireErrorsInStorage,
  };
};
