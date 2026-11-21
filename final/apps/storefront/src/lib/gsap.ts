"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
}

/**
 * Check if the user has requested reduced motion.
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Safely refresh all ScrollTriggers after DOM updates or route transitions.
 */
let refreshTimeout: ReturnType<typeof setTimeout> | null = null
export const safeRefreshScrollTrigger = (delay = 100) => {
  if (typeof window === "undefined") return
  if (refreshTimeout) clearTimeout(refreshTimeout)
  refreshTimeout = setTimeout(() => {
    ScrollTrigger.refresh()
  }, delay)
}

/**
 * Creates high-performance magnetic pull effect on elements (e.g. CTA buttons, badges).
 * Reverts smoothly when the pointer leaves.
 */
export const attachMagneticEffect = (
  element: HTMLElement,
  strength = 0.35,
  ease = "power2.out"
) => {
  if (!element || prefersReducedMotion()) return () => {}

  const xTo = gsap.quickTo(element, "x", { duration: 0.6, ease })
  const yTo = gsap.quickTo(element, "y", { duration: 0.6, ease })

  const onMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    xTo(deltaX)
    yTo(deltaY)
  }

  const onMouseLeave = () => {
    xTo(0)
    yTo(0)
  }

  element.addEventListener("mousemove", onMouseMove)
  element.addEventListener("mouseleave", onMouseLeave)

  return () => {
    element.removeEventListener("mousemove", onMouseMove)
    element.removeEventListener("mouseleave", onMouseLeave)
  }
}

export { gsap, useGSAP, ScrollTrigger }
