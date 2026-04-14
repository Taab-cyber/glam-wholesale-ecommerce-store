import Link from "next/link";
import { Globe, Heart, Phone, MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-heading text-2xl font-bold text-primary">Glam Wholesale</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              India&apos;s premier destination for high-quality wholesale fashionable accessories. Partner with us for the best designs.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-accent">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <Link href="/products" className="hover:text-primary transition-colors">All Products</Link>
              <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
              <Link href="/login" className="hover:text-primary transition-colors">Login / Account</Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-accent">Categories</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <Link href="/category/jewelry-sets" className="hover:text-primary transition-colors">Jewelry Sets</Link>
              <Link href="/category/hair-scrunchies" className="hover:text-primary transition-colors">Hair Scrunchies</Link>
              <Link href="/category/hair-claws" className="hover:text-primary transition-colors">Hair Claws</Link>
              <Link href="/category/bracelets" className="hover:text-primary transition-colors">Bracelets</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-accent">Contact Us</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-300">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> 123 Fashion Street, Mumbai</span>
              <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +91 98765 43210</span>
              <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> contact@glamwholesale.com</span>
              <div className="flex gap-4 pt-2">
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors" aria-label="Instagram"><Heart className="h-4 w-4" /></a>
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors" aria-label="Facebook"><Globe className="h-4 w-4" /></a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Glam Wholesale. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
