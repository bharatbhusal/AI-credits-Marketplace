/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	createPublicClient,
	createWalletClient,
	http,
	custom,
	PublicClient,
	WalletClient,
	Account,
} from "viem";

import { sepolia } from "viem/chains";

import { CONTRACT_ABI } from "../config/contract";
import { CONTRACT_ADDRESS } from "../config/contract";

let publicClient: PublicClient;
let walletClient: WalletClient;
let account: Account;

export async function init() {
	if (!window.ethereum) {
		throw new Error("Wallet not found");
	}

	await window.ethereum.request({
		method: "wallet_switchEthereumChain",
		params: [{ chainId: "0xaa36a7" }],
	});

	publicClient = createPublicClient({
		chain: sepolia,
		transport: http(),
	});

	walletClient = createWalletClient({
		chain: sepolia,
		transport: custom(window.ethereum),
	});

	const accounts = await window.ethereum.request({
		method: "eth_requestAccounts",
	});

	account = accounts[0];

	return account;
}

export function getAccount() {
	return account;
}

export async function getPricePerCredit() {
	return await publicClient.readContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "pricePerCredit",
	});
}

export async function getNextRequestId() {
	return await publicClient.readContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "nextRequestId",
	});
}

export async function requestAccountCreation(
	creditsRequested: number,
) {
	// const pricePerCredit =
	// 	(await getPricePerCredit()) as bigint;

	// const value = BigInt(creditsRequested) * pricePerCredit;

	return await walletClient.writeContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "requestAccountCreation",
		args: [BigInt(creditsRequested)],
		account,
		// value,
		chain: sepolia,
	});
}

export async function requestRecharge(
	creditsRequested: number,
) {
	// const pricePerCredit =
	// 	(await getPricePerCredit()) as bigint;

	// const value = BigInt(creditsRequested) * pricePerCredit;

	return await walletClient.writeContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "requestRecharge",
		args: [BigInt(creditsRequested)],
		account,
		// value,
		chain: sepolia,
	});
}

export async function getRequest(requestId: bigint) {
	return await publicClient.readContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "requests",
		args: [requestId],
	});
}

export async function getUserRequests(
	userAddress: `0x${string}`,
) {
	return await publicClient.readContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "getUserRequests",
		args: [userAddress],
	});
}
