import Image from "next/image";
import { photoUrl } from "@/lib/alumni";

export function Portrait({
  name,
  photo,
  className = "",
}: {
  name: string;
  photo: string;
  className?: string;
}) {
  if (photo) {
    return (
      <div className={`relative aspect-[4/5] bg-muted ${className}`}>
        <Image
          src={photoUrl(photo)}
          alt={`Photo of ${name}`}
          fill
          sizes="(min-width: 768px) 16rem, 100vw"
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={`No photo of ${name} yet`}
      className={`relative flex aspect-[4/5] items-center justify-center bg-muted ${className}`}
    >
      <span aria-hidden="true" className="text-6xl text-border">
        ◆
      </span>
    </div>
  );
}
