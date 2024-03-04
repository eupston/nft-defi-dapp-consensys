import { ethers } from "ethers";
import constants from "@/lib/constants";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export const LoanNFTButton = () => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [loanContract, setLoanContract] = useState<ethers.Contract | null>(
    null
  );
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null);
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
      const nftContractInstance = new ethers.Contract(
        constants.goreli.MINTABLENFT,
        constants.NFT_ABI.abi,
        signer
      );
      setNftContract(nftContractInstance);
    } else {
      console.error("Please install an Ethereum provider, like MetaMask");
    }
  }, []);

  const loanNFT = async () => {
    if (loanContract && signer && nftContract) {
      const tokenId = 1;
      const loanAmount = ethers.utils.parseEther("0.001");

      // Approve the loan contract to transfer the NFT
      // await nftContract.approve(loanContract.address, tokenId);

      const tx = await loanContract.takeLoan(tokenId, loanAmount);
      await tx.wait();
    }
  };

  return <Button onClick={loanNFT}>Loan NFT</Button>;
};