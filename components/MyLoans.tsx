import { useEffect, useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import { BigNumber, ethers } from "ethers";
import { useContracts } from "@/lib/hooks/useContracts";
import { RepayLoanButton } from "./RepayLoanButton";

interface Loan {
  borrower: string;
  loanAmount: BigNumber;
  isRepaid: boolean;
  tokenId: number;
}

export default function MyLoans() {
  const { account } = useSDK();
  const [loans, setLoans] = useState<Loan[]>([]);
  const { nftCollateralizer } = useContracts();

  useEffect(() => {
    if (account && nftCollateralizer) {
      const fetchLoans = async () => {
        const loans = await nftCollateralizer.getLoansOfBorrower(account);
        setLoans(loans);
      };

      fetchLoans();

      // Listen for LoanRepaid event
      const onLoanRepaid = (borrower: any) => {
        if (borrower.toLowerCase() === account.toLowerCase()) {
          fetchLoans();
        }
      };

      nftCollateralizer.on("LoanRepaid", onLoanRepaid);

      return () => {
        nftCollateralizer.off("LoanRepaid", onLoanRepaid);
      };
    }
  }, [account, nftCollateralizer]);

  return (
    <div className="grid gap-6">
      {loans.map((loan, index) => (
        <div
          key={index}
          className="p-4 rounded-lg border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center space-x-4">
            <img
              alt="NFT"
              className="aspect-square rounded-lg overflow-hidden"
              height="100"
              src="/placeholderNFT.jpg"
              width="100"
            />
            <div className="grid gap-1">
              <h3 className="font-semibold">Loan #{index + 1}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Amount: {ethers.utils.formatEther(loan.loanAmount)} ETH
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Status: {loan.isRepaid ? "Fully Repaid" : "In Repayment"}
              </p>
              {!loan.isRepaid && <RepayLoanButton tokenId={loan.tokenId} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
