import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MyNFTs } from "@/components/MyNFTs";

export default function Home() {
  return (
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
              Track the loans you have taken out using your NFTs as collateral.
            </p>
          </div>
          <div className="grid gap-6">
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-4">
                <img
                  alt="NFT"
                  className="aspect-square rounded-lg overflow-hidden"
                  height="100"
                  src="/placeholderNFT.jpg"
                  width="100"
                />
                <div className="grid gap-1">
                  <h3 className="font-semibold">Loan #1</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Amount: 0.5 ETH
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Repayment Terms: 30 days
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Status: In Repayment
                  </p>
                  <Button className="mt-2" size="sm">
                    Repay Loan
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-4">
                <img
                  alt="NFT"
                  className="aspect-square rounded-lg overflow-hidden"
                  height="100"
                  src="/placeholderNFT.jpg"
                  width="100"
                />
                <div className="grid gap-1">
                  <h3 className="font-semibold">Loan #2</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Amount: 1.2 ETH
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Repayment Terms: 60 days
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Status: Fully Repaid
                  </p>
                  <Button className="mt-2" size="sm">
                    Repay Loan
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-4">
                <img
                  alt="NFT"
                  className="aspect-square rounded-lg overflow-hidden"
                  height="100"
                  src="/placeholderNFT.jpg"
                  width="100"
                />
                <div className="grid gap-1">
                  <h3 className="font-semibold">Loan #3</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Amount: 0.8 ETH
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Repayment Terms: 45 days
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Status: In Repayment
                  </p>
                  <Button className="mt-2" size="sm">
                    Repay Loan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
