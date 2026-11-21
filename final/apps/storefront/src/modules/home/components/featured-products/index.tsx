import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  if (collections && collections.length > 0) {
    return (
      <>
        {collections.map((collection) => (
          <li key={collection.id}>
            <ProductRail collection={collection} region={region} />
          </li>
        ))}
      </>
    )
  }

  // Fallback to latest catalog products when no collections are defined
  const {
    response: { products: latestProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 8,
      fields: "*variants.calculated_price",
    },
  })

  if (!latestProducts || latestProducts.length === 0) {
    return null
  }

  return (
    <li>
      <div className="content-container py-12 lg:py-16">
        <div className="flex justify-between items-end mb-8 pb-3 border-b border-ui-border-base">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ui-fg-subtle">
              Signature Line
            </span>
            <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-ui-fg-base mt-1">
              Core Essentials
            </h3>
          </div>
          <InteractiveLink href="/store">Explore catalog</InteractiveLink>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {latestProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}
