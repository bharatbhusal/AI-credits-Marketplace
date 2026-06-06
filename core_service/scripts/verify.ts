import { run } from "hardhat";

const CONTRACT_ADDRESS =
	"0x7b8Dfa1B1b3f1cea137a40b4ec87198a72157ffE";

async function main() {
	console.log(
		`Verifying contract at ${CONTRACT_ADDRESS}...`,
	);

	try {
		await run("verify:verify", {
			address: CONTRACT_ADDRESS,
			constructorArguments: [1780935713],
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
