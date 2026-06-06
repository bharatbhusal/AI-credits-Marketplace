/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	createPublicClient,
	createWalletClient,
	custom,
	http,
	PublicClient,
	WalletClient,
	formatEther,
} from "viem";

import { sepolia } from "viem/chains";

/* -----------------------------------
   STATE (single source of truth)
----------------------------------- */

let publicClient: PublicClient;

let walletClient: WalletClient | null = null;

let account: `0x${string}` | null = null;

/* -----------------------------------
   INIT PUBLIC CLIENT (READ ONLY)
----------------------------------- */

export function initChain() {
	publicClient = createPublicClient({
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

	if (!publicClient) initChain();

	// Request accounts
	const accounts = (await window.ethereum.request({
		method: "eth_requestAccounts",
	})) as `0x${string}`[];

	account = accounts[0];

	// Create wallet client
	walletClient = createWalletClient({
		chain: sepolia,
		transport: custom(window.ethereum),
	});

	return { account, walletClient };
}

/* -----------------------------------
   DISCONNECT WALLET (frontend only)
----------------------------------- */

export function disconnectWallet() {
	account = null;
	walletClient = null;
}

/* -----------------------------------
   GETTERS
----------------------------------- */

export function getAccount() {
	return account;
}

export function getWalletClient() {
	return walletClient;
}

/* -----------------------------------
   NATIVE BALANCE
----------------------------------- */

export async function getNativeBalance(
	address?: `0x${string}`,
) {
	if (!publicClient) initChain();

	const addr = address || account;

	if (!addr) throw new Error("No address provided");

	const balance = await publicClient.getBalance({
		address: addr,
	});

	return {
		wei: balance,
		eth: formatEther(balance),
	};
}
