export default function Club() {
	return (
		<section className="w-full bg-[#0A3D27] px-6 py-10 text-white md:px-10 md:py-12">
			<div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
				<div className="space-y-3">
					<h2 className="text-3xl font-bold">Join the FamPlants Club</h2>
					<p className="max-w-3xl text-white/90">
						Get exclusive benefits, member-only discounts, useful plant care information,
						and connect with other growers in our community.
					</p>
				</div>

				<form className="flex w-full flex-col gap-3 sm:flex-row">
					<input
						type="email"
						required
						placeholder="Enter your email address"
						aria-label="Email address"
						className="h-11 w-full rounded-md border border-white/35 bg-white px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-white"
					/>
					<button
						type="submit"
						className="h-11 rounded-md border border-white bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
					>
						Join now
					</button>
				</form>
			</div>
		</section>
	);
}