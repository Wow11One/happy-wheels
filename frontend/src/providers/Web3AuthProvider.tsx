import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  LedgerWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import Web3AuthContext from '../contexts/Web3AuthContext';
import { createPortal } from 'react-dom';
import Modal from '../components/Modal';


export interface Web3AuthProviderProps {
  children: ReactNode;
}

export interface Web3AuthProviderState {
  isConnectWalletModalVisible: boolean;
}

interface ConnectWalletModalProps {
  onClose: () => void;
}

const initialState: Web3AuthProviderState = {
  isConnectWalletModalVisible: false,
};

const Web3AuthProvider: FC<Web3AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState(initialState);
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  console.log('SolflareWalletAdapter')
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [network],
  );

  const connectWallet = () => {
    setState({ ...state, isConnectWalletModalVisible: true });
  };

  return (
    <Web3AuthContext.Provider value={{ connectWallet }}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            {state.isConnectWalletModalVisible && (
              <ConnectWalletModal
                onClose={() => setState({ ...state, isConnectWalletModalVisible: false })}
              />
            )}
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Web3AuthContext.Provider>
  );
};

const ConnectWalletModal: FC<ConnectWalletModalProps> = ({ onClose }) => {
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.publicKey) {
      onClose();
    }
  }, [wallet.publicKey]);

  return createPortal(
    <Modal title='Connect wallet' onClose={onClose} className='max-w-xl'>
      <div className='flex flex-col px-10 py-8'>
        <p className='font-mono mb-8 text-white'>
          You cannot perform this action because the wallet is not connected. Please, connect your
          wallet and proceed the action again
        </p>
        <WalletMultiButton>Connect the wallet</WalletMultiButton>
      </div>
    </Modal>,
    document.getElementById('root')!,
  );
};

export default Web3AuthProvider;
