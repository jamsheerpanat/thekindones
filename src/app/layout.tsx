import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Providers } from "@/components/Providers";
import { MobileDock } from "@/components/MobileDock";
import { AppSpinner } from "@/components/AppSpinner";
import { prisma } from "@/lib/prisma";
import { toCardProduct } from "@/lib/menu-helpers";
import "@/app/globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display"
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "thekindones | Restaurant Commerce",
  description: "A modern restaurant commerce experience for thekindones."
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const featuredItems = await prisma.menuItem.findMany({
    where: { featured: true, active: true },
    include: { category: true },
    orderBy: { updatedAt: "desc" },
    take: 7
  });

  const spinnerItems = featuredItems.map((item) => toCardProduct(item));

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="overflow-x-hidden">
        <Providers>
          <AppSpinner items={spinnerItems} />
          <SiteHeader />
          <main className="pt-24 md:pt-24 pb-28 md:pb-0">{children}</main>
          <SiteFooter />
          <MobileDock />
        </Providers>
      </body>
    </html>
  );
}
