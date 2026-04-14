import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function OrderSuccessPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } } }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8">
        <CheckCircle2 className="h-12 w-12" />
      </div>
      
      <h1 className="font-heading text-4xl md:text-5xl font-bold text-dark mb-4">Order Confirmed!</h1>
      <p className="text-gray-600 max-w-lg mb-8 text-lg">
        Thank you, {order.guestName || order.userId ? "for your order" : "guest"}. Your wholesale order has been successfully placed.
      </p>

      <div className="bg-gray-50 border rounded-2xl p-8 max-w-xl w-full text-left mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-6 pb-6 border-b">
          <div>
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="font-bold text-lg">{order.orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Date</p>
            <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="font-heading font-semibold text-lg">Order Details</h3>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.quantity}x {item.product.name}</span>
              <span className="font-medium">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6 border-t font-bold text-lg">
          <span>Subtotal Paid</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      <div className="space-y-4 text-center max-w-md">
        <p className="text-sm text-gray-500 mb-6">
          We will contact you shortly via WhatsApp at <span className="font-semibold">{order.guestPhone}</span> to confirm shipping charges and dispatch timeline.
        </p>
        <Link href="/">
          <Button size="lg" className="w-full rounded-full h-14 text-lg bg-dark hover:bg-dark/90">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
