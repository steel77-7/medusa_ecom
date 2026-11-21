"use client"

import { useRef } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { gsap, useGSAP, prefersReducedMotion } from "@lib/gsap"

const links = [
  { label: "Shop", href: "/store", hasDropdown: true },
  { label: "On Sale", href: "/store?on_sale=true" },
  { label: "New Arrivals", href: "/store?sort=created_at" },
  { label: "Brands", href: "/store" },
]

export default function NavLinks() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const container = containerRef.current
      if (!container || prefersReducedMotion()) return

      const linkItems = container.querySelectorAll<HTMLElement>(".nav-link-item")
      linkItems.forEach((link) => {
        const underline = link.querySelector<HTMLElement>(".nav-underline")
        const chevron = link.querySelector<HTMLElement>(".nav-chevron")

        if (underline) {
          gsap.set(underline, { scaleX: 0, transformOrigin: "left center" })
        }

        link.addEventListener("mouseenter", () => {
          if (underline) {
            gsap.to(underline, {
              scaleX: 1,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            })
          }
          if (chevron) {
            gsap.to(chevron, {
              rotation: 180,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            })
          }
        })

        link.addEventListener("mouseleave", () => {
          if (underline) {
            gsap.to(underline, {
              scaleX: 0,
              transformOrigin: "right center",
              duration: 0.3,
              ease: "power2.in",
              overwrite: "auto",
              onComplete: () => {
                gsap.set(underline, { transformOrigin: "left center" })
              },
            })
          }
          if (chevron) {
            gsap.to(chevron, {
              rotation: 0,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            })
          }
        })
      })
    },
    { scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      className="hidden md:flex items-center gap-6 lg:gap-8 shrink-0 text-[16px] text-black font-normal"
    >
      {links.map((item) => (
        <div
          key={item.label}
          data-cursor="hover"
          className="nav-link-item relative flex items-center gap-1 cursor-pointer py-1"
        >
          <LocalizedClientLink
            href={item.href}
            className="hover:text-black transition-colors"
          >
            {item.label}
          </LocalizedClientLink>

          {item.hasDropdown && (
            <svg
              className="nav-chevron will-change-transform"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {/* Underline Indicator */}
          <span
            className="nav-underline absolute bottom-0 left-0 w-full h-[1.5px] bg-black will-change-transform"
          />
        </div>
      ))}
    </div>
  )
}

