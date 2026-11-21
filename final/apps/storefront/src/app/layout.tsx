import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import EditorialCursor from "@modules/common/components/editorial-cursor"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <head>
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap" />
        <link rel="ucp" href="/.well-known/ucp" />
      </head>
      <body>
        <EditorialCursor />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
