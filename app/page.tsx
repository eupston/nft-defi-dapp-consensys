"use client";

import { MyNFTs } from "@/components/MyNFTs";
import NavBar from "@/components/NavBar";
import { MetaMaskProvider, useSDK } from "@metamask/sdk-react";
import MyLoans from "@/components/MyLoans";

const host =
  typeof window !== "undefined" ? window.location.host : "defaultHost";

const sdkOptions = {
  logging: { developerMode: false },
  checkInstallationImmediately: false,
  dappMetadata: {
    name: "NFT-Loan-Collaterizer",
    url: host,
  },
};

export default function Home() {
  const { account } = useSDK();

  return (
    <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-between p-2">
        <div className="grid md:grid-cols-2 gap-6 xl:gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">My NFTs</h2>
              <p className="text-gray-500 dark:text-gray-400">
                View the NFTs you currently own.
              </p>
            </div>
            <MyNFTs />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">My Loans</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Track the loans you have taken out using your NFTs as
                collateral.
              </p>
            </div>
            <MyLoans />
          </div>
        </div>
      </main>
    </MetaMaskProvider>
  );
}
