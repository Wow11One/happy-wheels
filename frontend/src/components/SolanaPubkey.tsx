import { useWallet } from "@solana/wallet-adapter-react";

export default function SolanaPubkey() {
  const { publicKey } = useWallet();

  if (!publicKey) {
    return null;
  }

  const formattedPubkey =
    publicKey.toString().slice(0, 4) + "..." + publicKey.toString().slice(-4);

  return <div>{formattedPubkey}</div>;
}