"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export default function CartLink() {
  const count = useSelector((state: RootState) => state.cart.items.reduce((total, item) => total + item.quantity, 0));
  return <Link href="/cart" aria-label={`Cart with ${count} items`} className="relative grid h-10 w-10 place-items-center rounded-full text-[#254d3d] hover:bg-[#eaf6e5]"><ShoppingCart className="h-5 w-5" />{count ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#f2b84b] px-1 text-[11px] font-extrabold text-[#573c00]">{count}</span> : null}</Link>;
}
