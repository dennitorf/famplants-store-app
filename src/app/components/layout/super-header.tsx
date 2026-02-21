import { Search, ShoppingCart } from "lucide-react";

export default function SuperHeader() {
    return (
        <header className="flex w-full items-center justify-between gap-4 py-4">
            <div className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search products..."
                    aria-label="Search"
                    className="h-10 w-full border-0 border-b border-border bg-transparent pl-10 pr-3 text-sm outline-none transition-colors focus:border-foreground"
                />
            </div>

            <button
                type="button"
                aria-label="Open cart"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-[#0A3D27] transition-colors hover:bg-accent"
            >
                <ShoppingCart className="h-5 w-5" style={{ color: "#0A3D27" }} />
            </button>
        </header>
    );
}