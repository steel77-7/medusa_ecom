"use client"

import { login, requestPasswordReset } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"
import Spinner from "@modules/common/icons/spinner"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useActionState, useEffect, useState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction, isPending] = useActionState(login, null)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "in"

  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotPending, setForgotPending] = useState(false)
  const [forgotMessage, setForgotMessage] = useState<{ success: boolean; text: string } | null>(null)

  useEffect(() => {
    if (message?.state === "success") {
      const redirectParam = searchParams.get("redirect")
      const redirectUrl = redirectParam || `/${countryCode}/checkout`
      // Use window.location.href to guarantee full document reload with updated auth cookie
      window.location.href = redirectUrl
    }
  }, [message, countryCode, searchParams])

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail) return
    setForgotPending(true)
    setForgotMessage(null)
    const res = await requestPasswordReset(forgotEmail)
    setForgotPending(false)
    if (res.success) {
      setForgotMessage({
        success: true,
        text: "If an account exists for this email, password reset instructions have been sent.",
      })
    } else {
      setForgotMessage({
        success: false,
        text: res.error || "Failed to request password reset. Please try again.",
      })
    }
  }

  if (showForgotPassword) {
    return (
      <div className="w-full flex flex-col items-center" data-testid="forgot-password-view">
        <h2 className="text-sm uppercase tracking-widest font-bold text-black mb-2 text-center">
          Reset Password
        </h2>
        <p className="text-center text-xs text-black/60 mb-6 leading-relaxed">
          Enter your email address below and we will send you instructions to reset your password.
        </p>

        {forgotMessage && (
          <div
            className={`w-full mb-5 text-xs p-3.5 border ${
              forgotMessage.success
                ? "bg-emerald-50/80 border-emerald-200 text-emerald-800"
                : "bg-red-50/80 border-red-200 text-red-700"
            }`}
          >
            {forgotMessage.text}
          </div>
        )}

        <form onSubmit={handleForgotPassword} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="forgot-email"
              className="text-[11px] uppercase tracking-wider font-semibold text-black/70"
            >
              Email Address
            </label>
            <input
              id="forgot-email"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-white border border-black/20 focus:border-black rounded-lg text-sm text-black placeholder:text-black/30 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={forgotPending}
            className="w-full mt-2 bg-black text-white rounded-full py-3.5 px-6 text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {forgotPending ? (
              <>
                <Spinner className="animate-spin text-white" />
                <span>Sending...</span>
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowForgotPassword(false)
              setForgotMessage(null)
            }}
            className="text-xs uppercase tracking-wider text-black/60 hover:text-black transition-colors text-center mt-2"
          >
            Back to Sign In
          </button>
        </form>
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center"
      data-testid="login-page"
    >
      {message?.state === "verification_required" && (
        <div
          className="w-full mb-6 text-center text-xs text-black/80 bg-neutral-100 border border-black/15 p-4"
          data-testid="login-verification-message"
        >
          We sent a verification link to <strong>{message.email}</strong>.
          Please verify your email, then sign in.
        </div>
      )}

      {message?.state === "success" && (
        <div className="w-full mb-6 text-center text-xs bg-emerald-50/80 border border-emerald-200 text-emerald-800 p-3.5 flex items-center justify-center gap-2">
          <Spinner className="animate-spin" />
          <span>Signed in successfully. Redirecting to checkout...</span>
        </div>
      )}

      <form className="w-full flex flex-col gap-4" action={formAction}>
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-[11px] uppercase tracking-wider font-semibold text-black/70"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
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
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-[11px] uppercase tracking-wider font-semibold text-black/70"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-[11px] uppercase tracking-wider text-black/50 hover:text-black transition-colors"
              data-testid="forgot-password-link"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative w-full">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={isPending}
              placeholder="••••••••"
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

        {/* Error message */}
        {message?.state === "error" && (
          <div
            className="w-full p-3.5 bg-red-50/80 border border-red-200 text-red-700 text-xs leading-relaxed"
            data-testid="login-error-message"
          >
            {message.error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isPending}
          data-testid="sign-in-button"
          className="w-full mt-2 bg-black text-white rounded-full py-4 px-6 text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {isPending ? (
            <>
              <Spinner className="animate-spin text-white" />
              <span>Signing In...</span>
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="text-center text-xs text-black/60 mt-8 pt-6 border-t border-black/10 w-full">
        <span>New to High Fashion? </span>
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="font-semibold text-black uppercase tracking-wider underline underline-offset-4 hover:text-black/70 transition-colors ml-1"
          data-testid="register-button"
        >
          Create Account
        </button>
      </div>
    </div>
  )
}

export default Login
