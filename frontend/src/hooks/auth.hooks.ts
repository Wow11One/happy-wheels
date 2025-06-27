import { useAtom } from 'jotai';
import { internetIdentityAtom, solanaIdentityAtom } from '../storage/auth.storage';

export const useAuth = () => {
    const [internetIdenity, setInternetIdentity] = useAtom(internetIdentityAtom);
    const [solanaIdentity, setSolanaIdentity] = useAtom(solanaIdentityAtom);

    return {
        internetIdenity,
        solanaIdentity,
        setInternetIdentity,
        setSolanaIdentity,
    }
};