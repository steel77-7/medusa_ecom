import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-3 lg:max-w-[500px] mx-auto">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ui-fg-subtle">
          {product.collection?.title || "High Fashion Signature"}
        </span>
        <Heading
          level="h1"
          className="text-3xl sm:text-4xl font-medium tracking-tight text-ui-fg-base leading-tight"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <Text
          className="text-sm text-ui-fg-subtle leading-relaxed whitespace-pre-line mt-1"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
