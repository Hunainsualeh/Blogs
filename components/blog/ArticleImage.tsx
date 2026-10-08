import Image from "next/image";
import { cn } from "@/lib/utils";

type Ratio = "16/9" | "3/2" | "4/3" | "1/1" | "21/9" | "16/10" | "4/5";

const ratioClasses: Record<Ratio, string> = {
  "16/9": "aspect-[16/9]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
  "16/10": "aspect-[16/10]",
  "4/5": "aspect-[4/5]",
};

type ArticleImageProps = {
  src: string;
  alt: string;
  ratio?: Ratio;
  sizes: string;
  priority?: boolean;
  zoom?: boolean;
  className?: string;
  imageClassName?: string;
};

export function ArticleImage({ src, alt, ratio = "3/2", sizes, priority = false, zoom = true, className, imageClassName }: ArticleImageProps) {
  return (
    <div className={cn("img-shimmer relative overflow-hidden rounded-sm", ratioClasses[ratio], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", zoom && "img-zoom", imageClassName)}
      />
    </div>
  );
}
