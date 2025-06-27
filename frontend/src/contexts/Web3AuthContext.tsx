import { createContext } from 'react';

export interface Web3AuthContextValueType {
  connectWallet: () => void;
}

const Web3AuthContext = createContext<Web3AuthContextValueType>({
  connectWallet: () => {},
});

export default Web3AuthContext;
