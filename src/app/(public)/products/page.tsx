import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/products/ProductGrid";
import CategoryCard from "@/components/shared/CategoryCard";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  const categories = await prisma.category.findMany();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-4xl md:text-5xl font-bold text-dark mb-4 text-center">All Collections</h1>
      <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
        Explore our complete catalog of premium wholesale accessories. Strict MOQ of 12 pieces applies to all orders.
      </p>

      {/* Categories Filter Quick Links */}
      <div className="mb-12">
        <h2 className="text-xl font-heading font-semibold mb-6">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} name={cat.name} slug={cat.slug} image={cat.image} />
          ))}
        </div>
      </div>

      <div className="my-8 h-px bg-gray-200" />

      {/* Product Catalog */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-heading font-semibold">Latest Products</h2>
        <span className="text-sm text-gray-500 font-medium">{products.length} products</span>
      </div>
      
      <ProductGrid 
        products={products} 
        emptyMessage="We are currently restocking. Check back soon!" 
      />
    </div>
  );
}
