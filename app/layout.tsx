import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import { Toaster } from "@ieee/ui/components/sonner";
import { MotionProvider } from "@/components/motion/motion-provider";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Alumni | IEEE SRMIST",
    template: "%s | IEEE SRMIST Alumni",
  },
  description: "The alumni of IEEE SRMIST, and what they went on to do.",
  applicationName: "IEEE SRMIST Alumni",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.className} ${instrumentSans.variable}`}
    >
      <body className="flex min-h-dvh flex-col antialiased">
        <MotionProvider>{children}</MotionProvider>
        <Toaster theme="light" position="bottom-center" />
      </body>
    </html>
  );
}
