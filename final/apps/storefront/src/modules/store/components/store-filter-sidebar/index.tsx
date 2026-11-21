"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const categories = [
  { name: "T-shirts", handle: "t-shirts" },
  { name: "Shorts", handle: "shorts" },
  { name: "Shirts", handle: "shirts" },
  { name: "Hoodie", handle: "hoodie" },
  { name: "Jeans", handle: "jeans" },
]

const colorSwatches = [
  { name: "Green", bg: "#00C12B" },
  { name: "Red", bg: "#F50606" },
  { name: "Yellow", bg: "#F5DD06" },
  { name: "Orange", bg: "#F57906" },
  { name: "Cyan", bg: "#06CAF5" },
  { name: "Blue", bg: "#063AF5" },
  { name: "Purple", bg: "#7D06F5" },
  { name: "Pink", bg: "#F506A4" },
  { name: "White", bg: "#FFFFFF", border: true },
  { name: "Black", bg: "#000000" },
]

const sizes = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "2X-Large",
  "3X-Large",
  "4X-Large",
]

const dressStyles = [
  { name: "Casual", handle: "casual" },
  { name: "Formal", handle: "formal" },
  { name: "Party", handle: "party" },
  { name: "Gym", handle: "gym" },
]

export default function StoreFilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>("Large")
  const [price, setPrice] = useState<number>(200)

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedSize) params.set("size", selectedSize)
    if (selectedColor) params.set("color", selectedColor)
    params.set("maxPrice", price.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="w-full lg:w-[295px] shrink-0 border border-black/10 rounded-[20px] p-6 bg-white shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-black/10">
        <h2 className="text-[20px] font-bold text-black tracking-tight">
          Filters
        </h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black/60">
          <path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14H7M9 8H15M17 16H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Categories */}
      <div className="py-5 border-b border-black/10 flex flex-col gap-3">
        {categories.map((c) => (
          <button
            key={c.name}
            onClick={() => router.push(`/categories/${c.handle}`)}
            className="flex items-center justify-between text-[16px] text-black/60 hover:text-black transition-colors w-full py-1 text-left"
          >
            <span>{c.name}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>

      {/* Price Slider */}
      <div className="py-6 border-b border-black/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[20px] font-bold text-black">Price</span>
          <span className="text-sm font-semibold text-black">${price}</span>
        </div>
        <input
          type="range"
          min="50"
          max="300"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full accent-black cursor-pointer"
        />
        <div className="flex justify-between text-xs text-black/60 mt-2 font-medium">
          <span>$50</span>
          <span>$300</span>
        </div>
      </div>

      {/* Colors */}
      <div className="py-6 border-b border-black/10">
        <span className="text-[20px] font-bold text-black block mb-4">Colors</span>
        <div className="grid grid-cols-5 gap-3.5">
          {colorSwatches.map((color) => {
            const isSelected = selectedColor === color.name
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(isSelected ? null : color.name)}
                style={{ backgroundColor: color.bg }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  color.border ? "border border-black/20" : ""
                } ${isSelected ? "ring-2 ring-offset-2 ring-black scale-105" : "hover:scale-105"}`}
                aria-label={`Filter by ${color.name}`}
              >
                {isSelected && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={color.name === "White" ? "text-black" : "text-white"}
                  >
                    <path
                      d="M13.3334 4L6.00002 11.3333L2.66669 8"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Size Pills */}
      <div className="py-6 border-b border-black/10">
        <span className="text-[20px] font-bold text-black block mb-4">Size</span>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const isSelected = selectedSize === size
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(isSelected ? null : size)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-black text-white"
                    : "bg-[#F0F0F0] text-black/60 hover:text-black hover:bg-neutral-200"
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Dress Style */}
      <div className="py-6 border-b border-black/10 flex flex-col gap-3">
        <span className="text-[20px] font-bold text-black block mb-1">Dress Style</span>
        {dressStyles.map((style) => (
          <button
            key={style.name}
            onClick={() => router.push(`/collections/${style.handle}`)}
            className="flex items-center justify-between text-[16px] text-black/60 hover:text-black transition-colors w-full py-1 text-left"
          >
            <span>{style.name}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>

      {/* Apply Filter Button */}
      <button
        onClick={handleApplyFilter}
        className="w-full mt-6 bg-black text-white font-medium text-sm rounded-full py-4 hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-sm"
      >
        Apply Filter
      </button>
    </div>
  )
}

