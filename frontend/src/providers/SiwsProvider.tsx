import { useWallet } from '@solana/wallet-adapter-react';
import { SiwsIdentityProvider } from 'ic-siws-js/react';

export default function SiwsProvider({ children }: { children: React.ReactNode }) {
  const { wallet } = useWallet();
  console.log('process.env.CANISTER_ID_IC_SIWS_PROVIDER', process.env.CANISTER_ID_IC_SIWS_PROVIDER)
  return (
    <SiwsIdentityProvider canisterId={process.env.CANISTER_ID_IC_SIWS_PROVIDER!} adapter={wallet?.adapter}>
      {children}
    </SiwsIdentityProvider>
  );
}
