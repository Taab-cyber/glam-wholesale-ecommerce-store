import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  images: string[];
  category: { name: string; slug: string };
  badge: string | null;
  stock: number;
}

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export default function ProductGrid({ products, emptyMessage = "No products found." }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-heading text-gray-400">{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
