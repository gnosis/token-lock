import "../styles/globals.css"
import type { AppProps } from "next/app"
import { ProvideConfig } from "../components"
import { wagmiAdapter } from "../wagmi"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ProvideConfig>
          <Component {...pageProps} />
        </ProvideConfig>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default MyApp
