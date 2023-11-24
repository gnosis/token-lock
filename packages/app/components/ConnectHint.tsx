import { useAccount, useConnect, useSwitchNetwork } from "wagmi"
import { CHAINS } from "../config"
import Card from "./Card"
import Button from "./Button"
import { useWeb3Modal } from "@web3modal/wagmi/react"

const ConnectHint: React.FC = () => {
  const { isConnected } = useAccount()
  const { switchNetwork, data: chain } = useSwitchNetwork()

  const { open } = useWeb3Modal()

  const connectedChainId = chain?.id
  const connectedToUnsupportedChain =
    isConnected && !CHAINS.some(({ id }) => id === connectedChainId)

  if (connectedChainId && !connectedToUnsupportedChain) {
    return null
  }

  return (
    <Card>
      {!isConnected && (
        <Button primary onClick={() => open()}>
          Connect
        </Button>
      )}
      {connectedToUnsupportedChain && (
        <Button
          primary
          onClick={switchNetwork && (() => switchNetwork(CHAINS[0].id))}
          disabled={!switchNetwork}
        >
          Switch Wallet To {CHAINS[0].name}
        </Button>
      )}
    </Card>
  )
}

export default ConnectHint
