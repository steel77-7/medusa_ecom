import { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"
import repeat from "@lib/util/repeat"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const currencyCode = cart?.currency_code || "usd"

  return (
    <div className="divide-y divide-black/10">
      {items
        ? items
            .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
            .map((item) => (
              <Item
                key={item.id}
                item={item}
                currencyCode={currencyCode}
              />
            ))
        : repeat(3).map((i) => (
            <div key={i} className="flex items-center gap-4 py-5 animate-pulse">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-[#F0EEED] rounded-[16px]" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-5 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded w-1/6 mt-2" />
              </div>
            </div>
          ))}
    </div>
  )
}

export default ItemsTemplate
