"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    shippingAddress: "",
    notes: "",
    paymentMode: "Bank Transfer", // Default
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
          totalAmount: getTotal(),
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to place order');

      toast.success("Order placed successfully!");
      clearCart();
      router.push(`/order-success/${data.order.id}`);
    } catch (error: any) {
      toast.error(error.message || "An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null; // Avoid flicker before redirect

  const subtotal = getTotal();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Form */}
        <div className="flex-1 order-2 lg:order-1">
          <form id="checkout-form" onSubmit={handleSubmit} className="bg-white rounded-2xl border shadow-sm p-6 md:p-8 space-y-8">
            {/* Contact Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-heading font-bold border-b pb-2">Contact & Shipping Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (WhatsApp) *</Label>
                  <Input id="phone" name="phone" required value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business/Store Name</Label>
                  <Input id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Your Store Name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingAddress">Complete Shipping Address *</Label>
                <Input id="shippingAddress" name="shippingAddress" required value={formData.shippingAddress} onChange={handleChange} placeholder="123 Street Name, City, State, PIN" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h2 className="text-xl font-heading font-bold border-b pb-2">Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`border rounded-xl p-4 cursor-pointer transition-colors ${formData.paymentMode === 'Bank Transfer' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="paymentMode" value="Bank Transfer" checked={formData.paymentMode === 'Bank Transfer'} onChange={handleChange} className="h-4 w-4 text-primary" />
                    <span className="font-medium">Bank Transfer / UPI</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-7">Invoice with bank details will be shared after order confirmation.</p>
                </label>
                <label className={`border rounded-xl p-4 cursor-pointer transition-colors ${formData.paymentMode === 'Pay on Delivery' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="paymentMode" value="Pay on Delivery" checked={formData.paymentMode === 'Pay on Delivery'} onChange={handleChange} className="h-4 w-4 text-primary" />
                    <span className="font-medium">Pay on Delivery</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-7">Partial advance might be required depending on order size. Shipping extra.</p>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Order Notes (Optional)</Label>
              <textarea 
                id="notes" 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange} 
                className="w-full flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Any special packing or GST bill requests..."
              />
            </div>

            <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={loading}>
              {loading ? "Processing..." : "Place Final Order"}
            </Button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-[400px] order-1 lg:order-2">
          <div className="bg-gray-50 rounded-2xl border p-6 sticky top-24">
            <h2 className="font-heading text-xl font-bold mb-6">Order Review</h2>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 divide-y">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 items-center pt-4 first:pt-0">
                  <div className="h-16 w-16 bg-white rounded-md relative overflow-hidden flex-shrink-0 border">
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                  </div>
                  <div className="flex-1 text-sm">
                    <h4 className="font-medium line-clamp-1">{item.name}</h4>
                    <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-sm">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping cost</span>
                <span className="italic">To be calculated</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-dark">₹{subtotal}</span>
              </div>
              <div className="bg-primary/10 text-primary text-xs p-3 rounded-lg text-center mt-4">
                Note: Shipping charges will be communicated via WhatsApp/Email before dispatch.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
