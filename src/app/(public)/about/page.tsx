import Image from "next/image";

export const metadata = {
  title: "About Us | Glam Wholesale"
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <div className="text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-dark mb-6">About Glam Wholesale</h1>
          <div className="w-24 h-1.5 bg-primary rounded-full mx-auto" />
        </div>

        <div className="bg-pink-50 rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="font-heading text-3xl font-bold text-dark">India's Leading Accessories Supplier</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              At Glam Wholesale, we believe that high-quality fashion accessories should be accessible to businesses of all sizes. 
              Founded with the vision to bridge the gap between premium manufacturers and retail businesses, we offer a curated 
              selection of jewelry, hair accessories, and style essentials.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              We maintain a strict Minimum Order Quantity (MOQ) of just 12 pieces per design. This enables boutique owners, 
              resellers, and large retailers alike to test trends without committing to massive inventories.
            </p>
          </div>
          <div className="flex-1 w-full aspect-square bg-white rounded-2xl flex items-center justify-center p-8 shadow-sm">
            <div className="text-9xl opacity-80">👑</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="border border-gray-100 bg-white p-8 rounded-2xl shadow-sm text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 text-2xl">✨</div>
            <h3 className="font-heading font-bold text-xl mb-3">Curated Designs</h3>
            <p className="text-gray-500 text-sm">We strictly quality-check and curate trending styles so your customers keep coming back.</p>
          </div>
          <div className="border border-gray-100 bg-white p-8 rounded-2xl shadow-sm text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 text-2xl">🤝</div>
            <h3 className="font-heading font-bold text-xl mb-3">Business Friendly</h3>
            <p className="text-gray-500 text-sm">Our MOQ 12 model is designed to support businesses ensuring low risk and high variety.</p>
          </div>
          <div className="border border-gray-100 bg-white p-8 rounded-2xl shadow-sm text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 text-2xl">⚡</div>
            <h3 className="font-heading font-bold text-xl mb-3">Fast Dispatch</h3>
            <p className="text-gray-500 text-sm">We process and dispatch orders within 24-48 hours, ensuring your stock arrives promptly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
