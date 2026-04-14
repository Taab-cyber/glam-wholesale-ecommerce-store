"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    whatsapp: "",
    phone: "",
    email: "",
    address: "",
    instagram: "",
    facebook: "",
    aboutText: "",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFormData({
            whatsapp: data.whatsapp || "",
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
            instagram: data.instagram || "",
            facebook: data.facebook || "",
            aboutText: data.aboutText || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Settings saved!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-16 text-gray-400">Loading settings...</div>;

  // WhatsApp preview
  const whatsappPreview = formData.whatsapp
    ? `https://wa.me/${formData.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hi Glam Wholesale")}`
    : "";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="font-heading text-3xl font-bold text-dark">Site Settings</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-8 space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-bold border-b pb-2">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="+919876543210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+919876543210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={formData.email} onChange={handleChange} placeholder="contact@glamwholesale.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Full business address" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-heading font-bold border-b pb-2">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input id="instagram" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input id="facebook" name="facebook" value={formData.facebook} onChange={handleChange} placeholder="https://facebook.com/..." />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-heading font-bold border-b pb-2">About Text</h2>
          <div className="space-y-2">
            <Label htmlFor="aboutText">About the Business</Label>
            <Textarea id="aboutText" name="aboutText" value={formData.aboutText} onChange={handleChange} className="min-h-[120px]" placeholder="Describe your wholesale business..." />
          </div>
        </div>

        {whatsappPreview && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
            <p className="font-medium text-green-700 mb-1">WhatsApp Link Preview:</p>
            <a href={whatsappPreview} target="_blank" rel="noopener noreferrer" className="text-green-600 underline break-all text-xs">
              {whatsappPreview}
            </a>
          </div>
        )}

        <Button type="submit" disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
