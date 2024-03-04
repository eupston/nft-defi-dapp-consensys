import { ethers } from "ethers";
import constants from "@/lib/constants";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

interface RepayLoanButtonProps {
  tokenId: number;
}

export const RepayLoanButton: React.FC<RepayLoanButtonProps> = ({
  tokenId,
}) => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [loanContract, setLoanContract] = useState<ethers.Contract | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      setProvider(provider);
      const signer = provider.getSigner();
      setSigner(signer);
      const contract = new ethers.Contract(
        constants.goreli.NFTCOLLATERALLOAN,
        constants.LOAN_ABI.abi,
        signer
      );
      setLoanContract(contract);
    } else {
      console.error("Please install an Ethereum provider, like MetaMask");
    }
  }, []);

  const repayLoan = async () => {
    if (loanContract && signer) {
      const amountInWei = ethers.utils.parseEther("0.001");
      const tx = await loanContract.repayLoan(tokenId, {
        from: signer.getAddress(),
        value: amountInWei,
      });
      await tx.wait();
    }
  };

  return <Button onClick={repayLoan}>Repay Loan</Button>;
};
