/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	createCofheConfig,
	createCofheClient,
} from "@cofhe/sdk/web";

import {
	CofheClient,
	Encryptable,
	FheTypes,
} from "@cofhe/sdk";

import { chains } from "@cofhe/sdk/chains";

import { sepolia } from "viem/chains";

import {
	CONTRACT_ABI,
	CONTRACT_ADDRESS,
} from "@/config/contract";
import {
	connectWallet,
	getWalletClient,
	initChain,
} from "./chain";

/* -----------------------------------
   GLOBAL STATE (AS SDK EXPECTS)
----------------------------------- */

let client: CofheClient;

/* -----------------------------------
   INIT (MUST CALL FIRST)
----------------------------------- */

export async function init() {
	// switch chain
	await window.ethereum.request({
		method: "wallet_switchEthereumChain",
		params: [{ chainId: "0xaa36a7" }],
	});

	// COFHE config
	const config = createCofheConfig({
		supportedChains: [chains.sepolia],
	});

	client = createCofheClient(config);

	// connect cofhe
	await client.connect(initChain(), getWalletClient());
}

/* -----------------------------------
   READ: PRICE PER CREDIT (FHE)
----------------------------------- */

export async function getPricePerCredit() {
	const permit =
		await client.permits.getOrCreateSelfPermit();

	const ctHash = await initChain().readContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "pricePerCredit",
	});

	return await client
		.decryptForView(ctHash, FheTypes.Uint128)
		.withPermit(permit)
		.execute();
}

/* -----------------------------------
   READ: NEXT REQUEST ID
----------------------------------- */

export async function getNextRequestId() {
	const permit =
		await client.permits.getOrCreateSelfPermit();

	const ctHash = await initChain().readContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "nextRequestId",
	});

	return await client
		.decryptForView(ctHash, FheTypes.Uint128)
		.withPermit(permit)
		.execute();
}

/* -----------------------------------
   READ: REQUESTS
----------------------------------- */

export async function getRequest(requestId: bigint) {
	return await initChain().readContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "requests",
		args: [requestId],
	});
}

export async function getUserRequests(user: `0x${string}`) {
	return await initChain().readContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "getUserRequests",
		args: [user],
	});
}

/* -----------------------------------
   WRITE: ACCOUNT CREATION
----------------------------------- */

export async function requestAccountCreation(
	creditsRequested: number,
) {
	return await getWalletClient().writeContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "requestAccountCreation",
		args: [creditsRequested],
		account: "0xDad91936Dcc02b4042fF2b2bcea054A1Ba7d720c",
		chain: sepolia,
		gas: BigInt("200000"),
		value: BigInt(creditsRequested),
	});
}

/* -----------------------------------
   WRITE: RECHARGE
----------------------------------- */

export async function requestRecharge(
	creditsRequested: number,
) {
	const [encryptedAmount] = await client
		.encryptInputs([
			Encryptable.uint128(BigInt(creditsRequested)),
		])
		.execute();

	return await getWalletClient().writeContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "requestRecharge",
		args: [encryptedAmount],
		account: (await connectWallet()).account,
		chain: sepolia,
	});
}
