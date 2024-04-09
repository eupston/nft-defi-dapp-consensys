"use client";

import Link from "next/link";

import WalletIcon from "../public/icons/WalletIcon";

import { Button } from "./ui/button";
import { formatAddress } from "../lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { MintButton } from "./MintButton";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect } from "react";

export const ConnectWalletButton = () => {
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const account = useAccount();

  return (
    <div className="relative">
      {account.status === "connected" ? (
        <Popover>
          <PopoverTrigger>
            <Button>{formatAddress(account.address)}</Button>
          </PopoverTrigger>
          <PopoverContent className="mt-2 w-44 bg-gray-100 border rounded-md shadow-lg right-0 z-10 top-10">
            <button
              onClick={() => disconnect()}
              className="block w-full pl-2 pr-4 py-2 text-left text-[#F05252] hover:bg-gray-200"
            >
              Disconnect
            </button>
          </PopoverContent>
        </Popover>
      ) : (
        connectors
          .filter((connector) => connector.name === "MetaMask")
          .map((connector) => (
            <Button
              key={connector.uid}
              disabled={status === "pending"}
              onClick={() => connect({ connector })}
            >
              <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
          ))
      )}
    </div>
  );
};

export const NavBar = () => {
  const account = useAccount();

  return (
    <nav className="flex items-center justify-between max-w-screen-xl px-6 mx-auto py-7 rounded-xl">
      <Link href="/" className="flex gap-1 px-6">
        <span className="hidden text-2xl font-bold sm:block">
          <span className="text-gray-900">NFT Loan Collaterizer</span>
        </span>
      </Link>
      <div className="flex gap-4 px-6">
        <ConnectWalletButton />
        {account && <MintButton />}
      </div>
    </nav>
  );
};

export default NavBar;
