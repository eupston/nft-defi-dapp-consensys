import MINTABLE_NFT_ABI from "./abi/MintableNFT.json";
import NFTCOLLATERALLOAN_ABI from "./abi/NFTCollateralLoan.json";

export default {
  goreli: {
    MINTABLENFT: process.env.NEXT_PUBLIC_GOERLI_ADDRESS_MINTABLENFT || "",
    NFTCOLLATERALLOAN:
      process.env.NEXT_PUBLIC_GOERLI_ADDRESS_NFTCOLLATERALLOAN || "",
  },
  NFT_ABI: MINTABLE_NFT_ABI,
  LOAN_ABI: NFTCOLLATERALLOAN_ABI,
};
