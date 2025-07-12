import Header from "@/components/header";
import { artistInfo } from "@/lib/data";
import Link from "next/link";

export default function BiographyPage() {
	return (
		<div className="fixed inset-0 w-screen min-h-screen bg-background z-50 md:p-4 overflow-y-auto">
			{/* Mobile Layout */}
			<div className="block md:hidden">
				{/* Header */}
				<Header />

				{/* Works Section */}
				<div className="space-y-4 my-12 p-4">
					<div className="space-y-4 text-sm leading-relaxed">
						{artistInfo.bio.map((paragraph, index) => (
							<p key={index}>{paragraph}</p>
						))}
					</div>
				</div>

				{/* Exhibitions Section */}
				<div className="w-full grid grid-cols-12 my-12 p-4">
					<h2 className="font-medium text-lg">Exhibitions</h2>
					<div className="space-y-1 text-sm col-span-2 col-start-6 -col-end-1">
						{artistInfo.exhibitions.map((exhibition, index) => (
							<p key={index}>{exhibition}</p>
						))}
					</div>
				</div>
			</div>

			{/* Desktop Layout */}
			<div
				className="hidden md:grid grid-cols-12 gap-0 min-h-full"
				style={{ gridTemplateRows: "auto auto" }}
			>
				{/* First Row - Works Section */}
				<div className="col-start-1 col-end-3">
					<Link href="/" className="font-medium text-[#8f8f8f]">
						{artistInfo.name}
					</Link>
				</div>

				<div className="col-start-5">
					<Link href="/works" className="font-medium text-[#8f8f8f]">
						Works
					</Link>
				</div>

				<div className="col-start-8 col-end-11 space-y-4 text-sm leading-relaxed pb-12">
					{artistInfo.bio.map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
				</div>

				<div className="flex col-start-12 ml-auto">
					<Link
						href="/contact"
						className="font-medium hover:text-[#8f8f8f] transition-colors"
					>
						Contact
					</Link>
				</div>

				{/* Second Row - Exhibitions Section */}
				<div className="col-start-1 col-end-3 row-start-2"></div>

				<div className="col-start-5 row-start-2">
					<h2 className="font-medium text-lg">Exhibitions</h2>
				</div>

				<div className="col-start-5 md:col-start-8 col-end-11 row-start-2 space-y-1 text-sm">
					{artistInfo.exhibitions.map((exhibition, index) => (
						<p key={index}>{exhibition}</p>
					))}
				</div>

				<div className="col-start-7 col-end-9 row-start-2"></div>
			</div>
		</div>
	);
}
