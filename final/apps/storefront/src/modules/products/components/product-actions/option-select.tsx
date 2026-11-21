import { HttpTypes } from "@medusajs/types"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  name: string
  disabled: boolean
  "data-testid"?: string
}

const colorMap: Record<string, string> = {
  olive: "#4F5841",
  green: "#4F5841",
  navy: "#31344F",
  blue: "#31344F",
  slate: "#314F4A",
  black: "#000000",
  white: "#FFFFFF",
  red: "#D12A2A",
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  name,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)
  const isColor = title.toLowerCase().includes("color")

  return (
    <fieldset className="flex flex-col gap-y-3 py-4 border-b border-black/10" disabled={disabled}>
      <legend className="text-sm font-medium text-black/60">
        {isColor ? "Select Colors" : `Choose ${title}`}
      </legend>

      <div className="flex flex-wrap gap-3">
        {filteredOptions.map((v) => {
          const isSelected = v === current
          const id = `${name}-${v}`.replace(/[^A-Za-z0-9_-]/g, "-")

          if (isColor) {
            const swatchBg = colorMap[v.toLowerCase()] || "#314F4A"
            return (
              <div key={v}>
                <input
                  type="radio"
                  id={id}
                  name={name}
                  value={v}
                  checked={isSelected}
                  onChange={() => updateOption(option.id, v)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={id}
                  style={{ backgroundColor: swatchBg }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform ${
                    isSelected ? "ring-2 ring-offset-2 ring-black scale-105" : "hover:scale-105"
                  }`}
                  title={v}
                >
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <path d="M13.3334 4L6.00002 11.3333L2.66669 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </label>
              </div>
            )
          }

          // Size / standard options
          return (
            <div key={v}>
              <input
                type="radio"
                id={id}
                name={name}
                value={v}
                checked={isSelected}
                onChange={() => updateOption(option.id, v)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={`px-6 py-3 rounded-full text-sm font-medium cursor-pointer transition-all inline-block ${
                  isSelected
                    ? "bg-black text-white shadow-sm"
                    : "bg-[#F0F0F0] text-black/60 hover:text-black hover:bg-neutral-200"
                }`}
              >
                {v}
              </label>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}

export default OptionSelect
