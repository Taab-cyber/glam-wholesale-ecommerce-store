"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingBag, User } from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/account/orders")
        .then((res) => res.json())
        .then((data) => {
          setOrders(data.orders || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  const user = session?.user as any;

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-purple-100 text-purple-700",
    SHIPPED: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-2xl shadow-sm p-6 sticky top-24">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <User className="h-10 w-10" />
              </div>
              <h2 className="font-heading text-xl font-bold">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <Badge className={`mt-2 ${user?.isApproved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {user?.isApproved ? "Approved" : "Pending Approval"}
              </Badge>
            </div>

            <div className="space-y-2 border-t pt-4">
              <Link href="/account" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/5 text-primary font-medium">
                <User className="h-4 w-4" /> Profile
              </Link>
              <Link href="/account/orders" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-600 font-medium">
                <ShoppingBag className="h-4 w-4" /> My Orders
              </Link>
            </div>

            {user?.role === "ADMIN" && (
              <div className="mt-4 pt-4 border-t">
                <Link href="/admin">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                    Go to Admin Panel
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl font-bold">Recent Orders</h2>
              <Link href="/account/orders" className="text-primary text-sm font-medium hover:underline">
                View all
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No orders yet</h3>
                <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
                <Link href="/products">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-500">
                      <th className="text-left py-3 px-2 font-medium">Order #</th>
                      <th className="text-left py-3 px-2 font-medium">Date</th>
                      <th className="text-left py-3 px-2 font-medium">Items</th>
                      <th className="text-right py-3 px-2 font-medium">Total</th>
                      <th className="text-center py-3 px-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order: any) => (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-2 font-mono font-bold">{order.orderNumber}</td>
                        <td className="py-3 px-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-2">{order._count?.items || order.items?.length || 0}</td>
                        <td className="py-3 px-2 text-right font-bold">₹{order.totalAmount}</td>
                        <td className="py-3 px-2 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] || ""}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
