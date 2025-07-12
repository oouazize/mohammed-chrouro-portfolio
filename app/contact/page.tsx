import { artistInfo } from "@/lib/data";

export default function ContactPage() {
	return (
		<div className="w-full p-4 flex h-[calc(100dvh-64px)] items-center justify-center">
			<div className="w-full grid grid-cols-12">
				<div className="col-span-2 col-start-1 -col-end-1 md:col-start-9 md:col-end-11">
					<p className="-mb-4 md:mb-0">Personal</p>
					<div className="ml-44 md:ml-0">
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

				<div className="row-span-2 col-span-2 col-start-1 -col-end-1 md:col-start-11 mt-10 md:mt-0">
					<p className="-mb-4 md:mb-0">Agency</p>
					<div className="ml-44 md:ml-0">
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
