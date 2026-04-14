"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import WhatsAppButton from "../shared/WhatsAppButton";
import { toast } from "sonner";

interface ProductClientActionsProps {
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    images: string[];
  };
}

export default function ProductClientActions({ product }: ProductClientActionsProps) {
  const [qty, setQty] = useState(12);
  const addItem = useCartStore((state) => state.addItem);

  const increment = () => setQty(prev => prev + 12);
  const decrement = () => setQty(prev => (prev > 12 ? prev - 12 : 12));

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: qty,
      image: product.images[0] || null,
    });
    toast.success(`Added ${qty} pieces of ${product.name} to cart.`);
  };

  const isOutOfStock = product.stock < 12;

  return (
    <div className="flex flex-col gap-6 mt-8">
      {/* Price Display */}
      <div className="bg-gray-50 border p-4 rounded-xl">
        <div className="text-gray-500 text-sm font-medium mb-1">Wholesale Price</div>
        <div className="flex items-end gap-3 mb-2">
          <span className="text-4xl font-bold text-dark font-heading">₹{product.price}</span>
          <span className="text-gray-500 mb-1">/ piece</span>
        </div>
        <div className="flex justify-between items-center bg-primary/10 text-primary px-3 py-2 rounded font-medium text-sm">
          <span>Minimum Order (12 pcs)</span>
          <span>₹{product.price * 12}</span>
        </div>
        <div className="flex justify-between items-center bg-accent/20 text-dark px-3 py-2 rounded font-medium text-sm mt-2 border border-accent/30">
          <span>Your Selection ({qty} pcs)</span>
          <span className="font-bold">₹{product.price * qty}</span>
        </div>
      </div>

      {isOutOfStock ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center justify-center font-semibold">
          This product is currently out of stock.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border rounded-lg bg-white overflow-hidden shadow-sm">
              <button onClick={decrement} className="px-4 py-3 hover:bg-gray-100 transition-colors" aria-label="Decrease">
                <Minus className="h-4 w-4" />
              </button>
              <div className="px-4 font-bold border-x w-16 text-center">{qty}</div>
              <button 
                onClick={increment} 
                className="px-4 py-3 hover:bg-gray-100 transition-colors" 
                aria-label="Increase"
                disabled={qty + 12 > product.stock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {qty >= product.stock && (
              <span className="text-xs text-orange-500 font-medium ml-2">Max stock reached</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <Button size="lg" onClick={handleAddToCart} className="w-full shadow-lg h-14 text-lg bg-dark hover:bg-dark/90">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <WhatsAppButton 
              productName={product.name}
              sku={product.sku}
              qty={qty}
              className="w-full shadow-lg h-14 text-lg"
            />
          </div>
          <div className="mt-2 text-center text-xs text-gray-400">
            * Items are added in multiples of 12 only.
          </div>
        </div>
      )}
    </div>
  );
}
