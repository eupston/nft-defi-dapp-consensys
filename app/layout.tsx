import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { type ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NFT Loan Collaterizer",
  description: "App for taking out loans against your NFTs",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F4F4F5] px-3 py-2 md:py-3 lg:px-0 lg:max-w-screen-xl mx-auto">
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
