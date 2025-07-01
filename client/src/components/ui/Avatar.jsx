import { cn } from "@/lib/utils";

export function Avatar({ src, alt, className }) {
  return (
    <div className={cn("w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center", className)}>
      {src ? (
        <img src={src} alt={alt || "avatar"} className="w-full h-full rounded-full object-cover" />
      ) : (
        <span className="text-white font-bold">{alt ? alt.charAt(0).toUpperCase() : "?"}</span>
      )}
    </div>
  );
}

