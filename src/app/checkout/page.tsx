import Link from "next/link";
import StoreShell from "@/app/components/layout/store-shell";
import { auth0 } from "@/lib/auth0";
import CheckoutForm from "./checkout-form";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth0.getSession();
  if (!session?.user) return <StoreShell><section className="mx-auto max-w-xl py-20 text-center"><h1 className="font-[family-name:var(--font-joti-one)] text-4xl text-[#0A3D27]">Sign in to check out</h1><p className="mt-4 text-[#557064]">Your cart is saved in this browser.</p><Link href="/auth/login?returnTo=/checkout" className="auth-button auth-button-primary mt-7">Sign in</Link></section></StoreShell>;
  return <StoreShell><CheckoutForm email={session.user.email ?? ""} name={session.user.name ?? ""} /></StoreShell>;
}
