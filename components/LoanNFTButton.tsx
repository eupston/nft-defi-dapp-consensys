import { parseEther } from "ethers";
import { Button } from "./ui/button";
import { useState } from "react";
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/wagmi";
import constants from "@/lib/constants";

interface LoanNFTButtonProps {
  tokenId: number;
}

export const LoanNFTButton: React.FC<LoanNFTButtonProps> = ({ tokenId }) => {
  const [isNFTApproved, setIsNFTApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const loanNFT = async () => {
    setIsLoading(true);
    try {
      const loanAmount = parseEther("0.001");
      if (!isNFTApproved) {
        const results = await writeContract(config, {
          address: constants.sepolia.MINTABLENFT as `0x${string}`,
          abi: constants.NFT_ABI.abi,
          functionName: "approve",
          args: [constants.sepolia.NFTCOLLATERALLOAN, tokenId],
        });
        await waitForTransactionReceipt(config, {
          hash: results,
        });
        setIsNFTApproved(true);
      } else {
        const results = await writeContract(config, {
          address: constants.sepolia.NFTCOLLATERALLOAN as `0x${string}`,
          abi: constants.LOAN_ABI.abi,
          functionName: "takeLoan",
          args: [tokenId, loanAmount],
        });
        await waitForTransactionReceipt(config, {
          hash: results,
        });
      }
    } catch (error) {
      console.error("Transaction cancelled or failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={loanNFT} disabled={isLoading}>
      {isLoading
        ? "Processing..."
        : isNFTApproved
        ? "Loan NFT"
        : "Approve NFT for Lending"}
    </Button>
  );
};
