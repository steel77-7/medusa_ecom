"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NavSearch() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/store?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="bg-[#F0F0F0] rounded-full px-4 py-2.5 flex items-center gap-3 w-full transition-all focus-within:ring-2 focus-within:ring-black/10 focus-within:bg-neutral-100">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-neutral-400 shrink-0"
        >
          <path
            d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="bg-transparent text-sm text-black placeholder:text-neutral-400 focus:outline-none w-full"
        />
      </div>
    </form>
  )
}

