import AdminSidebar from "@/components/layout/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Admin | Glam Wholesale",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
      <Toaster position="top-center" richColors />
    </div>
  );
}
