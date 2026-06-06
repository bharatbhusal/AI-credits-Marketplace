import { run } from "hardhat";

const CONTRACT_ADDRESS =
	"0xe77867b160ff0d9837f39Beb0293E7E71Bb37805";

async function main() {
	console.log(
		`Verifying contract at ${CONTRACT_ADDRESS}...`,
	);

	try {
		await run("verify:verify", {
			address: CONTRACT_ADDRESS,
			constructorArguments: [
				"1",
				"0xDad91936Dcc02b4042fF2b2bcea054A1Ba7d720c",
			],
		});

		console.log("✅ Contract verified successfully!");
	} catch (error: any) {
		if (
			error.message?.toLowerCase().includes("already verified")
		) {
			console.log("ℹ️ Contract is already verified.");
		} else {
			console.error("❌ Verification failed:");
			console.error(error);
		}
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
