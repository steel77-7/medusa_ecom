"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"

import Item from "@modules/cart/components/item"

type ItemsTemplateProps = {
  cart: HttpTypes.StoreCart
}

const ItemsPreviewTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart.items
  const hasOverflow = items && items.length > 4

  return (
    <div
      className={clx({
        "pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]":
          hasOverflow,
      })}
    >
      <div className="divide-y divide-black/10" data-testid="items-table">
        {items
          ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    type="preview"
                    currencyCode={cart.currency_code}
                  />
                )
              })
          : repeat(5).map((i) => (
              <div key={i} className="flex items-center gap-4 py-4 animate-pulse">
                <div className="w-16 h-16 bg-[#F0EEED] rounded-[14px]" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}

export default ItemsPreviewTemplate
