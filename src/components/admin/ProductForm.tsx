"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductFormProps {
  productId?: string;
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    moq: "12",
    stock: "0",
    categoryId: "",
    isActive: true,
    isFeatured: false,
    badge: "",
    images: [] as string[],
  });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => {});

    if (productId) {
      fetch(`/api/admin/products/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name || "",
            sku: data.sku || "",
            description: data.description || "",
            price: String(data.price || ""),
            moq: String(data.moq || "12"),
            stock: String(data.stock || "0"),
            categoryId: data.categoryId || "",
            isActive: data.isActive ?? true,
            isFeatured: data.isFeatured ?? false,
            badge: data.badge || "",
            images: data.images || [],
          });
        })
        .catch(() => toast.error("Failed to load product"));
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (res.ok && data.url) {
          setFormData((prev) => ({ ...prev, images: [...prev.images, data.url] }));
          toast.success(`Uploaded ${file.name}`);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      } catch {
        toast.error(`Error uploading ${file.name}`);
      }
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
      const method = productId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      toast.success(productId ? "Product updated!" : "Product created!");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/admin/products" className="flex items-center gap-2 text-primary hover:underline text-sm font-medium">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <h1 className="font-heading text-3xl font-bold text-dark">
        {productId ? "Edit Product" : "Add New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Crystal Jewelry Set" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input id="sku" name="sku" required value={formData.sku} onChange={handleChange} placeholder="e.g. ISLO-20180" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea id="description" name="description" required value={formData.description} onChange={handleChange} placeholder="Detailed product description..." className="min-h-[100px]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹) *</Label>
            <Input id="price" name="price" type="number" step="0.01" required value={formData.price} onChange={handleChange} placeholder="850" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="moq">MOQ</Label>
            <Input id="moq" name="moq" type="number" value={formData.moq} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="badge">Badge</Label>
            <Input id="badge" name="badge" value={formData.badge} onChange={handleChange} placeholder="Bestseller, New, Hot" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={formData.categoryId} onValueChange={(val) => setFormData((prev) => ({ ...prev, categoryId: val }))}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex items-end gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))} className="h-4 w-4" />
              <span className="font-medium text-sm">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))} className="h-4 w-4" />
              <span className="font-medium text-sm">Featured</span>
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <Label>Product Images</Label>
          <div className="flex flex-wrap gap-4">
            {formData.images.map((img, i) => (
              <div key={i} className="relative h-24 w-24 rounded-lg border overflow-hidden group">
                <Image src={img} alt={`Product image ${i + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            ))}
            <label className="h-24 w-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
              <Upload className="h-5 w-5 text-gray-400 mb-1" />
              <span className="text-[10px] text-gray-400">{uploading ? "Uploading..." : "Upload"}</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link href="/admin/products">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : productId ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
