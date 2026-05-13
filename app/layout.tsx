import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "ТАВЛЕСРМ - Мобильный заказ",
  description: "WebApp для создания продажи",
  icons: {
    icon: "https://tablecrm.com/img/logo.svg",
    shortcut: "https://tablecrm.com/img/logo.svg",
    apple: "https://tablecrm.com/img/logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        geist.variable
      )}>
        {children}
      </body>
    </html>
  );
}
