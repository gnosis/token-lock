import { BigNumber } from "ethers"
import { formatToken } from "../Balance"
import cls from "./Stats.module.css"
import useTokenLockConfig from "../useTokenLockConfig"
import { useTokenLockContractRead } from "../tokenLockContract"

const TotalLockedStat: React.FC = () => {
  const config = useTokenLockConfig()
  const [{ data: totalSupply }] = useTokenLockContractRead("totalSupply", {
    watch: true,
  })

  return (
    <div className={`${cls.item} ${cls.fullWidth}`}>
      <dt>Total GNO Locked</dt>
      <dd>
        {totalSupply
          ? formatToken(totalSupply as unknown as BigNumber, config.decimals)
          : "…"}
      </dd>
    </div>
  )
}

export default TotalLockedStat
