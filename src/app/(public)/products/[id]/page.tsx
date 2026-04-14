import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, CheckCircle2, ShieldCheck } from "lucide-react";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import ProductClientActions from "@/components/products/ProductClientActions";
import ProductGrid from "@/components/products/ProductGrid";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true }
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const related = await prisma.product.findMany({
    where: { 
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: { category: true },
    take: 4,
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-8 font-medium truncate">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
        <Link href={`/category/${product.category.slug}`} className="hover:text-primary transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
        <span className="text-primary truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* Left: Gallery */}
        <div className="relative">
          {product.badge && (
            <Badge className="absolute top-4 left-4 z-20 bg-accent text-accent-foreground border-none text-xs uppercase tracking-wider font-bold">
              {product.badge}
            </Badge>
          )}
          <ProductImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <Link href={`/category/${product.category.slug}`} className="text-primary text-sm font-semibold tracking-wider uppercase mb-2">
            {product.category.name}
          </Link>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4 leading-tight">
            {product.name}
          </h1>
          <p className="font-mono text-sm text-gray-500 bg-gray-100 w-max px-2 py-1 flex rounded border">
            SKU: <span className="font-bold ml-1 text-dark">{product.sku}</span>
          </p>

          <div className="mt-8 flex flex-col gap-4 text-gray-600">
            <p className="leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              {product.stock > 0 ? "In Stock & Ready to Ship" : "Out of Stock"}
            </div>
            <div className="flex items-center gap-2 text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/20">
              <ShieldCheck className="h-4 w-4" />
              Quality Checked
            </div>
          </div>

          <ProductClientActions product={product} />

          <div className="mt-8 pt-8 border-t space-y-4 text-sm text-gray-500">
            <p><strong>Note:</strong> Color of the actual product may slightly vary due to different photographic lighting sources or your display color settings.</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="border-t pt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-heading font-bold">You might also like</h2>
            <Link href={`/category/${product.category.slug}`} className="text-primary font-medium hover:underline">
              View Category
            </Link>
          </div>
          <ProductGrid products={related} emptyMessage="" />
        </div>
      )}
    </div>
  );
}
