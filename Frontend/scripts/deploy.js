const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const Chai = await hre.ethers.getContractFactory("chai");
    const chai = await Chai.deploy();

    await chai.waitForDeployment();
    console.log("Chai deployed to:",await chai.getAddress());

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
