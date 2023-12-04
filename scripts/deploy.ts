import { writeFile } from "fs/promises";
import { ethers } from "hardhat";

async function main() {
  // const lockedAmount = ethers.utils.parseEther("1");

  const SupplyChain = await ethers.getContractFactory("Req");
  // const greeting = await Greeting.deploy("Hello world", { value: lockedAmount });
  const supplyChain = await SupplyChain.deploy("hello world");

  await supplyChain.deployed();

  console.log("Greeting contract deployed to: ", supplyChain.address);
  // write
  await writeFile(
    "./frontend/src/info/data.json",
    JSON.stringify({ contractAddress: supplyChain.address })
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
