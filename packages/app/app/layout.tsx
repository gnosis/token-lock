import "../styles/globals.css"
import { ProvideConfig } from "../components"
import ContextProvider from "../context"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gnosis Lock",
  description: "Gnosis Lock",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body>
        <ContextProvider>
          <ProvideConfig>{children}</ProvideConfig>
        </ContextProvider>
      </body>
    </html>
  )
}
