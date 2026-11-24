import Link from "next/link";
import Image from "next/image";
import {
  LogIn,
  LogOut,
  Menu,
  Search,
  UserRound,
} from "lucide-react";
import { auth0 } from "@/lib/auth0";
import CartLink from "@/app/components/cart/cart-link";
import { TagsService } from "@/utils/services/plants/tags-service";
import { loadResult } from "@/lib/result";

const utilityLinks = [
  { href: "/plants", label: "All Plants" },
  { href: "/collections", label: "Collections" },
  { href: "/products", label: "Shop" },
  { href: "/gardens", label: "Gardens" },
];

export default async function SiteHeader() {
  const [session, tagsResult] = await Promise.all([
    auth0.getSession(),
    loadResult(TagsService.getMenuTags()),
  ]);
  const user = session?.user;
  const links = [
    ...(tagsResult.data ?? []).map((tag) => ({
      href: `/plants/tags/${encodeURIComponent(tag.slug)}`,
      label: tag.name || "Plant tag",
    })),
    ...utilityLinks,
  ];

  return (
    <header className="sticky top-0 z-50 -mx-3 border-b border-emerald-950/10 bg-[#fbfdf8]/95 px-3 backdrop-blur sm:-mx-4 sm:px-4 md:-mx-6 md:px-6">
      <div className="mx-auto flex min-h-18 max-w-[1392px] flex-wrap items-center justify-between gap-x-3 gap-y-2 py-2">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-[#0A3D27]" aria-label="Fam Plants home">
          <Image
            src="/brand/fam-plants-logo.svg"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <span className="hidden font-[family-name:var(--font-joti-one)] text-xl min-[400px]:inline">FamPlants</span>
        </Link>

        <form action="/plants" method="get" role="search" aria-label="Search plant catalog" className="order-last flex w-full items-center rounded-full border border-emerald-950/15 bg-white focus-within:ring-2 focus-within:ring-[#15bc65] md:order-none md:mx-4 md:w-auto md:max-w-xl md:flex-1">
          <input type="search" name="q" aria-label="Search plants" placeholder="Search plants by name…" className="h-11 min-w-0 flex-1 rounded-l-full bg-transparent pl-5 pr-2 text-sm text-[#153f2f] outline-none" />
          <button type="submit" aria-label="Search" className="m-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0A3D27] text-white transition-colors hover:bg-[#256044] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A3D27]">
            <Search aria-hidden="true" className="h-4 w-4" />
          </button>
        </form>

        <div className="hidden items-center gap-3 md:flex">
          <CartLink />
          {user ? (
            <>
              <Link
                href="/profile"
                aria-label="View profile"
                title="Profile"
                className="grid h-10 w-10 place-items-center rounded-full text-[#254d3d] transition-colors hover:bg-[#eaf6e5]"
              >
                <UserRound className="h-5 w-5" />
              </Link>
              <Link
                href="/auth/logout"
                aria-label="Sign out"
                title="Sign out"
                className="grid h-10 w-10 place-items-center rounded-full border border-emerald-950/15 text-[#254d3d] transition-colors hover:bg-[#eef8e9]"
              >
                <LogOut className="h-5 w-5" />
              </Link>
            </>
          ) : (
            <Link href="/auth/login" className="auth-button auth-button-primary">
              <LogIn className="h-4 w-4" /> Sign in
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <CartLink />
          {user ? (
            <>
              <Link
                href="/profile"
                aria-label="View profile"
                title="Profile"
                className="grid h-10 w-10 place-items-center rounded-full text-[#254d3d] hover:bg-[#eaf6e5]"
              >
                <UserRound className="h-5 w-5" />
              </Link>
              <Link
                href="/auth/logout"
                aria-label="Sign out"
                title="Sign out"
                className="grid h-10 w-10 place-items-center rounded-full border border-emerald-950/15 text-[#254d3d] hover:bg-[#eef8e9]"
              >
                <LogOut className="h-5 w-5" />
              </Link>
            </>
          ) : null}
          <details className="relative">
            <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border border-emerald-950/10 text-[#0A3D27]" aria-label="Toggle menu">
              <Menu className="h-5 w-5" />
            </summary>
            <div className="absolute right-0 top-12 max-h-[75vh] w-72 overflow-y-auto rounded-2xl border border-emerald-950/10 bg-white p-3 shadow-xl">
              <nav className="grid gap-1" aria-label="Mobile navigation">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-xl px-4 py-3 font-bold text-[#254d3d] hover:bg-[#eaf6e5]">
                    {link.label}
                  </Link>
                ))}
              </nav>
              {!user ? (
                <Link href="/auth/login" className="auth-button auth-button-primary mt-2 w-full">
                  <LogIn className="h-4 w-4" /> Sign in
                </Link>
              ) : null}
            </div>
          </details>
        </div>
      </div>
      <nav className="mx-auto hidden max-w-[1392px] flex-wrap items-center gap-1 border-t border-emerald-950/10 py-2 md:flex" aria-label="Main navigation">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm font-bold text-[#254d3d] transition-colors hover:bg-[#eaf6e5]">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
