import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FiguTrade 2026",
  description: "Intercambiá figuritas del Mundial FIFA 2026 con tus amigos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col bg-green-50">{children}</body>
    </html>
  );
}
