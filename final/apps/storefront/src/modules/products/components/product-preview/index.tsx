import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Read metadata if available, or generate consistent rating
  const meta = (product.metadata || {}) as Record<string, any>
  const rating = meta.rating ? Number(meta.rating) : 4.5
  const originalPrice = meta.original_price ? `$${meta.original_price}` : null
  const discountPercent = meta.discount_percent ? `-${meta.discount_percent}%` : null

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block w-full transition-transform duration-300 ease-out hover:-translate-y-1.5"
      data-cursor="view"
    >
      <div data-testid="product-wrapper" className="flex flex-col select-none">
        {/* Card Image */}
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          alt={product.title}
          size="full"
          isFeatured={isFeatured}
        />

        {/* Product Details */}
        <div className="flex flex-col gap-1 mt-3 sm:mt-4">
          <h3
            className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold text-black capitalize truncate group-hover:text-neutral-700 transition-colors"
            data-testid="product-title"
          >
            {product.title}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 my-0.5">
            <div className="flex items-center text-[#FFC633]">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill={i < Math.floor(rating) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.04894 0.927051C9.3483 0.00574112 10.6517 0.00573993 10.9511 0.927049L12.4697 5.60081C12.6035 6.01284 12.9875 6.2918 13.4207 6.2918H18.3351C19.3037 6.2918 19.7065 7.53155 18.9231 8.10062L14.9472 10.9894C14.5967 11.244 14.4499 11.6957 14.5838 12.1077L16.1024 16.7815C16.4017 17.7028 15.3472 18.4688 14.5638 17.8997L10.5879 15.011C10.2374 14.7563 9.7626 14.7563 9.4121 15.011L5.43624 17.8997C4.65277 18.4688 3.59828 17.7028 3.89763 16.7815L5.41623 12.1077C5.55006 11.6957 5.40333 11.244 5.05284 10.9894L1.07693 8.10062C0.293475 7.53155 0.696328 6.2918 1.66492 6.2918H6.57929C7.01252 6.2918 7.39647 6.01284 7.5303 5.60081L9.04894 0.927051Z" />
                </svg>
              ))}
            </div>
            <span className="text-[13px] sm:text-[14px] text-black font-normal ml-1">
              {rating.toFixed(1)}/
              <span className="text-black/60">5</span>
            </span>
          </div>

          {/* Price and Discount */}
          <div className="flex items-center gap-2.5 mt-0.5">
            <span className="text-[18px] sm:text-[22px] lg:text-[24px] font-bold text-black tracking-tight">
              {cheapestPrice ? cheapestPrice.calculated_price : "$120"}
            </span>

            {originalPrice && (
              <span className="text-[18px] sm:text-[22px] lg:text-[24px] font-bold text-black/40 line-through tracking-tight">
                {originalPrice}
              </span>
            )}

            {discountPercent && (
              <span className="bg-[rgba(255,51,51,0.1)] text-[#FF3333] text-[12px] font-medium rounded-full px-3 py-0.5">
                {discountPercent}
              </span>
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
