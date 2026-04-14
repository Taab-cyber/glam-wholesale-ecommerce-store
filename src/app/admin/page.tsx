"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShoppingBag, Package, Users, IndianRupee, AlertTriangle, Clock, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center py-16 text-red-500">Failed to load dashboard. Make sure you are logged in as admin.</div>;
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-purple-100 text-purple-700",
    SHIPPED: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold text-dark">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/new">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="outline" className="gap-2"><Eye className="h-4 w-4" /> View Orders</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{stats.totalOrders}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-400">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-400">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Products</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{stats.totalProducts}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-400">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Customers</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{stats.totalCustomers}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-400">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Today&apos;s Revenue</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">₹{stats.revenueToday}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Monthly Revenue</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">₹{stats.revenueMonth}</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="font-heading">Recent Orders</CardTitle>
                <Link href="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-500 text-left">
                      <th className="pb-3 font-medium">Order #</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium text-right">Amount</th>
                      <th className="pb-3 font-medium text-center">Status</th>
                      <th className="pb-3 font-medium text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders?.map((order: any) => (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 font-mono font-bold">
                          <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">{order.orderNumber}</Link>
                        </td>
                        <td className="py-3">{order.user?.name || order.guestName || "Guest"}</td>
                        <td className="py-3 text-right font-semibold">₹{order.totalAmount}</td>
                        <td className="py-3 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${statusColors[order.status] || ""}`}>{order.status}</span>
                        </td>
                        <td className="py-3 text-right text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" /> Low Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.lowStock?.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">All products are well stocked!</p>
              ) : (
                <div className="space-y-3">
                  {stats.lowStock?.map((p: any) => (
                    <div key={p.id} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{p.sku}</p>
                      </div>
                      <Badge variant="destructive" className="text-xs">{p.stock} left</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
