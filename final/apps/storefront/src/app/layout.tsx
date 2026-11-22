import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import EditorialCursor from "@modules/common/components/editorial-cursor"
import "styles/globals.css"

const defaultTitle = "High Fashion | Find Clothes That Matches Your Style"
const defaultDescription =
  "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style."
const previewImage =
  "https://res.cloudinary.com/dtmqwo4sq/image/upload/v1795339836/ss-20261122-145948_uhie2e.png"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: defaultTitle,
    template: "%s | High Fashion",
  },
  description: defaultDescription,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: getBaseURL(),
    siteName: "High Fashion",
    images: [
      {
        url: previewImage,
        width: 1200,
        height: 630,
        alt: "High Fashion Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [previewImage],
  },
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
