import { parseEther } from "ethers";
import { Button } from "./ui/button";
import { useState } from "react";
import { useContracts } from "@/lib/hooks/useContracts";

interface LoanNFTButtonProps {
  tokenId: number;
}

export const LoanNFTButton: React.FC<LoanNFTButtonProps> = ({ tokenId }) => {
  const { signer, nftCollateralizer, mintable } = useContracts();
  const [isNFTApproved, setIsNFTApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const loanNFT = async () => {
    if (nftCollateralizer && signer && mintable) {
      setIsLoading(true);
      try {
        const loanAmount = parseEther("0.001");
        if (!isNFTApproved) {
          const address = await nftCollateralizer.getAddress();
          const approveTx = await mintable.approve(address, tokenId);
          await approveTx.wait();
          setIsNFTApproved(true);
        } else {
          const tx = await nftCollateralizer.takeLoan(tokenId, loanAmount);
          await tx.wait();
        }
      } catch (error) {
        console.error("Transaction cancelled or failed", error);
      } finally {
        setIsLoading(false);
      }
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
