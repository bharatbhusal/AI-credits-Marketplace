"use client";

import Link from "next/link";

export function Navbar() {
	return (
		<header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between gap-4">
					<Link href="/" className="group flex flex-col gap-0.5">
						<span className="text-sm font-semibold tracking-[0.24em] uppercase text-foreground/90">
							CreditFi
						</span>
						<span className="text-xs text-muted-foreground">
							Trade AI credits with Crypto
						</span>
					</Link>
				</div>
			</div>
		</header>
	);
}
