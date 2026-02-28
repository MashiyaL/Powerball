const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Lotto to Sepolia...");

  // Sepolia VRF Coordinator address
  const vrfCoordinator = "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B";

  // Your subscription ID from Chainlink
  const subscriptionId = ethers.BigNumber.from("52187446172812924055630889326158729879315955954031971907998167011533939937089");

  // Deploy the contract
  const Lotto = await hre.ethers.getContractFactory("Lotto");
  const lottery = await Lotto.deploy(subscriptionId, vrfCoordinator);

  await lottery.deployed();

  console.log("Lotto deployed to:", lottery.address);
  console.log("\nDeployment Details:");
  console.log("- Contract Address:", lottery.address);
  console.log("- VRF Coordinator:", vrfCoordinator);
  console.log("- Subscription ID:", subscriptionId);

  // Verify on block explorer (optional)
  console.log("\nTo verify on Etherscan, run:");
  console.log(`npx hardhat verify --network sepolia ${lottery.address} ${subscriptionId} ${vrfCoordinator}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
