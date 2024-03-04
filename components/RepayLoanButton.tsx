import { parseEther } from "ethers";
import { Button } from "./ui/button";
import { useContracts } from "@/lib/hooks/useContracts";

interface RepayLoanButtonProps {
  tokenId: number;
}

export const RepayLoanButton: React.FC<RepayLoanButtonProps> = ({
  tokenId,
}) => {
  const { nftCollateralizer } = useContracts();

  const repayLoan = async () => {
    if (nftCollateralizer) {
      const amountInWei = parseEther("0.001");
      const tx = await nftCollateralizer.repayLoan(tokenId, {
        value: amountInWei,
      });
      await tx.wait();
    }
  };

  return <Button onClick={repayLoan}>Repay Loan</Button>;
};
