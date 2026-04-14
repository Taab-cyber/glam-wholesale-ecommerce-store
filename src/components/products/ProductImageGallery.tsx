"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0] || null);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-2xl w-full flex items-center justify-center text-6xl">
        {productName.toLowerCase().includes("jewelry") ? "💍" : "🎀"}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-muted border">
        {mainImage && (
          <Image 
            src={mainImage} 
            alt={productName} 
            fill 
            className="object-cover hover:scale-110 transition-transform duration-500 cursor-zoom-in"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setMainImage(img)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                mainImage === img ? "border-primary ring-2 ring-primary/20 ring-offset-2" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img} alt={`${productName} thumbnail ${i+1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
