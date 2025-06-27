export interface Metadata {
  name: string;
  description: string;
  image: string;
  attributes?: { trait_type: string; value: string | number }[];
}

const PINATA_API_KEY = '70a46fc6f97845278456';
const PINATA_SECRET_API_KEY = '7261220db36cf663ec44946898dbd99d5f5c5b0556bfe28521d83c9f182ab2ff';

export const uploadFileToPinata = async (file: File): Promise<string> => {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    } as any,
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failed to upload file: ${res.statusText}`);
  }

  const data = await res.json();
  return data.IpfsHash; // return CID
};

export const uploadJsonToPinata = async (metadata: Metadata): Promise<string> => {
  const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY!,
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    throw new Error(`Failed to upload JSON metadata: ${res.statusText}`);
  }

  const data = await res.json();
  return data.IpfsHash;
};

export const getFileUrl = (fileCID: string) => `https://gateway.pinata.cloud/ipfs/${fileCID}`;

