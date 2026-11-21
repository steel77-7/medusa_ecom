import React from "react"

const MarqueeTicker = () => {
  const items = [
    "ORGANIC HEAVYWEIGHT COTTON",
    "MINIMALIST SILHOUETTES",
    "ETHICALLY MANUFACTURED IN EUROPE",
    "COMPLIMENTARY SHIPPING OVER 150€",
    "DESIGNED FOR LONGEVITY",
    "30-DAY COMPLIMENTARY RETURNS",
  ]

  return (
    <div className="w-full overflow-hidden border-b border-ui-border-base bg-neutral-900 py-3.5 text-neutral-300">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-x-12 text-[11px] font-medium tracking-[0.22em] uppercase">
        {/* Render twice for seamless loop */}
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-x-12">
            <span>{text}</span>
            <span className="h-1 w-1 rounded-full bg-neutral-500" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarqueeTicker

