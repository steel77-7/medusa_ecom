"use client"

import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import React, { useCallback, useState } from "react"
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay"
import ErrorMessage from "../error-message"

type RazorpayPaymentButtonProps = {
  session: HttpTypes.StorePaymentSession
  notReady: boolean
  cart: HttpTypes.StoreCart
  "data-testid"?: string
}

export const RazorpayPaymentButton: React.FC<RazorpayPaymentButtonProps> = ({
  session,
  notReady,
  cart,
  "data-testid": dataTestId,
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { Razorpay, isLoading: isRazorpayLoading, error: razorpayScriptError } = useRazorpay()

  const orderData = (session?.data as { id?: string; amount?: number }) || {}

  const onPaymentCompleted = async () => {
    try {
      await placeOrder()
    } catch (err: any) {
      setErrorMessage(err?.message || "An error occurred while finalizing your order.")
      setSubmitting(false)
    }
  }

  const handlePayment = useCallback(() => {
    setErrorMessage(null)
    setSubmitting(true)

    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY || ""
    if (!key || key.includes("placeholder")) {
      console.warn("Razorpay API key is not configured or using placeholder key.")
      if (!orderData?.id) {
        onPaymentCompleted()
        return
      }
    }

    if (!orderData?.id) {
      setErrorMessage(
        "Razorpay payment session could not be initialized. Please check your payment details or try again."
      )
      setSubmitting(false)
      return
    }

    try {
      const options: RazorpayOrderOptions = {
        key,
        amount: orderData.amount || Math.round((cart.total || 0) * 100),
        order_id: orderData.id,
        currency: cart.currency_code.toUpperCase() as RazorpayOrderOptions["currency"],
        name: process.env.NEXT_PUBLIC_SHOP_NAME || "High Fashion",
        description: `Order #${cart.id?.slice(-6) || "Checkout"}`,
        prefill: {
          name: [cart.billing_address?.first_name, cart.billing_address?.last_name]
            .filter(Boolean)
            .join(" "),
          email: cart.email,
          contact: cart.billing_address?.phone || cart.shipping_address?.phone || undefined,
        },
        theme: {
          color: "#000000",
        },
        modal: {
          backdropclose: true,
          escape: true,
          handleback: true,
          confirm_close: true,
          ondismiss: () => {
            setSubmitting(false)
          },
          animation: true,
        },
        handler: async (response) => {
          console.log("Razorpay payment response:", response)
          await onPaymentCompleted()
        },
      }

      const razorpayInstance = new Razorpay(options)

      razorpayInstance.on("payment.failed", (response: any) => {
        setErrorMessage(
          response?.error?.description ||
            response?.error?.reason ||
            "Payment failed. Please try a different card or UPI method."
        )
        setSubmitting(false)
      })

      razorpayInstance.open()
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to launch Razorpay checkout.")
      setSubmitting(false)
    }
  }, [
    Razorpay,
    cart.billing_address,
    cart.currency_code,
    cart.email,
    cart.id,
    cart.shipping_address,
    cart.total,
    orderData,
  ])

  return (
    <>
      <Button
        disabled={notReady || submitting || isRazorpayLoading}
        isLoading={submitting || isRazorpayLoading}
        onClick={handlePayment}
        size="large"
        className="w-full bg-black hover:bg-black/90 text-white rounded-full py-4 text-base font-medium transition-all"
        data-testid={dataTestId || "razorpay-payment-button"}
      >
        {submitting ? "Processing Payment..." : "Pay with Razorpay"}
      </Button>
      {razorpayScriptError && (
        <ErrorMessage
          error="Failed to load Razorpay checkout script. Please check your internet connection."
          data-testid="razorpay-script-error"
        />
      )}
      <ErrorMessage
        error={errorMessage}
        data-testid="razorpay-payment-error-message"
      />
    </>
  )
}

export default RazorpayPaymentButton

