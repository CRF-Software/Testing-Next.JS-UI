import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// The Header will be imported in the page component to handle the onInfoClick prop

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cite Rite by GPTZero",
  description: "Analyze text to uncover claims and evidence with AI-powered Cite Rite by GPTZero",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The Header component will be included in the page component */}
        {children}
      </body>
    </html>
  );
}
