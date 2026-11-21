"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { gsap, safeRefreshScrollTrigger, prefersReducedMotion } from "@lib/gsap"

export default function EditorialCursor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cursorHaloRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorLabelRef = useRef<HTMLSpanElement>(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const pathname = usePathname()

  // Refresh ScrollTrigger on route changes
  useEffect(() => {
    safeRefreshScrollTrigger(150)
  }, [pathname])

  useEffect(() => {
    // Only enable for desktop pointer devices with fine precision and motion enabled
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(pointer: fine)").matches ||
      prefersReducedMotion()
    ) {
      return
    }

    setIsEnabled(true)

    const container = containerRef.current
    const halo = cursorHaloRef.current
    const ring = cursorRingRef.current
    const dot = cursorDotRef.current
    const label = cursorLabelRef.current

    if (!container || !halo || !ring || !dot) return

    // Position setters with buttery-smooth latencies
    // Center all elements with xPercent / yPercent so they never offset or stick to top-left
    gsap.set([dot, ring, halo], { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" })
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" })

    const ringX = gsap.quickTo(ring, "x", { duration: 0.25, ease: "power3.out" })
    const ringY = gsap.quickTo(ring, "y", { duration: 0.25, ease: "power3.out" })

    const haloX = gsap.quickTo(halo, "x", { duration: 0.35, ease: "power2.out" })
    const haloY = gsap.quickTo(halo, "y", { duration: 0.35, ease: "power2.out" })

    let isVisible = false
    let currentMode: "default" | "hover" | "view" | "hidden" = "default"

    // Proximity Illumination Engine
    const activeInfluenced = new Map<HTMLElement, boolean>()
    let cachedCandidates: { el: HTMLElement; cx: number; cy: number; isCard: boolean }[] = []
    let lastCacheTime = 0

    const updateCandidatesCache = () => {
      const now = performance.now()
      if (now - lastCacheTime < 300) return
      lastCacheTime = now

      const selector =
        'button, a, [role="button"], .product-grid-item, .bento-card, .review-card, .brand-item, .social-icon-btn, .stat-item, [data-cursor="hover"], [data-cursor="view"]'
      const nodes = document.querySelectorAll<HTMLElement>(selector)
      const list: { el: HTMLElement; cx: number; cy: number; isCard: boolean }[] = []

      const vh = window.innerHeight
      const vw = window.innerWidth

      nodes.forEach((el) => {
        if (el.closest('[aria-hidden="true"]') || el.contains(container)) return
        const rect = el.getBoundingClientRect()
        if (
          rect.bottom >= -60 &&
          rect.top <= vh + 60 &&
          rect.right >= -60 &&
          rect.left <= vw + 60 &&
          rect.width > 0 &&
          rect.height > 0
        ) {
          const isCard =
            rect.width > 200 ||
            el.classList.contains("product-grid-item") ||
            el.classList.contains("bento-card") ||
            el.classList.contains("review-card")
          list.push({
            el,
            cx: rect.left + rect.width / 2,
            cy: rect.top + rect.height / 2,
            isCard,
          })
        }
      })

      cachedCandidates = list
    }

    window.addEventListener("scroll", updateCandidatesCache, { passive: true })
    window.addEventListener("resize", updateCandidatesCache, { passive: true })
    updateCandidatesCache()

    const GLOW_RADIUS = 140 // Illumination proximity radius in pixels

    const handleProximity = (mx: number, my: number) => {
      if (cachedCandidates.length === 0) updateCandidatesCache()

      const currentInfluencedThisFrame = new Set<HTMLElement>()

      for (let i = 0; i < cachedCandidates.length; i++) {
        const item = cachedCandidates[i]
        const dx = mx - item.cx
        const dy = my - item.cy
        const distSq = dx * dx + dy * dy

        if (distSq < GLOW_RADIUS * GLOW_RADIUS) {
          const dist = Math.sqrt(distSq)
          const falloff = Math.pow(1 - dist / GLOW_RADIUS, 1.4)

          // Magnetic attraction towards glow
          const maxDisplacement = item.isCard ? 4 : 8
          const pullFactor = item.isCard ? 0.06 : 0.18

          const tx = Math.max(-maxDisplacement, Math.min(maxDisplacement, dx * pullFactor * falloff))
          const ty = Math.max(-maxDisplacement, Math.min(maxDisplacement, dy * pullFactor * falloff))
          const targetScale = item.isCard ? 1 + 0.012 * falloff : 1 + 0.035 * falloff

          // Warm luminous glow illumination on the element
          const glowColor = `rgba(255, 198, 51, ${0.4 * falloff})`
          const shadowGlow = `0 0 ${Math.round(20 * falloff)}px ${glowColor}, 0 ${Math.round(6 * falloff)}px ${Math.round(20 * falloff)}px rgba(0, 0, 0, ${0.06 + 0.12 * falloff})`
          const borderColor = `rgba(255, 198, 51, ${0.45 * falloff})`
          const brightness = 1 + 0.1 * falloff

          currentInfluencedThisFrame.add(item.el)
          activeInfluenced.set(item.el, true)

          gsap.to(item.el, {
            x: tx,
            y: ty,
            scale: targetScale,
            boxShadow: shadowGlow,
            borderColor: borderColor,
            filter: `brightness(${brightness.toFixed(3)})`,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          })
        }
      }

      // Revert elements that left the glow illumination field
      activeInfluenced.forEach((_, el) => {
        if (!currentInfluencedThisFrame.has(el)) {
          activeInfluenced.delete(el)
          gsap.to(el, {
            x: 0,
            y: 0,
            scale: 1,
            boxShadow: "",
            borderColor: "",
            filter: "",
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          })
        }
      })
    }

    let rAFId: number | null = null
    let latestMouseX = 0
    let latestMouseY = 0

    const onMouseMove = (e: MouseEvent) => {
      latestMouseX = e.clientX
      latestMouseY = e.clientY

      if (!isVisible) {
        // First move: immediately snap positions so it never sits at (0, 0)
        gsap.set([dot, ring, halo], { x: latestMouseX, y: latestMouseY })
        gsap.to([dot, ring, halo], { autoAlpha: 1, duration: 0.3, ease: "power2.out" })
        isVisible = true
      }

      dotX(latestMouseX)
      dotY(latestMouseY)
      ringX(latestMouseX)
      ringY(latestMouseY)
      haloX(latestMouseX)
      haloY(latestMouseY)

      if (rAFId === null) {
        rAFId = requestAnimationFrame(() => {
          handleProximity(latestMouseX, latestMouseY)
          rAFId = null
        })
      }
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target || !isVisible) return

      // Input elements
      if (target.closest("input, textarea, select, [contenteditable='true']")) {
        if (currentMode !== "hidden") {
          currentMode = "hidden"
          gsap.to([dot, ring, halo], {
            autoAlpha: 0,
            scale: 0.2,
            duration: 0.2,
            ease: "power2.out",
          })
        }
        return
      }

      // Product cards
      const productTarget = target.closest('[data-cursor="view"], [data-testid="product-wrapper"]')
      if (productTarget) {
        if (currentMode !== "view") {
          currentMode = "view"
          gsap.to(dot, { autoAlpha: 0, duration: 0.2 })
          gsap.to(ring, {
            width: 72,
            height: 72,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            borderColor: "transparent",
            scale: 1,
            autoAlpha: 1,
            duration: 0.3,
            ease: "power3.out",
          })
          gsap.to(halo, {
            scale: 1.35,
            autoAlpha: 1,
            duration: 0.35,
            ease: "power2.out",
          })
          if (label) {
            label.innerText = "VIEW"
            gsap.to(label, { autoAlpha: 1, scale: 1, duration: 0.25 })
          }
        }
        return
      }

      // Buttons / interactive controls
      const interactiveTarget = target.closest(
        'button, a, [role="button"], input[type="submit"], [data-cursor="hover"]'
      )
      if (interactiveTarget) {
        if (currentMode !== "hover") {
          currentMode = "hover"
          gsap.to(dot, { scale: 0.5, autoAlpha: 0.8, duration: 0.2 })
          gsap.to(ring, {
            width: 48,
            height: 48,
            backgroundColor: "rgba(0, 0, 0, 0.06)",
            borderColor: "rgba(0, 0, 0, 0.4)",
            scale: 1.1,
            autoAlpha: 1,
            duration: 0.3,
            ease: "power3.out",
          })
          gsap.to(halo, {
            scale: 1.2,
            autoAlpha: 1,
            duration: 0.3,
            ease: "power2.out",
          })
          if (label) {
            gsap.to(label, { autoAlpha: 0, scale: 0.8, duration: 0.2 })
          }
        }
        return
      }

      // Default state
      if (currentMode !== "default") {
        currentMode = "default"
        gsap.to(dot, { scale: 1, autoAlpha: 1, duration: 0.25 })
        gsap.to(ring, {
          width: 34,
          height: 34,
          backgroundColor: "transparent",
          borderColor: "rgba(0, 0, 0, 0.35)",
          scale: 1,
          autoAlpha: 1,
          duration: 0.3,
          ease: "power3.out",
        })
        gsap.to(halo, {
          scale: 1,
          autoAlpha: 1,
          duration: 0.3,
          ease: "power2.out",
        })
        if (label) {
          gsap.to(label, { autoAlpha: 0, duration: 0.2 })
        }
      }
    }

    const onMouseLeave = () => {
      isVisible = false
      gsap.to([dot, ring, halo], { autoAlpha: 0, duration: 0.25, ease: "power2.in" })

      activeInfluenced.forEach((_, el) => {
        gsap.to(el, {
          x: 0,
          y: 0,
          scale: 1,
          boxShadow: "",
          borderColor: "",
          filter: "",
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        })
      })
      activeInfluenced.clear()
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true })
    document.addEventListener("mouseover", onMouseOver, { passive: true })
    document.addEventListener("mouseleave", onMouseLeave)

    return () => {
      if (rAFId !== null) cancelAnimationFrame(rAFId)
      window.removeEventListener("scroll", updateCandidatesCache)
      window.removeEventListener("resize", updateCandidatesCache)
      window.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseover", onMouseOver)
      document.removeEventListener("mouseleave", onMouseLeave)

      activeInfluenced.forEach((_, el) => {
        gsap.set(el, {
          x: 0,
          y: 0,
          scale: 1,
          boxShadow: "",
          borderColor: "",
          filter: "",
        })
      })
      activeInfluenced.clear()
    }
  }, [])

  if (!isEnabled) return null

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
    >
      {/* Soft Glow Halo (Atmospheric, Warm Luminous Flare, No Hard Outlines) */}
      <div
        ref={cursorHaloRef}
        className="fixed top-0 left-0 w-[110px] h-[110px] rounded-full pointer-events-none will-change-transform opacity-0"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 198, 51, 0.45) 0%, rgba(255, 220, 110, 0.22) 38%, rgba(255, 255, 255, 0.1) 58%, transparent 75%)",
          filter: "blur(6px)",
          boxShadow: "0 0 35px 12px rgba(255, 198, 51, 0.25)",
        }}
      />

      {/* Outer Precision Ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-[34px] h-[34px] rounded-full border border-black/40 flex items-center justify-center transition-[background-color,border-color] duration-200 will-change-transform opacity-0"
      >
        <span
          ref={cursorLabelRef}
          className="text-[10px] tracking-widest font-black uppercase text-white opacity-0"
        >
          VIEW
        </span>
      </div>

      {/* Center Micro Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-black will-change-transform opacity-0 shadow-xs"
      />
    </div>
  )
}
