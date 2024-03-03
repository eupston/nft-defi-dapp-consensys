// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract NFTCollateralLoan {
  
    // Mapping from token ID to the loan details
    struct Loan {
        address borrower;
        uint256 loanAmount;
        bool isRepaid;
    }
    mapping(uint256 => Loan) public loans;

    // The NFT used as collateral
    IERC721 public collateralNFT;

    // Loan-to-Value ratio
    uint256 public constant LTV = 50;

    // Events
    event LoanTaken(address borrower, uint256 tokenId, uint256 loanAmount);
    event LoanRepaid(address borrower, uint256 tokenId);

    constructor(address _collateralNFT) {
        collateralNFT = IERC721(_collateralNFT);
    }

    // Deposit an NFT and take out a loan
    function takeLoan(uint256 tokenId, uint256 loanAmount) external payable {
        // Transfer the NFT to this contract
        collateralNFT.transferFrom(msg.sender, address(this), tokenId);

        // Calculate max loan based on LTV and NFT value (simplified for PoC)
        uint256 maxLoanAmount = getNFTValue(tokenId) * LTV / 100;
        require(loanAmount <= maxLoanAmount, "Loan amount exceeds LTV");

        // Check if the contract has enough Ether
        require(address(this).balance >= loanAmount, "Contract has insufficient Ether");

        // Transfer Ether to the borrower
        payable(msg.sender).transfer(loanAmount);

        // Record the loan details
        loans[tokenId] = Loan(msg.sender, loanAmount, false);

        emit LoanTaken(msg.sender, tokenId, loanAmount);
    }

    // Repay the loan and retrieve the NFT
    function repayLoan(uint256 tokenId) external payable {
        Loan storage loan = loans[tokenId];
        require(msg.sender == loan.borrower, "Only the borrower can repay the loan");
        require(!loan.isRepaid, "Loan is already repaid");

        // Ensure the correct amount of Ether was sent
        require(msg.value == loan.loanAmount, "Incorrect Ether amount sent");

        // Transfer the NFT back to the borrower
        collateralNFT.transferFrom(address(this), msg.sender, tokenId);

        // Mark the loan as repaid
        loan.isRepaid = true;

        emit LoanRepaid(msg.sender, tokenId);
    }
        // Dummy function to get the value of an NFT (to be replaced with actual logic)
    function getNFTValue(uint256 tokenId) public pure returns (uint256) {
        // Placeholder for NFT appraisal logic
        return 1 ether; // 1 ether as a placeholder value
    }
    // Deposit Ether into the contract
    function deposit() external payable {
    }
}