"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type Activity = {
	type: string;
	requestId: bigint;
	creditsRequested: bigint;
	tx: string;
};

type Props = {
	activities: Activity[];
};

export function ActivityFeedCard({ activities }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Activity</CardTitle>
			</CardHeader>

			<CardContent>
				{activities.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						No activity found
					</p>
				) : (
					<div className="space-y-2">
						{activities.map((a, i) => (
							<div
								key={i}
								className="border rounded-md p-3 text-sm space-y-1"
							>
								<p className="font-mono">{a.type}</p>
								<p>Request ID: {a.requestId.toString()}</p>
								<p>Credits: {a.creditsRequested.toString()}</p>
								<p className="text-xs text-muted-foreground">
									Tx: {a.tx}
								</p>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
