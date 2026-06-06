"use client";

import { useEffect, useState } from "react";
import {
	init,
	requestAccountCreation,
	requestRecharge,
	getUserRequests,
} from "@/services/cofhe";

export default function Hero() {
	const [credits, setCredits] = useState("");
	const [requests, setRequests] = useState<bigint[]>([]);
	const [account, setAccount] = useState<string>("");

	useEffect(() => {
		const setup = async () => {
			const acc = await init();
			setAccount(acc.address);
		};

		setup();
	}, []);

	const loadRequests = async () => {
		if (!account) return;

		const data = await getUserRequests(
			account as `0x${string}`,
		);
		setRequests(data as bigint[]);
	};

	const handleCreateAccount = async () => {
		await requestAccountCreation(Number(credits));
		alert("Account request sent");
	};

	const handleRecharge = async () => {
		await requestRecharge(Number(credits));
		alert("Recharge request sent");
	};

	return (
		<div style={{ padding: 24, fontFamily: "system-ui" }}>
			<h1>AI Workspace Gateway</h1>

			<p>
				Wallet: <b>{account}</b>
			</p>

			<hr />

			<h2>Create Request</h2>

			<input
				type="number"
				placeholder="Credits"
				value={credits}
				onChange={(e) => setCredits(e.target.value)}
				style={{ padding: 8, marginRight: 8 }}
			/>

			<button onClick={handleCreateAccount}>
				Create Account
			</button>

			<button
				onClick={handleRecharge}
				style={{ marginLeft: 8 }}
			>
				Recharge
			</button>

			<hr />

			<h2>Your Requests</h2>

			<button onClick={loadRequests}>Load Requests</button>

			<ul>
				{requests.map((id) => (
					<li key={id.toString()}>
						Request ID: {id.toString()}
					</li>
				))}
			</ul>
		</div>
	);
}
