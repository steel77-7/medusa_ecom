"use client"

import { useRef } from "react"
import Image from "next/image"
import { gsap, useGSAP, prefersReducedMotion } from "@lib/gsap"

const brands = [
  { name: "VERSACE", src: "/figma/27116.svg", width: 166, height: 34 },
  { name: "ZARA", src: "/figma/9bd75.svg", width: 91, height: 38 },
  { name: "GUCCI", src: "/figma/653d6.svg", width: 156, height: 36 },
  { name: "PRADA", src: "/figma/b1cc1.svg", width: 194, height: 32 },
  { name: "Calvin Klein", src: "/figma/861f0.svg", width: 206, height: 34 },
]

export default function BrandTicker() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const container = containerRef.current
      if (!container) return

      const isReduced = prefersReducedMotion()

      if (!isReduced) {
        // Entrance animation triggered when scrolled into view
        gsap.from(".brand-item", {
          scrollTrigger: {
            trigger: container,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          y: 28,
          opacity: 0,
          scale: 0.92,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        })

        // Interactive subtle magnetic attraction on each brand logo
        const items = container.querySelectorAll<HTMLElement>(".brand-item")
        items.forEach((item) => {
          const xTo = gsap.quickTo(item, "x", { duration: 0.4, ease: "power2.out" })
          const yTo = gsap.quickTo(item, "y", { duration: 0.4, ease: "power2.out" })

          const onMouseMove = (e: MouseEvent) => {
            const rect = item.getBoundingClientRect()
            const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.25
            const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.25
            xTo(dx)
            yTo(dy)
          }

          const onMouseEnter = () => {
            gsap.to(item, {
              scale: 1.08,
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
            })
          }

          const onMouseLeave = () => {
            xTo(0)
            yTo(0)
            gsap.to(item, {
              scale: 1,
              opacity: 0.85,
              duration: 0.4,
              ease: "power2.out",
            })
          }

          item.addEventListener("mousemove", onMouseMove)
          item.addEventListener("mouseenter", onMouseEnter)
          item.addEventListener("mouseleave", onMouseLeave)
        })
      }
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="bg-black py-10 sm:py-12 w-full overflow-hidden select-none"
    >
      <div className="content-container flex flex-wrap items-center justify-around gap-8 sm:gap-12 md:gap-16">
        {brands.map((b) => (
          <div
            key={b.name}
            data-cursor="hover"
            className="brand-item relative flex items-center justify-center opacity-85 cursor-pointer will-change-transform"
          >
            <Image
              src={b.src}
              alt={b.name}
              width={b.width}
              height={b.height}
              className="h-7 sm:h-9 w-auto object-contain brightness-0 invert pointer-events-none"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
