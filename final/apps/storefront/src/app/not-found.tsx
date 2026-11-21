import { ArrowUpRightMini } from "@medusajs/icons"
import { Button, Text } from "@modules/common/components/ui"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404 - Page Not Found | High Fashion",
  description: "The page you are looking for does not exist.",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-y-3 items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center">
      <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ui-fg-subtle">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-ui-fg-base">
        Page Not Found
      </h1>
      <p className="text-sm text-ui-fg-subtle max-w-sm leading-relaxed mb-4">
        The piece, capsule, or page you tried to access does not exist or has been relocated.
      </p>
      <Link href="/">
        <Button className="px-6 py-2.5 text-xs uppercase tracking-widest font-semibold">
          Return to Storefront
        </Button>
      </Link>
    </div>
  )
}
