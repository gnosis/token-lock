import "../styles/globals.css"
import type { AppProps } from "next/app"
import { ProvideConfig } from "../components"
import { Providers } from "../wagmi"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <ProvideConfig>
        <Component {...pageProps} />
      </ProvideConfig>
    </Providers>
  )
}

export default MyApp
