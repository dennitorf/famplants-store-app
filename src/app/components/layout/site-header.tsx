import Link from "next/link";
import { LogIn, LogOut, Menu, Sprout, UserRound } from "lucide-react";
import { auth0 } from "@/lib/auth0";

const links = [
  { href: "/plants", label: "Plants" },
  { href: "/families", label: "Families" },
  { href: "/products", label: "Shop" },
  { href: "/gardens", label: "My gardens" },
];

export default async function SiteHeader() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 -mx-3 border-b border-emerald-950/10 bg-[#fbfdf8]/95 px-3 backdrop-blur sm:-mx-4 sm:px-4 md:-mx-6 md:px-6">
      <div className="mx-auto flex h-18 max-w-[1392px] items-center justify-between gap-4">
        <Link href="/home" className="flex items-center gap-2 text-[#0A3D27]">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#dff5d8]">
            <Sprout className="h-6 w-6" />
          </span>
          <span className="font-[family-name:var(--font-joti-one)] text-xl">FamPlants</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm font-bold text-[#254d3d] transition-colors hover:bg-[#eaf6e5]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <div className="flex max-w-44 items-center gap-2 text-sm text-[#254d3d]">
                <UserRound className="h-4 w-4 shrink-0" />
                <span className="truncate">{user.name ?? user.email ?? "Garden member"}</span>
              </div>
              <Link href="/auth/logout" className="auth-button auth-button-secondary">
                <LogOut className="h-4 w-4" /> Sign out
              </Link>
            </>
          ) : (
            <Link href="/auth/login" className="auth-button auth-button-primary">
              <LogIn className="h-4 w-4" /> Sign in
            </Link>
          )}
        </div>

        <details className="relative md:hidden">
          <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border border-emerald-950/10 text-[#0A3D27]" aria-label="Toggle menu">
            <Menu className="h-5 w-5" />
          </summary>
          <div className="absolute right-0 top-12 w-64 rounded-2xl border border-emerald-950/10 bg-white p-3 shadow-xl">
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-xl px-4 py-3 font-bold text-[#254d3d] hover:bg-[#eaf6e5]">
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link href={user ? "/auth/logout" : "/auth/login"} className="auth-button auth-button-primary mt-2 w-full">
              {user ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              {user ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
