import MINTABLE_NFT_ABI from "../app_contracts/artifacts/contracts/MintableNFT.sol/MintableNFT.json";
import NFTCOLLATERALLOAN_ABI from "../app_contracts/artifacts/contracts/NFTCollateralLoan.sol/NFTCollateralLoan.json";

export default {
  goreli: {
    MINTABLENFT: process.env.NEXT_PUBLIC_GOERLI_ADDRESS_MINTABLENFT || "",
    NFTCOLLATERALLOAN:
      process.env.NEXT_PUBLIC_GOERLI_ADDRESS_NFTCOLLATERALLOAN || "",
  },
  NFT_ABI: MINTABLE_NFT_ABI,
  LOAN_ABI: NFTCOLLATERALLOAN_ABI,
};
