/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	createPublicClient,
	createWalletClient,
	custom,
	http,
	WalletClient,
	formatEther,
} from "viem";

import { sepolia } from "viem/chains";

/* -----------------------------------
   STATE (single source of truth)
----------------------------------- */

let walletClient: WalletClient | null = null;

/* -----------------------------------
   INIT PUBLIC CLIENT (READ ONLY)
----------------------------------- */

export function initChain() {
	return createPublicClient({
		chain: sepolia,
		transport: http(),
	});
}

/* -----------------------------------
   WALLET CONNECTION
----------------------------------- */

export async function connectWallet() {
	if (!window.ethereum) {
		throw new Error("No wallet found");
	}

	initChain();

	// Request accounts
	const accounts = (await window.ethereum.request({
		method: "eth_requestAccounts",
	})) as `0x${string}`[];

	// Create wallet client
	walletClient = createWalletClient({
		chain: sepolia,
		transport: custom(window.ethereum),
	});

	return { account: accounts[0] };
}

/* -----------------------------------
   DISCONNECT WALLET (frontend only)
----------------------------------- */

export function disconnectWallet() {
	walletClient = null;
}

/* -----------------------------------
   GETTERS
----------------------------------- */

export function getWalletClient() {
	if (!window.ethereum) {
		throw new Error("No wallet found");
	}

	initChain();

	// Create wallet client
	return createWalletClient({
		chain: sepolia,
		transport: custom(window.ethereum),
	});
}

/* -----------------------------------
   NATIVE BALANCE
----------------------------------- */

export async function getNativeBalance(
	address?: `0x${string}`,
) {
	const publicClient = initChain();

	const addr = walletClient?.account?.address || address;

	if (!addr) throw new Error("No address provided");

	const balance = await publicClient.getBalance({
		address: addr,
	});

	return {
		wei: balance,
		eth: formatEther(balance),
	};
}
