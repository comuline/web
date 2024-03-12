import "@/styles/globals.css";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import Script from "next/script";
import { env } from "process";

export const metadata = {
  title: `Jadwal KRL — Cari & Simpan Jadwal KRL ${new Date().getFullYear()}`,
  description: `Platform website untuk mencari, menyimpan, dan memantau jadwal KRL Jakarta dan Yogyakarta dengan mudah dan cepat.`,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase:
    env.NODE_ENV === "production"
      ? new URL("https://www.jadwal-krl.com")
      : undefined,
  openGraph: {
    title: `Jadwal KRL — Cari & Simpan Jadwal KRL ${new Date().getFullYear()}`,
    description: `Platform website untuk mencari, menyimpan, dan memantau jadwal KRL Jakarta dan Yogyakarta dengan mudah dan cepat.`,
    images: "/og.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
      <Script
        defer
        src="https://analytics.zulio.me/script.js"
        data-website-id="20b80658-98dc-4ef8-92d5-0a7d7d153ad0"
      />
    </html>
  );
}
