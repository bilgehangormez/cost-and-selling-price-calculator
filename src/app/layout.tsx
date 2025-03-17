import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Un Üretim Maliyeti ve Satış Fiyatı Hesaplayıcı",
  description: "Un üretimi için maliyet hesaplama ve satış fiyatı belirleme aracı.",
  keywords: ["un üretimi", "maliyet hesaplama", "un fiyat hesaplama", "kar hesaplama"],
  authors: [{ name: "Bilgehan Gormez" }],
  creator: "Bilgehan Gormez",
  publisher: "Bilgehan Gormez",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://cost-and-selling-price-calculator.vercel.app/",
    title: "Un Üretim Maliyeti ve Satış Fiyatı Hesaplayıcı",
    description: "Un üretimi için maliyet hesaplama ve satış fiyatı belirleme aracı.",
    siteName: "Un Üretim Maliyeti Hesaplayıcı",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Un Üretim Maliyeti ve Satış Fiyatı Hesaplayıcı",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Un Üretim Maliyeti ve Satış Fiyatı Hesaplayıcı",
    description: "Un üretimi için maliyet hesaplama ve satış fiyatı belirleme aracı.",
    images: ["/og-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#ffffff",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
