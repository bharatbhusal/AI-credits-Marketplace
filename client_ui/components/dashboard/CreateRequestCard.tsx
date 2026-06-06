"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";

type Props = {
	credits: string;
	setCredits: (v: string) => void;
	account: string;
	loadingTx: boolean;
	onCreate: () => void;
	onRecharge: () => void;
};

export function CreateRequestCard({
	credits,
	setCredits,
	account,
	loadingTx,
	onCreate,
	onRecharge,
}: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Create Request</CardTitle>
			</CardHeader>

			<CardContent className="space-y-4">
				<Label>Credit Count: </Label>
				<Input
					type="number"
					placeholder="Enter credits"
					value={credits}
					onChange={(e) => setCredits(e.target.value)}
					disabled={!account}
				/>

				<div className="flex gap-3">
					<Button
						onClick={onCreate}
						disabled={!account || loadingTx}
					>
						Create Account
					</Button>

					<Button
						variant="secondary"
						onClick={onRecharge}
						disabled={!account || loadingTx}
					>
						Recharge
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
