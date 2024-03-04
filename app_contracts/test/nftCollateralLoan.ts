import { ethers } from "hardhat";
import chai from "chai";
import { NFTCollateralLoan__factory, NFTCollateralLoan } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MintableNFT__factory, MintableNFT } from "../typechain";

const { expect } = chai;

describe("NFTCollateralLoan", () => {
  let nftCollateralLoan: NFTCollateralLoan;
  let signers: SignerWithAddress[];
  let mintableNFT: MintableNFT;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    const mintableNFTFactory = (await ethers.getContractFactory(
      "MintableNFT",
      signers[0]
    )) as MintableNFT__factory;
    mintableNFT = (await mintableNFTFactory.deploy(
      "MintableNFT",
      "MNFT"
    )) as MintableNFT;
    await mintableNFT.deployed();

    // Mint an NFT to the first signer
    await mintableNFT.mint(signers[0].address);

    const nftCollateralLoanFactory = (await ethers.getContractFactory(
      "NFTCollateralLoan",
      signers[0]
    )) as NFTCollateralLoan__factory;
    nftCollateralLoan = (await nftCollateralLoanFactory.deploy(
      mintableNFT.address
    )) as NFTCollateralLoan;
    await nftCollateralLoan.deployed();
    // Send 100 Ether to the contract
    await nftCollateralLoan
      .connect(signers[0])
      .deposit({ value: ethers.utils.parseEther("100") });
  });

  describe("Loan functionality", async () => {
    it("should allow a user to take a loan", async () => {
      const tokenId = 1;
      const loanAmount = ethers.utils.parseEther("0.005");
      // approve nftCollateralLoan to interact with NFT
      await mintableNFT
        .connect(signers[0])
        .approve(nftCollateralLoan.address, tokenId);

      await nftCollateralLoan.connect(signers[0]).takeLoan(tokenId, loanAmount);
      const loan = await nftCollateralLoan.loans(tokenId);
      expect(loan.borrower).to.equal(signers[0].address);
      expect(loan.loanAmount).to.equal(loanAmount);
      expect(loan.isRepaid).to.equal(false);
      expect(loan.tokenId).to.equal(tokenId);
    });

    it("should not allow a user to take a loan exceeding LTV", async () => {
      const tokenId = 1;
      const loanAmount = ethers.utils.parseEther("0.01");
      await mintableNFT
        .connect(signers[0])
        .approve(nftCollateralLoan.address, tokenId);
      await expect(
        nftCollateralLoan.connect(signers[0]).takeLoan(tokenId, loanAmount)
      ).to.be.revertedWith("Loan amount exceeds LTV");
    });

    it("should allow a user to repay a loan", async () => {
      const tokenId = 1;
      const loanAmount = ethers.utils.parseEther("0.005");
      await mintableNFT
        .connect(signers[0])
        .approve(nftCollateralLoan.address, tokenId);
      await nftCollateralLoan.connect(signers[0]).takeLoan(tokenId, loanAmount);
      await nftCollateralLoan
        .connect(signers[0])
        .repayLoan(tokenId, { value: loanAmount });
      const loan = await nftCollateralLoan.loans(tokenId);
      expect(loan.isRepaid).to.equal(true);
      expect(loan.tokenId).to.equal(tokenId);
    });

    it("should not allow a user to repay a loan that is already repaid", async () => {
      const tokenId = 1;
      const loanAmount = ethers.utils.parseEther("0.005");
      await mintableNFT
        .connect(signers[0])
        .approve(nftCollateralLoan.address, tokenId);

      await nftCollateralLoan.connect(signers[0]).takeLoan(tokenId, loanAmount);
      await nftCollateralLoan
        .connect(signers[0])
        .repayLoan(tokenId, { value: loanAmount });
      await expect(
        nftCollateralLoan.repayLoan(tokenId, { value: loanAmount })
      ).to.be.revertedWith("Loan is already repaid");
    });
  });

  it("should return all loans of a borrower", async () => {
    const tokenId1 = 1;
    const tokenId2 = 2;
    const loanAmount = ethers.utils.parseEther("0.005");

    // Mint another NFT to the first signer
    await mintableNFT.mint(signers[0].address);

    // Approve nftCollateralLoan to interact with NFTs
    await mintableNFT
      .connect(signers[0])
      .approve(nftCollateralLoan.address, tokenId1);
    await mintableNFT
      .connect(signers[0])
      .approve(nftCollateralLoan.address, tokenId2);

    // Take two loans
    await nftCollateralLoan.connect(signers[0]).takeLoan(tokenId1, loanAmount);
    await nftCollateralLoan.connect(signers[0]).takeLoan(tokenId2, loanAmount);

    // Get all loans of the borrower
    const loans = await nftCollateralLoan.getLoansOfBorrower(
      signers[0].address
    );

    // Check the length of the loans array
    expect(loans.length).to.equal(2);

    // Check the details of the first loan
    expect(loans[0].borrower).to.equal(signers[0].address);
    expect(loans[0].loanAmount).to.equal(loanAmount);
    expect(loans[0].isRepaid).to.equal(false);
    expect(loans[0].tokenId).to.equal(tokenId1);

    // Check the details of the second loan
    expect(loans[1].borrower).to.equal(signers[0].address);
    expect(loans[1].loanAmount).to.equal(loanAmount);
    expect(loans[1].isRepaid).to.equal(false);
    expect(loans[1].tokenId).to.equal(tokenId2);
  });
});
