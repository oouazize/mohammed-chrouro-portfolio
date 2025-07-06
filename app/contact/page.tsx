import { artistInfo } from "@/lib/data";

export default function ContactPage() {
	return (
		<div className="max-w-4xl mx-auto p-6 flex h-[calc(100dvh-64px)] items-center justify-center">
			<div className="grid md:grid-cols-2 gap-24 text-sm">
				<div>
					<h3 className="font-medium mb-4">Personal</h3>
					<div className="space-y-1">
						{artistInfo.contact.personal.email && (
							<p>E: {artistInfo.contact.personal.email}</p>
						)}
						{artistInfo.contact.personal.instagram && (
							<p>I: {artistInfo.contact.personal.instagram}</p>
						)}
						{artistInfo.contact.personal.phone && (
							<p>P: {artistInfo.contact.personal.phone}</p>
						)}
					</div>
				</div>

				<div>
					<h3 className="font-medium mb-4">Agency</h3>
					<div className="space-y-1">
						{artistInfo.contact.agency.name && (
							<p>MA: {artistInfo.contact.agency.name}</p>
						)}
						{artistInfo.contact.agency.agent && (
							<p>Agent: {artistInfo.contact.agency.agent}</p>
						)}
						{artistInfo.contact.agency.phone && (
							<p>Phone: {artistInfo.contact.agency.phone}</p>
						)}
						{artistInfo.contact.agency.website && (
							<p>Website: {artistInfo.contact.agency.website}</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
