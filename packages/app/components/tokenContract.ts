import { BaseContract, BigNumber, CallOverrides } from "ethers";
import {
  erc20ABI,
  useContractRead,
  useContractWrite,
  useProvider,
} from "wagmi";
import useTokenLockConfig from "./useTokenLockConfig";

export const useTokenContractRead = (
  functionName: string,
  config?: Parameters<typeof useContractRead>[2]
) => {
  const { tokenAddress } = useTokenLockConfig();
  // const provider = useProvider();
  return useContractRead<Erc20Contract>(
    {
      addressOrName: tokenAddress,
      contractInterface: erc20ABI,
      // signerOrProvider: provider,
    },
    functionName,
    config
  );
};

export const useTokenContractWrite = (
  functionName: string,
  config?: Parameters<typeof useContractWrite>[2]
) => {
  const { tokenAddress } = useTokenLockConfig();
  // const provider = useProvider();
  return useContractWrite<Erc20Contract>(
    {
      addressOrName: tokenAddress,
      contractInterface: erc20ABI,
      // signerOrProvider: provider,
    },
    functionName,
    config
  );
};

interface Erc20Contract extends BaseContract {
  balanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  decimals(overrides?: CallOverrides): Promise<BigNumber>;

  name(overrides?: CallOverrides): Promise<string>;

  symbol(overrides?: CallOverrides): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
}
