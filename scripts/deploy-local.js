//THIS DEPLOY SCRIPT IS FOR USE LOCALLY
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();

  // Deploy CookieNFT
  const CookieNFT = await ethers.getContractFactory('CookieNFT');
  const cookieNFT = await CookieNFT.deploy(); // already awaited in Ethers v6

  console.log(`Deployed CookieNFT at: ${cookieNFT.target}`); // ✅ Ethers v6 uses `.target`, not `.address`

  console.log(`Minting 2 cookie NFTs...`);

  const baseUri = "https://gateway.pinata.cloud/ipfs/bafybeifrubxogczkqebmhltqcxaimg4gifcvxymyylrqyokpzxzvymezky/"

  let transaction = await cookieNFT.mint(`${baseUri}1.json`);
  transaction = await cookieNFT.mint(`${baseUri}2.json`);
  transaction = await cookieNFT.mint(`${baseUri}3.json`);
  transaction = await cookieNFT.mint(`${baseUri}4.json`);
  transaction = await cookieNFT.mint(`${baseUri}5.json`);
  transaction = await cookieNFT.mint(`${baseUri}6.json`);
  transaction = await cookieNFT.mint(`${baseUri}7.json`);
  await transaction.wait()

  const uri1 = await cookieNFT.tokenURI(1);
  console.log('Token 1 URI:', uri1);

  // Deploy CookieVote
  const CookieVote = await ethers.getContractFactory('CookieVote');
  const cookieVote = await CookieVote.deploy(cookieNFT.target); // ✅ use .target instead of .address

  console.log(`Deployed CookieVote at: ${cookieVote.target}`);
  console.log(`Finished`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//FROM HARDHAT CONFIG IN CRUMBL
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
};
