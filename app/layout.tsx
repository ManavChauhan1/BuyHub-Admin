import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";
import dynamic from "next/dynamic";

import { ModalProvider } from "@/providers/modal-provider";
import { ToasterProvider } from "@/providers/toast-provider";

import "./globals.css";
import prismadb from "@/lib/prismadb";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({subsets: ['latin']})


export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider>
      <html lang="en"  suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ToasterProvider />
            <ModalProvider />
              {children}
          </ThemeProvider>
          </body>
      </html>
    </ClerkProvider>
  );
}
