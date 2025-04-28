const hre = require("hardhat");

async function main() {
    const Medical = await hre.ethers.getContractFactory("Medical");
    const medichain = await Medical.deploy();

    await medichain.waitForDeployment();

    console.log(`Contract address: ${await medichain.getAddress()}`);
}

//npx hardhat run scripts/deploy.js --network medichain

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})