import type { Metadata } from "next";
import { Nunito } from "next/font/google"; // Yumshoq va do'stona (rounded)
import "./globals.css";
import { FinanceProvider } from "@/context/FinanceContext";

const fontSans = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: "Spendex - Shaxsiy Moliya",
  description: "Moliyaviy erkinlik sari ilk qadam",
  icons: {
    icon: '/logo.svg',
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

import AppLayout from "@/components/AppLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={`${fontSans.variable} antialiased`}>
        <FinanceProvider>
          <AppLayout>
             {children}
          </AppLayout>
        </FinanceProvider>
      </body>
    </html>
  );
}
