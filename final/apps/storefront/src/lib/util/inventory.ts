import { HttpTypes } from "@medusajs/types"

export const isVariantInStock = (
  variant: HttpTypes.StoreProductVariant | undefined
) => {
  if (!variant) return false
  if (variant.manage_inventory === false) return true
  if (variant.allow_backorder) return true
  if ((variant.inventory_quantity ?? 0) > 0) return true
  // If manage_inventory is unset/null, default to in-stock
  if (variant.manage_inventory === undefined || variant.manage_inventory === null) return true
  return false
}
