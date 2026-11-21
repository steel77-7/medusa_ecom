import React, { Suspense } from "react"
import VariantImageGallery from "@modules/products/components/image-gallery/variant-image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const meta = (product.metadata || {}) as Record<string, any>
  const rating = meta.rating ? Number(meta.rating) : 4.5

  return (
    <div className="content-container py-8 sm:py-10" data-testid="product-container">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-black/60 mb-8">
        <LocalizedClientLink href="/" className="hover:text-black transition-colors">
          Home
        </LocalizedClientLink>
        <span>&gt;</span>
        <LocalizedClientLink href="/store" className="hover:text-black transition-colors">
          Shop
        </LocalizedClientLink>
        <span>&gt;</span>
        <span className="text-black font-medium capitalize">
          {product.title}
        </span>
      </div>

      {/* Main 2-Column Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Column: Vertical Thumbnails + Large Main Image */}
        <div className="w-full">
          <VariantImageGallery product={product} />
        </div>

        {/* Right Column: Title, Ratings, Pricing, Options, Add to Cart */}
        <div className="w-full flex flex-col">
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black uppercase tracking-tight text-black font-integral leading-[1.05]">
            {product.title}
          </h1>

          {/* Star Rating */}
          <div className="flex items-center gap-2 my-3">
            <div className="flex items-center text-[#FFC633]">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="20"
                  height="20"
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
            <span className="text-sm font-normal text-black ml-1">
              {rating.toFixed(1)}/
              <span className="text-black/60">5</span>
            </span>
          </div>

          {/* Actions & Variants (pricing, description, options, counter, add to cart) */}
          <ProductActions product={product} region={region} />
        </div>
      </div>

      {/* Tabs: Details, Reviews, FAQs */}
      <ProductTabs product={product} />

      {/* Recommendations: "YOU MIGHT ALSO LIKE" */}
      <div
        className="my-16 sm:my-24"
        data-testid="related-products-container"
      >
        <h2 className="text-3xl sm:text-4xl md:text-[48px] font-black uppercase tracking-tight text-center text-black mb-10 sm:mb-14 font-integral">
          YOU MIGHT ALSO LIKE
        </h2>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
