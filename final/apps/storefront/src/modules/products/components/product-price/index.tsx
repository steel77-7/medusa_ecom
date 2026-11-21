import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-neutral-100 animate-pulse rounded-md" />
  }

  const meta = (product.metadata || {}) as Record<string, any>
  const originalPrice = meta.original_price ? `$${meta.original_price}` : selectedPrice.price_type === "sale" ? selectedPrice.original_price : null
  const discountPercent = meta.discount_percent ? `-${meta.discount_percent}%` : selectedPrice.price_type === "sale" ? `-${selectedPrice.percentage_diff}%` : null

  return (
    <div className="flex items-center gap-3 my-2">
      <span
        className="text-2xl sm:text-3xl font-bold text-black tracking-tight"
        data-testid="product-price"
        data-value={selectedPrice.calculated_price_number}
      >
        {selectedPrice.calculated_price}
      </span>

      {originalPrice && (
        <span
          className="text-2xl sm:text-3xl font-bold text-black/40 line-through tracking-tight"
          data-testid="original-product-price"
        >
          {originalPrice}
        </span>
      )}

      {discountPercent && (
        <span className="bg-[rgba(255,51,51,0.1)] text-[#FF3333] text-sm font-medium rounded-full px-3.5 py-1">
          {discountPercent}
        </span>
      )}
    </div>
  )
}
