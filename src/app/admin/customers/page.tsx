"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((res) => res.json())
      .then((data) => { setCustomers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleApproval = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
      });
      if (res.ok) {
        setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, isApproved } : c)));
        toast.success(isApproved ? "Customer approved" : "Customer rejected");
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-dark">Customers</h1>
        <p className="text-gray-500">{customers.length} registered customers</p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading customers...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-500 text-left">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Business</th>
                  <th className="p-4 font-medium text-center">Orders</th>
                  <th className="p-4 font-medium text-center">Status</th>
                  <th className="p-4 font-medium text-center">Registered</th>
                  <th className="p-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c: any) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4 text-gray-500">{c.email}</td>
                    <td className="p-4">{c.phone || "—"}</td>
                    <td className="p-4">{c.businessName || "—"}</td>
                    <td className="p-4 text-center">{c._count?.orders || 0}</td>
                    <td className="p-4 text-center">
                      <Badge className={c.isApproved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
                        {c.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </td>
                    <td className="p-4 text-center text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {!c.isApproved && (
                          <Button size="sm" variant="ghost" className="text-green-600 gap-1 text-xs" onClick={() => handleApproval(c.id, true)}>
                            <CheckCircle className="h-4 w-4" /> Approve
                          </Button>
                        )}
                        {c.isApproved && (
                          <Button size="sm" variant="ghost" className="text-red-500 gap-1 text-xs" onClick={() => handleApproval(c.id, false)}>
                            <XCircle className="h-4 w-4" /> Reject
                          </Button>
                        )}
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
