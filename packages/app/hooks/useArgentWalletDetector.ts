import { useState } from "react"
import { useContractRead } from "wagmi"

const walletDetectorAddress = "0xeca4B0bDBf7c55E9b7925919d03CbF8Dc82537E8"
const walletDetectorABI = [
  "function isArgentWallet(address _wallet) external view returns (bool)",
]

const useArgentWalletDetector = (chainId: number, address: string) =>
  useContractRead(
    {
      addressOrName: walletDetectorAddress,
      contractInterface: walletDetectorABI,
    },
    "isArgentWallet",
    {
      args: address,
      skip: !address,
    }
  )

export default useArgentWalletDetector
