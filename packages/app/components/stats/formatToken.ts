import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils"

export const formatToken = (bigNumber: BigNumber, decimals: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(parseFloat(formatUnits(bigNumber, decimals)))
