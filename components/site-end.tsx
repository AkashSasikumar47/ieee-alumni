import Link from "next/link";
import { copyrightLine } from "@ieee/ui/layout/app-footer";

export function SiteEnd() {
  return (
    <div className="flex items-baseline justify-between gap-4 text-xs text-muted-foreground">
      <span className="flex gap-4">
        <Link href="/" className="transition-colors hover:text-foreground">
          All alumni
        </Link>
        <Link
          href="/admin"
          prefetch={false}
          className="transition-colors hover:text-foreground"
        >
          Admin
        </Link>
      </span>
      <span>{copyrightLine()}</span>
    </div>
  );
}
