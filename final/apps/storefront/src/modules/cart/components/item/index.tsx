"use client"

import { updateLineItem, deleteLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { convertToLocale } from "@lib/util/money"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)

  const changeQuantity = async (quantity: number) => {
    if (quantity <= 0) {
      await handleDelete()
      return
    }

    setUpdating(true)
    await updateLineItem({
      lineId: item.id,
      quantity,
    }).finally(() => {
      setUpdating(false)
    })
  }

  const handleDelete = async () => {
    setUpdating(true)
    await deleteLineItem(item.id).finally(() => {
      setUpdating(false)
    })
  }

  const unitPrice = item.unit_price || 0
  const sizeOption = item.variant?.options?.find((o) => o.option?.title?.toLowerCase() === "size")?.value || item.variant?.title
  const colorOption = item.variant?.options?.find((o) => o.option?.title?.toLowerCase() === "color")?.value

  return (
    <div className="flex items-start sm:items-center justify-between gap-4 py-5 first:pt-0 last:pb-0">
      <div className="flex items-start sm:items-center gap-4 min-w-0">
        {/* Product Image */}
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="w-20 h-20 sm:w-28 sm:h-28 bg-[#F0EEED] rounded-[16px] p-2 shrink-0 relative overflow-hidden block"
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
            alt={item.product_title}
          />
        </LocalizedClientLink>

        {/* Product Details */}
        <div className="flex flex-col gap-1 min-w-0">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="text-base sm:text-lg font-bold text-black truncate hover:text-neutral-700 transition-colors"
          >
            {item.product_title}
          </LocalizedClientLink>

          <div className="text-xs sm:text-sm text-black/60 flex flex-wrap gap-x-3">
            {sizeOption && <span>Size: <strong className="text-black font-medium">{sizeOption}</strong></span>}
            {colorOption && <span>Color: <strong className="text-black font-medium">{colorOption}</strong></span>}
          </div>

          <span className="text-lg sm:text-xl font-bold text-black tracking-tight mt-1">
            {convertToLocale({ amount: unitPrice, currency_code: currencyCode })}
          </span>
        </div>
      </div>

      {/* Delete & Quantity Controls */}
      {type === "full" ? (
        <div className="flex flex-col items-end justify-between h-20 sm:h-24 shrink-0">
          <button
            type="button"
            onClick={handleDelete}
            disabled={updating}
            className="text-red-500 hover:text-red-700 p-1 transition-colors"
            aria-label="Remove item"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 11V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 11V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="bg-[#F0F0F0] rounded-full px-3.5 py-1.5 flex items-center gap-3 sm:gap-4 text-sm font-semibold shadow-xs">
            <button
              type="button"
              onClick={() => changeQuantity(item.quantity - 1)}
              disabled={updating}
              className="text-black hover:opacity-60 transition-opacity p-0.5 text-base font-bold"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="min-w-[16px] text-center text-black">
              {updating ? "..." : item.quantity}
            </span>
            <button
              type="button"
              onClick={() => changeQuantity(item.quantity + 1)}
              disabled={updating}
              className="text-black hover:opacity-60 transition-opacity p-0.5 text-base font-bold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center shrink-0">
          <span className="text-xs sm:text-sm font-medium text-black/60 bg-[#F0F0F0] px-3 py-1 rounded-full">
            Qty: {item.quantity}
          </span>
        </div>
      )}
    </div>
  )
}

export default Item
