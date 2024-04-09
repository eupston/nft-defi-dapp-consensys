import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("NFTCollateralLoan");

  // Send Ether during deployment to fund contract
  const deploymentOptions = {
    value: ethers.utils.parseEther("0.05"),
  };

  let goerliAddress = process.env.SEPOLIA_ADDRESS_MINTABLENFT;
  if (!goerliAddress) {
    throw new Error(
      "The environment variable SEPOLIA_ADDRESS_MINTABLENFT is not defined"
    );
  }

  let contract = await factory.deploy(goerliAddress, deploymentOptions);
  console.log(
    `The address the Contract WILL have once mined: ${contract.address}`
  );

  console.log(
    `The transaction that was sent to the network to deploy the Contract: ${contract.deployTransaction.hash}`
  );

  console.log(
    "The contract is NOT deployed yet; we must wait until it is mined..."
  );
  await contract.deployed();
  console.log("Mined!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
