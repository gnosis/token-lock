import { useState } from "react"
import { useAccount, useConnect } from "wagmi"
import Account from "./Account"
import Modal from "./Modal"

const Connect: React.FC = () => {
  const [
    {
      data: { connected },
    },
  ] = useConnect()

  const [showModal, setShowModal] = useState(false)

  return (
    <>
      {showModal && <Modal onRequestClose={() => setShowModal(false)} />}

      {connected ? (
        <Account />
      ) : (
        <button onClick={() => setShowModal(true)}>Connect wallet</button>
      )}
    </>
  )
}

export default Connect
