import Link from "next/link";
import { Button } from "@ieee/ui/components/button";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col items-start justify-end gap-6 px-gutter pt-16 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <p className="text-[3.25rem] leading-[0.95] font-medium tracking-[-0.045em] lg:text-[5rem]">
          Nobody here
          <span className="block text-muted-foreground">yet.</span>
        </p>
        <Button variant="outline" asChild>
          <Link href="/">All alumni</Link>
        </Button>
      </main>
    </>
  );
}
