"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import constants from "@/lib/constants";
import { Button } from "./ui/button";

export const MintButton = () => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      setProvider(provider);
      const signer = provider.getSigner();
      setSigner(signer);
      const contract = new ethers.Contract(
        constants.goreli.MINTABLENFT,
        constants.NFT_ABI.abi,
        signer
      );
      setNftContract(contract);
    } else {
      console.error("Please install an Ethereum provider, like MetaMask");
    }
  }, []);

  const mintNFT = async () => {
    if (nftContract && signer) {
      const address = await signer.getAddress();
      const tx = await nftContract.mint(address);
      await tx.wait();
    }
  };

  return <Button onClick={mintNFT}>Mint NFT</Button>;
};
