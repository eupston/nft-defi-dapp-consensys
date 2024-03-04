"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BigNumber } from "ethers";
import { useContracts } from "@/lib/hooks/useContracts";

interface NFT {
  id: BigNumber;
  name: string;
  image: string;
}

export const MyNFTs: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const { signer, mintable } = useContracts();

  useEffect(() => {
    if (signer && mintable) {
      signer.getAddress().then((address) => {
        mintable.getTokensOfOwner(address).then((tokenIds: BigNumber[]) => {
          const fetchedNfts = tokenIds.map((id) => ({
            id,
            name: "My NFT",
            image: "/placeholderNFT.jpg",
          }));
          setNfts(fetchedNfts);
        });
      });
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
            <Button className="mt-2" size="sm">
              Loan NFT
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
