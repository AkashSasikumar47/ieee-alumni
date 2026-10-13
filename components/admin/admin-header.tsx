import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@ieee/ui/components/button";
import { IeeeLogo } from "@ieee/ui/layout/ieee-logo";
import { Wordmark } from "@/components/wordmark";

export function AdminHeader({ email }: { email?: string }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background px-gutter pt-[env(safe-area-inset-top)]">
      <Link
        href="/admin"
        aria-label="Alumni admin"
        className="flex items-baseline gap-2 text-lg"
      >
        <Wordmark />
        <span className="text-sm text-muted-foreground">Admin</span>
      </Link>
      <div className="flex items-center gap-3">
        {email !== undefined && (
          <>
            <span className="hidden text-sm text-muted-foreground md:inline">
              {email}
            </span>
            <form action="/api/auth/logout" method="post">
              <Button type="submit" variant="outline" size="sm">
                <LogOut />
                Sign out
              </Button>
            </form>
          </>
        )}
        <a
          href="https://ieeesrmist.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="IEEE SRMIST"
          className="hidden sm:block"
        >
          <IeeeLogo tone="dark" preload className="h-6 md:h-7" />
        </a>
      </div>
    </header>
  );
}
