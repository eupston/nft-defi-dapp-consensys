"use client";

import { Button } from "./ui/button";
import { useContracts } from "@/lib/hooks/useContracts";
import { useAccount, useWriteContract } from "wagmi";
import constants from "@/lib/constants";

export const MintButton = () => {
  const { data: hash, writeContract } = useWriteContract();
  const account = useAccount();

  return (
    <Button
      onClick={() => {
        writeContract({
          address: constants.sepolia.MINTABLENFT as `0x${string}`,
          abi: constants.NFT_ABI.abi,
          functionName: "mint",
          args: [account.address],
        });
      }}
    >
      Mint NFT
    </Button>
  );
};
