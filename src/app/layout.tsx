import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Controle de Gastos 3D",
  description: "Aplicativo de controle de gastos Mobile-First com elementos 3D.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#090b0e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Previne zoom em mobile para comportamento nativo
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
