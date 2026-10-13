import Link from "next/link";
import { copyrightLine } from "@ieee/ui/layout/app-footer";

export function AdminFooter() {
  return (
    <footer className="flex items-baseline justify-between gap-4 border-t px-gutter pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-xs text-muted-foreground">
      <span>{copyrightLine()}</span>
      <Link href="/" className="transition-colors hover:text-foreground">
        View site
      </Link>
    </footer>
  );
}
