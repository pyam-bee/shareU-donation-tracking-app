const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", balance.toString());

  const DonationCampaign = await hre.ethers.getContractFactory("DonationCampaign");
  const donationCampaign = await DonationCampaign.deploy();

  // Wait for the deployment tx to be mined (this ensures address is available)
  await donationCampaign.waitForDeployment();

  const address = await donationCampaign.getAddress();
  console.log("DonationCampaign deployed to:", address);

  // Properly build path using path.join
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract address
  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ DonationCampaign: address }, null, 2)
  );

  // Save contract artifact
  const contractArtifact = await hre.artifacts.readArtifact("DonationCampaign");
  fs.writeFileSync(
    path.join(contractsDir, "DonationCampaign.json"),
    JSON.stringify(contractArtifact, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
