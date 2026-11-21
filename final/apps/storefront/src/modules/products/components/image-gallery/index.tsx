"use client"

import { useState, useRef, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { gsap, prefersReducedMotion } from "@lib/gsap"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const mainImageContainerRef = useRef<HTMLDivElement>(null)
  const mainImageWrapRef = useRef<HTMLDivElement>(null)

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/5] bg-[#F0EEED] rounded-[20px] flex items-center justify-center text-neutral-400">
        No images available
      </div>
    )
  }

  const activeImage = images[selectedIdx] || images[0]

  // Image Switch Transition
  useEffect(() => {
    if (mainImageWrapRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        mainImageWrapRef.current,
        { opacity: 0.3, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
      )
    }
  }, [selectedIdx])

  // Mouse hover pan / inspection effect on Desktop
  useEffect(() => {
    const container = mainImageContainerRef.current
    const wrap = mainImageWrapRef.current
    if (!container || !wrap || prefersReducedMotion()) return

    const isFinePointer = window.matchMedia("(pointer: fine)").matches
    if (!isFinePointer) return

    const xTo = gsap.quickTo(wrap, "x", { duration: 0.45, ease: "power2.out" })
    const yTo = gsap.quickTo(wrap, "y", { duration: 0.45, ease: "power2.out" })

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1

      xTo(normX * 16)
      yTo(normY * 16)
    }

    const onMouseEnter = () => {
      gsap.to(wrap, { scale: 1.06, duration: 0.4, ease: "power2.out" })
    }

    const onMouseLeave = () => {
      xTo(0)
      yTo(0)
      gsap.to(wrap, { scale: 1, duration: 0.45, ease: "power2.out" })
    }

    container.addEventListener("mousemove", onMouseMove, { passive: true })
    container.addEventListener("mouseenter", onMouseEnter)
    container.addEventListener("mouseleave", onMouseLeave)

    return () => {
      container.removeEventListener("mousemove", onMouseMove)
      container.removeEventListener("mouseenter", onMouseEnter)
      container.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [])

  return (
    <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-3 sm:gap-4 w-full select-none">
      {/* Thumbnails list (vertical on desktop, horizontal on mobile) */}
      <div className="flex flex-row md:flex-col gap-3 w-full md:w-[152px] shrink-0 overflow-x-auto md:overflow-visible">
        {images.slice(0, 4).map((image, idx) => {
          const isSelected = selectedIdx === idx
          return (
            <button
              key={image.id || idx}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              data-cursor="hover"
              className={`relative w-20 h-24 sm:w-24 sm:h-28 md:w-[152px] md:h-[167px] bg-[#F0EEED] rounded-[16px] sm:rounded-[20px] p-2 flex items-center justify-center shrink-0 overflow-hidden transition-all duration-300 ${
                isSelected
                  ? "border-2 border-black scale-[0.98] shadow-sm"
                  : "border border-transparent hover:border-black/20 opacity-80 hover:opacity-100 hover:scale-[1.02]"
              }`}
            >
              {image.url && (
                <Image
                  src={image.url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-contain p-2"
                  sizes="152px"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Main Large Active Image Preview with Interactive Pan */}
      <div
        ref={mainImageContainerRef}
        data-cursor="hover"
        className="relative w-full aspect-[4/5] max-h-[530px] bg-[#F0EEED] rounded-[20px] p-6 flex items-center justify-center overflow-hidden flex-1 cursor-crosshair"
      >
        <div
          ref={mainImageWrapRef}
          className="relative w-full h-full will-change-transform"
        >
          {activeImage?.url && (
            <Image
              src={activeImage.url}
              alt="Product preview"
              fill
              priority
              className="object-contain p-4 sm:p-6 pointer-events-none"
              sizes="(max-width: 768px) 100vw, 550px"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageGallery
