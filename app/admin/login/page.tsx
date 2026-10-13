import type { Metadata } from "next";
import { AdminFooter } from "@/components/admin/admin-footer";
import { AdminHeader } from "@/components/admin/admin-header";
import { LoginForm } from "@/components/admin/login-form";
import { Fade } from "@/components/motion/fade";
import { Rise } from "@/components/motion/rise";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const { error } = await searchParams;

  return (
    <>
      <AdminHeader />
      <main className="grid flex-1 content-start gap-10 px-gutter py-14 md:grid-cols-[1fr_1.5fr_1fr] md:py-24">
        <h1 className="text-[3.25rem] leading-[0.95] font-medium tracking-[-0.045em] lg:text-[4.25rem]">
          <Rise>Admins</Rise>
          <Rise step={1}>
            <span className="text-muted-foreground">only.</span>
          </Rise>
        </h1>
        <Fade step={2} className="w-full max-w-sm md:col-start-2">
          <LoginForm error={typeof error === "string" ? error : undefined} />
        </Fade>
      </main>
      <AdminFooter />
    </>
  );
}
