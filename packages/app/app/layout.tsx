import "../styles/globals.css"
import { ProvideConfig } from "../components"
import { headers } from "next/headers"
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
    const headersObj = await headers();
    const cookies = headersObj.get('cookie')

  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={cookies}>
          <ProvideConfig>{children}</ProvideConfig>
        </ContextProvider>
      </body>
    </html>
  )
}
