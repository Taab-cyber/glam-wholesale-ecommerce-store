import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, totalAmount, name, email, phone, businessName, shippingAddress, notes, paymentMode } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    // Validate quantities are multiples of 12
    for (const item of items) {
      if (item.quantity % 12 !== 0) {
        return NextResponse.json({ error: `Quantity must be a multiple of 12. Invalid for product.` }, { status: 400 });
      }
    }

    const session = await getServerSession(authOptions);

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `GW-${String(orderCount + 1001).padStart(5, "0")}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user ? (session.user as any).id : null,
        guestName: session?.user ? null : name,
        guestEmail: session?.user ? null : email,
        guestPhone: session?.user ? null : phone,
        businessName: businessName || null,
        totalAmount,
        status: "PENDING",
        paymentMode: paymentMode || "Bank Transfer",
        notes: notes || null,
        shippingAddress: shippingAddress || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json({ order, message: "Order placed successfully" });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
