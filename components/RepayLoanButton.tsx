import { parseEther } from "ethers";
import { Button } from "./ui/button";
import { useContracts } from "@/lib/hooks/useContracts";
import { useState } from "react";

interface RepayLoanButtonProps {
  tokenId: number;
}

export const RepayLoanButton: React.FC<RepayLoanButtonProps> = ({
  tokenId,
}) => {
  const { nftCollateralizer } = useContracts();
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const repayLoan = async () => {
    if (nftCollateralizer) {
      setIsLoading(true);
      try {
        const amountInWei = parseEther("0.001");
        const tx = await nftCollateralizer.repayLoan(tokenId, {
          value: amountInWei,
        });
        await tx.wait();
      } catch (error) {
        console.error("Transaction cancelled or failed", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Button onClick={repayLoan} disabled={isLoading}>
      {isLoading ? "Processing..." : "Repay Loan"}
    </Button>
  );
};
