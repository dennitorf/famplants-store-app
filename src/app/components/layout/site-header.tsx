import Link from "next/link";
import {
  ChevronDown,
  Flower2,
  Hash,
  Layers3,
  LogIn,
  LogOut,
  Menu,
  Sprout,
  UserRound,
} from "lucide-react";
import { auth0 } from "@/lib/auth0";
import { PlantTagsService } from "@/utils/services/plants/plant-tags-service";

const links = [
  { href: "/products", label: "Shop" },
  { href: "/gardens", label: "My gardens" },
];

export default async function SiteHeader() {
  const [session, tagsResponse] = await Promise.all([
    auth0.getSession(),
    PlantTagsService.getAll(1, 100).catch(() => null),
  ]);
  const user = session?.user;
  const tags = tagsResponse?.data ?? [];

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
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded-full px-4 py-2 text-sm font-bold text-[#254d3d] transition-colors hover:bg-[#eaf6e5]">
              Plants
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="absolute left-0 top-12 max-h-[70vh] w-[38rem] overflow-y-auto rounded-3xl border border-emerald-950/10 bg-white p-4 shadow-2xl">
              <div className="mb-3 grid grid-cols-2 gap-2 border-b border-emerald-950/10 pb-3">
                <Link href="/plants" className="flex items-center gap-3 rounded-2xl bg-[#eef8e9] p-3 font-bold text-[#153f2f] hover:bg-[#dff2d7]">
                  <Flower2 className="h-5 w-5" /> All plants
                </Link>
                <Link href="/families" className="flex items-center gap-3 rounded-2xl bg-[#eef8e9] p-3 font-bold text-[#153f2f] hover:bg-[#dff2d7]">
                  <Layers3 className="h-5 w-5" /> Families
                </Link>
              </div>
              {tags.length ? (
                <div>
                  <p className="eyebrow mb-2 px-2">Collections by tag</p>
                  <div className="grid grid-cols-2 gap-1">
                    {tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/plants?tag=${encodeURIComponent(tag.id)}`}
                        className="flex items-start gap-2 rounded-xl px-3 py-2 text-sm text-[#365b4b] hover:bg-[#eef8e9] hover:text-[#0A3D27]"
                      >
                        <Hash className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          <span className="block font-bold">{tag.name || "Plant collection"}</span>
                          {tag.description ? <span className="mt-0.5 block line-clamp-1 text-xs text-[#70857b]">{tag.description}</span> : null}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </details>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm font-bold text-[#254d3d] transition-colors hover:bg-[#eaf6e5]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href="/profile" className="flex max-w-44 items-center gap-2 rounded-full px-3 py-2 text-sm text-[#254d3d] hover:bg-[#eaf6e5]">
                <UserRound className="h-4 w-4 shrink-0" />
                <span className="truncate">{user.name ?? user.email ?? "Garden member"}</span>
              </Link>
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
          <div className="absolute right-0 top-12 max-h-[75vh] w-72 overflow-y-auto rounded-2xl border border-emerald-950/10 bg-white p-3 shadow-xl">
            <nav className="grid gap-1" aria-label="Mobile navigation">
              <Link href="/plants" className="rounded-xl px-4 py-3 font-bold text-[#254d3d] hover:bg-[#eaf6e5]">All plants</Link>
              <Link href="/families" className="rounded-xl px-4 py-3 font-bold text-[#254d3d] hover:bg-[#eaf6e5]">Families</Link>
              {tags.length ? (
                <details className="rounded-xl bg-[#f4faef]">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-bold text-[#254d3d]">
                    Plant tags <ChevronDown className="h-4 w-4" />
                  </summary>
                  <div className="grid gap-1 px-2 pb-2">
                    {tags.map((tag) => (
                      <Link key={tag.id} href={`/plants?tag=${encodeURIComponent(tag.id)}`} className="rounded-lg px-3 py-2 text-sm text-[#365b4b] hover:bg-white">
                        {tag.name || "Plant collection"}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : null}
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-xl px-4 py-3 font-bold text-[#254d3d] hover:bg-[#eaf6e5]">
                  {link.label}
                </Link>
              ))}
              {user ? <Link href="/profile" className="rounded-xl px-4 py-3 font-bold text-[#254d3d] hover:bg-[#eaf6e5]">Profile</Link> : null}
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
