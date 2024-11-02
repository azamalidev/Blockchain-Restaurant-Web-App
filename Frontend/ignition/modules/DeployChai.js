const { ethers } = require("hardhat");

async function main() {
  const Chai = await ethers.getContractFactory("chai");
  const chai = await Chai.deploy();
  
  // Wait for the deployment to be mined
  await chai.deployTransaction.wait(); 

  console.log(`Chai contract deployed to address: ${chai.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
