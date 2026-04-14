"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Printer } from "lucide-react";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setStatus(data.status);
        setNotes(data.notes || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrder(updated);
        toast.success("Order updated!");
      } else {
        toast.error("Failed to update order");
      }
    } catch {
      toast.error("Error updating order");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-16 text-gray-400">Loading order...</div>;
  if (!order) return <div className="text-center py-16 text-red-500">Order not found</div>;

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-purple-100 text-purple-700",
    SHIPPED: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/orders" className="flex items-center gap-2 text-primary hover:underline text-sm font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
        <Button variant="outline" onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" /> Print
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <h1 className="font-heading text-3xl font-bold text-dark">Order {order.orderNumber}</h1>
        <span className={`text-sm px-3 py-1 rounded-full font-bold ${statusColors[order.status] || ""}`}>{order.status}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Info */}
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-heading text-xl font-bold border-b pb-3">Customer Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{order.user?.name || order.guestName || "Guest"}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{order.user?.email || order.guestEmail || "—"}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-medium">{order.user?.phone || order.guestPhone || "—"}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Business</span><span className="font-medium">{order.user?.businessName || order.businessName || "—"}</span></div>
          </div>

          <h3 className="font-bold text-sm pt-4">Shipping Address</h3>
          <p className="text-sm text-gray-600">{order.shippingAddress || "Not provided"}</p>

          <h3 className="font-bold text-sm pt-4">Payment Mode</h3>
          <p className="text-sm text-gray-600">{order.paymentMode || "Not specified"}</p>

          <h3 className="font-bold text-sm pt-4">Order Date</h3>
          <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
        </div>

        {/* Status Update */}
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-heading text-xl font-bold border-b pb-3">Update Order</h2>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Order Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes about this order..." />
          </div>

          <Button onClick={handleUpdate} disabled={saving} className="w-full">
            {saving ? "Updating..." : "Update Order"}
          </Button>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold border-b pb-3 mb-4">Order Items</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="text-left py-3 font-medium">Product</th>
              <th className="text-center py-3 font-medium">SKU</th>
              <th className="text-center py-3 font-medium">Qty</th>
              <th className="text-right py-3 font-medium">Price/pc</th>
              <th className="text-right py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item: any) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="py-3 font-medium">{item.product?.name || "Product"}</td>
                <td className="py-3 text-center font-mono text-xs">{item.product?.sku || "—"}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">₹{item.price}</td>
                <td className="py-3 text-right font-bold">₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2">
              <td colSpan={4} className="py-4 text-right font-bold text-lg">Order Total:</td>
              <td className="py-4 text-right font-bold text-lg">₹{order.totalAmount}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
