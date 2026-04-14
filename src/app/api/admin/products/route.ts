import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user && (session.user as any).role === "ADMIN";
}

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, sku, description, price, moq, stock, images, categoryId, isActive, isFeatured, badge } = body;

    if (!name || !sku || !description || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        price: parseFloat(price),
        moq: parseInt(moq) || 12,
        stock: parseInt(stock) || 0,
        images: images || [],
        categoryId,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        badge: badge || null,
      },
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ error: "SKU already exists" }, { status: 400 });
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
