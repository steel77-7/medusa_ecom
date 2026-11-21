"use client"

import { signup } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"
import Spinner from "@modules/common/icons/spinner"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useActionState, useEffect, useState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction, isPending] = useActionState(signup, null)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "in"

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [clientError, setClientError] = useState<string | null>(null)

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    if (message?.state === "success") {
      const redirectParam = searchParams.get("redirect")
      const redirectUrl = redirectParam || `/${countryCode}/checkout`
      // Full document reload guarantees updated auth cookie and clean session transfer
      window.location.href = redirectUrl
    }
  }, [message, countryCode, searchParams])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setClientError(null)

    if (password !== confirmPassword) {
      e.preventDefault()
      setClientError("Passwords do not match.")
      return
    }

    if (password.length < 8) {
      e.preventDefault()
      setClientError("Password must be at least 8 characters long.")
      return
    }
  }

  const activeError = clientError || (message?.state === "error" ? message.error : null)

  return (
    <div
      className="w-full flex flex-col items-center"
      data-testid="register-page"
    >
      {message?.state === "verification_required" && (
        <div
          className="w-full mb-6 text-center text-xs text-black/80 bg-neutral-100 border border-black/15 p-4"
          data-testid="register-verification-message"
        >
          We sent a verification link to <strong>{message.email}</strong>.
          Please check your inbox to verify your email, then sign in.
        </div>
      )}

      {message?.state === "success" && (
        <div className="w-full mb-6 text-center text-xs bg-emerald-50/80 border border-emerald-200 text-emerald-800 p-3.5 flex items-center justify-center gap-2">
          <Spinner className="animate-spin" />
          <span>Account created successfully. Redirecting to checkout...</span>
        </div>
      )}

      <form className="w-full flex flex-col gap-4" action={formAction} onSubmit={handleSubmit}>
        {/* Name Fields: First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="first_name"
              className="text-[11px] uppercase tracking-wider font-semibold text-black/70"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              autoComplete="given-name"
              required
              disabled={isPending}
              placeholder="Jane"
              className="w-full px-4 py-3 bg-white border border-black/20 focus:border-black rounded-lg text-sm text-black placeholder:text-black/30 outline-none transition-all disabled:opacity-60"
              data-testid="first-name-input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="last_name"
              className="text-[11px] uppercase tracking-wider font-semibold text-black/70"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              autoComplete="family-name"
              required
              disabled={isPending}
              placeholder="Doe"
              className="w-full px-4 py-3 bg-white border border-black/20 focus:border-black rounded-lg text-sm text-black placeholder:text-black/30 outline-none transition-all disabled:opacity-60"
              data-testid="last-name-input"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="register-email"
            className="text-[11px] uppercase tracking-wider font-semibold text-black/70"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isPending}
            placeholder="name@example.com"
            className="w-full px-4 py-3 bg-white border border-black/20 focus:border-black rounded-lg text-sm text-black placeholder:text-black/30 outline-none transition-all disabled:opacity-60"
            data-testid="email-input"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="register-password"
            className="text-[11px] uppercase tracking-wider font-semibold text-black/70"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              placeholder="At least 8 characters"
              className="w-full px-4 py-3 pr-11 bg-white border border-black/20 focus:border-black rounded-lg text-sm text-black placeholder:text-black/30 outline-none transition-all disabled:opacity-60"
              data-testid="password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black focus:outline-none transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirm_password"
            className="text-[11px] uppercase tracking-wider font-semibold text-black/70"
          >
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <input
              id="confirm_password"
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isPending}
              placeholder="Re-enter password"
              className="w-full px-4 py-3 pr-11 bg-white border border-black/20 focus:border-black rounded-lg text-sm text-black placeholder:text-black/30 outline-none transition-all disabled:opacity-60"
              data-testid="confirm-password-input"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black focus:outline-none transition-colors"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        </div>

        {/* Error message */}
        {activeError && (
          <div
            className="w-full p-3.5 bg-red-50/80 border border-red-200 text-red-700 text-xs leading-relaxed"
            data-testid="register-error"
          >
            {activeError}
          </div>
        )}

        {/* Terms agreement note */}
        <span className="text-center text-black/50 text-[11px] leading-relaxed mt-2">
          By creating an account, you agree to High Fashion&apos;s{" "}
          <LocalizedClientLink
            href="/terms"
            className="underline underline-offset-2 hover:text-black"
          >
            Terms of Use
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/privacy"
            className="underline underline-offset-2 hover:text-black"
          >
            Privacy Policy
          </LocalizedClientLink>
          .
        </span>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isPending}
          data-testid="register-button"
          className="w-full mt-2 bg-black text-white rounded-full py-4 px-6 text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {isPending ? (
            <>
              <Spinner className="animate-spin text-white" />
              <span>Creating Account...</span>
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Switch to Sign In */}
      <div className="text-center text-xs text-black/60 mt-8 pt-6 border-t border-black/10 w-full">
        <span>Already have an account? </span>
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="font-semibold text-black uppercase tracking-wider underline underline-offset-4 hover:text-black/70 transition-colors ml-1"
          data-testid="sign-in-link"
        >
          Sign In
        </button>
      </div>
    </div>
  )
}

export default Register
