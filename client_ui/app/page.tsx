"use client";

import { useState } from "react";

import {
	requestAccountCreation,
	requestRecharge,
	getUserRequests,
	init,
} from "@/services/contract";

import {
	getNativeBalance,
	connectWallet as ConnectWalletService,
} from "@/services/chain";

import { WalletCard } from "@/components/dashboard/WalletCard";
import { CreateRequestCard } from "@/components/dashboard/CreateRequestCard";
import { RequestsCard } from "@/components/dashboard/RequestsCard";
import { ActivityFeedCard } from "@/components/dashboard/ActivityFeedCard";

type Activity = {
	type: string;
	requestId: bigint;
	creditsRequested: bigint;
	tx: string;
};

export default function HomePage() {
	const [credits, setCredits] = useState("1");
	const [requests, setRequests] = useState<bigint[]>([]);
	const [activities, setActivities] = useState<Activity[]>(
		[],
	);
	const [balance, setBalance] = useState("0");
	const [account, setAccount] = useState("");

	const [loadingWallet, setLoadingWallet] = useState(false);
	const [loadingTx, setLoadingTx] = useState(false);
	const [loadingRequests, setLoadingRequests] =
		useState(false);
	const [loadingChain, setLoadingChain] = useState(false);

	// wallet + cofhe init
	const connectWallet = async () => {
		setLoadingWallet(true);

		try {
			// 1. connect wallet
			const { account: acc } = await ConnectWalletService();
			setAccount(acc);

			// 2. IMPORTANT: init COFHE AFTER wallet is available
			await init();

			// 3. load balance
			const bal = await getNativeBalance(acc);
			setBalance(bal.eth);
		} finally {
			setLoadingWallet(false);
			setLoadingChain(false);
		}
	};

	const disconnectWallet = () => {
		setAccount("");
		setRequests([]);
		setActivities([]);
		setBalance("0");
	};

	// requests
	const loadRequests = async () => {
		if (!account) return;

		setLoadingRequests(true);

		try {
			const data = await getUserRequests(
				account as `0x${string}`,
			);
			setRequests(data as bigint[]);
		} finally {
			setLoadingRequests(false);
		}
	};

	// chain data
	const loadChainData = async () => {
		if (!account) return;

		setLoadingChain(true);

		try {
			const bal = await getNativeBalance(
				account as `0x${string}`,
			);
			setBalance(bal.eth);
		} finally {
			setLoadingChain(false);
		}
	};

	// tx: create account
	const handleCreateAccount = async () => {
		setLoadingTx(true);

		try {
			await requestAccountCreation(Number(credits));
			console.log("Account request sent");
		} finally {
			setLoadingTx(false);
		}
	};

	// tx: recharge
	const handleRecharge = async () => {
		setLoadingTx(true);

		try {
			await requestRecharge(Number(credits));
			console.log("Recharge request sent");
		} finally {
			setLoadingTx(false);
		}
	};

	return (
		<div className="flex justify-center p-6">
			<div className="w-full max-w-3xl space-y-6">
				<WalletCard
					account={account}
					balance={balance}
					loadingWallet={loadingWallet}
					loadingChain={loadingChain}
					onConnect={connectWallet}
					onDisconnect={disconnectWallet}
					onRefresh={loadChainData}
				/>

				<CreateRequestCard
					credits={credits}
					setCredits={setCredits}
					account={account}
					loadingTx={loadingTx}
					onCreate={handleCreateAccount}
					onRecharge={handleRecharge}
				/>

				{/* Optional */}
				{/* <RequestsCard
					account={account}
					requests={requests}
					loading={loadingRequests}
					onLoad={loadRequests}
				/> */}

				{/* <ActivityFeedCard activities={activities} /> */}
			</div>
		</div>
	);
}
