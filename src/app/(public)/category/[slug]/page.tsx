import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/products/ProductGrid";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        where: { isActive: true },
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-8 font-medium">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-primary">{category.name}</span>
      </div>

      {/* Category Header */}
      <div className="bg-pink-50 rounded-3xl p-8 md:p-12 mb-12 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl">💎</div>
        <div className="relative z-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-dark mb-4">{category.name}</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Discover our premium {category.name.toLowerCase()} for wholesale buyers. Minimum order quantity of 12 pieces per design.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-heading font-semibold">Products ({category.products.length})</h2>
      </div>

      <ProductGrid 
        products={category.products} 
        emptyMessage={`No products found in ${category.name} yet.`} 
      />
    </div>
  );
}
