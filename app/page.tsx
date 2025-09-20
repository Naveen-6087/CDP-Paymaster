"use client";

import React from 'react';
import {
ConnectWallet,
Wallet,
WalletDropdown,
WalletDropdownLink,
WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';

import {
Address,
Avatar,
Name,
Identity,
EthBalance
} from '@coinbase/onchainkit/identity';

import {
Transaction,
TransactionButton,
TransactionStatus,
TransactionStatusAction,
TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';

import { useAccount } from 'wagmi';
import { encodeFunctionData, type Address as ViemAddress } from 'viem';
import { baseSepolia } from 'viem/chains';
import type { TransactionError } from '@coinbase/onchainkit/transaction';

// NFT Contract Details
const NFT_CONTRACT_ADDRESS = "0x66519FCAee1Ed65bc9e@aCc25cCD900668D3eD49";
const NFT_CONTRACT_ABI = [
{
inputs: [
{ internalType: "address", name: "recipient", type: "address" },
{ internalType: "uint16", name: "item", type: "uint16" },
],
name: "mintTo",
outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
stateMutability: "payable",
type: "function",
},
] as const;
 
export default function App() {
  const { address, isConnected, connector } = useAccount();
  // Check if user is connected with a Smart Wallet
  const isSmartWallet = !!(isConnected && connector?.id === 'coinbaseWalletSDK');
  console.log(isSmartWallet, connector?.id);
  // Prepare the mint transaction
  const mintCall = address ? [{
    to: NFT_CONTRACT_ADDRESS as ViemAddress,
    data: encodeFunctionData({
      abi: NFT_CONTRACT_ABI,
      functionName: 'mintTo',
      args: [address as ViemAddress, 1], // Minting item ID 1
    }),
    value: BigInt(0), // Free mint
  }] : [];

  const handleError = (error: TransactionError) => {
    if (error.message.includes('per address transaction count')) {
      alert('You have already claimed your free NFT!');
    } else {
      alert(`Error: ${error.message}`);
      console.error('Transaction error:', error);
    }
  };

  const handleSuccess = (response: unknown) => {
    console.log('Transaction successful!', response);
    alert('NFT minted successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 flex-shrink-0 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-end">
          <Wallet>
            <ConnectWallet className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-xl px-6 py-3 flex items-center gap-3">
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownLink
                icon="wallet"
                href="https://keys.coinbase.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wallet
              </WalletDropdownLink>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          {/* Hero Section */}
          <div className="text-center mb-16 w-full">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-8 shadow-2xl">
              <span className="text-4xl">🚀</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
              Gas-Sponsored NFT Minting
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              Experience the future of Web3 with frictionless onboarding powered by Coinbase Paymaster
            </p>
          </div>

          {/* Main Card - Centered */}
          <div className="w-full max-w-lg mx-auto">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
              {!isConnected ? (
                <div className="text-center space-y-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl">🔗</span>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-white">
                      Connect Your Wallet
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed font-light">
                      Get started by connecting your wallet to mint your free NFT
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-4">
                    <p className="text-green-300 font-medium flex items-center justify-center gap-2">
                      <span className="text-lg">💡</span>
                      Use Coinbase Smart Wallet for gas-free minting!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Connected Wallet Info */}
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl">✓</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-3 font-medium">Connected as:</p>
                      <p className="font-mono text-sm break-all bg-black/20 rounded-xl p-4 border border-white/10 leading-relaxed">
                        {address}
                      </p>
                    </div>
                  </div>

                  {/* Wallet Type Indicator */}
                  {isSmartWallet ? (
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">✨</span>
                        </div>
                        <div className="text-left">
                          <p className="text-green-300 font-semibold text-lg">
                            Smart Wallet Connected
                          </p>
                          <p className="text-green-400/80 font-light">
                            Your mint will be gas-sponsored!
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">⚠️</span>
                        </div>
                        <div className="text-left">
                          <p className="text-yellow-300 font-semibold text-lg">
                            EOA Wallet Connected
                          </p>
                          <p className="text-yellow-400/80 font-light">
                            You will need ETH to pay for gas
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transaction Component */}
                  <div className="space-y-6">
                    <Transaction
                      isSponsored={true}
                      chainId={baseSepolia.id}
                      calls={mintCall}
                      onError={handleError}
                      onSuccess={handleSuccess}
                    >
                      <TransactionButton className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg" />
                      <TransactionStatus>
                        <TransactionStatusLabel />
                        <TransactionStatusAction />
                      </TransactionStatus>
                    </Transaction>
                  </div>
                </div>
              )}

              {/* How it Works Section */}
              <div className="mt-10 p-6 bg-black/20 rounded-xl border border-white/10">
                <h3 className="font-semibold mb-6 text-white flex items-center text-lg">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-sm">ℹ️</span>
                  </span>
                  How it works
                </h3>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-center space-x-4">
                    <span className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex-shrink-0"></span>
                    <span className="font-light">Smart Wallet users: Free gas-sponsored mint</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <span className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex-shrink-0"></span>
                    <span className="font-light">EOA users: Standard gas fees apply</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex-shrink-0"></span>
                    <span className="font-light">Limited to 1 NFT per address</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <span className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex-shrink-0"></span>
                    <span className="font-light">Powered by Coinbase Paymaster</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}