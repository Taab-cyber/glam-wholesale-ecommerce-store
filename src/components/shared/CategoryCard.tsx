import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  slug: string;
  image?: string | null;
}

export default function CategoryCard({ name, slug, image }: CategoryCardProps) {
  // Emoji fallback based on name if no image
  const getFallbackEmoji = (catName: string) => {
    const lowerName = catName.toLowerCase();
    if (lowerName.includes("scrunchie")) return "🎀";
    if (lowerName.includes("claw")) return "🌸";
    if (lowerName.includes("clip")) return "✨";
    if (lowerName.includes("bracelet")) return "💎";
    if (lowerName.includes("jewelry")) return "💍";
    return "🛍️";
  };

  return (
    <Link href={`/category/${slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-primary/20 aspect-square flex flex-col items-center justify-center relative p-4 group-hover:-translate-y-1">
        {image ? (
          <Image 
            src={image} 
            alt={name} 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{getFallbackEmoji(name)}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/10 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white font-heading font-semibold text-lg text-center z-10">{name}</h3>
        </div>
      </div>
    </Link>
  );
}
