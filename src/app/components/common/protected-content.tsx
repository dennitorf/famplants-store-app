import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { auth0 } from "@/lib/auth0";

export default async function ProtectedContent({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();

  if (!session?.user) {
    return (
      <section className="mx-auto my-16 max-w-xl rounded-[2rem] border border-emerald-900/10 bg-[#f3faef] p-8 text-center shadow-sm">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[#0A3D27] shadow-sm">
          <LockKeyhole className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-2xl font-bold text-[#0A3D27]">Your garden is personal</h2>
        <p className="mt-2 text-[#557064]">
          Sign in to create gardens, add plants, and keep your collection organized.
          The plant and product catalogs remain open to everyone.
        </p>
        <Link href="/auth/login?returnTo=/gardens" className="auth-button auth-button-primary mt-6">
          Sign in to continue
        </Link>
      </section>
    );
  }

  return children;
}
