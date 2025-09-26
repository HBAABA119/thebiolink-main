import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Logo from "../components/Logo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinkSpark - Create Your Perfect Link-in-Bio Page",
  description: "Create your perfect link-in-bio page in seconds. Free, open-source, and privacy-focused.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        <div className="p-4 border-b">
          <Logo width={150} height={50} showText={true} />
        </div>
        {children}
      </body>
    </html>
  );
}