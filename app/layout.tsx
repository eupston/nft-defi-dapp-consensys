import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { MetaMaskProvider } from "@metamask/sdk-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NFT Loan Collaterizer",
  description: "App for taking out loans against your NFTs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F4F4F5] px-3 py-2 md:py-3 lg:px-0 lg:max-w-screen-xl mx-auto">
        {children}
      </body>
    </html>
  );
}
