"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type Props = {
	account: string;
	requests: bigint[];
	loading: boolean;
	onLoad: () => void;
};

export function RequestsCard({
	account,
	requests,
	loading,
	onLoad,
}: Props) {
	console.log(requests);
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Your Requests</CardTitle>

				<Button
					variant="outline"
					onClick={onLoad}
					disabled={!account || loading}
				>
					Refresh
				</Button>
			</CardHeader>

			<CardContent>
				{!account ? (
					<p className="text-sm text-muted-foreground">
						Connect wallet to view requests
					</p>
				) : requests.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						No requests found
					</p>
				) : (
					<div className="space-y-2">
						{requests.map((id) => (
							<div
								key={id.toString()}
								className="flex items-center justify-between rounded-md border p-3"
							>
								<span className="text-sm font-mono">
									Request #{id.toString()}
								</span>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
