import { useRef, useState } from "react"
import useOnClickOutside from "use-onclickoutside"
import { useAccount } from "wagmi"
import cls from "./Account.module.css"

const Account: React.FC = () => {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  const [showDropdown, setShowDropdown] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setShowDropdown(false))

  if (!accountData) {
    return null
  }

  const avatar = accountData.ens?.avatar

  return (
    <div className={cls.container}>
      <button className={cls.button} onClick={() => setShowDropdown(true)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {avatar && <img src={avatar} alt="ENS Avatar" />}
        <div>
          {accountData.ens?.name
            ? `${accountData.ens?.name} (${accountData.address})`
            : accountData.address}
        </div>
      </button>
      {showDropdown && (
        <div className={cls.dropdown} ref={ref}>
          <button
            onClick={() => {
              disconnect()
              setShowDropdown(false)
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}

export default Account
