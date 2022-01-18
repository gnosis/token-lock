import { useEffect, useState } from "react"
import { COINGECKO_TOKEN_ID } from "../config"
import useTokenLockConfig from "./useTokenLockConfig"

let resolvedTokenPrice = 0
const tokenPricePromise = fetch(
  `https://api.coingecko.com/api/v3/simple/price?ids=${COINGECKO_TOKEN_ID}&vs_currencies=usd`
)
  .then((response) => response.json())
  .then((json) => {
    resolvedTokenPrice = json[COINGECKO_TOKEN_ID].usd
    return resolvedTokenPrice
  })

const useTokenPrice = () => {
  const [tokenPrice, setTokenPrice] = useState(resolvedTokenPrice)

  useEffect(() => {
    tokenPricePromise.then(setTokenPrice)
  }, [])

  return tokenPrice
}

export default useTokenPrice
