/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	createPublicClient,
	http,
	PublicClient,
	parseAbiItem,
} from "viem";

import { sepolia } from "viem/chains";

import {
	CONTRACT_ABI,
	CONTRACT_ADDRESS,
} from "@/config/contract";
import { getWalletClient, getAccount } from "./chain";

/* -----------------------------------
   CLIENTS
----------------------------------- */

let publicClient: PublicClient;

function ensureClient() {
	if (!publicClient) {
		publicClient = createPublicClient({
			chain: sepolia,
			transport: http(),
		});
	}

	if (!getWalletClient()) {
		throw new Error("Wallet not connected");
	}
}

/* -----------------------------------
   READ: CONTRACT VALUES
----------------------------------- */

export async function getPricePerCredit() {
	ensureClient();

	return (await publicClient.readContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "pricePerCredit",
	})) as bigint;
}

export async function getNextRequestId() {
	ensureClient();

	return await publicClient.readContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "nextRequestId",
	});
}

export async function getRequest(requestId: bigint) {
	ensureClient();

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
	ensureClient();

	return await publicClient.readContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "getUserRequests",
		args: [userAddress],
	});
}

/* -----------------------------------
   WRITE: CONTRACT ACTIONS
----------------------------------- */

export async function requestAccountCreation(
	creditsRequested: number,
) {
	ensureClient();

	const walletClient = getWalletClient();
	const account = getAccount();

	if (!walletClient || !account) {
		throw new Error("Wallet not connected");
	}

	const pricePerCredit = await getPricePerCredit();

	const value = BigInt(creditsRequested) * pricePerCredit;

	return await walletClient.writeContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "requestAccountCreation",
		args: [BigInt(creditsRequested)],
		account,
		chain: sepolia,
		gas: BigInt("200000"),
		value,
	});
}

export async function requestRecharge(
	creditsRequested: number,
) {
	ensureClient();

	const walletClient = getWalletClient();
	const account = getAccount();

	if (!walletClient || !account) {
		throw new Error("Wallet not connected");
	}

	const pricePerCredit = await getPricePerCredit();

	const value = BigInt(creditsRequested) * pricePerCredit;

	return await walletClient.writeContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: "requestRecharge",
		args: [BigInt(creditsRequested)],
		account,
		chain: sepolia,
		value,
	});
}

/* -----------------------------------
   CONTRACT ACTIVITY (RAW)
----------------------------------- */

export async function getRecentActivities(
	fromBlock = BigInt("0"),
) {
	ensureClient();

	return await publicClient.getLogs({
		address: CONTRACT_ADDRESS,
		fromBlock,
		toBlock: "latest",
	});
}

/* -----------------------------------
   DECODED ACTIVITY (BUSINESS LAYER)
----------------------------------- */

const accountCreatedEvent = parseAbiItem(
	"event AccountCreationRequested(uint256 indexed requestId, address indexed user, uint256 creditsRequested, uint256 amountPaid)",
);

const rechargeEvent = parseAbiItem(
	"event RechargeRequested(uint256 indexed requestId, address indexed user, uint256 creditsRequested, uint256 amountPaid)",
);

export async function getDecodedActivities() {
	ensureClient();

	const logs = await publicClient.getLogs({
		address: CONTRACT_ADDRESS,
		events: [accountCreatedEvent, rechargeEvent],
		fromBlock: "earliest",
	});

	return logs
		.map((log: any) => {
			if (log.eventName === "AccountCreationRequested") {
				return {
					type: "CREATE_ACCOUNT",
					requestId: log.args.requestId,
					user: log.args.user,
					creditsRequested: log.args.creditsRequested,
					amountPaid: log.args.amountPaid,
					tx: log.transactionHash,
				};
			}

			if (log.eventName === "RechargeRequested") {
				return {
					type: "RECHARGE",
					requestId: log.args.requestId,
					user: log.args.user,
					creditsRequested: log.args.creditsRequested,
					amountPaid: log.args.amountPaid,
					tx: log.transactionHash,
				};
			}

			return null;
		})
		.filter(Boolean);
}
