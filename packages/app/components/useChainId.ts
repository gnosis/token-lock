import { useNetwork } from "wagmi"
import { CHAINS } from "../config"

const useChainId = () => {
  const { chain } = useNetwork()
  const connectedChainId = chain?.id
  const chainId =
    connectedChainId && CHAINS.some(({ id }) => id === connectedChainId)
      ? connectedChainId
      : CHAINS[0].id

  return chainId
}

export default useChainId
