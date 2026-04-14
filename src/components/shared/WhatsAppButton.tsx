"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  productName?: string;
  sku?: string;
  qty?: number;
  variant?: "icon" | "full" | "floating";
  className?: string;
}

export default function WhatsAppButton({ productName, sku, qty = 12, variant = "full", className = "" }: WhatsAppButtonProps) {
  const [phone, setPhone] = useState("+919876543210");

  useEffect(() => {
    // We would fetch settings from an endpoint if possible, but for a synchronous component,
    // we can either pass it down or load it initially via context.
    // For now falling back to default or fetching from a generic endpoint.
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if(data?.whatsapp) setPhone(data.whatsapp);
      })
      .catch(() => {});
  }, []);

  const getMessage = () => {
    if (productName && sku) {
      return `Hi Glam Wholesale, I want to order: ${productName} (SKU: ${sku}). Quantity: ${qty} pieces.`;
    }
    return "Hi Glam Wholesale, I have an inquiry.";
  };

  const handleWhatsApp = () => {
    const formattedPhone = phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(getMessage())}`;
    window.open(url, "_blank");
  };

  if (variant === "icon") {
    return (
      <Button 
        onClick={handleWhatsApp} 
        variant="outline" 
        size="icon" 
        className={`border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 w-full ${className}`}
        title="Order via WhatsApp"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    );
  }

  if (variant === "floating") {
    return (
      <button 
        onClick={handleWhatsApp}
        className={`fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center animate-bounce ${className}`}
        title="Chat on WhatsApp"
        aria-label="WhatsApp Us"
      >
        <MessageCircle className="h-8 w-8" />
      </button>
    );
  }

  return (
    <Button 
      onClick={handleWhatsApp} 
      className={`bg-green-500 hover:bg-green-600 text-white gap-2 shadow-sm ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      WhatsApp Us
    </Button>
  );
}
