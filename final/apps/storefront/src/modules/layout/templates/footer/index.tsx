"use client"

import { useRef } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { gsap, useGSAP, prefersReducedMotion } from "@lib/gsap"

const paymentBadges = [
  { name: "Visa", src: "/figma/5f99f.svg", width: 46, height: 30 },
  { name: "Mastercard", src: "/figma/7fb06.svg", width: 46, height: 30 },
  { name: "PayPal", src: "/figma/87049.svg", width: 46, height: 30 },
  { name: "Apple Pay", src: "/figma/ffb5f.svg", width: 46, height: 30 },
  { name: "Google Pay", src: "/figma/5b913.svg", width: 46, height: 30 },
]

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const newsletterCardRef = useRef<HTMLDivElement>(null)
  const subscribeBtnRef = useRef<HTMLButtonElement>(null)

  useGSAP(
    () => {
      const footer = footerRef.current
      if (!footer || prefersReducedMotion()) return

      // Newsletter floating card ScrollTrigger entrance
      if (newsletterCardRef.current) {
        gsap.from(newsletterCardRef.current, {
          scrollTrigger: {
            trigger: newsletterCardRef.current,
            start: "top 92%",
            toggleActions: "play none none none",
          },
          y: 40,
          opacity: 0,
          scale: 0.97,
          duration: 0.8,
          ease: "power2.out",
        })
      }

      // Magnetic hover on Subscribe button
      const btn = subscribeBtnRef.current
      if (btn) {
        const xTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power2.out" })
        const yTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power2.out" })

        const onMouseMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect()
          const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.3
          const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.3
          xTo(dx)
          yTo(dy)
        }

        const onMouseEnter = () => {
          gsap.to(btn, { scale: 1.03, duration: 0.25, ease: "power2.out" })
        }

        const onMouseLeave = () => {
          xTo(0)
          yTo(0)
          gsap.to(btn, { scale: 1, duration: 0.35, ease: "power2.out" })
        }

        btn.addEventListener("mousemove", onMouseMove)
        btn.addEventListener("mouseenter", onMouseEnter)
        btn.addEventListener("mouseleave", onMouseLeave)
      }

      // Magnetic hover on Social icons
      const socialIcons = footer.querySelectorAll<HTMLElement>(".social-icon-btn")
      socialIcons.forEach((icon) => {
        const xTo = gsap.quickTo(icon, "x", { duration: 0.3, ease: "power2.out" })
        const yTo = gsap.quickTo(icon, "y", { duration: 0.3, ease: "power2.out" })

        const onMouseMove = (e: MouseEvent) => {
          const rect = icon.getBoundingClientRect()
          const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35
          const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35
          xTo(dx)
          yTo(dy)
        }

        const onMouseEnter = () => {
          gsap.to(icon, { scale: 1.15, duration: 0.25, ease: "back.out(2)" })
        }

        const onMouseLeave = () => {
          xTo(0)
          yTo(0)
          gsap.to(icon, { scale: 1, duration: 0.3, ease: "power2.out" })
        }

        icon.addEventListener("mousemove", onMouseMove)
        icon.addEventListener("mouseenter", onMouseEnter)
        icon.addEventListener("mouseleave", onMouseLeave)
      })
    },
    { scope: footerRef }
  )

  return (
    <footer ref={footerRef} className="relative w-full mt-24 select-none">
      {/* Floating Newsletter Card */}
      <div className="content-container relative z-20 -mb-[85px] sm:-mb-[90px]">
        <div
          ref={newsletterCardRef}
          className="bg-black text-white rounded-[20px] px-6 py-8 sm:px-12 sm:py-10 md:px-16 md:py-11 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl will-change-transform"
        >
          <h2 className="text-2xl sm:text-3xl md:text-[40px] font-black uppercase tracking-tight leading-[1.1] max-w-lg font-integral text-center md:text-left">
            STAY UP TO DATE ABOUT OUR LATEST OFFERS
          </h2>

          <div className="flex flex-col gap-3.5 w-full md:w-[350px]">
            <div className="bg-white rounded-full px-4 py-3 flex items-center gap-3 w-full shadow-inner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neutral-400 shrink-0">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="email"
                placeholder="Enter your email address"
                className="bg-transparent text-sm text-black placeholder:text-neutral-400 focus:outline-none w-full"
              />
            </div>
            <button
              ref={subscribeBtnRef}
              type="button"
              data-cursor="hover"
              className="bg-white text-black font-medium text-sm sm:text-base rounded-full py-3 px-8 w-full hover:bg-neutral-200 transition-colors shadow-sm will-change-transform"
            >
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="bg-[#F0F0F0] pt-[120px] sm:pt-[140px] pb-12 w-full">
        <div className="content-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 pb-12">
            {/* Column 1: Brand Info */}
            <div className="md:col-span-1.5 flex flex-col items-start gap-4">
              <LocalizedClientLink
                href="/"
                data-cursor="hover"
                className="text-2xl sm:text-[28px] font-black tracking-tight uppercase text-black font-integral hover:opacity-85 transition-opacity"
              >
                High Fashion
              </LocalizedClientLink>
              <p className="text-sm text-black/60 leading-relaxed max-w-xs">
                We have clothes that suits your style and which you’re proud to wear. From women to men.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-3 mt-1">
                {/* Twitter */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="social-icon-btn w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors will-change-transform"
                  aria-label="Twitter"
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="social-icon-btn w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-85 transition-opacity will-change-transform"
                  aria-label="Facebook"
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.704 0-1.024.112-1.246.33-.284.278-.363.784-.363 1.777v1.873h4.482l-.658 3.667h-3.824v7.98H9.1z"/></svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="social-icon-btn w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors will-change-transform"
                  aria-label="Instagram"
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="social-icon-btn w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors will-change-transform"
                  aria-label="GitHub"
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>

            {/* Column 2: COMPANY */}
            <div>
              <h3 className="font-semibold text-sm tracking-wider uppercase text-black mb-4">
                Company
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-black/60">
                <li><LocalizedClientLink href="/about" data-cursor="hover" className="hover:text-black transition-colors">About</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/features" data-cursor="hover" className="hover:text-black transition-colors">Features</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/works" data-cursor="hover" className="hover:text-black transition-colors">Works</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/career" data-cursor="hover" className="hover:text-black transition-colors">Career</LocalizedClientLink></li>
              </ul>
            </div>

            {/* Column 3: HELP */}
            <div>
              <h3 className="font-semibold text-sm tracking-wider uppercase text-black mb-4">
                Help
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-black/60">
                <li><LocalizedClientLink href="/contact" data-cursor="hover" className="hover:text-black transition-colors">Customer Support</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/shipping" data-cursor="hover" className="hover:text-black transition-colors">Delivery Details</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/terms" data-cursor="hover" className="hover:text-black transition-colors">Terms & Conditions</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/privacy" data-cursor="hover" className="hover:text-black transition-colors">Privacy Policy</LocalizedClientLink></li>
              </ul>
            </div>

            {/* Column 4: FAQ */}
            <div>
              <h3 className="font-semibold text-sm tracking-wider uppercase text-black mb-4">
                FAQ
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-black/60">
                <li><LocalizedClientLink href="/account" data-cursor="hover" className="hover:text-black transition-colors">Account</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/shipping" data-cursor="hover" className="hover:text-black transition-colors">Manage Deliveries</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/account/orders" data-cursor="hover" className="hover:text-black transition-colors">Orders</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/payments" data-cursor="hover" className="hover:text-black transition-colors">Payments</LocalizedClientLink></li>
              </ul>
            </div>

            {/* Column 5: RESOURCES */}
            <div>
              <h3 className="font-semibold text-sm tracking-wider uppercase text-black mb-4">
                Resources
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-black/60">
                <li><a href="#ebooks" data-cursor="hover" className="hover:text-black transition-colors">Free eBooks</a></li>
                <li><a href="#tutorial" data-cursor="hover" className="hover:text-black transition-colors">Development Tutorial</a></li>
                <li><a href="#blog" data-cursor="hover" className="hover:text-black transition-colors">How to - Blog</a></li>
                <li><a href="#youtube" data-cursor="hover" className="hover:text-black transition-colors">Youtube Playlist</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="border-t border-black/10 pt-6 mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-black/60">
            <p>High Fashion © 2000-2026, All Rights Reserved</p>

            <div className="flex items-center gap-2">
              {paymentBadges.map((b) => (
                <div key={b.name} className="bg-white rounded-md p-1 border border-black/5 flex items-center justify-center shadow-xs hover:border-black/20 transition-colors">
                  <Image
                    src={b.src}
                    alt={b.name}
                    width={b.width}
                    height={b.height}
                    className="h-5 sm:h-6 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
