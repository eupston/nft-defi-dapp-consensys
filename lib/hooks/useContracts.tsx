import { useState, useEffect } from "react";
import { ethers, Provider } from "ethers";
import constants from "@/lib/constants";
import { useSDK } from "@metamask/sdk-react";

export const useContracts = () => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [nftCollateralizer, setNftCollateralizer] =
    useState<ethers.Contract | null>(null);
  const [mintable, setMintable] = useState<ethers.Contract | null>(null);
  const { sdk, connected, account, ready } = useSDK();

  useEffect(() => {
    const initializeContracts = async () => {
      if (
        connected &&
        sdk &&
        typeof window !== "undefined" &&
        window.ethereum
      ) {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const signer = await provider.getSigner();

        // Hardcode the contracts
        const nftCollateralizerContract = new ethers.Contract(
          constants.goreli.NFTCOLLATERALLOAN,
          constants.LOAN_ABI.abi,
          signer
        );

        const mintableContract = new ethers.Contract(
          constants.goreli.MINTABLENFT,
          constants.NFT_ABI.abi,
          signer
        );

        setProvider(provider);
        setSigner(signer);
        setNftCollateralizer(nftCollateralizerContract);
        setMintable(mintableContract);
      }
    };

    initializeContracts();
  }, [connected, sdk, account, ready]);

  return { provider, signer, nftCollateralizer, mintable };
};
