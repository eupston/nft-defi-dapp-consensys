import { ethers } from "hardhat";
import chai from "chai";
import { MintableNFT__factory, MintableNFT } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const { expect } = chai;

describe("MintableNFT", () => {
  let mintableNFT: MintableNFT;
  let signers: SignerWithAddress[];

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
  });

  describe("Minting functionality", async () => {
    it("should mint a new token", async () => {
      const recipient = signers[1].address;
      await mintableNFT.mint(recipient);
      expect(await mintableNFT.ownerOf(1)).to.equal(recipient);
    });

    it("should only allow the owner to mint tokens", async () => {
      const recipient = signers[1].address;
      await expect(
        mintableNFT.connect(signers[1]).mint(recipient)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should allow the owner to mint multiple tokens", async () => {
      const recipient = signers[0].address;
      await mintableNFT.mint(recipient);
      await mintableNFT.mint(recipient);
      expect(await mintableNFT.ownerOf(1)).to.equal(recipient);
      expect(await mintableNFT.ownerOf(2)).to.equal(recipient);
    });
  });
});
