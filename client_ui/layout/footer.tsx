"use client";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function Footer() {
	const currentYear = new Date().getFullYear();
	return (
		<footer className="border-t border-border/60 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
			<div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="grid gap-8 md:grid-cols-3">
					{/* Brand Section */}
					<div className="space-y-3">
						<Link
							href="/"
							className="group flex flex-col gap-0.5"
						>
							<span className="text-sm font-semibold tracking-[0.24em] uppercase text-foreground/90 transition-colors group-hover:text-foreground">
								CreditFi
							</span>
							<span className="text-xs text-muted-foreground transition-colors group-hover:text-muted-foreground/80">
								Trade AI credits with Crypto
							</span>
						</Link>
						<p className="max-w-xs text-sm leading-6 text-muted-foreground">
							AI credits Marketplace
						</p>
					</div>
				</div>

				<Separator className="my-6 bg-border/60" />

				{/* Bottom Section */}
				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
					<p className="text-xs text-muted-foreground">
						© {currentYear} creditFi. All rights reserved.
					</p>
					<p className="text-xs text-muted-foreground">
						Hyderabad
					</p>
				</div>
			</div>
		</footer>
	);
}
