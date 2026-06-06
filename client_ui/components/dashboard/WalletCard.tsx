"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type Props = {
	account: string;
	balance: string;
	loadingWallet: boolean;
	loadingChain: boolean;
	onConnect: () => void;
	onDisconnect: () => void;
	onRefresh: () => void;
};

export function WalletCard({
	account,
	balance,
	loadingWallet,
	loadingChain,
	onConnect,
	onDisconnect,
	onRefresh,
}: Props) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Wallet</CardTitle>

				{account ? (
					<Button variant="secondary" onClick={onDisconnect}>
						Disconnect
					</Button>
				) : (
					<Button onClick={onConnect} disabled={loadingWallet}>
						{loadingWallet ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							"Connect Wallet"
						)}
					</Button>
				)}
			</CardHeader>

			<CardContent>
				<Label>Address</Label>
				<p className="mt-1 text-sm font-mono break-all">
					{account || "Not connected"}
				</p>

				<div className="mt-3">
					<Label>Balance (ETH)</Label>
					<p className="text-sm font-medium">{balance}</p>
				</div>

				{/* <Button
					className="mt-4"
					variant="outline"
					onClick={onRefresh}
					disabled={!account || loadingChain}
				>
					{loadingChain ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						"Refresh Chain Data"
					)}
				</Button> */}
			</CardContent>
		</Card>
	);
}
