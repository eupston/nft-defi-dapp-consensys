"use client";

import { Button } from "./ui/button";
import { useContracts } from "@/lib/hooks/useContracts";

export const MintButton = () => {
  const { signer, mintable } = useContracts();

  const mintNFT = async () => {
    if (mintable && signer) {
      const address = await signer.getAddress();
      const tx = await mintable.mint(address);
      await tx.wait();
    }
  };

  return <Button onClick={mintNFT}>Mint NFT</Button>;
};
