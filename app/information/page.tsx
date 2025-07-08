import { artistInfo } from "@/lib/data";

export default function InformationPage() {
	return (
		<div className="max-w-4xl mx-auto p-6 pt-12 grid md:grid-cols-2 gap-12">
			<div className="space-y-8">
				{artistInfo.bio.map((paragraph, index) => (
					<div key={index}>
						<p>{paragraph}</p>
					</div>
				))}
			</div>

			<div className="space-y-12">
				<div>
					<h3 className="font-medium mb-4">Exhibitions</h3>
					<div className="space-y-1 text-sm">
						{artistInfo.exhibitions.map((exhibition, index) => (
							<p key={index}>{exhibition}</p>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
