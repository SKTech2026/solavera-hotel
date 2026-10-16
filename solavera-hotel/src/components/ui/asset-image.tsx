import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  quality?: number;
};

export function AssetImage({ src, alt, priority, sizes = "100vw", className = "", quality = 75 }: Props) {
  return (
    <div className={`asset-image ${className}`}>
      <div className="asset-fallback" aria-hidden="true" />
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} quality={quality} className="object-cover" />
    </div>
  );
}
