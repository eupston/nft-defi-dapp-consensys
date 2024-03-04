"use client";

import React, { useEffect, useState } from "react";
import { BigNumberish } from "ethers";
import { useContracts } from "@/lib/hooks/useContracts";
import { LoanNFTButton } from "./LoanNFTButton";

interface NFT {
  id: BigNumberish;
  name: string;
  image: string;
}

export const MyNFTs: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const { signer, mintable, nftCollateralizer } = useContracts();

  useEffect(() => {
    if (signer && mintable && nftCollateralizer) {
      signer.getAddress().then((address) => {
        mintable.getTokensOfOwner(address).then((tokenIds: BigNumberish[]) => {
          const fetchedNfts = tokenIds.map((id) => ({
            id,
            name: "My NFT",
            image: "/placeholderNFT.jpg",
          }));
          setNfts(fetchedNfts);
        });
      });

      // Listen for the Minted event
      mintable.on("Transfer", async (from, to, tokenId) => {
        const address = await signer.getAddress();
        if (to === address) {
          // If the current user is the receiver of the minted NFT, update the state
          const newNFT = {
            id: tokenId,
            name: "My NFT",
            image: "/placeholderNFT.jpg",
          };
          setNfts((prevNfts) => [...prevNfts, newNFT]);
        }
      });

      // Listen for the LoanTaken event
      nftCollateralizer.on(
        "LoanTaken",
        async (borrower, tokenId, loanAmount) => {
          const address = await signer.getAddress();
          if (borrower === address) {
            // If the current user is the borrower, remove the NFT from the state
            setNfts((prevNfts) => prevNfts.filter((nft) => nft.id !== tokenId));
          }
        }
      );
      return () => {
        mintable.removeAllListeners("Transfer");
        nftCollateralizer.removeAllListeners("LoanTaken");
      };
    }
  }, [signer, mintable]);

  return (
    <div className="grid gap-6">
      {nfts.map((nft) => (
        <div
          key={nft.id.toString()}
          className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-800"
        >
          <img
            alt="NFT"
            className="aspect-square rounded-lg overflow-hidden flex-shrink-0"
            height="100"
            src={nft.image}
            width="100"
          />
          <div className="grid gap-1 ml-4 flex-1">
            <h3 className="font-semibold">{nft.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ID: {nft.id.toString()}
            </p>
            <LoanNFTButton tokenId={parseInt(nft.id.toString())} />
          </div>
        </div>
      ))}
    </div>
  );
};
