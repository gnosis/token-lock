import { useRef, useState } from "react"
import useOnClickOutside from "use-onclickoutside"
import copy from "copy-to-clipboard"
import { useAccount, useDisconnect, useEnsName, useNetwork } from "wagmi"
import truncateEthAddress from "truncate-eth-address"
import Identicon from "./Identicon"
import Button from "../Button"
import cls from "./index.module.css"
import IconButton, { IconLinkButton } from "../IconButton"
import { useWeb3Modal } from "@web3modal/wagmi/react"

const Connect: React.FC = () => {
  const network = useNetwork()
  const { address, isConnected, connector } = useAccount()
  const { data: ensName } = useEnsName({
    address,
  })

  const { open } = useWeb3Modal()

  const { disconnect } = useDisconnect()

  const [showDropdown, setShowDropdown] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setShowDropdown(false))

  const explorer =
    network.chain?.blockExplorers && network.chain?.blockExplorers.default

  return (
    <>
      <div className={cls.container}>
        <button className={cls.button} onClick={() => setShowDropdown(true)}>
          <div className={cls.identiconWrapper}>
            <Identicon />
            <img
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
            {isConnected ? (
              <>
                <div className={cls.dropdownAccountDetails}>
                  <div className={cls.row}>
                    <Identicon large />
                  </div>
                  {address && (
                    <div className={cls.dropdownAddress}>
                      <div className={cls.address}>
                        {ensName
                          ? `${ensName} (${truncateEthAddress(address)})`
                          : truncateEthAddress(address)}
                      </div>
                      <IconButton
                        onClick={() => {
                          copy(address)
                        }}
                        icon="copy"
                        title="Copy to clipboard"
                      />
                      {explorer && (
                        <IconLinkButton
                          icon="open"
                          href={`${explorer.url}/address/${address}`}
                          external
                          title={`Open in ${explorer?.name}`}
                        />
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
                {connector?.id !== "gnosisSafe" && (
                  <>
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
                )}
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
                    onClick={() => open()}
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
