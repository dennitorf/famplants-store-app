"use client";

import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { cartActions } from "@/store/cart-slice";

export default function AddToCartButton({ productId, name, sku, unitPrice, imageUrl, disabled }: { productId: string; name: string; sku: string; unitPrice: number; imageUrl?: string; disabled?: boolean }) {
  const dispatch = useDispatch();
  return <button type="button" disabled={disabled} onClick={() => dispatch(cartActions.addItem({ productId, name, sku, unitPrice, imageUrl, quantity: 1 }))} className="auth-button auth-button-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
    <ShoppingCart className="h-4 w-4" />{disabled ? "Out of stock" : "Add to cart"}
  </button>;
}
