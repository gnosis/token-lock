import "../styles/globals.css"
import type { AppProps } from "next/app"
import { ProvideConfig, Provider } from "../components"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <ProvideConfig>
        <Component {...pageProps} />
      </ProvideConfig>
    </Provider>
  )
}

export default MyApp
