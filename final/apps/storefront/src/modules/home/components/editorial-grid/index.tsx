"use client"

import { useRef } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowUpRightMini } from "@medusajs/icons"

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
}

const EditorialGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Staggered reveal for editorial cards
        gsap.from(".editorial-card", {
          opacity: 0,
          y: 40,
          stagger: 0.2,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        })
      })
    },
    { scope: containerRef }
  )

  return (
    <section ref={containerRef} className="py-20 bg-white border-b border-ui-border-base">
      <div className="content-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-y-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ui-fg-subtle">
              Curated Series
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-ui-fg-base mt-2">
              Architectural Staples
            </h2>
          </div>
          <LocalizedClientLink
            href="/store"
            className="group inline-flex items-center gap-x-1.5 text-sm font-medium text-ui-fg-base hover:text-ui-fg-interactive transition-colors"
          >
            <span>View All Releases</span>
            <ArrowUpRightMini className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </LocalizedClientLink>
        </div>

        {/* 2-Column Asymmetric Editorial Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Card 1: Summer Essentials */}
          <LocalizedClientLink
            href="/collections/summer-essentials"
            className="editorial-card group relative block overflow-hidden rounded-xl bg-neutral-100 aspect-[4/5] sm:aspect-[3/4]"
          >
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
              alt="Summer Essentials Collection"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-8 text-white flex flex-col items-start gap-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-300">
                01 / Capsule Release
              </span>
              <h3 className="text-2xl sm:text-3xl font-medium tracking-tight">
                Summer Essentials
              </h3>
              <p className="text-sm text-neutral-300 max-w-sm font-normal">
                Lightweight organic linens and washed heavyweight cottons crafted for warmer climates.
              </p>
              <div className="pt-2 inline-flex items-center gap-x-1.5 text-xs font-medium uppercase tracking-wider text-white group-hover:underline">
                <span>Shop Capsule</span>
                <ArrowUpRightMini />
              </div>
            </div>
          </LocalizedClientLink>

          {/* Card 2: Winter Layers */}
          <LocalizedClientLink
            href="/collections/winter-layers"
            className="editorial-card group relative block overflow-hidden rounded-xl bg-neutral-100 aspect-[4/5] sm:aspect-[3/4]"
          >
            <Image
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80"
              alt="Winter Layers Collection"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-8 text-white flex flex-col items-start gap-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-300">
                02 / Heavyweight Outerwear
              </span>
              <h3 className="text-2xl sm:text-3xl font-medium tracking-tight">
                Winter Layers
              </h3>
              <p className="text-sm text-neutral-300 max-w-sm font-normal">
                Structured fleece hoodies, wool blends, and technical twill outerwear designed to insulate.
              </p>
              <div className="pt-2 inline-flex items-center gap-x-1.5 text-xs font-medium uppercase tracking-wider text-white group-hover:underline">
                <span>Shop Outerwear</span>
                <ArrowUpRightMini />
              </div>
            </div>
          </LocalizedClientLink>
        </div>

        {/* 3-Column Category Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          {/* Tops */}
          <LocalizedClientLink
            href="/store?category=tops"
            className="editorial-card group relative block overflow-hidden rounded-lg bg-neutral-100 aspect-[4/5]"
          >
            <Image
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
              alt="Tops Category"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-5 text-white">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300">Category</span>
              <h4 className="text-xl font-medium tracking-tight mt-0.5">Tees & Knits</h4>
            </div>
          </LocalizedClientLink>

          {/* Hoodies */}
          <LocalizedClientLink
            href="/store?category=hoodies"
            className="editorial-card group relative block overflow-hidden rounded-lg bg-neutral-100 aspect-[4/5]"
          >
            <Image
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
              alt="Hoodies Category"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-5 text-white">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300">Category</span>
              <h4 className="text-xl font-medium tracking-tight mt-0.5">Hoodies & Fleece</h4>
            </div>
          </LocalizedClientLink>

          {/* Pants */}
          <LocalizedClientLink
            href="/store?category=pants"
            className="editorial-card group relative block overflow-hidden rounded-lg bg-neutral-100 aspect-[4/5]"
          >
            <Image
              src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80"
              alt="Pants Category"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-5 text-white">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300">Category</span>
              <h4 className="text-xl font-medium tracking-tight mt-0.5">Twill & Denim</h4>
            </div>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default EditorialGrid

