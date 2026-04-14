"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  const handleIncrement = (productId: string, currentQty: number) => {
    updateQuantity(productId, currentQty + 12);
  };

  const handleDecrement = (productId: string, currentQty: number) => {
    if (currentQty > 12) updateQuantity(productId, currentQty - 12);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="bg-pink-50 h-24 w-24 rounded-full flex items-center justify-center text-primary mb-6">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="font-heading text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Wholesale shopping awaits!</p>
        <Link href="/products">
          <Button size="lg" className="rounded-full px-8">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const subtotal = getTotal();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b text-sm font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            <div className="divide-y">
              {items.map((item) => (
                <div key={item.productId} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="col-span-1 dflex md:col-span-6 flex gap-4 items-center">
                    <div className="h-20 w-20 bg-muted rounded-xl relative overflow-hidden flex-shrink-0 border">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex justify-center items-center">📦</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 font-mono mt-1">SKU: {item.sku}</p>
                      <p className="text-sm font-medium mt-1">₹{item.price} <span className="text-gray-400 text-xs">/ piece</span></p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-1 md:col-span-3 flex justify-center items-center mt-4 md:mt-0">
                    <div className="flex items-center border rounded-lg bg-gray-50">
                      <button onClick={() => handleDecrement(item.productId, item.quantity)} className="p-2 hover:bg-gray-200 transition-colors" disabled={item.quantity <= 12}>
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="w-12 text-center font-bold text-sm">{item.quantity}</div>
                      <button onClick={() => handleIncrement(item.productId, item.quantity)} className="p-2 hover:bg-gray-200 transition-colors">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-1 md:col-span-2 text-right mt-2 md:mt-0">
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>

                  {/* Remove */}
                  <div className="col-span-1 text-right md:text-center absolute top-4 right-4 md:static">
                    <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600 transition-colors p-2" aria-label="Remove item">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 text-xs text-gray-500 text-center border-t">
              * Quantities can only be adjusted in multiples of 12.
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-white rounded-2xl border shadow-sm p-6 sticky top-24">
            <h2 className="font-heading text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-sm italic">Calculated after order</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-dark">₹{subtotal}</span>
              </div>
              <p className="text-xs text-gray-500 text-right mt-1">Excluding shipping</p>
            </div>

            <div className="space-y-3">
              <Link href="/checkout" className="block">
                <Button size="lg" className="w-full text-lg h-14 shadow-md bg-dark hover:bg-dark/90 text-white rounded-xl">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/products" className="block text-center mt-4">
                <Button variant="ghost" className="w-full p-2 text-primary hover:text-primary/80 hover:bg-primary/5">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
