import { useRef, useState } from "react"
import useOnClickOutside from "use-onclickoutside"
import copy from "copy-to-clipboard"
import { chain, useAccount, useConnect, useNetwork } from "wagmi"
import truncateEthAddress from "truncate-eth-address"
import Image from "next/image"
import Identicon from "./Identicon"
import Modal from "./Modal"
import Button from "../Button"
import cls from "./index.module.css"

const Connect: React.FC = () => {
  const [{ data: network }] = useNetwork()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })
  const [
    {
      data: { connected },
    },
  ] = useConnect()

  const [showDropdown, setShowDropdown] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setShowDropdown(false))

  const avatar = accountData?.ens?.avatar
  const address = accountData?.address

  const explorer =
    network.chain?.blockExplorers && network.chain?.blockExplorers[0]

  return (
    <>
      {showModal && <Modal onRequestClose={() => setShowModal(false)} />}

      <div className={cls.container}>
        <button className={cls.button} onClick={() => setShowDropdown(true)}>
          <div className={cls.identiconWrapper}>
            <Identicon arrow />
            <Image
              className={cls.arrow}
              alt="Identicon arrow"
              src="/arrow.svg"
              height={12}
              width={12}
            />
          </div>
        </button>

        {showDropdown && (
          <div className={cls.dropdown} ref={ref}>
            {connected ? (
              <>
                <div className={cls.dropdownAccountDetails}>
                  <div className={cls.row}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {avatar && <img src={avatar} alt="ENS Avatar" />}
                  </div>
                  {address && (
                    <div className={cls.dropdownAddress}>
                      <div className={cls.address}>
                        {accountData?.ens?.name
                          ? `${accountData?.ens?.name} (${truncateEthAddress(
                              address
                            )})`
                          : truncateEthAddress(address)}
                      </div>
                      <button
                        className={cls.iconButton}
                        onClick={() => {
                          copy(address)
                        }}
                        title="Copy to clipboard"
                      >
                        <Image
                          src="/copy.svg"
                          alt="Copy to clipboard"
                          width={16}
                          height={16}
                        />
                      </button>
                      {explorer && (
                        <a
                          className={cls.iconButton}
                          href={`${explorer.url}/address/${address}`}
                          rel="external noreferrer"
                          target="_blank"
                          title={`Open in ${explorer?.name}`}
                        >
                          <Image
                            src="/open.svg"
                            alt={`Open in ${explorer?.name}`}
                            width={16}
                            height={16}
                          />
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className={cls.dropdownDivider} />
                <div className={cls.dropdownSplitRow}>
                  Status
                  <div className={cls.dropdownListFlex}>
                    <div className={cls.dropdownConnectedJewel} />
                    <strong>Connected</strong>
                  </div>
                </div>
                <div className={cls.dropdownDivider} />
                <div className={cls.dropdownSplitRow}>
                  Network
                  <div className={cls.dropdownListFlex}>
                    <div className={cls.dropdownNetworkJewel} />
                    {network.chain?.name || "Unsupported network"}
                  </div>
                </div>
                <div className={cls.dropdownDivider} />
                <div className={cls.row}>
                  <Button
                    className={cls.dropdownButton}
                    primary
                    onClick={() => {
                      disconnect()
                      setShowDropdown(false)
                    }}
                  >
                    Disconnect
                  </Button>
                </div>
              </>
            ) : (
              <div className={cls.wrapper}>
                Connect a Wallet
                <div className={cls.marginTop}>
                  <Identicon large />
                </div>
                <div className={cls.marginTop}>
                  <Button
                    className={cls.dropdownButton}
                    primary
                    onClick={() => setShowModal(true)}
                  >
                    Connect wallet
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default Connect
