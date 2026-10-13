import Link from "next/link";
import { IeeeLogo } from "@ieee/ui/layout/ieee-logo";
import { Wordmark } from "@/components/wordmark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b bg-background px-gutter pt-[env(safe-area-inset-top)]">
      <Link href="/" aria-label="Alumni home" className="text-lg">
        <Wordmark />
      </Link>
      <a
        href="https://ieeesrmist.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="IEEE SRMIST"
      >
        <IeeeLogo tone="dark" preload className="h-6 md:h-7" />
      </a>
    </header>
  );
}
