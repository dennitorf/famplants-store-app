import {
	Facebook,
	Instagram,
	Linkedin,
	Twitter,
	Youtube,
} from "lucide-react";

const footerColumns = [
	{
		title: "Support",
		links: [
			{ label: "Return Policy", href: "#" },
			{ label: "Contact Us", href: "#" },
			{ label: "Shipping Info", href: "#" },
		],
	},
	{
		title: "Legal",
		links: [
			{ label: "Terms of Privacy", href: "#" },
			{ label: "Terms of Service", href: "#" },
			{ label: "Cookie Policy", href: "#" },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "About Us", href: "#" },
			{ label: "Careers", href: "#" },
			{ label: "FAQ", href: "#" },
		],
	},
];

const socialLinks = [
	{ label: "Instagram", href: "#", Icon: Instagram },
	{ label: "Facebook", href: "#", Icon: Facebook },
	{ label: "Twitter", href: "#", Icon: Twitter },
	{ label: "YouTube", href: "#", Icon: Youtube },
	{ label: "LinkedIn", href: "#", Icon: Linkedin },
];

export default function Footer() {
	return (
		<footer className="mt-10 border-t border-border py-8">
			<div className="grid gap-8 md:grid-cols-4">
				{footerColumns.map((column) => (
					<div key={column.title} className="space-y-3">
						<h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
						<ul className="space-y-2">
							{column.links.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				))}

				<div className="space-y-3">
					<h3 className="text-sm font-semibold text-foreground">Follow Us</h3>
					<ul className="space-y-2">
						{socialLinks.map(({ label, href, Icon }) => (
							<li key={label}>
								<a
									href={href}
									className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
								>
									<Icon className="h-4 w-4" />
									<span>{label}</span>
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	);
}