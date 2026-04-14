import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import CategoryCard from "@/components/shared/CategoryCard";
import ProductGrid from "@/components/products/ProductGrid";
import { ShieldCheck, Package, Truck, IndianRupee } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

export const dynamic = "force-dynamic";

export default async function Home() {
  const categories = await prisma.category.findMany({ take: 6 });
  
  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { category: true },
    take: 8,
  });

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Marquee Strip */}
      <div className="bg-primary text-primary-foreground py-2 overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee inline-block text-sm font-semibold tracking-wider">
          {Array(5).fill("MOQ: 12 Pieces • Wholesale Prices • India Delivery • Jewelry • Hair Accessories • ").map((text, i) => (
            <span key={i} className="mx-4">{text}</span>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-pink-50 py-20 px-4 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#FF6EB410_1px,transparent_1px),linear-gradient(to_bottom,#FF6EB410_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-dark leading-tight drop-shadow-sm">
            India's Premier <br />
            <span className="text-primary italic">Wholesale Accessories</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Discover breathtaking jewelry sets, hair accessories, and trending styles. Premium quality with a strictly enforced MOQ of 12 pieces per product.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                Shop Now Collection
              </Button>
            </Link>
            <WhatsAppButton className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-lg hidden sm:flex" variant="full" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-16 w-16 bg-pink-100 text-primary rounded-2xl flex items-center justify-center mb-2 shadow-sm">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="font-heading font-bold text-xl">Premium Quality</h3>
              <p className="text-sm text-gray-500">Hand-picked styles ensuring durability and fashion.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-16 w-16 bg-pink-100 text-primary rounded-2xl flex items-center justify-center mb-2 shadow-sm">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="font-heading font-bold text-xl">Low MOQ</h3>
              <p className="text-sm text-gray-500">Stock up easily with a Minimum Order Quantity of 12.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-16 w-16 bg-pink-100 text-primary rounded-2xl flex items-center justify-center mb-2 shadow-sm">
                <IndianRupee className="h-8 w-8" />
              </div>
              <h3 className="font-heading font-bold text-xl">Best Prices</h3>
              <p className="text-sm text-gray-500">Unbeatable wholesale rates direct to buyers.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-16 w-16 bg-pink-100 text-primary rounded-2xl flex items-center justify-center mb-2 shadow-sm">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="font-heading font-bold text-xl">Fast Delivery</h3>
              <p className="text-sm text-gray-500">Speedy shipping anywhere across India.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-dark mb-4">Shop By Category</h2>
            <div className="w-24 h-1.5 bg-primary rounded-full" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} name={cat.name} slug={cat.slug} image={cat.image} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-dark mb-4">Trending Styles</h2>
            <div className="w-24 h-1.5 bg-primary rounded-full mb-6" />
            <p className="text-gray-500 max-w-xl text-lg">Top-selling styles that your customers will love.</p>
          </div>
          
          <ProductGrid products={featuredProducts} emptyMessage="No featured products yet." />
          
          <div className="mt-12 flex justify-center">
            <Link href="/products">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white px-8 rounded-full">
                View All Catalog
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
