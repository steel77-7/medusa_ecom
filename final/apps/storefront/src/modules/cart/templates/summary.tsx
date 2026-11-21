"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"

type SummaryProps = {
  cart: HttpTypes.StoreCart
  customer?: HttpTypes.StoreCustomer | null
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart, customer }: SummaryProps) => {
  const [promoCode, setPromoCode] = useState("")
  const step = getCheckoutStep(cart)

  const countryCode = (cart.region?.countries?.[0]?.iso_2 || "in").toLowerCase()
  const checkoutHref = customer
    ? "/checkout?step=" + step
    : `/account?redirect=/${countryCode}/checkout`

  const subtotal = cart.item_subtotal || cart.subtotal || 0
  const discount = cart.discount_total || 0
  const shipping = cart.shipping_total || 0
  const total = cart.total || 0
  const currencyCode = cart.currency_code || "usd"

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl sm:text-[24px] font-bold text-black tracking-tight font-integral">
        Order Summary
      </h2>

      {/* Breakdown Rows */}
      <div className="flex flex-col gap-4 text-base">
        <div className="flex items-center justify-between text-black/60">
          <span>Subtotal</span>
          <span className="font-bold text-black">
            {convertToLocale({ amount: subtotal, currency_code: currencyCode })}
          </span>
        </div>

        {discount > 0 ? (
          <div className="flex items-center justify-between text-black/60">
            <span>Discount (-20%)</span>
            <span className="font-bold text-[#FF3333]">
              -{convertToLocale({ amount: discount, currency_code: currencyCode })}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-black/60">
            <span>Discount (-20%)</span>
            <span className="font-bold text-[#FF3333]">-$0</span>
          </div>
        )}

        <div className="flex items-center justify-between text-black/60">
          <span>Delivery Fee</span>
          <span className="font-bold text-black">
            {shipping === 0 ? "Free" : convertToLocale({ amount: shipping, currency_code: currencyCode })}
          </span>
        </div>

        <div className="border-t border-black/10 pt-4 flex items-center justify-between text-lg sm:text-xl">
          <span className="font-semibold text-black">Total</span>
          <span className="font-bold text-black text-2xl tracking-tight">
            {convertToLocale({ amount: total, currency_code: currencyCode })}
          </span>
        </div>
      </div>

      {/* Promo Code Input & Apply */}
      <div className="flex items-center gap-3 pt-2">
        <div className="bg-[#F0F0F0] rounded-full px-4 py-3 flex items-center gap-2.5 flex-1 shadow-inner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black/40 shrink-0">
            <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41V13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 7H7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Add promo code"
            className="bg-transparent text-sm text-black placeholder:text-black/40 focus:outline-none w-full"
          />
        </div>
        <button
          type="button"
          className="bg-black text-white rounded-full px-8 py-3 text-sm font-medium hover:bg-neutral-800 active:scale-[0.98] transition-all shrink-0 shadow-sm"
        >
          Apply
        </button>
      </div>

      {/* Go to Checkout Button */}
      <LocalizedClientLink
        href={checkoutHref}
        className="w-full mt-2"
        data-testid="checkout-button"
      >
        <button
          type="button"
          className="w-full bg-black text-white rounded-full py-4 px-8 text-base font-medium flex items-center justify-center gap-3 hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-md"
        >
          <span>Go to Checkout</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
