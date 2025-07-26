//THIS SCRIPT IS FOR TESTNET/MAINNET DEPLOYMENT 

const hre = require("hardhat");
const { ethers } = hre;
require("dotenv").config();

async function main() {
  console.log("Attempting...")
  //const [signer] = await ethers.getSigners();
  //console.log("Deployer address:", signer.address)
  const [deployer] = await ethers.getSigners();
  const network = hre.network.name;

  console.log(`🔧 Deploying to network: ${network}`);
  console.log(`👤 Deployer: ${deployer.address}`);

  const baseUri = network === "localhost"
    ? "http://localhost:3000/ipfs/"
    : process.env.PINATA_BASE_URI || "https://gateway.pinata.cloud/ipfs/bafybeifrubxogczkqebmhltqcxaimg4gifcvxymyylrqyokpzxzvymezky/";

  // Deploy CookieNFT
  console.log("Attempting cookieNFT contract...")
  const CookieNFT = await ethers.getContractFactory("CookieNFT");
  const cookieNFT = await CookieNFT.deploy();
  await cookieNFT.waitForDeployment();
  const cookieNFTAddress = await cookieNFT.getAddress();
  console.log(`✅ CookieNFT deployed at: ${cookieNFTAddress}`);

  // Mint cookies
  console.log("🍪 Minting 7 cookie NFTs...");
  for (let i = 1; i <= 7; i++) {
    const tx = await cookieNFT.mint(`${baseUri}${i}.json`);
    await tx.wait();
    console.log(`  ➕ Minted token ${i}`);
  }

  const uri1 = await cookieNFT.tokenURI(1);
  console.log(`🔗 Token 1 URI: ${uri1}`);

  // Deploy CookieVote
  console.log("Attempting cookieVote contract...")
  const CookieVote = await ethers.getContractFactory("CookieVote");
  const cookieVote = await CookieVote.deploy(cookieNFTAddress);
  await cookieVote.waitForDeployment();
  const cookieVoteAddress = await cookieVote.getAddress();
  console.log(`✅ CookieVote deployed at: ${cookieVoteAddress}`);

  // Verify contracts (Etherscan)
  if (network !== "localhost" && process.env.ETHERSCAN_API_KEY) {
    try {
      console.log("🔍 Verifying on Etherscan...");

      await hre.run("verify:verify", {
        address: cookieNFTAddress,
        constructorArguments: [],
      });

      await hre.run("verify:verify", {
        address: cookieVoteAddress,
        constructorArguments: [cookieNFTAddress],
      });

      console.log("✅ Verified successfully!");
    } catch (err) {
      console.warn("⚠️ Verification failed:", err.message);
    }
  }

  console.log("🚀 Deployment complete!");
}

main().catch((err) => {
  console.error("❌ Deployment error:", err);
  process.exit(1);
});
