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
        uint256 tokenId;
    }

    // Array to store all token IDs
    uint256[] public allTokenIds;
    mapping(uint256 => Loan) public loans;

    // The NFT used as collateral
    IERC721 public collateralNFT;

    // Loan-to-Value ratio
    uint256 public constant LTV = 50;

    // Events
    event LoanTaken(address borrower, uint256 tokenId, uint256 loanAmount);
    event LoanRepaid(address borrower, uint256 tokenId);

    constructor(address _collateralNFT) payable {
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
        loans[tokenId] = Loan(msg.sender, loanAmount, false, tokenId);
        allTokenIds.push(tokenId);

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
    // Dummy function to get the value of an NFT (to be replaced with actual logic with mint price perhaps)
    function getNFTValue(uint256 tokenId) public pure returns (uint256) {
        // Placeholder for NFT appraisal logic
        return 0.01 ether;
    }

  function getLoansOfBorrower(address borrower) external view returns (Loan[] memory) {
    // Temporary array to store the loans of the borrower
    Loan[] memory borrowerLoans = new Loan[](allTokenIds.length);

    // Counter for the number of loans
    uint256 loanCount = 0;

    // Iterate over all token IDs
    for (uint256 i = 0; i < allTokenIds.length; i++) {
        // If the borrower of the loan is the specified address, add the loan to the array
        if (loans[allTokenIds[i]].borrower == borrower) {
            borrowerLoans[loanCount] = loans[allTokenIds[i]];
            borrowerLoans[loanCount].tokenId = allTokenIds[i]; // Add this line
            loanCount++;
        }
    }

    // Create a new array with the correct length
    Loan[] memory result = new Loan[](loanCount);

    // Copy the data to the new array
    for (uint256 i = 0; i < loanCount; i++) {
        result[i] = borrowerLoans[i];
    }

    return result;
}

    // Deposit Ether into the contract
    function deposit() external payable {
    }
}