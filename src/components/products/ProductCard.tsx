"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import WhatsAppButton from "../shared/WhatsAppButton";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    images: string[];
    category: { name: string; slug: string };
    badge: string | null;
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: 12,
      image: product.images[0] || null,
    });
  };

  const moqTotal = product.price * 12;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-[0_8px_30px_rgb(233,30,140,0.1)] transition-all duration-300 border overflow-hidden flex flex-col group">
      <div className="relative aspect-square w-full bg-muted overflow-hidden">
        {product.images[0] ? (
          <Image 
            src={product.images[0]} 
            alt={product.name} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-pink-50 text-primary/40">
            {product.category.name.includes("Jewelry") ? "💍" : "🎀"}
          </div>
        )}
        
        {product.badge && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground z-10 border-none shadow-sm pointer-events-none uppercase text-[10px] tracking-wider font-bold">
            {product.badge}
          </Badge>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/category/${product.category.slug}`} className="text-xs text-secondary font-medium tracking-wide mb-1 hover:underline">
          {product.category.name}
        </Link>
        <Link href={`/products/${product.id}`} className="group-hover:text-primary transition-colors">
          <h3 className="font-heading font-semibold text-lg line-clamp-2 leading-snug">{product.name}</h3>
        </Link>
        <p className="text-xs text-gray-500 mb-3 mt-1 font-mono">SKU: {product.sku}</p>
        
        <div className="mt-auto pt-3 border-t">
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-medium text-gray-600">Per piece:</span>
            <span className="text-lg font-bold text-dark">₹{product.price}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-primary bg-primary/5 px-2 py-1.5 rounded-md mb-4 border border-primary/10">
            <span>Min 12 pcs</span>
            <span className="font-bold text-sm">₹{moqTotal}</span>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            <Button onClick={handleAddToCart} className="col-span-4 w-full shadow-sm" disabled={product.stock < 12}>
              {product.stock < 12 ? "Out of Stock" : "Add to Cart"}
            </Button>
            <div className="col-span-1">
              <WhatsAppButton 
                productName={product.name} 
                sku={product.sku}
                variant="icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
