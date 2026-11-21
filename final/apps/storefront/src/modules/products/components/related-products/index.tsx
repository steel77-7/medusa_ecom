import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const queryParams: HttpTypes.StoreProductListParams = {
    limit: 4,
    fields: "*variants.calculated_price",
  }
  if (region?.id) {
    queryParams.region_id = region.id
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    ).slice(0, 4)
  })

  if (!products.length) {
    return null
  }

  return (
    <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
      {products.map((p) => (
        <li key={p.id}>
          <ProductPreview region={region} product={p} isFeatured />
        </li>
      ))}
    </ul>
  )
}
