const { expect } = require("chai");
const { ethers } = require('hardhat');

const TOKENID = 1
const NAME = 'Chocolate Chip Cookie'

describe("CookieVote", () => {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test. 

  //This would be your beforeEach; instead they are now fixtures

  let deployer, voter;

  let cookieNFT, cookieVote;

  beforeEach(async () => {
    //Accs
    [deployer, voter] = await ethers.getSigners()

    //Deploy CookieNFT
    const CookieNFT = await ethers.getContractFactory("CookieNFT")
    cookieNFT = await CookieNFT.deploy()
    //await cookieNFT.waitForDeployment();

    //Mint NFT
    let transaction = await cookieNFT.connect(voter).mint('URI')
    await transaction.wait()

    //Deploy CookieVote and pass in CookieNFT address
    const CookieVote = await ethers.getContractFactory('CookieVote')
    cookieVote = await CookieVote.deploy(await cookieNFT.getAddress())
    //await cookieVote.waitForDeployment()

    //cast vote 
    transaction = await cookieVote.connect(voter).vote(1)
    await transaction.wait()
  })


  describe("Deployment", () => {
    it("sets correct NFT address", async () => {
      const result = await cookieVote.CookieNFT();
      expect(result).to.equal(await cookieNFT.getAddress())
    });

  });

  describe("voting", () => {
    it('its increments vote count for tokenId', async () => {
      const votes = await cookieVote.getVotes(1)
      expect(votes).to.be.equal(1)
    })

    it('marks the address as having voted', async () => {
      const voted = await cookieVote.hasVoted(voter.address, 1)
      expect(voted).to.be.equal(true)
    })

    it('reverts if voter attempts to vote on same token', async () => {
      await expect(cookieVote.connect(voter).vote(1)).to.be.revertedWith("Already voted on this token");
    })
  });

});
