"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = (q?: string) => {
    setLoading(true);
    const url = q ? `/api/admin/products?search=${encodeURIComponent(q)}` : "/api/admin/products";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Error deleting product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-dark">Products</h1>
          <p className="text-gray-500">{products.length} products</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Add New Product</Button>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button type="submit" variant="outline">Search</Button>
      </form>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-500 text-left">
                  <th className="p-4 font-medium">Image</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">SKU</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium text-right">Price</th>
                  <th className="p-4 font-medium text-center">Stock</th>
                  <th className="p-4 font-medium text-center">Status</th>
                  <th className="p-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="h-12 w-12 bg-muted rounded-lg overflow-hidden relative">
                        {product.images?.[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-lg">📦</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium line-clamp-1">{product.name}</p>
                      {product.badge && <Badge className="text-[10px] mt-1 bg-accent text-accent-foreground">{product.badge}</Badge>}
                    </td>
                    <td className="p-4 font-mono text-xs">{product.sku}</td>
                    <td className="p-4">{product.category?.name}</td>
                    <td className="p-4 text-right font-semibold">₹{product.price}</td>
                    <td className="p-4 text-center">
                      <span className={product.stock < 20 ? "text-red-600 font-bold" : ""}>{product.stock}</span>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={product.isActive ? "default" : "secondary"} className="text-[10px]">
                        {product.isActive ? "Active" : "Draft"}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <Button size="icon" variant="ghost" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                        </Link>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleDelete(product.id, product.name)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
