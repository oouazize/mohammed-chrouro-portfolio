import { artistInfo } from "@/lib/data";

export default function ContactPage() {
	return (
		<div className="w-full p-4 flex h-[calc(100dvh-64px)] items-center justify-center">
			<div className="w-full flex flex-col md:flex-row gap-8 justify-between md:grid grid-cols-12">
				<div className="flex md:block md:col-span-2 md:col-start-7 md:col-end-10">
					<p>Personal</p>
					<div className="ml-24 md:ml-0 flex flex-col">
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

				<div className="flex md:block md:col-span-2 md:col-start-10">
					<p>Agency</p>
					<div className="ml-24 md:ml-0 flex flex-col">
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
