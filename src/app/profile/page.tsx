import Link from "next/link";
import { CalendarDays, Flower2, LogIn, LogOut, Mail, ShoppingBag, Sprout, UserRound } from "lucide-react";
import StoreShell from "@/app/components/layout/store-shell";
import PageHero from "@/app/components/common/page-hero";
import { ErrorState } from "@/app/components/common/async-state";
import { auth0 } from "@/lib/auth0";
import { loadResult } from "@/lib/result";
import { ensureCurrentUser } from "@/utils/services/auth/current-user-service";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth0.getSession();

  if (!session?.user) {
    return (
      <StoreShell>
        <PageHero eyebrow="Your account" title="Your FamPlants profile." description="Sign in to see your account details and personal growing spaces." />
        <section className="mx-auto mb-16 max-w-xl rounded-[2rem] border border-emerald-900/10 bg-[#f3faef] p-8 text-center shadow-sm">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[#0A3D27] shadow-sm">
            <UserRound className="h-6 w-6" />
          </span>
          <h2 className="mt-5 text-2xl font-bold text-[#0A3D27]">You are not signed in</h2>
          <p className="mt-2 text-[#557064]">Sign in to view your profile and manage your account session.</p>
          <Link href="/auth/login?returnTo=/profile" className="auth-button auth-button-primary mt-6">
            <LogIn className="h-4 w-4" /> Sign in
          </Link>
        </section>
      </StoreShell>
    );
  }

  const userResult = await loadResult(ensureCurrentUser());
  if (userResult.data === null) {
    return (
      <StoreShell>
        <PageHero eyebrow="Your account" title="Your FamPlants profile." description="Your account information and personal growing spaces." />
        <div className="pb-16"><ErrorState message={userResult.error || "We could not load your synchronized FamPlants user."} /></div>
      </StoreShell>
    );
  }

  const user = userResult.data;
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || session.user.name || "FamPlants member";
  const initials = getInitials(fullName);
  const memberSince = formatDate(user.createdDate);

  return (
    <StoreShell>
      <PageHero eyebrow="Your account" title="Your FamPlants profile." description="Review your account information and return to the places you use most." />
      <section className="mx-auto grid max-w-5xl gap-6 pb-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <article className="rounded-[2rem] bg-gradient-to-br from-[#2D6A4F] to-[#40916C] p-7 text-white shadow-lg">
            <div className="flex items-center gap-5">
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white/20 text-2xl font-extrabold">
                {initials}
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-white/75">FamPlants member</p>
                <h2 className="mt-1 text-3xl font-bold">{fullName}</h2>
                <p className="mt-1 text-white/85">Member since {memberSince}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-emerald-950/10 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold text-[#153f2f]">Account details</h2>
            <dl className="mt-5 divide-y divide-emerald-950/10">
              <ProfileRow icon={<UserRound className="h-5 w-5" />} label="Full name" value={fullName} />
              <ProfileRow icon={<Mail className="h-5 w-5" />} label="Email" value={user.email || session.user.email || "Not available"} />
              <ProfileRow icon={<CalendarDays className="h-5 w-5" />} label="Member since" value={memberSince} />
              <ProfileRow icon={<Sprout className="h-5 w-5" />} label="Authentication" value={user.authProvider || "Auth0"} />
            </dl>
          </article>
        </div>

        <aside className="space-y-6">
          <article className="rounded-[2rem] border border-emerald-950/10 bg-[#f3faef] p-7 shadow-sm">
            <h2 className="text-xl font-bold text-[#153f2f]">Quick links</h2>
            <div className="mt-5 grid gap-3">
              <ProfileLink href="/gardens" icon={<Sprout className="h-5 w-5" />} title="My gardens" description="Manage your growing spaces." />
              <ProfileLink href="/plants" icon={<Flower2 className="h-5 w-5" />} title="Explore plants" description="Browse plants and tagged collections." />
              <ProfileLink href="/products" icon={<ShoppingBag className="h-5 w-5" />} title="Shop" description="Explore published products." />
            </div>
          </article>
          <Link href="/auth/logout" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#b42318] px-5 py-4 font-bold text-white transition-opacity hover:opacity-90">
            <LogOut className="h-5 w-5" /> Sign out
          </Link>
        </aside>
      </section>
    </StoreShell>
  );
}

function ProfileRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="grid gap-2 py-4 sm:grid-cols-[1fr_1.5fr] sm:items-center">
      <dt className="flex items-center gap-2 font-bold text-[#557064]">{icon}{label}</dt>
      <dd className="break-words text-[#153f2f] sm:text-right">{value}</dd>
    </div>
  );
}

function ProfileLink({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl bg-white p-4 text-[#153f2f] shadow-sm transition-transform hover:-translate-y-0.5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e4f4dc] text-[#12613f]">{icon}</span>
      <span>
        <span className="block font-bold">{title}</span>
        <span className="block text-sm text-[#637b70]">{description}</span>
      </span>
    </Link>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return "FP";
  }
  return `${parts[0][0] || ""}${parts.length > 1 ? parts[parts.length - 1][0] || "" : ""}`.toUpperCase();
}

function formatDate(value?: string): string {
  if (!value) {
    return "Recently";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}
