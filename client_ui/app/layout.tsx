import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/layout/navbar";
import { Footer } from "@/layout/footer";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			data-scroll-behavior="smooth"
			suppressHydrationWarning
			className="dark h-full antialiased"
		>
			<body
				className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-background text-foreground`}
			>
				<div className="flex min-h-dvh flex-col">
					<Navbar />
					<div className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
						{children}
					</div>
					<Footer />
				</div>
			</body>
		</html>
	);
}
