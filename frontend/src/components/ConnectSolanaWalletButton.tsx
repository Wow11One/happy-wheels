import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function ConnectSolanaWalletButton() {
  const { wallet } = useWallet();

  if (wallet) {
    return null;
  }

  return (
    <div>
      <WalletMultiButton />
    </div>
  );
}
