import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import AnimatedProductGrid from "@modules/products/components/animated-product-grid"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
      limit: 4,
    },
  })

  if (!pricedProducts || pricedProducts.length === 0) {
    return null
  }

  return (
    <AnimatedProductGrid
      title={collection.title}
      viewAllHref={`/collections/${collection.handle}`}
    >
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {pricedProducts.map((product) => (
          <li key={product.id} className="product-grid-item will-change-transform">
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </AnimatedProductGrid>
  )
}
