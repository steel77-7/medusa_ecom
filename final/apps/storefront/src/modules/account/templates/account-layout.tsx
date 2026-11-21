"use client"

import React, { useEffect } from "react"
import { useSearchParams } from "next/navigation"

import UnderlineLink from "@modules/common/components/interactive-link"
import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (customer) {
      const redirect = searchParams.get("redirect")
      if (redirect) {
        window.location.href = redirect
      }
    }
  }, [customer, searchParams])

  if (customer && searchParams.get("redirect")) {
    return (
      <div className="flex-1 py-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-black/60 font-medium">
            Redirecting to checkout...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 py-8 sm:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
        {customer ? (
          <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] py-8 sm:py-12 gap-8">
            <div>
              <AccountNav customer={customer} />
            </div>
            <div className="flex-1">{children}</div>
          </div>
        ) : (
          <div className="flex justify-center items-center py-8 sm:py-12 w-full">
            <div className="w-full max-w-md">{children}</div>
          </div>
        )}
        <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-gray-200 py-12 gap-8">
          <div>
            <h3 className="text-xl-semi mb-4">Got questions?</h3>
            <span className="txt-medium">
              You can find frequently asked questions and answers on our
              customer service page.
            </span>
          </div>
          <div>
            <UnderlineLink href="/customer-service">
              Customer Service
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
