import { useAccount, useSwitchChain, useChainId } from "wagmi"
import { CHAINS } from "../config"
import Card from "./Card"
import Button from "./Button"
import { useAppKit } from "@reown/appkit/react"

const ConnectHint: React.FC = () => {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const { open } = useAppKit()

  const connectedToUnsupportedChain =
    isConnected && !CHAINS.some(({ id }) => id === chainId)

  if (chainId && !connectedToUnsupportedChain) {
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
          onClick={switchChain && (() => switchChain({ chainId: CHAINS[0].id }))}
          disabled={!switchChain}
        >
          Switch Wallet To {CHAINS[0].name}
        </Button>
      )}
    </Card>
  )
}

export default ConnectHint
