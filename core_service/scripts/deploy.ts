import { ethers } from "hardhat";

async function main() {
	const Factory = await ethers.getContractFactory("Lock");
	const contract = await Factory.deploy("1780935713");
	await contract.waitForDeployment();
	console.log(
		"Contract deployed to:",
		await contract.getAddress(),
	);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
