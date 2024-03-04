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

  const loanNFT = async () => {
    if (nftCollateralizer && signer && mintable) {
      const loanAmount = parseEther("0.001");

      if (!isNFTApproved) {
        // Approve the loan contract to transfer the NFT
        await mintable.approve(nftCollateralizer.address, tokenId);
        setIsNFTApproved(true);
      } else {
        // Take the loan
        const tx = await nftCollateralizer.takeLoan(tokenId, loanAmount);
        await tx.wait();
      }
    }
  };

  return (
    <Button onClick={loanNFT}>
      {isNFTApproved ? "Loan NFT" : "Approve NFT for Lending"}
    </Button>
  );
};
