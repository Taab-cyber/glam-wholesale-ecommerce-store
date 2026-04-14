"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/store/cartStore";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  
  useEffect(() => setMounted(true), []);
  
  if (pathname.startsWith('/admin')) return null;

  const itemCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Menu */}
        <div className="flex md:hidden items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="text-primary font-heading text-2xl">Glam Wholesale</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium">Home</Link>
                <Link href="/products" className="text-lg font-medium">Products</Link>
                <Link href="/about" className="text-lg font-medium">About</Link>
                <Link href="/contact" className="text-lg font-medium">Contact</Link>
                {session ? (
                  <>
                    <Link href="/account" className="text-lg font-medium">My Account</Link>
                    {isAdmin && <Link href="/admin" className="text-lg font-medium text-primary">Admin Panel</Link>}
                    <button onClick={() => signOut()} className="text-lg font-medium text-red-500 text-left">Logout</button>
                  </>
                ) : (
                  <Link href="/login" className="text-lg font-medium text-primary">Login</Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/" className="font-heading text-2xl md:text-3xl font-bold text-primary flex-1 md:flex-none text-center md:text-left">
          Glam Wholesale
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">Home</Link>
          <Link href="/products" className="text-foreground hover:text-primary transition-colors font-medium">Products</Link>
          <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium">About</Link>
          <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-medium">Contact</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {session ? (
            <div className="hidden md:flex items-center gap-1">
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="text-primary text-xs">Admin</Button>
                </Link>
              )}
              <Link href="/account">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="hover:text-red-500" onClick={() => signOut()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:text-primary">
              <ShoppingCart className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 99 ? "99+" : Math.ceil(itemCount / 12)}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
