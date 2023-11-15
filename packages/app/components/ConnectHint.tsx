import { useState } from "react"
import { useNetwork, useSwitchNetwork } from "wagmi"
import { CHAINS } from "../config"
import Card from "./Card"
import Modal from "./Connect/Modal"
import Button from "./Button"

const ConnectHint: React.FC = () => {
  const [showModal, setShowModal] = useState(false)

  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  const connectedChainId = chain?.id
  const connectedToUnsupportedChain =
    connectedChainId && !CHAINS.some(({ id }) => id === connectedChainId)

  if (connectedChainId && !connectedToUnsupportedChain) {
    return null
  }

  return (
    <Card>
      {!connectedChainId && (
        <Button primary onClick={() => setShowModal(true)}>
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

      {showModal && <Modal onRequestClose={() => setShowModal(false)} />}
    </Card>
  )
}

export default ConnectHint
