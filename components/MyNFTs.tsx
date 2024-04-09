"use client";

import React, { useEffect, useState } from "react";
import { BigNumberish } from "ethers";
import { useContracts } from "@/lib/hooks/useContracts";
import { LoanNFTButton } from "./LoanNFTButton";
import { useAccount, useReadContract } from "wagmi";
import constants from "@/lib/constants";
import { useWatchContractEvent } from "wagmi";
import { parseEventLogs } from "viem";

interface NFT {
  id: BigNumberish;
  name: string;
  image: string;
}

export const MyNFTs: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const account = useAccount();

  const { data: tokenIds = [] } = useReadContract({
    address: constants.sepolia.MINTABLENFT as `0x${string}`,
    abi: constants.NFT_ABI.abi,
    functionName: "getTokensOfOwner",
    args: [account.address],
  });

  useEffect(() => {
    if (tokenIds.length < 1) return;
    const fetchedNfts = tokenIds.map((id: BigNumberish[]) => ({
      id,
      name: "My NFT",
      image: "/placeholderNFT.jpg",
    }));
    setNfts(fetchedNfts);
  }, [tokenIds]);

  useWatchContractEvent({
    address: constants.sepolia.MINTABLENFT as `0x${string}`,
    abi: constants.NFT_ABI.abi,
    eventName: "Transfer",
    onLogs(logs) {
      console.log("New logs!", logs);
      const nftData = logs[0].args;
      if (nftData.to === account.address) {
        // If the current user is the receiver of the minted NFT, update the state
        const newNFT = {
          id: nftData.tokenId,
          name: "My NFT",
          image: "/placeholderNFT.jpg",
        };
        setNfts((prevNfts) => [...prevNfts, newNFT]);
      }
    },
  });

  useWatchContractEvent({
    address: constants.sepolia.NFTCOLLATERALLOAN as `0x${string}`,
    abi: constants.LOAN_ABI.abi,
    eventName: "LoanTaken",
    onLogs(logs) {
      const loanData = logs[0].args;
      console.log("New logs!", loanData);
      if (loanData.borrower === account.address) {
        // If the current user is the borrower, remove the NFT from the state
        setNfts((prevNfts) =>
          prevNfts.filter((nft) => nft.id !== loanData.tokenId)
        );
      }
    },
  });

  // useEffect(() => {
  //   if (signer && mintable && nftCollateralizer) {
  //     signer.getAddress().then((address) => {
  //       mintable.getTokensOfOwner(address).then((tokenIds: BigNumberish[]) => {
  //         console.info("tokenIds orginial", tokenIds);

  //         const fetchedNfts = tokenIds.map((id) => ({
  //           id,
  //           name: "My NFT",
  //           image: "/placeholderNFT.jpg",
  //         }));
  //         setNfts(fetchedNfts);
  //       });
  //     });

  //     // Listen for the Minted event
  //     mintable.on("Transfer", async (from, to, tokenId) => {
  //       const address = await signer.getAddress();
  //       if (to === address) {
  //         // If the current user is the receiver of the minted NFT, update the state
  //         const newNFT = {
  //           id: tokenId,
  //           name: "My NFT",
  //           image: "/placeholderNFT.jpg",
  //         };
  //         setNfts((prevNfts) => [...prevNfts, newNFT]);
  //       }
  //     });

  //     // Listen for the LoanTaken event
  //     nftCollateralizer.on(
  //       "LoanTaken",
  //       async (borrower, tokenId, loanAmount) => {
  //         const address = await signer.getAddress();
  //         if (borrower === address) {
  //           // If the current user is the borrower, remove the NFT from the state
  //           setNfts((prevNfts) => prevNfts.filter((nft) => nft.id !== tokenId));
  //         }
  //       }
  //     );
  //     return () => {
  //       mintable.removeAllListeners("Transfer");
  //       nftCollateralizer.removeAllListeners("LoanTaken");
  //     };
  //   }
  // }, [signer, mintable]);

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
