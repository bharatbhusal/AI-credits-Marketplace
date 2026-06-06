/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	createCofheConfig,
	createCofheClient,
} from "@cofhe/sdk/web";

import { Encryptable, FheTypes } from "@cofhe/sdk";

import { chains } from "@cofhe/sdk/chains";

import {
	createPublicClient,
	createWalletClient,
	http,
	custom,
	PublicClient,
	WalletClient,
} from "viem";

import { sepolia } from "viem/chains";

import {
	CONTRACT_ABI,
	CONTRACT_ADDRESS,
} from "@/config/contract";

/* -----------------------------------
   GLOBAL STATE (AS SDK EXPECTS)
----------------------------------- */

let client: any;
let publicClient: PublicClient;
let walletClient: WalletClient;
let account: `0x${string}`;

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

	// viem clients
	publicClient = createPublicClient({
		chain: sepolia,
		transport: http(),
	});

	walletClient = createWalletClient({
		chain: sepolia,
		transport: custom(window.ethereum),
	});

	// wallet connect
	const accounts = await window.ethereum.request({
		method: "eth_requestAccounts",
	});

	account = accounts[0];

	// attach wallet account
	// walletClient.account = account;

	// connect cofhe
	await client.connect(publicClient, walletClient);

	// permit
	await client.permits.getOrCreateSelfPermit();
}

/* -----------------------------------
   READ: PRICE PER CREDIT (FHE)
----------------------------------- */

export async function getPricePerCredit() {
	const permit =
		await client.permits.getOrCreateSelfPermit();

	const ctHash = await publicClient.readContract({
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

	const ctHash = await publicClient.readContract({
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
	return await publicClient.readContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "requests",
		args: [requestId],
	});
}

export async function getUserRequests(user: `0x${string}`) {
	return await publicClient.readContract({
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
	const [encryptedAmount] = await client
		.encryptInputs([
			Encryptable.uint128(BigInt(creditsRequested)),
		])
		.execute();

	return await walletClient.writeContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "requestAccountCreation",
		args: [encryptedAmount],
		account,
		chain: sepolia,
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

	return await walletClient.writeContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "requestRecharge",
		args: [encryptedAmount],
		account,
		chain: sepolia,
	});
}

/* -----------------------------------
   OPTIONAL: PUBLISH FLOW EXAMPLE
----------------------------------- */

export async function publishRequest(requestId: bigint) {
	const permit =
		await client.permits.getOrCreateSelfPermit();

	const ctHash = await publicClient.readContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "requests",
		args: [requestId],
	});

	const { decryptedValue, signature } = await client
		.decryptForTx(ctHash)
		.withPermit(permit)
		.execute();

	return await walletClient.writeContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "markCompleted",
		args: [requestId, decryptedValue, signature],
		account,
		chain: sepolia,
	});
}
