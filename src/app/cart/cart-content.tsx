"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { cartActions } from "@/store/cart-slice";

export default function CartContent() {
  const dispatch = useDispatch();
  const { items, hydrated } = useSelector((state: RootState) => state.cart);
  const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

  return <section className="py-10 md:py-14"><p className="eyebrow">Your order</p><h1 className="mt-2 font-[family-name:var(--font-joti-one)] text-4xl text-[#0A3D27] md:text-6xl">Shopping cart</h1>
    {!hydrated ? <p className="mt-8 text-[#557064]">Loading your cart...</p> : !items.length ? <div className="mt-8 rounded-[2rem] bg-[#f3faef] p-10 text-center"><ShoppingBag className="mx-auto h-10 w-10 text-[#40916c]" /><h2 className="mt-4 text-2xl font-bold text-[#153f2f]">Your cart is empty</h2><Link href="/products" className="auth-button auth-button-primary mt-6">Browse products</Link></div> : <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_.7fr]"><div className="divide-y rounded-[2rem] border border-emerald-950/10 bg-white px-6">{items.map((item) => <article key={item.productId} className="grid gap-4 py-6 sm:grid-cols-[6rem_1fr_auto] sm:items-center">{item.imageUrl ? <Image src={item.imageUrl} alt={item.name} width={96} height={96} unoptimized className="h-24 w-24 rounded-2xl object-cover" /> : <div className="image-placeholder h-24 w-24 rounded-2xl !p-2">Photo</div>}<div><Link href={`/products/${item.productId}`} className="text-lg font-bold text-[#153f2f] hover:underline">{item.name}</Link><p className="text-sm text-[#637b70]">SKU {item.sku} · ${item.unitPrice.toFixed(2)} each</p><div className="mt-3 inline-flex items-center rounded-full border border-emerald-950/10"><button className="p-2" onClick={() => dispatch(cartActions.setQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}><Minus className="h-4 w-4" /></button><span className="min-w-9 text-center font-bold">{item.quantity}</span><button className="p-2" onClick={() => dispatch(cartActions.setQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}><Plus className="h-4 w-4" /></button></div></div><div className="flex items-center justify-between gap-5 sm:block sm:text-right"><p className="font-extrabold text-[#0A3D27]">${(item.unitPrice * item.quantity).toFixed(2)}</p><button onClick={() => dispatch(cartActions.removeItem(item.productId))} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-red-700"><Trash2 className="h-4 w-4" />Remove</button></div></article>)}</div><aside className="h-fit rounded-[2rem] bg-[#0A3D27] p-7 text-white"><h2 className="text-xl font-bold">Order summary</h2><div className="mt-6 flex justify-between border-b border-white/20 pb-4"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><p className="mt-4 text-sm text-white/70">Shipping and taxes will be calculated during checkout.</p><Link href="/checkout" className="auth-button mt-6 w-full bg-[#f2b84b] !text-[#573c00] hover:opacity-90">Continue to checkout</Link></aside></div>}
  </section>;
}
