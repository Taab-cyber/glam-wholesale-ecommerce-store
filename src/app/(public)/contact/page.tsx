import { MapPin, Phone, Mail, Instagram, MessageCircle } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

export const metadata = {
  title: "Contact Us | Glam Wholesale"
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-dark mb-6">Get in Touch</h1>
          <div className="w-24 h-1.5 bg-primary rounded-full mx-auto mb-6" />
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Have questions about an order or want to discuss bulk wholesale requirements? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-8">
            <h2 className="font-heading text-3xl font-bold">Contact Information</h2>
            
            <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary mt-1 flex-shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Our Location</h3>
                <p className="text-gray-600 leading-relaxed">
                  123 Fashion Street, <br />
                  Wholesale Market Phase II, <br />
                  Mumbai, Maharashtra, India.
                </p>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary mt-1 flex-shrink-0">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">WhatsApp Us</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Fastest way to get support or place manual business orders.
                </p>
                <WhatsAppButton variant="full" />
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary mt-1 flex-shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Email Us</h3>
                <p className="text-gray-600 leading-relaxed">
                  support@glamwholesale.com <br />
                  sales@glamwholesale.com
                </p>
              </div>
            </div>
          </div>

          {/* Business Inquiry Form Fallback */}
          <div className="bg-gray-50 border rounded-3xl p-8 lg:p-12 h-full flex flex-col justify-center">
            <h2 className="font-heading text-3xl font-bold mb-6">Send an Inquiry</h2>
            <p className="text-gray-600 mb-8">
              Prefer to email us? Drop a message below and our wholesale representative will reach out within 24 hours.
            </p>
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Your Name</label>
                <input type="text" className="w-full border rounded-lg p-3 bg-white" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email Address</label>
                <input type="email" className="w-full border rounded-lg p-3 bg-white" placeholder="john@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message Details</label>
                <textarea className="w-full border rounded-lg p-3 bg-white h-32 resize-none" placeholder="Let us know what you're looking for..." />
              </div>
              <button disabled className="w-full bg-dark text-white rounded-lg p-4 font-bold opacity-50 cursor-not-allowed">
                Submitting Form... (Use WhatsApp instead)
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
