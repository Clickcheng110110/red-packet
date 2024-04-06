import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/index.css";
import "draft-js/dist/Draft.css";

import Header from "@/components/Header";
import { http, createConfig, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StreamWeb3.AI",
  description: "Mapping the Web3 Knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: "#000" }}>
        <Header />
        {children}
      </body>
    </html>
  );
}
