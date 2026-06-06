import { ethers } from "hardhat";

async function main() {
	const Factory = await ethers.getContractFactory(
		"AIWorkspaceGateway",
	);
	const contract = await Factory.deploy(
		"2",
		"0xDad91936Dcc02b4042fF2b2bcea054A1Ba7d720c",
	);
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
