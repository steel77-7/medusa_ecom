"use client"

import { useRef } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { gsap, useGSAP, prefersReducedMotion } from "@lib/gsap"

type AnimatedProductGridProps = {
  title?: string
  viewAllHref?: string
  children: React.ReactNode
  className?: string
}

export default function AnimatedProductGrid({
  title,
  viewAllHref,
  children,
  className = "",
}: AnimatedProductGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)

  useGSAP(
    () => {
      const container = containerRef.current
      if (!container) return

      const isReduced = prefersReducedMotion()
      if (isReduced) return

      // Animate Section Title
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        })
      }

      // Batch Animate Product Cards as they enter viewport
      const cards = container.querySelectorAll(".product-grid-item")
      if (cards.length > 0) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: container,
            start: "top 82%",
            toggleActions: "play none none none",
          },
          y: 45,
          opacity: 0,
          scale: 0.95,
          duration: 0.75,
          stagger: 0.08,
          ease: "power2.out",
        })
      }

      // Magnetic Hover on View All button
      const btn = buttonRef.current
      if (btn) {
        const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power2.out" })
        const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power2.out" })

        const onMouseMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect()
          const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.3
          const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.3
          xTo(dx)
          yTo(dy)
        }

        const onMouseEnter = () => {
          gsap.to(btn, { scale: 1.04, duration: 0.3, ease: "power2.out" })
        }

        const onMouseLeave = () => {
          xTo(0)
          yTo(0)
          gsap.to(btn, { scale: 1, duration: 0.4, ease: "power2.out" })
        }

        btn.addEventListener("mousemove", onMouseMove)
        btn.addEventListener("mouseenter", onMouseEnter)
        btn.addEventListener("mouseleave", onMouseLeave)

        return () => {
          btn.removeEventListener("mousemove", onMouseMove)
          btn.removeEventListener("mouseenter", onMouseEnter)
          btn.removeEventListener("mouseleave", onMouseLeave)
        }
      }
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className={`content-container py-12 sm:py-16 md:py-20 ${className}`}>
      {title && (
        <h2
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-[48px] font-black uppercase tracking-tight text-center text-black mb-8 sm:mb-12 md:mb-14 font-integral will-change-transform"
        >
          {title}
        </h2>
      )}

      {children}

      {viewAllHref && (
        <div className="flex justify-center mt-9 sm:mt-12">
          <LocalizedClientLink
            ref={buttonRef}
            href={viewAllHref}
            data-cursor="hover"
            className="border border-black/10 rounded-full px-14 py-3.5 text-[15px] sm:text-[16px] font-medium text-black hover:bg-black hover:text-white transition-all inline-flex items-center justify-center w-full sm:w-auto shadow-sm active:scale-[0.98] will-change-transform"
          >
            View All
          </LocalizedClientLink>
        </div>
      )}
    </div>
  )
}

