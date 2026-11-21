"use client"

import { useState } from "react"
import { useParams, usePathname, useSearchParams } from "next/navigation"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "in"

  const redirectParam = searchParams?.get("redirect")
  const isCheckout =
    pathname?.includes("/checkout") ||
    redirectParam?.includes("checkout")

  const isOrderSection =
    pathname?.includes("/orders") ||
    redirectParam?.includes("orders")

  return (
    <div className="w-full flex flex-col items-center py-6 sm:py-10 px-4 sm:px-0" data-testid="auth-screen">
      {/* Brand & Context Header */}
      <div className="text-center mb-8 w-full max-w-sm">
        <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-black/50 block mb-2">
          High Fashion
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black font-integral">
          {currentView === LOGIN_VIEW.SIGN_IN ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-xs sm:text-sm text-black/60 mt-2">
          {currentView === LOGIN_VIEW.SIGN_IN
            ? "Sign in with your email and password to continue."
            : "Register your profile for express checkout and exclusive access."}
        </p>
      </div>

      {/* Checkout Authentication Notice */}
      {isCheckout && (
        <div className="mb-6 w-full max-w-sm bg-[#FAFAFA] border border-black/15 p-4 text-center">
          <p className="font-semibold text-black text-xs uppercase tracking-wider">
            Checkout Authentication
          </p>
          <p className="text-black/60 text-xs mt-1 leading-relaxed">
            Please sign in or create an account to proceed to checkout. Your shopping bag and chosen items are saved.
          </p>
        </div>
      )}

      {/* Orders Section Notice */}
      {isOrderSection && !isCheckout && (
        <div className="mb-6 w-full max-w-sm bg-[#FAFAFA] border border-black/15 p-4 text-center">
          <p className="font-semibold text-black text-xs uppercase tracking-wider">
            Sign In To View Orders
          </p>
          <p className="text-black/60 text-xs mt-1 leading-relaxed">
            Please log in to your High Fashion account to view your past purchases and track order status.
          </p>
        </div>
      )}

      {/* Luxury Tab Switcher */}
      <div className="grid grid-cols-2 w-full max-w-sm border-b border-black/10 mb-8 text-center">
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className={`pb-3 text-xs uppercase tracking-widest font-semibold transition-all relative ${
            currentView === LOGIN_VIEW.SIGN_IN
              ? "text-black border-b-2 border-black -mb-[1px]"
              : "text-black/40 hover:text-black/80"
          }`}
          data-testid="switch-to-sign-in"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className={`pb-3 text-xs uppercase tracking-widest font-semibold transition-all relative ${
            currentView === LOGIN_VIEW.REGISTER
              ? "text-black border-b-2 border-black -mb-[1px]"
              : "text-black/40 hover:text-black/80"
          }`}
          data-testid="switch-to-register"
        >
          Create Account
        </button>
      </div>

      {/* Form Content */}
      <div className="w-full max-w-sm">
        {currentView === LOGIN_VIEW.SIGN_IN ? (
          <Login setCurrentView={setCurrentView} />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}
      </div>
    </div>
  )
}

export default LoginTemplate
