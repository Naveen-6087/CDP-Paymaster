"use client";
import { ReactNode } from "react";
import { baseSepolia } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";

export function RootProvider(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseSepolia}
      config={{
        // appearance: {
        //   mode: "auto", 
        // },
        paymaster: process.env.NEXT_PUBLIC_CDP_PAYMASTER_URL,
        wallet: {
          // display: "modal",
          preference: "smartWalletOnly",
        },
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}
