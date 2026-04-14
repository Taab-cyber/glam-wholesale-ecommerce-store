import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user && (session.user as any).role === "ADMIN";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalOrders, pendingOrders, totalProducts, totalCustomers, revenueToday, revenueMonth, lowStock, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: todayStart }, status: { not: "CANCELLED" } },
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: monthStart }, status: { not: "CANCELLED" } },
        _sum: { totalAmount: true },
      }),
      prisma.product.findMany({
        where: { stock: { lt: 20 }, isActive: true },
        select: { id: true, name: true, sku: true, stock: true },
        orderBy: { stock: "asc" },
        take: 10,
      }),
      prisma.order.findMany({
        include: { user: { select: { name: true } }, _count: { select: { items: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      totalProducts,
      totalCustomers,
      revenueToday: revenueToday._sum.totalAmount || 0,
      revenueMonth: revenueMonth._sum.totalAmount || 0,
      lowStock,
      recentOrders,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
